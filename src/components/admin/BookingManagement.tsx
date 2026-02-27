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
  MailOutlined,
  CloseOutlined,
  DollarOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import BookingSummaryCards from "./BookingSummaryCards";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getAdminBookings,
  getAdminBookingById,
  cancelBooking,
  refundBooking,
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
  CONFIRMED: { label: "Đã xác nhận", color: "#1890ff", bgColor: "#e6f7ff" },
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

export default function BookingManagement() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    status: string;
    tour: string;
    dateRange?: any;
  }>({
    status: "all",
    tour: "all",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [bookingsResult, toursData] = await Promise.all([
          getAdminBookings(),
          getPublicTours(),
        ]);
        setTours(toursData);
        const rows: BookingRow[] = (bookingsResult.data ?? []).map((b) => ({
          ...b,
          key: String(b.id),
        }));
        setBookings(rows);
      } catch (err) {
        console.error("Error fetching bookings data:", err);
        setError("Không thể tải dữ liệu bookings. Vui lòng thử lại sau.");
        message.error("Không thể tải dữ liệu bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBookings = bookings
    .filter((b) => {
      if (filter.status !== "all" && b.status !== filter.status) return false;
      if (filter.tour !== "all" && b.tourTitle !== filter.tour) return false;
      if (searchText) {
        const s = searchText.toLowerCase();
        return (
          String(b.id).toLowerCase().includes(s) ||
          (b.bookingCode || "").toLowerCase().includes(s) ||
          (b.contactName || "").toLowerCase().includes(s) ||
          (b.contactEmail || "").toLowerCase().includes(s) ||
          (b.contactPhone || "").toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = a.createdAt ? dayjs(a.createdAt).valueOf() : 0;
      const dateB = b.createdAt ? dayjs(b.createdAt).valueOf() : 0;
      return dateB - dateA; // Mới nhất trên cùng (theo ngày tạo giảm dần)
    });

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
      await cancelBooking(booking.id, `Phí hủy ${percent}%`);

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
    } catch (err) {
      console.error("Error cancelling booking:", err);
      message.error("Không thể hủy booking");
    }
  };

  const handleRefund = async (id: string) => {
    try {
      const booking = bookings.find((b) => String(b.id) === id);
      if (
        booking &&
        booking.cancellationFee != null &&
        booking.cancellationFee > 0
      ) {
        const refundAmount =
          (booking.finalAmount || booking.totalAmount) -
          booking.cancellationFee;
        await refundBooking(Number(id), refundAmount);
        setBookings(
          bookings.map((b) =>
            String(b.id) === id
              ? { ...b, status: "REFUNDED" as const, refundAmount }
              : b,
          ),
        );
        message.success(
          `Đã hoàn tiền: ${refundAmount.toLocaleString("vi-VN")}đ (Sau khi trừ phí hủy ${booking.cancellationFee.toLocaleString("vi-VN")}đ)`,
        );
      } else {
        await refundBooking(Number(id));
        setBookings(
          bookings.map((b) =>
            String(b.id) === id ? { ...b, status: "REFUNDED" as const } : b,
          ),
        );
        message.success("Đã hoàn tiền");
      }
    } catch (err) {
      console.error("Error refunding booking:", err);
      message.error("Không thể hoàn tiền");
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
            {record.status === "CANCELLED" && (
              <Button
                type="link"
                icon={<DollarOutlined />}
                size="small"
                onClick={() => handleRefund(String(record.id))}
              >
                Hoàn tiền
              </Button>
            )}
            <Button type="link" icon={<MailOutlined />} size="small">
              Gửi email
            </Button>
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
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="PENDING">Chờ xử lý</Select.Option>
              <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
              <Select.Option value="PAID">Đã thanh toán</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
              <Select.Option value="REFUNDED">Đã hoàn tiền</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tour"
              value={filter.tour}
              onChange={(value) => setFilter({ ...filter, tour: value })}
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
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm ID, tên, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<ExportOutlined />} style={{ width: "100%" }}>
              Xuất Excel
            </Button>
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
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} booking`,
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
              {selectedBooking.tourStartTime
                ? dayjs(selectedBooking.tourStartTime).format("HH:mm")
                : "—"}
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
              {selectedBooking.paidAt
                ? dayjs(selectedBooking.paidAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hủy">
              {selectedBooking.cancelledAt
                ? dayjs(selectedBooking.cancelledAt).format("DD/MM/YYYY HH:mm")
                : "—"}
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
              {selectedBooking.createdAt
                ? dayjs(selectedBooking.createdAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lúc">
              {selectedBooking.updatedAt
                ? dayjs(selectedBooking.updatedAt).format("DD/MM/YYYY HH:mm")
                : "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      {/* Modal Xác nhận hủy */}
      <Modal
        title="Xác nhận hủy booking"
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedBooking && (
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
                {(
                  selectedBooking.finalAmount ??
                  selectedBooking.totalAmount ??
                  0
                ).toLocaleString("vi-VN")}
                đ
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tour">
                {selectedBooking.tourDate
                  ? dayjs(selectedBooking.tourDate).format("DD/MM/YYYY")
                  : "—"}
              </Descriptions.Item>
            </Descriptions>
            {(() => {
              const cancelFee = calculateCancelFee(
                selectedBooking.tourDate,
                selectedBooking.finalAmount ?? selectedBooking.totalAmount ?? 0,
              );
              return (
                <div style={{ marginTop: 16 }}>
                  <Alert
                    message={`Phí hủy: ${cancelFee.percent}%`}
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
                            {(
                              (selectedBooking.finalAmount ??
                                selectedBooking.totalAmount ??
                                0) - cancelFee.fee
                            ).toLocaleString("vi-VN")}
                            đ
                          </strong>
                        </div>
                      </div>
                    }
                    type={cancelFee.percent === 100 ? "error" : "warning"}
                  />
                </div>
              );
            })()}
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setIsCancelModalOpen(false)}>Hủy</Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => handleCancelBooking(selectedBooking)}
                >
                  Xác nhận hủy
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
