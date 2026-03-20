import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Row,
  Col,
  Tag,
  Space,
  Button,
  Modal,
  Descriptions,
  message,
  Popconfirm,
  Input,
  Alert,
  Spin,
  Typography,
} from "antd";

const { Title, Text } = Typography;
import {
  EyeOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import BookingSummaryCards from "./BookingSummaryCards";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/** Format datetime từ UTC sang giờ Việt Nam (UTC+7) */
function formatDateTimeVN(isoString: string | null | undefined): string {
  if (!isoString) return "-";
  
  try {
    // Nếu timestamp có Z hoặc timezone indicator → parse UTC và thêm 7 giờ
    if (isoString.includes("Z") || isoString.match(/[+-]\d{2}:\d{2}$/)) {
      return dayjs.utc(isoString).add(7, "hour").format("DD/MM/YYYY HH:mm");
    }
    
    // Nếu không có timezone indicator, giả định là UTC (backend thường trả về UTC)
    // dayjs.utc() sẽ tự động parse ISO string không có timezone như UTC
    return dayjs.utc(isoString).add(7, "hour").format("DD/MM/YYYY HH:mm");
  } catch (err) {
    console.error("Error parsing datetime:", isoString, err);
    return "-";
  }
}

/** Format thời gian từ string "HH:mm" sang định dạng 12 giờ với AM/PM */
function formatTime12h(timeStr: string | null | undefined): string {
  if (!timeStr) return "—";
  // Nếu là ISO string, parse và format
  if (timeStr.includes("T") || timeStr.includes("Z")) {
    const d = dayjs.utc(timeStr).add(7, "hour");
    const hour12 = d.hour() === 0 ? 12 : d.hour() > 12 ? d.hour() - 12 : d.hour();
    const ampm = d.hour() < 12 ? "AM" : "PM";
    return `${String(hour12).padStart(2, "0")}:${String(d.minute()).padStart(2, "0")} ${ampm}`;
  }
  // Nếu là "HH:mm" format
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? "AM" : "PM";
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

import {
  getAdminBookings,
  getAdminBookingById,
  cancelBooking,
  getBookingCancellationFee,
  type AdminBooking,
} from "../../services/adminApi";
import { getPublicTours } from "../../services/api";
import type { Tour } from "../../types";

function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ₫`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K ₫`;
  return `${value.toLocaleString("vi-VN")} ₫`;
}

// Dùng luôn AdminBooking làm bản ghi bảng (thêm key cho Ant Table)
type BookingRow = AdminBooking & { key: string };

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor?: string }
> = {
  PENDING: { label: "Chờ xử lý", color: "#faad14", bgColor: "#fffbe6" },
  CONFIRMED: { label: "Đã xác nhận", color: "#52c41a", bgColor: "#f6ffed" },
  PAID: { label: "Đã thanh toán", color: "#52c41a", bgColor: "#f6ffed" },
  CANCELLED: { label: "Đã hủy", color: "#ff4d4f", bgColor: "#fff1f0" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#8c8c8c", bgColor: "#fafafa" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", color: "#faad14" },
  PAID: { label: "Đã thanh toán", color: "#52c41a" },
  PARTIAL: { label: "Thanh toán một phần", color: "#1890ff" },
  REFUNDED: { label: "Đã hoàn", color: "#8c8c8c" },
};

const paymentMethodLabels: Record<string, string> = {
  CREDIT_CARD: "Thẻ tín dụng",
  BANK_TRANSFER: "Chuyển khoản",
  CASH: "Tiền mặt",
  EWALLET: "Ví điện tử",
  VNPAY: "VNPay",
  MOMO: "MoMo",
};

// Fallback tính phí hủy khi API cancellation-fee không có
const calculateCancelFee = (tourDate: string, totalAmount: number) => {
  const tour = dayjs(tourDate);
  const daysUntil = tour.diff(dayjs(), "day");
  if (daysUntil > 10) return { fee: totalAmount * 0.15, percent: 15 };
  if (daysUntil >= 6) return { fee: totalAmount * 0.4, percent: 40 };
  if (daysUntil >= 3) return { fee: totalAmount * 0.75, percent: 75 };
  return { fee: totalAmount, percent: 100 };
};

function CancelModalBody({
  selectedBooking,
  cancelFeeFromApi,
  setCancelFeeFromApi,
  calculateCancelFee,
  getBookingCancellationFee,
  onCancel,
  onConfirm,
}: {
  selectedBooking: BookingRow;
  cancelFeeFromApi: { fee: number; percent?: number } | null;
  setCancelFeeFromApi: (v: { fee: number; percent?: number } | null) => void;
  calculateCancelFee: (tourDate: string, totalAmount: number) => { fee: number; percent: number };
  getBookingCancellationFee: (id: number) => Promise<{ fee: number; percent?: number }>;
  onCancel: () => void;
  onConfirm: (b: BookingRow) => void;
}) {
  const totalAmount =
    selectedBooking.finalAmount ?? selectedBooking.totalAmount ?? 0;
  const cancelFee =
    cancelFeeFromApi ??
    calculateCancelFee(selectedBooking.tourDate, totalAmount);

  useEffect(() => {
    if (!selectedBooking?.id) return;
    getBookingCancellationFee(selectedBooking.id)
      .then((res) =>
        setCancelFeeFromApi({ fee: res.fee ?? 0, percent: res.percent })
      )
      .catch(() => setCancelFeeFromApi(null));
  }, [selectedBooking?.id, getBookingCancellationFee, setCancelFeeFromApi]);

  return (
    <div>
      <Alert
        message="Điều khoản hủy tour"
        description={
          <div style={{ marginTop: 8 }}>
            <div>• Trước &gt;10 ngày: Phí hủy 10-20%</div>
            <div>• 6-10 ngày: Phí hủy 30-50%</div>
            <div>• 3-5 ngày: Phí hủy 70-80%</div>
            <div>• &lt;3 ngày / No-show: Phí hủy 100%</div>
          </div>
        }
        type="warning"
        style={{ marginBottom: 16 }}
      />
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Booking ID">
          {selectedBooking.id}
        </Descriptions.Item>
        <Descriptions.Item label="Mã đặt chỗ">
          {selectedBooking.bookingCode || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {selectedBooking.contactName || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Tour">
          {selectedBooking.tourTitle || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Thành tiền">
          {totalAmount.toLocaleString("vi-VN")}đ
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tour">
          {selectedBooking.tourDate
            ? dayjs(selectedBooking.tourDate).format("DD/MM/YYYY")
            : "—"}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 16 }}>
        <Alert
          message={`Phí hủy: ${cancelFee.percent}%${cancelFeeFromApi ? " (từ hệ thống)" : " (ước tính)"}`}
          description={
            <div>
              <div>
                Phí hủy:{" "}
                <strong style={{ color: "#ff4d4f" }}>
                  {cancelFee.fee.toLocaleString("vi-VN")}đ
                </strong>
              </div>
              <div>
                Số tiền hoàn:{" "}
                <strong style={{ color: "#52c41a" }}>
                  {(totalAmount - cancelFee.fee).toLocaleString("vi-VN")}đ
                </strong>
              </div>
            </div>
          }
          type={cancelFee.percent === 100 ? "error" : "warning"}
        />
      </div>
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            danger
            onClick={() => onConfirm(selectedBooking)}
          >
            Xác nhận hủy
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    status: string;
    tour: string;
  }>({
    status: "all",
    tour: "all",
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelFeeFromApi, setCancelFeeFromApi] = useState<{
    fee: number;
    percent?: number;
  } | null>(null);

  const openDetailModal = async (record: BookingRow) => {
    setSelectedBooking(record);
    setIsModalOpen(true);
    setDetailLoading(true);
    try {
      const fresh = await getAdminBookingById(record.id);
      setSelectedBooking({ ...fresh, key: String(fresh.id) });
    } catch {
      // Giữ dữ liệu từ bảng nếu gọi API lỗi
    } finally {
      setDetailLoading(false);
    }
  };

  const hasFilter = filter.status !== "all" || filter.tour !== "all" || !!searchText.trim();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      let toursData = tours;
      if (toursData.length === 0) {
        toursData = await getPublicTours();
        setTours(toursData);
      }
      if (hasFilter) {
        const result = await getAdminBookings({
          page: 0,
          size: 500,
        });
        const all = (result.data ?? []).map((b) => ({ ...b, key: String(b.id) }));
        const filtered = all.filter((b) => {
          if (filter.status !== "all" && b.status !== filter.status) return false;
          if (filter.tour !== "all" && b.tourTitle !== filter.tour) return false;
          if (!searchText.trim()) return true;
          const s = searchText.toLowerCase();
          return (
            String(b.id).toLowerCase().includes(s) ||
            (b.bookingCode || "").toLowerCase().includes(s) ||
            (b.contactName || "").toLowerCase().includes(s) ||
            (b.contactEmail || "").toLowerCase().includes(s) ||
            (b.contactPhone || "").toLowerCase().includes(s)
          );
        });
        setBookings(filtered);
        setTotalBookings(filtered.length);
      } else {
        const result = await getAdminBookings({
          page: pagination.page - 1,
          size: pagination.pageSize,
        });
        const rows = (result.data ?? []).map((b) => ({ ...b, key: String(b.id) }));
        setBookings(rows);
        setTotalBookings(result.total ?? rows.length);
      }
    } catch (err) {
      console.error("Error fetching bookings data:", err);
      setError("Không thể tải dữ liệu bookings. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await fetchData();
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [filter.status, filter.tour, pagination.page, pagination.pageSize]);

  useEffect(() => {
    if (!searchText.trim()) {
      setPagination((p) => ({ ...p, page: 1 }));
      fetchData();
      return;
    }
    const t = setTimeout(() => {
      setPagination((p) => ({ ...p, page: 1 }));
      fetchData();
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  const filteredBookings = hasFilter
    ? bookings.slice(
        (pagination.page - 1) * pagination.pageSize,
        pagination.page * pagination.pageSize
      )
    : bookings;

  const handleCancelBooking = async (booking: BookingRow) => {
    try {
      let fee: number;
      let percent: number;
      try {
        const res = await getBookingCancellationFee(booking.id);
        fee = res.fee ?? 0;
        percent = res.percent ?? 0;
      } catch {
        const local = calculateCancelFee(
          booking.tourDate,
          booking.finalAmount || booking.totalAmount,
        );
        fee = local.fee;
        percent = local.percent;
      }
      await cancelBooking(booking.id);

      setBookings(
        bookings.map((b) =>
          b.id === booking.id
            ? {
                ...b,
                status: "CANCELLED" as const,
                cancellationFee: fee,
                cancelledAt: new Date().toISOString(),
              }
            : b,
        ),
      );
      message.warning(
        `Đã hủy booking. Phí hủy: ${fee.toLocaleString("vi-VN")}đ${percent ? ` (${percent}%)` : ""}`,
      );
      setIsCancelModalOpen(false);
      setCancelFeeFromApi(null);
      fetchData();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      message.error("Không thể hủy booking");
    }
  };

  const columns: ColumnsType<BookingRow> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left",
      render: (id: number) => id,
    },
    {
      title: "Mã đặt chỗ",
      dataIndex: "bookingCode",
      key: "bookingCode",
      width: 120,
      render: (v: string) => v || "—",
    },
    {
      title: "Tour",
      dataIndex: "tourTitle",
      key: "tourTitle",
      width: 200,
      render: (text: string) => <strong>{text || "—"}</strong>,
    },
    {
      title: "Ngày tour",
      dataIndex: "tourDate",
      key: "tourDate",
      width: 110,
      render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 180,
      render: (_, record) => record.contactName || "—",
    },
    {
      title: "Thành tiền",
      dataIndex: "finalAmount",
      key: "finalAmount",
      width: 120,
      render: (v: number, record) => {
        const amount = v ?? record.totalAmount;
        return amount != null ? (
          <strong style={{ color: "#8B0000" }}>
            {Number(amount).toLocaleString("vi-VN")}đ
          </strong>
        ) : (
          "—"
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = statusConfig[status] || statusConfig.PENDING;
        return (
          <Tag
            color={config.color}
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.color,
              color: config.color,
              fontWeight: 500,
              padding: "4px 12px",
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        const cancelFee = calculateCancelFee(
          record.tourDate,
          record.finalAmount ?? record.totalAmount ?? 0,
        );
        return (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => openDetailModal(record)}
            >
              Xem chi tiết
            </Button>
            {(record.status === "PAID" || record.paymentStatus === "PAID") && (
              <Popconfirm
                title="Xác nhận hủy booking"
                description={
                  <div>
                    <div>Phí hủy: {cancelFee.percent}%</div>
                    <div>
                      Số tiền hoàn:{" "}
                      {(
                        (record.finalAmount ?? record.totalAmount) -
                        cancelFee.fee
                      ).toLocaleString("vi-VN")}
                      đ
                    </div>
                  </div>
                }
                onConfirm={() => {
                  setSelectedBooking(record);
                  setCancelFeeFromApi(null);
                  setIsCancelModalOpen(true);
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  type="link"
                  danger
                  icon={<CloseOutlined />}
                  size="small"
                >
                  Hủy booking
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    totalRevenue: bookings
      .filter(
        (b) =>
          b.status !== "CANCELLED" &&
          b.status !== "REFUNDED" &&
          (b.status === "PAID" ||
            b.status === "CONFIRMED" ||
            b.paymentStatus === "PAID"),
      )
      .reduce((sum, b) => sum + (b.finalAmount ?? b.totalAmount ?? 0), 0),
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header - đồng bộ với Dashboard */}
      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}
        >
          Quản lý Booking
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Quản lý và xử lý booking của khách hàng
        </Text>
      </div>

      <BookingSummaryCards
        stats={{
          total: stats.total,
          confirmed: stats.confirmed,
          cancelled: stats.cancelled,
          totalRevenue: formatRevenue(stats.totalRevenue),
        }}
      />

      {/* Bảng Booking - đồng bộ với Dashboard/TourManagement */}
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
        title={
          <Title
            level={5}
            style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}
          >
            Danh sách Booking
          </Title>
        }
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => {
                setFilter({ ...filter, status: value });
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="PENDING">Chờ xử lý</Select.Option>
              <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tour"
              value={filter.tour}
              onChange={(value) => {
                setFilter({ ...filter, tour: value });
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {tours.map((tour) => (
                <Select.Option key={tour.id} value={tour.title}>
                  {tour.title}
                </Select.Option>
              ))}
              {bookings
                .filter(
                  (b) =>
                    b.tourTitle && !tours.some((t) => t.title === b.tourTitle),
                )
                .reduce((acc: { id: string; title: string }[], b) => {
                  if (!acc.some((x) => x.title === b.tourTitle))
                    acc.push({ id: String(b.tourId), title: b.tourTitle });
                  return acc;
                }, [])
                .map((t) => (
                  <Select.Option key={t.id} value={t.title}>
                    {t.title}
                  </Select.Option>
                ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Input
              placeholder="Tìm kiếm ID, mã đặt chỗ, tên, email, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBookings}
            scroll={{ x: 900 }}
            pagination={{
              current: pagination.page,
              pageSize: pagination.pageSize,
              total: totalBookings,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} / Tổng ${total} booking`,
              onChange: (page, pageSize) =>
                setPagination((p) => ({
                  ...p,
                  page,
                  pageSize: pageSize ?? p.pageSize,
                })),
            }}
          />
        )}
      </Card>

      {/* Modal Chi tiết Booking */}
      <Modal
        title="Chi tiết Booking"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin />
            <p style={{ marginTop: 8 }}>Đang tải chi tiết...</p>
          </div>
        ) : selectedBooking ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {selectedBooking.id}
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt chỗ">
              {selectedBooking.bookingCode || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Tour">
              {selectedBooking.tourTitle || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Tour ID">
              {selectedBooking.tourId}
            </Descriptions.Item>
            <Descriptions.Item label="Lịch tour ID">
              {selectedBooking.tourScheduleId ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tour">
              {selectedBooking.tourDate
                ? dayjs(selectedBooking.tourDate).format("DD/MM/YYYY")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ khởi hành">
              {formatTime12h(selectedBooking.tourStartTime)}
            </Descriptions.Item>
            <Descriptions.Item label="Số người">
              {selectedBooking.numParticipants}
            </Descriptions.Item>
            <Descriptions.Item label="Người liên hệ">
              {selectedBooking.contactName || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedBooking.contactEmail || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedBooking.contactPhone || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {(selectedBooking.totalAmount ?? 0).toLocaleString("vi-VN")}đ
            </Descriptions.Item>
            <Descriptions.Item label="Giảm giá">
              {(selectedBooking.discountAmount ?? 0).toLocaleString("vi-VN")}đ
            </Descriptions.Item>
            <Descriptions.Item label="Thành tiền">
              <strong style={{ color: "#8B0000" }}>
                {(
                  selectedBooking.finalAmount ??
                  selectedBooking.totalAmount ??
                  0
                ).toLocaleString("vi-VN")}
                đ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              <Tag
                color={
                  paymentStatusConfig[selectedBooking.paymentStatus]?.color
                }
              >
                {paymentStatusConfig[selectedBooking.paymentStatus]?.label ??
                  selectedBooking.paymentStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {paymentMethodLabels[selectedBooking.paymentMethod] ??
                selectedBooking.paymentMethod ??
                "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[selectedBooking.status]?.color}>
                {statusConfig[selectedBooking.status]?.label ??
                  selectedBooking.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán">
              {formatDateTimeVN(selectedBooking.paidAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hủy">
              {formatDateTimeVN(selectedBooking.cancelledAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Phí hủy">
              {selectedBooking.cancellationFee != null &&
              selectedBooking.cancellationFee > 0 ? (
                <strong style={{ color: "#ff4d4f" }}>
                  {selectedBooking.cancellationFee.toLocaleString("vi-VN")}đ
                </strong>
              ) : (
                "—"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền hoàn">
              {selectedBooking.refundAmount != null &&
              selectedBooking.refundAmount > 0 ? (
                <strong style={{ color: "#52c41a" }}>
                  {selectedBooking.refundAmount.toLocaleString("vi-VN")}đ
                </strong>
              ) : (
                "—"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {formatDateTimeVN(selectedBooking.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lúc">
              {formatDateTimeVN(selectedBooking.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      {/* Modal Xác nhận hủy */}
      <Modal
        title="Xác nhận hủy booking"
        open={isCancelModalOpen}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setCancelFeeFromApi(null);
        }}
        footer={null}
        width={600}
      >
        {selectedBooking && (
          <CancelModalBody
            selectedBooking={selectedBooking}
            cancelFeeFromApi={cancelFeeFromApi}
            setCancelFeeFromApi={setCancelFeeFromApi}
            calculateCancelFee={calculateCancelFee}
            getBookingCancellationFee={getBookingCancellationFee}
            onCancel={() => {
              setIsCancelModalOpen(false);
              setCancelFeeFromApi(null);
            }}
            onConfirm={handleCancelBooking}
          />
        )}
      </Modal>
    </div>
  );
}
