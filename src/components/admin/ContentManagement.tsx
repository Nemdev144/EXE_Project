import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Form,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;

interface Content {
  key: string;
  id: string;
  title: string;
  type: "festival" | "food" | "costume" | "language" | "legend" | "artisan";
  province: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  festival: "Lễ hội",
  food: "Ẩm thực",
  costume: "Trang phục",
  language: "Ngôn ngữ",
  legend: "Truyền thuyết",
  artisan: "Nghệ nhân",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Bản nháp", color: "default" },
  PENDING: { label: "Chờ duyệt", color: "warning" },
  PUBLISHED: { label: "Đã xuất bản", color: "success" },
  ARCHIVED: { label: "Đã lưu trữ", color: "error" },
};

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([
    {
      key: "1",
      id: "1",
      title: "Lễ hội Cồng chiêng Tây Nguyên",
      type: "festival",
      province: "Đắk Lắk",
      status: "PUBLISHED",
      author: "Admin",
      createdAt: "15/01/2025",
    },
    {
      key: "2",
      id: "2",
      title: "Rượu cần - Thức uống truyền thống",
      type: "food",
      province: "Đắk Lắk",
      status: "PENDING",
      author: "Staff A",
      createdAt: "20/01/2025",
    },
    {
      key: "3",
      id: "3",
      title: "Trang phục Êđê",
      type: "costume",
      province: "Gia Lai",
      status: "DRAFT",
      author: "Staff B",
      createdAt: "22/01/2025",
    },
  ]);

  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    province: string;
    search: string;
  }>({
    type: "all",
    status: "all",
    province: "all",
    search: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredContents = contents.filter((content) => {
    if (filter.type !== "all" && content.type !== filter.type) return false;
    if (filter.status !== "all" && content.status !== filter.status) return false;
    if (filter.province !== "all" && content.province !== filter.province) return false;
    if (filter.search && !content.title.toLowerCase().includes(filter.search.toLowerCase()))
      return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: Content["status"]) => {
    setContents(
      contents.map((content) =>
        content.id === id ? { ...content, status: newStatus } : content
      )
    );
    message.success("Cập nhật trạng thái thành công");
  };

  const columns: ColumnsType<Content> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => <Tag color="blue">{typeLabels[type]}</Tag>,
    },
    {
      title: "Tỉnh",
      dataIndex: "province",
      key: "province",
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
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} size="small">
            Sửa
          </Button>
          {record.status === "PENDING" && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, "PUBLISHED")}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, "DRAFT")}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === "PUBLISHED" && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleStatusChange(record.id, "ARCHIVED")}
            >
              Lưu trữ
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý Nội dung Văn hóa</h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Quản lý và duyệt nội dung văn hóa
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Tạo nội dung mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Loại nội dung"
              value={filter.type}
              onChange={(value) => setFilter({ ...filter, type: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="festival">Lễ hội</Select.Option>
              <Select.Option value="food">Ẩm thực</Select.Option>
              <Select.Option value="costume">Trang phục</Select.Option>
              <Select.Option value="language">Ngôn ngữ</Select.Option>
              <Select.Option value="legend">Truyền thuyết</Select.Option>
              <Select.Option value="artisan">Nghệ nhân</Select.Option>
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
              <Select.Option value="DRAFT">Bản nháp</Select.Option>
              <Select.Option value="PENDING">Chờ duyệt</Select.Option>
              <Select.Option value="PUBLISHED">Đã xuất bản</Select.Option>
              <Select.Option value="ARCHIVED">Đã lưu trữ</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tỉnh thành"
              value={filter.province}
              onChange={(value) => setFilter({ ...filter, province: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
              <Select.Option value="Gia Lai">Gia Lai</Select.Option>
              <Select.Option value="Kon Tum">Kon Tum</Select.Option>
              <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
              <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm..."
              allowClear
              onSearch={(value) => setFilter({ ...filter, search: value })}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredContents}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} mục`,
          }}
        />
      </Card>

      <Modal
        title="Tạo nội dung mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Loại nội dung" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="festival">Lễ hội</Select.Option>
              <Select.Option value="food">Ẩm thực</Select.Option>
              <Select.Option value="costume">Trang phục</Select.Option>
              <Select.Option value="language">Ngôn ngữ</Select.Option>
              <Select.Option value="legend">Truyền thuyết</Select.Option>
              <Select.Option value="artisan">Nghệ nhân</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tỉnh thành" name="province" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
              <Select.Option value="Gia Lai">Gia Lai</Select.Option>
              <Select.Option value="Kon Tum">Kon Tum</Select.Option>
              <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
              <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => message.success("Đã tạo thành công")}>
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
