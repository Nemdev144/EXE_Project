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
  Alert,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SendOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { TextArea } = Input;

interface Content {
  key: string;
  id: string;
  title: string;
  type: "festival" | "food" | "costume" | "language" | "legend" | "artisan";
  province: string;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
  summary?: string;
  body?: string;
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
      summary: "Rượu cần là thức uống đặc trưng của Tây Nguyên",
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
      summary: "Trang phục truyền thống của người Êđê",
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [form] = Form.useForm();

  // Chỉ hiển thị nội dung DRAFT và PENDING (do staff tạo)
  const staffContents = contents.filter(
    (content) => content.status === "DRAFT" || content.status === "PENDING"
  );

  const filteredContents = staffContents.filter((content) => {
    if (filter.type !== "all" && content.type !== filter.type) return false;
    if (filter.status !== "all" && content.status !== filter.status) return false;
    if (filter.province !== "all" && content.province !== filter.province) return false;
    if (filter.search && !content.title.toLowerCase().includes(filter.search.toLowerCase()))
      return false;
    return true;
  });

  const handleCreateOrUpdate = (values: any) => {
    if (isEditMode && selectedContent) {
      setContents(
        contents.map((content) =>
          content.id === selectedContent.id
            ? { ...content, ...values, id: selectedContent.id, status: "DRAFT" }
            : content
        )
      );
      message.success("Đã cập nhật nội dung thành công");
    } else {
      const newContent: Content = {
        key: String(contents.length + 1),
        id: String(contents.length + 1),
        ...values,
        status: "DRAFT",
        author: "Staff User",
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };
      setContents([...contents, newContent]);
      message.success("Đã tạo nội dung thành công");
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedContent(null);
    form.resetFields();
  };

  const handleEdit = (content: Content) => {
    if (content.status === "PUBLISHED") {
      message.warning("Không thể chỉnh sửa nội dung đã được xuất bản");
      return;
    }
    setSelectedContent(content);
    setIsEditMode(true);
    form.setFieldsValue(content);
    setIsModalOpen(true);
  };

  const handleSubmitForReview = (id: string) => {
    setContents(
      contents.map((content) =>
        content.id === id ? { ...content, status: "PENDING" } : content
      )
    );
    message.success("Đã gửi nội dung chờ Admin duyệt");
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          {record.status === "DRAFT" && (
            <>
              <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
                Sửa
              </Button>
              <Button
                type="link"
                icon={<SendOutlined />}
                size="small"
                onClick={() => handleSubmitForReview(record.id)}
              >
                Gửi duyệt
              </Button>
            </>
          )}
          {record.status === "PENDING" && (
            <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
              Sửa
            </Button>
          )}
          {record.status === "PUBLISHED" && (
            <Tag color="success">Đã xuất bản - Không thể chỉnh sửa</Tag>
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
              Tạo và chỉnh sửa nội dung văn hóa (chỉ DRAFT)
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsEditMode(false);
                setSelectedContent(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Tạo nội dung mới
            </Button>
          </Col>
        </Row>
        <Alert
          message="Lưu ý"
          description="Staff chỉ có thể tạo và chỉnh sửa nội dung ở trạng thái DRAFT. Sau khi hoàn thành, gửi cho Admin duyệt. Không thể publish hoặc archive nội dung."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
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
        title={isEditMode ? "Chỉnh sửa nội dung" : "Tạo nội dung mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedContent(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
            <Input placeholder="Nhập tiêu đề nội dung" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Loại nội dung" name="type" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại">
                  <Select.Option value="festival">Lễ hội</Select.Option>
                  <Select.Option value="food">Ẩm thực</Select.Option>
                  <Select.Option value="costume">Trang phục</Select.Option>
                  <Select.Option value="language">Ngôn ngữ</Select.Option>
                  <Select.Option value="legend">Truyền thuyết</Select.Option>
                  <Select.Option value="artisan">Nghệ nhân</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tỉnh thành" name="province" rules={[{ required: true }]}>
                <Select placeholder="Chọn tỉnh">
                  <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
                  <Select.Option value="Gia Lai">Gia Lai</Select.Option>
                  <Select.Option value="Kon Tum">Kon Tum</Select.Option>
                  <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
                  <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Tóm tắt" name="summary">
            <TextArea rows={3} placeholder="Nhập tóm tắt nội dung..." />
          </Form.Item>
          <Form.Item label="Nội dung chi tiết" name="body">
            <TextArea rows={8} placeholder="Nhập nội dung chi tiết..." />
          </Form.Item>
          <Form.Item label="Hình ảnh" name="images">
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <PictureOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Cập nhật" : "Tạo bản nháp"}
              </Button>
              {isEditMode && selectedContent?.status === "DRAFT" && (
                <Button
                  type="default"
                  icon={<SendOutlined />}
                  onClick={() => {
                    form.validateFields().then((values) => {
                      handleCreateOrUpdate(values);
                      handleSubmitForReview(selectedContent.id);
                    });
                  }}
                >
                  Lưu và gửi duyệt
                </Button>
              )}
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setSelectedContent(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
