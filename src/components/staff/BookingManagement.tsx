import { useState } from "react";
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
  Input,
  DatePicker,
  Statistic,
  Alert,
} from "antd";
import {
  EyeOutlined,
  MailOutlined,
  SearchOutlined,
  ExportOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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
  internalNote?: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor?: string }> = {
  PENDING: { label: "Chờ thanh toán", color: "#faad14", bgColor: "#fffbe6" },
  PAID: { label: "Đã thanh toán", color: "#52c41a", bgColor: "#f6ffed" },
  CANCELLED: { label: "Đã hủy", color: "#ff4d4f", bgColor: "#fff1f0" },
  REFUNDED: { label: "Đã hoàn tiền", color: "#8c8c8c", bgColor: "#fafafa" },
};

const staffLabels = ["Đã liên hệ", "Khách đồng ý đổi tour", "Khách không phản hồi"];

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      key: "1",
      id: "BK001",
      tour: "Lễ hội Cồng chiêng",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      participants: 2,
      totalAmount: 3000000,
      status: "PAID",
      bookingDate: "15/01/2025",
      tourDate: "25/01/2025",
      staffLabel: "Đã liên hệ",
      internalNote: "Khách đã xác nhận tham gia",
    },
    {
      key: "2",
      id: "BK002",
      tour: "Tour Ẩm thực Tây Nguyên",
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0907654321",
      participants: 2,
      totalAmount: 5000000,
      status: "PENDING",
      bookingDate: "18/01/2025",
      tourDate: "01/02/2025",
      staffLabel: "Khách không phản hồi",
    },
    {
      key: "3",
      id: "BK003",
      tour: "Làng nghề Gốm",
      customer: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0912345678",
      participants: 2,
      totalAmount: 1600000,
      status: "PAID",
      bookingDate: "20/01/2025",
      tourDate: "08/02/2025",
    },
  ]);

  const [filter, setFilter] = useState<{ status: string; tour: string; dateRange?: any }>({
    status: "all",
    tour: "all",
  });
  const [searchText, setSearchText] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    if (filter.status !== "all" && booking.status !== filter.status) return false;
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

  const handleStaffLabel = (id: string, label: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, staffLabel: label } : booking
      )
    );
    message.success("Đã cập nhật nhãn");
  };

  const handleAddNote = (id: string, note: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, internalNote: note } : booking
      )
    );
    message.success("Đã thêm ghi chú");
    setIsNoteModalOpen(false);
    setNoteText("");
  };

  const handleSendEmail = (booking: Booking, template: string) => {
    message.success(`Đã gửi email "${template}" đến ${booking.email}`);
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
        <strong style={{ color: "#8B0000" }}>{amount.toLocaleString("vi-VN")}đ</strong>
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
      title: "Nhãn xử lý",
      key: "label",
      width: 200,
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
      render: (_, record) => (
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
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setNoteText(record.internalNote || "");
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
                  <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
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

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    paid: bookings.filter((b) => b.status === "PAID").length,
    needAction: bookings.filter((b) => !b.staffLabel || b.staffLabel === "Khách không phản hồi").length,
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
              title={<span style={{ color: "#fff", opacity: 0.9 }}>Tổng Booking</span>}
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
              title={<span style={{ color: "#fff", opacity: 0.9 }}>Chờ thanh toán</span>}
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
              title={<span style={{ color: "#fff", opacity: 0.9 }}>Đã thanh toán</span>}
              value={stats.paid}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={<span style={{ color: "#fff", opacity: 0.9 }}>Cần xử lý</span>}
              value={stats.needAction}
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
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#262626" }}>
          Quản lý Booking
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
          Xem và xử lý booking của khách hàng
        </p>
        <Alert
          message="Lưu ý"
          description="Staff không có quyền hủy booking PAID hoặc thực hiện refund. Vui lòng liên hệ Admin để xử lý."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
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
              <Select.Option value="Lễ hội Cồng chiêng">Lễ hội Cồng chiêng</Select.Option>
              <Select.Option value="Tour Ẩm thực Tây Nguyên">Tour Ẩm thực Tây Nguyên</Select.Option>
              <Select.Option value="Làng nghề Gốm">Làng nghề Gốm</Select.Option>
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
            <Descriptions.Item label="ID">{selectedBooking.id}</Descriptions.Item>
            <Descriptions.Item label="Tour">{selectedBooking.tour}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{selectedBooking.customer}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBooking.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedBooking.phone}</Descriptions.Item>
            <Descriptions.Item label="Số người">{selectedBooking.participants}</Descriptions.Item>
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
            <Descriptions.Item label="Ngày đặt">{selectedBooking.bookingDate}</Descriptions.Item>
            <Descriptions.Item label="Ngày tour">{selectedBooking.tourDate}</Descriptions.Item>
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
            {selectedBooking.internalNote && (
              <Descriptions.Item label="Ghi chú nội bộ">
                {selectedBooking.internalNote}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal Ghi chú */}
      <Modal
        title="Ghi chú nội bộ"
        open={isNoteModalOpen}
        onOk={() => {
          if (selectedBooking) {
            handleAddNote(selectedBooking.id, noteText);
          }
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
