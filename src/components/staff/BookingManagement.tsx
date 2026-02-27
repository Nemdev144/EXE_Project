import { useState, useEffect } from "react";
import {
  App,
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
  Input,
  Alert,
  Spin,
  Typography,
} from "antd";

const { Title, Text } = Typography;
import {
  EyeOutlined,
  MailOutlined,
  SearchOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getAdminBookings,
  getAdminBookingById,
  updateBooking,
  type AdminBooking,
} from "../../services/adminApi";
import { getPublicTours } from "../../services/api";
import type { Tour } from "../../types";
import Breadcrumbs from "../Breadcrumbs";
import BookingSummaryCards from "../admin/BookingSummaryCards";

type BookingRow = AdminBooking & { key: string };

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor?: string }
> = {
  PENDING: { label: "Chờ thanh toán", color: "#faad14", bgColor: "#fffbe6" },
  CONFIRMED: { label: "Đã xác nhận", color: "#1890ff", bgColor: "#e6f7ff" },
  PAID: { label: "Đã thanh toán", color: "#52c41a", bgColor: "#f6ffed" },
  CANCELLED: { label: "Đã hủy", color: "#ff4d4f", bgColor: "#fff1f0" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#8c8c8c", bgColor: "#fafafa" },
};

const staffLabels = [
  "Đã liên hệ",
  "Khách đồng ý đổi tour",
  "Khách không phản hồi",
];

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

function formatRevenue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ₫`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K ₫`;
  return `${value.toLocaleString("vi-VN")} ₫`;
}

export default function BookingManagement() {
  const { message } = App.useApp();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{ status: string; tour: string }>({
    status: "all",
    tour: "all",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [staffLabelsMap, setStaffLabelsMap] = useState<Record<number, string>>(
    {},
  );
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsResult, toursData] = await Promise.all([
        getAdminBookings(),
        getPublicTours(),
      ]);
      setTours(toursData);
      setBookings(
        (bookingsResult.data ?? []).map((b) => ({ ...b, key: String(b.id) })),
      );
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể tải dữ liệu bookings. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDetailModal = async (record: BookingRow) => {
    setSelectedBooking(record);
    setIsModalOpen(true);
    setDetailLoading(true);
    try {
      const fresh = await getAdminBookingById(record.id);
      setSelectedBooking({ ...fresh, key: String(fresh.id) });
    } catch {
      // Giữ dữ liệu từ bảng
    } finally {
      setDetailLoading(false);
    }
  };

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
      return dateB - dateA;
    });

  const handleStaffLabel = (id: number, label: string) => {
    setStaffLabelsMap((prev) => ({ ...prev, [id]: label }));
    message.success("Đã cập nhật nhãn");
  };

  const handleAddNote = async (id: number, note: string) => {
    try {
      await updateBooking(id, { notes: note });
      setNotesMap((prev) => ({ ...prev, [id]: note }));
      message.success("Đã lưu ghi chú");
    } catch {
      setNotesMap((prev) => ({ ...prev, [id]: note }));
      message.success("Đã thêm ghi chú (lưu cục bộ)");
    }
    setIsNoteModalOpen(false);
    setNoteText("");
  };

  const handleSendEmail = (booking: BookingRow, template: string) => {
    message.success(`Đã gửi email "${template}" đến ${booking.contactEmail}`);
  };

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
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openDetailModal(record)}
          >
            Xem chi tiết
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setNoteText(notesMap[record.id] || "");
              setIsNoteModalOpen(true);
            }}
          >
            Ghi chú
          </Button>
          <Button
            type="link"
            icon={<MailOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: "Chọn template email",
                content: (
                  <Space
                    orientation="vertical"
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    <Button
                      block
                      onClick={() => {
                        handleSendEmail(record, "Nhắc thanh toán");
                        Modal.destroyAll();
                      }}
                    >
                      Nhắc thanh toán
                    </Button>
                    <Button
                      block
                      onClick={() => {
                        handleSendEmail(record, "Thông báo thiếu người");
                        Modal.destroyAll();
                      }}
                    >
                      Thông báo thiếu người
                    </Button>
                    <Button
                      block
                      onClick={() => {
                        handleSendEmail(record, "Đề xuất đổi tour");
                        Modal.destroyAll();
                      }}
                    >
                      Đề xuất đổi tour
                    </Button>
                  </Space>
                ),
                okButtonProps: { style: { display: "none" } },
                cancelText: "Đóng",
              });
            }}
          >
            Gửi email
          </Button>
        </Space>
      ),
    },
  ];

  const tourOptions = [
    ...tours.map((t) => t.title),
    ...Array.from(
      new Set(
        bookings
          .filter(
            (b) => b.tourTitle && !tours.some((t) => t.title === b.tourTitle),
          )
          .map((b) => b.tourTitle),
      ),
    ),
  ].filter(Boolean);

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumbs
        items={[
          { label: "Dashboard", path: "/staff" },
          { label: "Quản lý Booking" },
        ]}
      />
      <BookingSummaryCards
        stats={{
          total: stats.total,
          confirmed: stats.confirmed,
          cancelled: stats.cancelled,
          totalRevenue: formatRevenue(stats.totalRevenue),
        }}
      />

      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}
        >
          Quản lý Booking
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Xem và xử lý booking của khách hàng
        </Text>
        <Alert
          message="Lưu ý"
          description="Staff không có quyền hủy booking PAID hoặc thực hiện refund. Vui lòng liên hệ Admin để xử lý."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </div>

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
              <Select.Option value="PENDING">Chờ thanh toán</Select.Option>
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
              {tourOptions.map((title) => (
                <Select.Option key={title} value={title}>
                  {title}
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
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBookings}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} booking`,
            }}
          />
        )}
      </Card>

      {/* Modal Chi tiết */}
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
            {staffLabelsMap[selectedBooking.id] && (
              <Descriptions.Item label="Nhãn">
                <Tag
                  color="#1890ff"
                  style={{
                    backgroundColor: "#e6f7ff",
                    borderColor: "#1890ff",
                    color: "#1890ff",
                    fontWeight: 500,
                    padding: "4px 12px",
                  }}
                >
                  {staffLabelsMap[selectedBooking.id]}
                </Tag>
              </Descriptions.Item>
            )}
            {notesMap[selectedBooking.id] && (
              <Descriptions.Item label="Ghi chú nội bộ">
                {notesMap[selectedBooking.id]}
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : null}
      </Modal>

      {/* Modal Ghi chú */}
      <Modal
        title="Ghi chú nội bộ"
        open={isNoteModalOpen}
        onOk={() => {
          if (selectedBooking) handleAddNote(selectedBooking.id, noteText);
        }}
        onCancel={() => {
          setIsNoteModalOpen(false);
          setNoteText("");
        }}
        okText="Lưu"
        cancelText="Hủy"
        width={500}
      >
        <Input.TextArea
          rows={6}
          placeholder="Nhập ghi chú nội bộ cho booking này..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </Modal>
    </Space>
  );
}
