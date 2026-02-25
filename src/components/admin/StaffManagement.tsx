import { useState, useEffect } from "react";
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
  Spin,
  Alert,
  Typography,
} from "antd";
import {
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  MailOutlined,
  IdcardOutlined,
  EyeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import PersonDetailCard from "./PersonDetailCard";
import type { ColumnsType } from "antd/es/table";
import {
  getAdminUsers,
  updateUser,
  type AdminUser,
} from "../../services/adminApi";

const { Title, Text } = Typography;

const staffRoleConfig: Record<string, string> = {
  STAFF: "Nhân viên",
  USER: "Người dùng",
  ADMIN: "Quản trị viên",
};

interface StaffUser {
  key: string;
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: "STAFF" | "USER" | "ADMIN";
  status: "ACTIVE" | "LOCKED" | "INACTIVE";
  createdAt: string;
  lastLogin?: string;
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{ status: string }>({
    status: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);
  const [form] = Form.useForm();

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: { role?: string; status?: string } = {
        role: "STAFF",
      };
      if (filter.status !== "all") {
        params.status = filter.status;
      }

      const response = await getAdminUsers(params);

      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format");
      }

      const mapped: StaffUser[] = response.data.map((u: AdminUser) => ({
        key: String(u.id),
        id: String(u.id),
        username: u.username || "",
        name: u.fullName || "",
        email: u.email || "",
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        dateOfBirth: u.dateOfBirth,
        gender: u.gender,
        role: (u.role === "STAFF" || u.role === "ADMIN"
          ? u.role
          : "STAFF") as StaffUser["role"],
        status:
          u.status === "LOCKED"
            ? "LOCKED"
            : u.status === "INACTIVE"
              ? "INACTIVE"
              : "ACTIVE",
        createdAt: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
          : "-",
        lastLogin: u.lastLogin
          ? new Date(u.lastLogin).toLocaleDateString("vi-VN")
          : undefined,
      }));

      setStaff(mapped);
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (err as Error)?.message ||
        "Không thể tải dữ liệu nhân viên.";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [filter.status]);

  const filteredStaff = staff.filter((s) => {
    if (filter.status !== "all" && s.status !== filter.status) return false;
    return true;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "ACTIVE" | "LOCKED" | "INACTIVE",
  ) => {
    try {
      await updateUser(parseInt(id), { status: newStatus });
      setStaff(
        staff.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      );
      message.success("Cập nhật trạng thái thành công");
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleRoleChange = async (id: string, newRole: StaffUser["role"]) => {
    try {
      await updateUser(parseInt(id), { role: newRole });
      if (newRole === "STAFF") {
        setStaff(staff.map((s) => (s.id === id ? { ...s, role: newRole } : s)));
      } else {
        setStaff(staff.filter((s) => s.id !== id));
      }
      message.success("Cập nhật vai trò thành công");
    } catch {
      message.error("Cập nhật vai trò thất bại");
    }
  };

  const columns: ColumnsType<StaffUser> = [
    {
      title: "Nhân viên",
      key: "user",
      width: 280,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatarUrl} style={{ backgroundColor: "#8B0000" }}>
            {!record.avatarUrl && (record.name?.charAt(0) || "S")}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name || "N/A"}</div>
            {record.username && (
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                @{record.username}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              <MailOutlined /> {record.email || "N/A"}
            </div>
            {record.phone && (
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                📞 {record.phone}
              </div>
            )}
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
          onChange={(value) =>
            handleRoleChange(record.id, value as StaffUser["role"])
          }
          style={{ width: 150 }}
        >
          <Select.Option value="STAFF">Nhân viên</Select.Option>
          <Select.Option value="USER">Người dùng</Select.Option>
          <Select.Option value="ADMIN">Quản trị viên</Select.Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config: Record<string, { label: string; color: string }> = {
          ACTIVE: { label: "Hoạt động", color: "green" },
          LOCKED: { label: "Đã khóa", color: "red" },
          INACTIVE: { label: "Không hoạt động", color: "default" },
        };
        const c = config[status] || { label: status, color: "default" };
        return <Tag color={c.color}>{c.label}</Tag>;
      },
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
              setSelectedStaff(record);
              setDetailModalOpen(true);
            }}
          >
            Xem
          </Button>
          <Button type="link" icon={<KeyOutlined />} size="small">
            Reset mật khẩu
          </Button>
          <Button
            type="link"
            icon={
              record.status === "ACTIVE" ? <LockOutlined /> : <UnlockOutlined />
            }
            size="small"
            danger={record.status === "ACTIVE"}
            onClick={() => {
              const newStatus =
                record.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
              handleStatusChange(record.id, newStatus);
            }}
          >
            {record.status === "ACTIVE"
              ? "Khóa"
              : record.status === "LOCKED"
                ? "Mở khóa"
                : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <Title
          level={2}
          style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}
        >
          Quản lý Staff
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Quản lý nhân viên và phân quyền
        </Text>
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title
              level={5}
              style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}
            >
              Danh sách nhân viên
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Thêm nhân viên
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
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
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
            </Select>
          </Col>
        </Row>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
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
        ) : filteredStaff.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <IdcardOutlined
              style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
            />
            <p style={{ color: "#8c8c8c" }}>Chưa có nhân viên nào.</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStaff}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} nhân viên`,
            }}
          />
        )}
      </Card>

      <Modal
        title="Chi tiết Staff"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedStaff(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedStaff(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedStaff && (
          <PersonDetailCard
            avatarUrl={selectedStaff.avatarUrl}
            name={selectedStaff.name}
            subtitle={
              selectedStaff.username ? `@${selectedStaff.username}` : undefined
            }
            status={selectedStaff.status}
            statusLabel={
              selectedStaff.status === "ACTIVE"
                ? "Hoạt động"
                : selectedStaff.status === "LOCKED"
                  ? "Đã khóa"
                  : "Không hoạt động"
            }
            infoSections={[
              {
                rows: [
                  {
                    label: "Email",
                    value: selectedStaff.email,
                    icon: <MailOutlined />,
                  },
                  {
                    label: "Số điện thoại",
                    value: selectedStaff.phone || "Chưa có",
                    icon: <PhoneOutlined />,
                  },
                  {
                    label: "Vai trò",
                    value:
                      staffRoleConfig[selectedStaff.role] || selectedStaff.role,
                  },
                  {
                    label: "Ngày sinh",
                    value: selectedStaff.dateOfBirth
                      ? new Date(selectedStaff.dateOfBirth).toLocaleDateString(
                          "vi-VN",
                        )
                      : "Chưa có",
                  },
                  {
                    label: "Giới tính",
                    value:
                      selectedStaff.gender === "MALE"
                        ? "Nam"
                        : selectedStaff.gender === "FEMALE"
                          ? "Nữ"
                          : selectedStaff.gender === "OTHER"
                            ? "Khác"
                            : "Chưa có",
                  },
                ],
              },
            ]}
          />
        )}
      </Modal>

      <Modal
        title="Thêm nhân viên"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" initialValue="STAFF">
            <Select>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  message.info("Chức năng tạo user đang phát triển")
                }
              >
                Tạo
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
