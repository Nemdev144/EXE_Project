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
  DatePicker,
  Alert,
  Statistic,
  Tooltip,
  Spin,
} from "antd";
import {
  EyeOutlined,
  MailOutlined,
  CloseOutlined,
  DollarOutlined,
  SearchOutlined,
  ExportOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  getAdminBookings,
  updateBooking,
  cancelBooking,
  refundBooking,
  type AdminBooking,
} from "../../services/adminApi";
import { getPublicTours } from "../../services/api";
import type { Tour } from "../../types";

const { RangePicker } = DatePicker;

interface Booking {
  key: string;
  id: string;
  tour: string;
  customer: string;
  email: string;
  phone: string;
  participants: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  bookingDate: string;
  tourDate: string;
  staffLabel?: string;
  cancelFee?: number;
  cancelFeePercent?: number;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor?: string }
> = {
  PENDING: { label: "Chờ thanh toán", color: "#faad14", bgColor: "#fffbe6" },
  PAID: { label: "Đã thanh toán", color: "#52c41a", bgColor: "#f6ffed" },
  CANCELLED: { label: "Đã hủy", color: "#ff4d4f", bgColor: "#fff1f0" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#8c8c8c", bgColor: "#fafafa" },
};

const staffLabels = [
  "Đã liên hệ",
  "Khách đồng ý đổi tour",
  "Khách không phản hồi",
];

// Điều khoản hủy tour
const cancelPolicy = [
  { days: 10, feePercent: "10-20%" },
  { days: 6, feePercent: "30-50%" },
  { days: 3, feePercent: "70-80%" },
  { days: 0, feePercent: "100%" },
];

// Tính phí hủy
const calculateCancelFee = (
  bookingDate: string,
  tourDate: string,
  totalAmount: number,
) => {
  const [day, month, year] = tourDate.split("/");
  const tour = dayjs(`${year}-${month}-${day}`);
  const daysUntil = tour.diff(dayjs(), "day");

  if (daysUntil > 10) return { fee: totalAmount * 0.15, percent: 15 };
  if (daysUntil >= 6) return { fee: totalAmount * 0.4, percent: 40 };
  if (daysUntil >= 3) return { fee: totalAmount * 0.75, percent: 75 };
  return { fee: totalAmount, percent: 100 };
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Fetch bookings and tours from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bookings and tours in parallel
        const [bookingsResult, toursData] = await Promise.all([
          getAdminBookings(),
          getPublicTours(),
        ]);

        // Set tours for filter dropdown
        setTours(toursData);

        // Map AdminBooking to Booking format
        const mappedBookings: Booking[] = bookingsResult.data.map(
          (adminBooking: AdminBooking) => {
            // Find tour title from tours list
            const tour = toursData.find((t) => t.id === adminBooking.tourId);
            const tourTitle =
              adminBooking.tourTitle || tour?.title || "Tour không xác định";

            return {
              key: String(adminBooking.id),
              id: String(adminBooking.id),
              tour: tourTitle,
              customer: adminBooking.customerName,
              email: adminBooking.email,
              phone: adminBooking.phone,
              participants: adminBooking.participants,
              totalAmount: adminBooking.totalAmount,
              status: adminBooking.status,
              bookingDate: dayjs(adminBooking.bookingDate).format("DD/MM/YYYY"),
              tourDate: dayjs(adminBooking.tourDate).format("DD/MM/YYYY"),
            };
          },
        );

        setBookings(mappedBookings);
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter.status !== "all" && booking.status !== filter.status)
      return false;
    if (filter.tour !== "all" && booking.tour !== filter.tour) return false;
    if (
      searchText &&
      !booking.customer.toLowerCase().includes(searchText.toLowerCase()) &&
      !booking.email.toLowerCase().includes(searchText.toLowerCase()) &&
      !booking.id.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;
    return true;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: Booking["status"],
  ) => {
    try {
      await updateBooking(Number(id), { status: newStatus });
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status: newStatus } : booking,
        ),
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.error("Error updating booking status:", err);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
      const cancelFee = calculateCancelFee(
        booking.bookingDate,
        booking.tourDate,
        booking.totalAmount,
      );
      await cancelBooking(Number(booking.id), `Phí hủy ${cancelFee.percent}%`);

      setBookings(
        bookings.map((b) =>
          b.id === booking.id
            ? {
                ...b,
                status: "CANCELLED",
                cancelFee: cancelFee.fee,
                cancelFeePercent: cancelFee.percent,
              }
            : b,
        ),
      );
      message.warning(
        `Đã hủy booking. Phí hủy: ${cancelFee.fee.toLocaleString("vi-VN")}đ (${cancelFee.percent}%)`,
      );
      setIsCancelModalOpen(false);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      message.error("Không thể hủy booking");
    }
  };

  const handleRefund = async (id: string) => {
    try {
      const booking = bookings.find((b) => b.id === id);
      if (booking && booking.cancelFee) {
        const refundAmount = booking.totalAmount - booking.cancelFee;
        await refundBooking(Number(id), refundAmount);
        setBookings(
          bookings.map((b) => (b.id === id ? { ...b, status: "REFUNDED" } : b)),
        );
        message.success(
          `Đã hoàn tiền: ${refundAmount.toLocaleString("vi-VN")}đ (Sau khi trừ phí hủy ${booking.cancelFee.toLocaleString("vi-VN")}đ)`,
        );
      } else {
        await refundBooking(Number(id));
        await handleStatusChange(id, "REFUNDED");
        message.success("Đã hoàn tiền đầy đủ");
      }
    } catch (err) {
      console.error("Error refunding booking:", err);
      message.error("Không thể hoàn tiền");
    }
  };

  const handleStaffLabel = (id: string, label: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, staffLabel: label } : booking,
      ),
    );
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tour",
      dataIndex: "tour",
      key: "tour",
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.customer}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            <MailOutlined /> {record.email}
          </div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Số người",
      dataIndex: "participants",
      key: "participants",
      width: 100,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount) => (
        <strong style={{ color: "#8B0000" }}>
          {amount.toLocaleString("vi-VN")}đ
        </strong>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const config = statusConfig[status];
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
      title: "Ngày tour",
      dataIndex: "tourDate",
      key: "tourDate",
      width: 120,
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </div>
      ),
    },
    {
      title: "Nhãn",
      key: "label",
      width: 180,
      render: (_, record) => (
        <div>
          {record.staffLabel && (
            <Tag
              color="#1890ff"
              style={{
                marginBottom: 4,
                display: "block",
                backgroundColor: "#e6f7ff",
                borderColor: "#1890ff",
                color: "#1890ff",
                fontWeight: 500,
                padding: "4px 12px",
              }}
            >
              {record.staffLabel}
            </Tag>
          )}
          <Select
            size="small"
            placeholder="Thêm nhãn"
            value={record.staffLabel || undefined}
            onChange={(value) => handleStaffLabel(record.id, value)}
            style={{ width: "100%" }}
          >
            {staffLabels.map((label) => (
              <Select.Option key={label} value={label}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => {
        const cancelFee = calculateCancelFee(
          record.bookingDate,
          record.tourDate,
          record.totalAmount,
        );
        return (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedBooking(record);
                setIsModalOpen(true);
              }}
            >
              Chi tiết
            </Button>
            {record.status === "PAID" && (
              <Popconfirm
                title="Xác nhận hủy booking"
                description={
                  <div>
                    <div>Phí hủy: {cancelFee.percent}%</div>
                    <div>
                      Số tiền hoàn:{" "}
                      {(record.totalAmount - cancelFee.fee).toLocaleString(
                        "vi-VN",
                      )}
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
                onClick={() => handleRefund(record.id)}
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
    pending: bookings.filter((b) => b.status === "PENDING").length,
    paid: bookings.filter((b) => b.status === "PAID").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    totalRevenue: bookings
      .filter((b) => b.status === "PAID")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #8B0000 0%, #a00000 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff", opacity: 0.9 }}>
                  Tổng Booking
                </span>
              }
              value={stats.total}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff", opacity: 0.9 }}>
                  Chờ thanh toán
                </span>
              }
              value={stats.pending}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff", opacity: 0.9 }}>
                  Đã thanh toán
                </span>
              }
              value={stats.paid}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff", opacity: 0.9 }}>Doanh thu</span>
              }
              value={stats.totalRevenue / 1000000}
              precision={1}
              suffix="M"
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h2
          style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#262626" }}
        >
          Quản lý Booking
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
          Quản lý và xử lý booking của khách hàng
        </p>
      </Card>

      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
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
            scroll={{ x: 1400 }}
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
        {selectedBooking && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {selectedBooking.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tour">
              {selectedBooking.tour}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {selectedBooking.customer}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedBooking.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedBooking.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Số người">
              {selectedBooking.participants}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <strong style={{ color: "#8B0000" }}>
                {selectedBooking.totalAmount.toLocaleString("vi-VN")}đ
              </strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[selectedBooking.status].color}>
                {statusConfig[selectedBooking.status].label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {selectedBooking.bookingDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tour">
              {selectedBooking.tourDate}
            </Descriptions.Item>
            {selectedBooking.staffLabel && (
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
                  {selectedBooking.staffLabel}
                </Tag>
              </Descriptions.Item>
            )}
            {selectedBooking.status === "CANCELLED" &&
              selectedBooking.cancelFee && (
                <>
                  <Descriptions.Item label="Phí hủy">
                    <strong style={{ color: "#ff4d4f" }}>
                      {selectedBooking.cancelFee.toLocaleString("vi-VN")}đ (
                      {selectedBooking.cancelFeePercent}%)
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền hoàn">
                    <strong style={{ color: "#52c41a" }}>
                      {(
                        selectedBooking.totalAmount - selectedBooking.cancelFee
                      ).toLocaleString("vi-VN")}
                      đ
                    </strong>
                  </Descriptions.Item>
                </>
              )}
          </Descriptions>
        )}
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
              <Descriptions.Item label="Khách hàng">
                {selectedBooking.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Tour">
                {selectedBooking.tour}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {selectedBooking.totalAmount.toLocaleString("vi-VN")}đ
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tour">
                {selectedBooking.tourDate}
              </Descriptions.Item>
            </Descriptions>
            {(() => {
              const cancelFee = calculateCancelFee(
                selectedBooking.bookingDate,
                selectedBooking.tourDate,
                selectedBooking.totalAmount,
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
                              selectedBooking.totalAmount - cancelFee.fee
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
    </Space>
  );
}
