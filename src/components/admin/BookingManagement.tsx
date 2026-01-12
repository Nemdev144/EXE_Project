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
} from "antd";
import {
  EyeOutlined,
  MailOutlined,
  CloseOutlined,
  CheckOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ thanh toán", color: "warning" },
  PAID: { label: "Đã thanh toán", color: "success" },
  CANCELLED: { label: "Đã hủy", color: "error" },
  REFUNDED: { label: "Đã hoàn tiền", color: "default" },
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
      staffLabel: "Đã liên hệ",
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

  const [filter, setFilter] = useState<{ status: string; tour: string }>({
    status: "all",
    tour: "all",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBookings = bookings.filter((booking) => {
    if (filter.status !== "all" && booking.status !== filter.status) return false;
    if (filter.tour !== "all" && booking.tour !== filter.tour) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: Booking["status"]) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
    message.success("Cập nhật trạng thái thành công");
  };

  const handleStaffLabel = (id: string, label: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, staffLabel: label } : booking
      )
    );
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tour",
      dataIndex: "tour",
      key: "tour",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Khách hàng",
      key: "customer",
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
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
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
      render: (status: string) => {
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Ngày tour",
      dataIndex: "tourDate",
      key: "tourDate",
    },
    {
      title: "Nhãn",
      key: "label",
      render: (_, record) => (
        <div>
          {record.staffLabel && (
            <Tag color="blue" style={{ marginBottom: 4, display: "block" }}>
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
      render: (_, record) => (
        <Space direction="vertical" size="small">
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
            <Button
              type="link"
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleStatusChange(record.id, "CANCELLED")}
            >
              Hủy
            </Button>
          )}
          {record.status === "CANCELLED" && (
            <Button
              type="link"
              icon={<DollarOutlined />}
              size="small"
              onClick={() => handleStatusChange(record.id, "REFUNDED")}
            >
              Hoàn tiền
            </Button>
          )}
          <Button type="link" icon={<MailOutlined />} size="small">
            Email
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý Booking</h2>
        <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
          Quản lý và xử lý booking của khách hàng
        </p>
      </Card>

      <Card>
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
        </Row>

        <Table
          columns={columns}
          dataSource={filteredBookings}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} booking`,
          }}
        />
      </Card>

      <Modal
        title="Chi tiết Booking"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
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
          </Descriptions>
        )}
      </Modal>
    </Space>
  );
}
