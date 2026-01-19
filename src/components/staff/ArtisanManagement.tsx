import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Button,
  Space,
  Select,
  Input,
  Modal,
  Form,
  message,
  Upload,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface Artisan {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  experience: string;
  tours: string[];
  status: "ACTIVE" | "INACTIVE";
  bio?: string;
  image?: string;
}

export default function ArtisanManagement() {
  const [artisans, setArtisans] = useState<Artisan[]>([
    {
      id: "1",
      name: "Nghệ nhân Y Kông",
      title: "Nghệ nhân Cồng chiêng",
      specialty: "Biểu diễn và truyền dạy cồng chiêng",
      location: "Đắk Lắk",
      experience: "40 năm",
      tours: ["Lễ hội Cồng chiêng", "Tour văn hóa Đắk Lắk"],
      status: "ACTIVE",
      bio: "Nghệ nhân với hơn 40 năm kinh nghiệm trong việc biểu diễn và truyền dạy cồng chiêng",
    },
    {
      id: "2",
      name: "Bà H'Bla",
      title: "Nghệ nhân Dệt thổ cẩm",
      specialty: "Dệt thổ cẩm truyền thống",
      location: "Gia Lai",
      experience: "35 năm",
      tours: ["Làng nghề Gốm Gia Lai"],
      status: "ACTIVE",
      bio: "Nghệ nhân dệt thổ cẩm với nhiều năm kinh nghiệm",
    },
    {
      id: "3",
      name: "Ông A Pui",
      title: "Nghệ nhân Làm gốm",
      specialty: "Nghề làm gốm truyền thống",
      location: "Gia Lai",
      experience: "45 năm",
      tours: ["Làng nghề Gốm Gia Lai"],
      status: "ACTIVE",
      bio: "Nghệ nhân làm gốm với kỹ thuật truyền thống",
    },
  ]);

  const [filter, setFilter] = useState<{ location: string; status: string; search: string }>({
    location: "all",
    status: "all",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [form] = Form.useForm();

  const filteredArtisans = artisans.filter((artisan) => {
    if (filter.location !== "all" && artisan.location !== filter.location) return false;
    if (filter.status !== "all" && artisan.status !== filter.status) return false;
    if (filter.search && !artisan.name.toLowerCase().includes(filter.search.toLowerCase()))
      return false;
    return true;
  });

  const handleCreateOrUpdate = (values: any) => {
    if (isEditMode && selectedArtisan) {
      setArtisans(
        artisans.map((artisan) =>
          artisan.id === selectedArtisan.id
            ? { ...artisan, ...values, id: selectedArtisan.id }
            : artisan
        )
      );
      message.success("Đã cập nhật nghệ nhân thành công");
    } else {
      const newArtisan: Artisan = {
        id: String(artisans.length + 1),
        ...values,
        tours: [],
        status: "ACTIVE",
      };
      setArtisans([...artisans, newArtisan]);
      message.success("Đã tạo nghệ nhân thành công");
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedArtisan(null);
    form.resetFields();
  };

  const handleEdit = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
    setIsEditMode(true);
    form.setFieldsValue(artisan);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: "ACTIVE" | "INACTIVE") => {
    setArtisans(
      artisans.map((artisan) =>
        artisan.id === id ? { ...artisan, status: newStatus } : artisan
      )
    );
    message.success("Đã cập nhật trạng thái thành công");
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý Nghệ nhân</h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Tạo và chỉnh sửa thông tin nghệ nhân
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsEditMode(false);
                setSelectedArtisan(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Thêm nghệ nhân mới
            </Button>
          </Col>
        </Row>
        <Alert
          message="Lưu ý"
          description="Staff không có quyền xóa nghệ nhân khỏi hệ thống. Chỉ có thể tạo mới và chỉnh sửa thông tin."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tỉnh thành"
              value={filter.location}
              onChange={(value) => setFilter({ ...filter, location: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
              <Select.Option value="Gia Lai">Gia Lai</Select.Option>
              <Select.Option value="Kon Tum">Kon Tum</Select.Option>
              <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
              <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm nghệ nhân..."
              allowClear
              onSearch={(value) => setFilter({ ...filter, search: value })}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {filteredArtisans.map((artisan) => (
            <Col xs={24} sm={12} lg={8} key={artisan.id}>
              <Card
                hoverable
                style={{ height: "100%" }}
                actions={[
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(artisan)}
                  >
                    Sửa
                  </Button>,
                  <Button
                    type="link"
                    danger={artisan.status === "ACTIVE"}
                    onClick={() =>
                      handleStatusChange(
                        artisan.id,
                        artisan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                      )
                    }
                  >
                    {artisan.status === "ACTIVE" ? "Ẩn" : "Hiện"}
                  </Button>,
                ]}
              >
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <Avatar
                    size={80}
                    style={{
                      backgroundColor: "#8B0000",
                      marginBottom: 12,
                    }}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <h3 style={{ margin: "8px 0 4px 0", fontSize: 18, fontWeight: 600 }}>
                      {artisan.name}
                    </h3>
                    <p style={{ margin: 0, color: "#8B0000", fontWeight: 500 }}>
                      {artisan.title}
                    </p>
                    <Tag
                      color={artisan.status === "ACTIVE" ? "green" : "default"}
                      style={{ marginTop: 8 }}
                    >
                      {artisan.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </Tag>
                  </div>
                </div>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <div>
                    <TrophyOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
                    <strong>Chuyên môn:</strong> {artisan.specialty}
                  </div>
                  <div>
                    <EnvironmentOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
                    {artisan.location}
                  </div>
                  <div>
                    <TeamOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
                    Kinh nghiệm: {artisan.experience}
                  </div>
                  {artisan.bio && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 12, color: "#8c8c8c" }}>{artisan.bio}</div>
                    </div>
                  )}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 8 }}>
                      Tour tham gia:
                    </div>
                    <Space wrap>
                      {artisan.tours.length > 0 ? (
                        artisan.tours.map((tour, idx) => (
                          <Tag key={idx} color="blue">
                            {tour}
                          </Tag>
                        ))
                      ) : (
                        <span style={{ fontSize: 12, color: "#8c8c8c" }}>Chưa có tour</span>
                      )}
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={isEditMode ? "Chỉnh sửa nghệ nhân" : "Thêm nghệ nhân mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedArtisan(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item label="Tên nghệ nhân" name="name" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên nghệ nhân" />
          </Form.Item>
          <Form.Item label="Chức danh" name="title" rules={[{ required: true }]}>
            <Input placeholder="VD: Nghệ nhân Cồng chiêng" />
          </Form.Item>
          <Form.Item label="Chuyên môn" name="specialty" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Mô tả chuyên môn..." />
          </Form.Item>
          <Form.Item label="Tiểu sử" name="bio">
            <Input.TextArea rows={3} placeholder="Nhập tiểu sử nghệ nhân..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Địa điểm" name="location" rules={[{ required: true }]}>
                <Select placeholder="Chọn địa điểm">
                  <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
                  <Select.Option value="Gia Lai">Gia Lai</Select.Option>
                  <Select.Option value="Kon Tum">Kon Tum</Select.Option>
                  <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
                  <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kinh nghiệm" name="experience" rules={[{ required: true }]}>
                <Input placeholder="VD: 40 năm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Ảnh đại diện" name="image">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Cập nhật" : "Tạo"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setSelectedArtisan(null);
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
