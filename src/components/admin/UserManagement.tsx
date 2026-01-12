import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Select,
  Row,
  Col,
  Avatar,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface User {
  key: string;
  id: string;
  name: string;
  email: string;
  role: "USER" | "STAFF" | "ADMIN";
  status: "ACTIVE" | "LOCKED";
  createdAt: string;
  lastLogin?: string;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  USER: { label: "Người dùng", color: "blue" },
  STAFF: { label: "Nhân viên", color: "orange" },
  ADMIN: { label: "Quản trị viên", color: "red" },
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      key: "1",
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "USER",
      status: "ACTIVE",
      createdAt: "10/01/2025",
      lastLogin: "22/01/2025",
    },
    {
      key: "2",
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "STAFF",
      status: "ACTIVE",
      createdAt: "05/01/2025",
      lastLogin: "23/01/2025",
    },
    {
      key: "3",
      id: "3",
      name: "Admin User",
      email: "admin@coiviet.com",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "01/01/2025",
      lastLogin: "23/01/2025",
    },
  ]);

  const [filter, setFilter] = useState<{ role: string; status: string }>({
    role: "all",
    status: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredUsers = users.filter((user) => {
    if (filter.role !== "all" && user.role !== filter.role) return false;
    if (filter.status !== "all" && user.status !== filter.status) return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: "ACTIVE" | "LOCKED") => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: newStatus } : user)));
    message.success("Cập nhật trạng thái thành công");
  };

  const handleRoleChange = (id: string, newRole: User["role"]) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    message.success("Cập nhật vai trò thành công");
  };

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#8B0000" }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              <MailOutlined /> {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string, record) => (
        <Select
          value={role}
          onChange={(value) => handleRoleChange(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value="USER">Người dùng</Select.Option>
          <Select.Option value="STAFF">Nhân viên</Select.Option>
          <Select.Option value="ADMIN">Quản trị viên</Select.Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (text) => text || "Chưa đăng nhập",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button type="link" icon={<KeyOutlined />} size="small">
            Reset mật khẩu
          </Button>
          <Button
            type="link"
            icon={record.status === "ACTIVE" ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            danger={record.status === "ACTIVE"}
            onClick={() =>
              handleStatusChange(record.id, record.status === "ACTIVE" ? "LOCKED" : "ACTIVE")
            }
          >
            {record.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý User/Staff</h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Quản lý người dùng và phân quyền
            </p>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Tạo user mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Vai trò"
              value={filter.role}
              onChange={(value) => setFilter({ ...filter, role: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="USER">Người dùng</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="LOCKED">Đã khóa</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} user`,
          }}
        />
      </Card>

      <Modal
        title="Tạo user mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="USER">Người dùng</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => message.success("Đã tạo user thành công")}>
                Tạo
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
