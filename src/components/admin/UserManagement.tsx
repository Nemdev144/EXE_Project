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
} from "antd";
import {
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  getAdminUsers,
  updateUser,
  type AdminUser,
} from "../../services/adminApi";

interface User {
  key: string;
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: "CUSTOMER" | "USER" | "STAFF" | "ADMIN" | "ARTISAN";
  status: "ACTIVE" | "LOCKED" | "INACTIVE";
  createdAt: string;
  lastLogin?: string;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  CUSTOMER: { label: "Khách hàng", color: "blue" },
  USER: { label: "Người dùng", color: "cyan" },
  STAFF: { label: "Nhân viên", color: "orange" },
  ADMIN: { label: "Quản trị viên", color: "red" },
  ARTISAN: { label: "Nghệ nhân", color: "purple" },
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{ role: string; status: string }>({
    role: "all",
    status: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: {
        role?: string;
        status?: string;
      } = {};

      if (filter.role !== "all") {
        params.role = filter.role;
      }
      if (filter.status !== "all") {
        params.status = filter.status;
      }

      console.log(
        "[UserManagement] 🚀 Starting fetchUsers with params:",
        params,
      );

      const response = await getAdminUsers(params);
      console.log("[UserManagement] ✅ API response received:", response);
      console.log(
        "[UserManagement] ✅ API response.data:",
        JSON.stringify(response.data, null, 2),
      );

      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error(
          "[UserManagement] ❌ Invalid API response format:",
          response,
        );
        throw new Error("Invalid API response format");
      }

      console.log(
        "[UserManagement] ✅ Processing",
        response.data.length,
        "users",
      );

      const mappedUsers: User[] = response.data.map(
        (user: AdminUser, index: number) => {
          console.log(
            `[UserManagement] 📝 Mapping user ${index + 1}:`,
            JSON.stringify(user, null, 2),
          );

          // Ensure all required fields are present
          if (!user.id || !user.fullName || !user.email) {
            console.warn("[UserManagement] ⚠️ Invalid user data:", user);
          }

          const mappedUser = {
            key: user.id.toString(),
            id: user.id.toString(),
            username: user.username || "",
            name: user.fullName || "",
            email: user.email || "",
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            role: user.role || "CUSTOMER",
            status:
              user.status === "LOCKED"
                ? "LOCKED"
                : user.status === "INACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            createdAt: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("vi-VN")
              : "-",
            lastLogin: user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString("vi-VN")
              : undefined,
          };

          console.log(
            `[UserManagement] ✅ Mapped user ${index + 1}:`,
            JSON.stringify(mappedUser, null, 2),
          );
          return mappedUser;
        },
      );

      console.log(
        "[UserManagement] ✅ All mapped users:",
        JSON.stringify(mappedUsers, null, 2),
      );
      setUsers(mappedUsers);
    } catch (err: any) {
      console.error("=".repeat(80));
      console.error(
        "[UserManagement] ❌ ========== API ERROR START ==========",
      );
      console.error("[UserManagement] ❌ Error type:", typeof err);
      console.error("[UserManagement] ❌ Error name:", err?.name);
      console.error("[UserManagement] ❌ Error message:", err?.message);
      console.error("[UserManagement] ❌ Error code:", err?.code);

      // Check for CORS error
      if (
        err?.code === "ERR_NETWORK" ||
        err?.message?.includes("CORS") ||
        err?.message?.includes("Network Error")
      ) {
        console.error("[UserManagement] ❌ ⚠️ CORS ERROR DETECTED!");
        console.error(
          "[UserManagement] ❌ This is likely a CORS policy issue from the backend",
        );
        console.error(
          "[UserManagement] ❌ Backend needs to allow requests from:",
          window.location.origin,
        );
      }

      console.error("[UserManagement] ❌ Error response:", err?.response);
      console.error(
        "[UserManagement] ❌ Error response data:",
        err?.response?.data,
      );
      console.error(
        "[UserManagement] ❌ Error response status:",
        err?.response?.status,
      );
      console.error(
        "[UserManagement] ❌ Error response headers:",
        err?.response?.headers,
      );
      console.error("[UserManagement] ❌ Error config:", err?.config);
      console.error("[UserManagement] ❌ Error config URL:", err?.config?.url);
      console.error(
        "[UserManagement] ❌ Error config baseURL:",
        err?.config?.baseURL,
      );
      console.error(
        "[UserManagement] ❌ Error config headers:",
        err?.config?.headers,
      );
      console.error(
        "[UserManagement] ❌ Full error object:",
        JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
      );
      console.error("[UserManagement] ❌ ========== API ERROR END ==========");
      console.error("=".repeat(80));

      let errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể tải dữ liệu users. Vui lòng thử lại sau.";

      // Add CORS-specific message
      if (
        err?.code === "ERR_NETWORK" ||
        err?.message?.includes("CORS") ||
        err?.message?.includes("Network Error")
      ) {
        errorMessage =
          "Lỗi CORS: Backend không cho phép request từ origin này. Vui lòng kiểm tra cấu hình CORS trên server.";
      }

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter.role, filter.status]);

  const filteredUsers = users.filter((user) => {
    if (filter.role !== "all" && user.role !== filter.role) return false;
    if (filter.status !== "all" && user.status !== filter.status) return false;
    return true;
  });

  const handleStatusChange = async (
    id: string,
    newStatus: "ACTIVE" | "LOCKED" | "INACTIVE",
  ) => {
    try {
      await updateUser(parseInt(id), { status: newStatus });
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user,
        ),
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.error("[UserManagement] ❌ Update status error:", err);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleRoleChange = async (id: string, newRole: User["role"]) => {
    try {
      await updateUser(parseInt(id), { role: newRole });
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: newRole } : user,
        ),
      );
      message.success("Cập nhật vai trò thành công");
    } catch (err) {
      console.error("[UserManagement] ❌ Update role error:", err);
      message.error("Cập nhật vai trò thất bại");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      width: 280,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatarUrl} style={{ backgroundColor: "#8B0000" }}>
            {!record.avatarUrl && (record.name?.charAt(0) || "U")}
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
          onChange={(value) => handleRoleChange(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
          <Select.Option value="USER">Người dùng</Select.Option>
          <Select.Option value="STAFF">Nhân viên</Select.Option>
          <Select.Option value="ADMIN">Quản trị viên</Select.Option>
          <Select.Option value="ARTISAN">Nghệ nhân</Select.Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
          ACTIVE: { label: "Hoạt động", color: "green" },
          LOCKED: { label: "Đã khóa", color: "red" },
          INACTIVE: { label: "Không hoạt động", color: "default" },
        };
        const config = statusConfig[status] || {
          label: status,
          color: "default",
        };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Ngày sinh",
      key: "dateOfBirth",
      width: 120,
      render: (_, record) =>
        record.dateOfBirth
          ? new Date(record.dateOfBirth).toLocaleDateString("vi-VN")
          : "-",
    },
    {
      title: "Giới tính",
      key: "gender",
      width: 100,
      render: (_, record) => {
        const genderMap: Record<string, string> = {
          MALE: "Nam",
          FEMALE: "Nữ",
          OTHER: "Khác",
        };
        return record.gender ? genderMap[record.gender] || record.gender : "-";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 120,
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
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              Quản lý User/Staff
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Quản lý người dùng và phân quyền
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
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
              <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
              <Select.Option value="USER">Người dùng</Select.Option>
              <Select.Option value="STAFF">Nhân viên</Select.Option>
              <Select.Option value="ADMIN">Quản trị viên</Select.Option>
              <Select.Option value="ARTISAN">Nghệ nhân</Select.Option>
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
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
            </Select>
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
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#8c8c8c" }}>Không tìm thấy user nào.</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} user`,
            }}
          />
        )}
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
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
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
              <Button
                type="primary"
                onClick={() => message.success("Đã tạo user thành công")}
              >
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
