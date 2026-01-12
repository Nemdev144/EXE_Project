import { useState } from "react";
import {
  Card,
  Row,
  Col,
  List,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  EyeOutlined,
  DeleteOutlined,
  MailOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

interface Template {
  id: string;
  name: string;
  subject: string;
  type: "SYSTEM" | "CUSTOM";
  category: string;
  lastModified: string;
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Xác nhận đặt tour",
      subject: "Xác nhận đặt tour - Cội Việt",
      type: "SYSTEM",
      category: "Booking",
      lastModified: "15/01/2025",
    },
    {
      id: "2",
      name: "Nhắc thanh toán",
      subject: "Nhắc nhở thanh toán tour",
      type: "CUSTOM",
      category: "Payment",
      lastModified: "18/01/2025",
    },
    {
      id: "3",
      name: "Thông báo thiếu người",
      subject: "Tour sắp khởi hành - Cần thêm người",
      type: "CUSTOM",
      category: "Tour",
      lastModified: "20/01/2025",
    },
    {
      id: "4",
      name: "Đề xuất đổi tour",
      subject: "Đề xuất tour thay thế",
      type: "CUSTOM",
      category: "Tour",
      lastModified: "22/01/2025",
    },
    {
      id: "5",
      name: "Reset mật khẩu",
      subject: "Yêu cầu reset mật khẩu",
      type: "SYSTEM",
      category: "Account",
      lastModified: "10/01/2025",
    },
    {
      id: "6",
      name: "Xác nhận hoàn tiền",
      subject: "Xác nhận hoàn tiền tour",
      type: "SYSTEM",
      category: "Refund",
      lastModified: "12/01/2025",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateContent, setTemplateContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateContent(`Kính chào {{customer_name}},

{{template_content}}

Trân trọng,
Đội ngũ Cội Việt`);
    form.setFieldsValue({
      subject: template.subject,
      content: templateContent || `Kính chào {{customer_name}},

{{template_content}}

Trân trọng,
Đội ngũ Cội Việt`,
    });
  };

  const handleSave = () => {
    message.success("Đã lưu template thành công");
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý Email Templates</h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Tạo và chỉnh sửa email templates
            </p>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Tạo template mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Templates" style={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
            <List
              dataSource={templates}
              renderItem={(template) => (
                <List.Item
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedTemplate?.id === template.id ? "#fff1f0" : "transparent",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    border:
                      selectedTemplate?.id === template.id
                        ? "1px solid #8B0000"
                        : "1px solid #f0f0f0",
                  }}
                  onClick={() => handleEdit(template)}
                >
                  <List.Item.Meta
                    avatar={<MailOutlined style={{ fontSize: 20, color: "#8B0000" }} />}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 500 }}>{template.name}</span>
                        {template.type === "SYSTEM" && (
                          <Tag color="red" style={{ fontSize: 10 }}>
                            System
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: 12, color: "#8c8c8c" }}>{template.subject}</div>
                        <div style={{ fontSize: 11, color: "#bfbfbf", marginTop: 4 }}>
                          {template.category} • {template.lastModified}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {selectedTemplate ? (
            <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{selectedTemplate.name}</span>
                  {selectedTemplate.type === "SYSTEM" && (
                    <Tag color="red">System Template</Tag>
                  )}
                </div>
              }
              extra={
                <Space>
                  <Button icon={<EyeOutlined />}>Preview</Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    disabled={selectedTemplate.type === "SYSTEM"}
                  >
                    Lưu
                  </Button>
                </Space>
              }
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Subject"
                  name="subject"
                  rules={[{ required: true }]}
                >
                  <Input disabled={selectedTemplate.type === "SYSTEM"} />
                </Form.Item>
                <Form.Item
                  label="Nội dung"
                  name="content"
                  rules={[{ required: true }]}
                >
                  <TextArea
                    rows={15}
                    disabled={selectedTemplate.type === "SYSTEM"}
                    style={{ fontFamily: "monospace" }}
                  />
                </Form.Item>
                <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: -16 }}>
                  Sử dụng biến: {"{{customer_name}}"}, {"{{tour_name}}"}, {"{{booking_id}}"}
                </div>
                {selectedTemplate.type === "CUSTOM" && (
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => message.warning("Xác nhận xóa template?")}
                    >
                      Xóa
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <FileTextOutlined style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 16 }} />
                <div style={{ fontSize: 16, color: "#8c8c8c", fontWeight: 500 }}>
                  Chọn một template để chỉnh sửa
                </div>
                <div style={{ fontSize: 14, color: "#bfbfbf", marginTop: 8 }}>
                  Chọn template từ danh sách bên trái để bắt đầu
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title="Tạo template mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên template" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Danh mục" name="category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => message.success("Đã tạo template thành công")}>
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
