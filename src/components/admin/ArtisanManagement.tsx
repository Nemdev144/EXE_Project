import { useState, useEffect } from "react";
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
  Spin,
  Alert,
  Statistic,
  Tooltip,
  Table,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import PersonDetailCard from "./PersonDetailCard";
import {
  getAdminArtisans,
  updateArtisan,
  type AdminArtisan,
} from "../../services/adminApi";
import { getArtisans, getProvinces } from "../../services/api";
import type { Artisan as ApiArtisan } from "../../types";
import dayjs from "dayjs";

const { Search } = Input;

interface Artisan {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  provinceId?: number;
  experience: string;
  tours: string[];
  status: "ACTIVE" | "INACTIVE";
  profileImageUrl?: string;
  bio?: string;
  workshopAddress?: string;
  totalTours?: number;
  averageRating?: number;
  images?: string[];
  createdAt?: string;
}

export default function ArtisanManagement() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    location: string;
    status: string;
    search: string;
  }>({
    location: "all",
    status: "all",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Fetch provinces for edit form
  useEffect(() => {
    getProvinces().then((list) =>
      setProvinces(list.map((p) => ({ id: p.id, name: p.name }))),
    );
  }, []);

  // Fetch artisans: thử Admin API trước, fallback sang Public API nếu lỗi 500
  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      setFallbackNotice(null);

      try {
        const { data } = await getAdminArtisans();
        const mappedArtisans: Artisan[] = (data || []).map(
          (apiArtisan: AdminArtisan) => {
            const createdAt = dayjs(apiArtisan.createdAt);
            const yearsSince = dayjs().diff(createdAt, "year");
            const experience = yearsSince > 0 ? `${yearsSince} năm` : "Mới";
            const title = `Nghệ nhân ${apiArtisan.specialization}`;
            const totalTours = apiArtisan.totalReviews || 0;

            return {
              id: String(apiArtisan.id),
              name: apiArtisan.fullName,
              title,
              specialty: apiArtisan.specialization,
              location: apiArtisan.provinceName || "Tây Nguyên",
              provinceId: apiArtisan.provinceId,
              experience,
              tours: totalTours > 0 ? [`${totalTours} tour`] : [],
              status: apiArtisan.status,
              profileImageUrl: apiArtisan.profileImageUrl,
              bio: apiArtisan.bio,
              workshopAddress: apiArtisan.workshopAddress,
              totalTours,
              averageRating: apiArtisan.averageRating,
              images: apiArtisan.images,
              createdAt: apiArtisan.createdAt,
            };
          },
        );
        setArtisans(mappedArtisans);
      } catch (adminErr: unknown) {
        const status = (adminErr as { response?: { status?: number } })
          ?.response?.status;
        // Fallback: dùng API public khi admin API lỗi (500, 502, 503, 401, 403, 404...)
        if (
          status === 500 ||
          status === 502 ||
          status === 503 ||
          status === 401 ||
          status === 403 ||
          status === 404
        ) {
          const apiArtisans = await getArtisans();
          const mapped: Artisan[] = apiArtisans.map((a: ApiArtisan) => {
            const createdAt = dayjs(a.createdAt);
            const yearsSince = dayjs().diff(createdAt, "year");
            const experience = yearsSince > 0 ? `${yearsSince} năm` : "Mới";
            return {
              id: String(a.id),
              name: a.fullName,
              title: `Nghệ nhân ${a.specialization}`,
              specialty: a.specialization,
              location: a.provinceName || "Tây Nguyên",
              provinceId: a.provinceId,
              experience,
              tours:
                (a.totalReviews || 0) > 0 ? [`${a.totalReviews} tour`] : [],
              status: "ACTIVE" as const,
              profileImageUrl: a.profileImageUrl,
              bio: a.bio,
              workshopAddress: a.workshopAddress,
              totalTours: a.totalReviews,
              averageRating: a.averageRating,
              images: a.images,
              createdAt: a.createdAt,
            };
          });
          setArtisans(mapped);
          setFallbackNotice(
            "API Admin đang bảo trì. Đang hiển thị dữ liệu từ nguồn công khai (chỉ xem, không sửa được).",
          );
        } else {
          throw adminErr;
        }
      }
    } catch (err) {
      console.error("Error fetching artisans:", err);
      setError("Không thể tải dữ liệu nghệ nhân. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu nghệ nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  // Province options for filter (combine API provinces + unique from artisans)
  const provinceOptions = [
    ...provinces.map((p) => p.name),
    ...Array.from(new Set(artisans.map((a) => a.location).filter(Boolean))),
  ].filter(Boolean);
  const uniqueProvinces = Array.from(new Set(provinceOptions)).sort();

  const filteredArtisans = artisans.filter((artisan) => {
    if (filter.location !== "all" && artisan.location !== filter.location)
      return false;
    if (filter.status !== "all" && artisan.status !== filter.status)
      return false;
    if (
      filter.search &&
      !artisan.name.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleStatusChange = (id: string, newStatus: "ACTIVE" | "INACTIVE") => {
    setArtisans(
      artisans.map((artisan) =>
        artisan.id === id ? { ...artisan, status: newStatus } : artisan,
      ),
    );
    message.success("Cập nhật trạng thái thành công");
  };

  const handleViewDetail = (record: Artisan) => {
    setSelectedArtisan(record);
    setDetailModalOpen(true);
  };

  const handleOpenEdit = (record: Artisan) => {
    setSelectedArtisan(record);
    editForm.setFieldsValue({
      specialization: record.specialty,
      bio: record.bio || "",
      profileImageUrl: record.profileImageUrl || "",
      workshopAddress: record.workshopAddress || "",
      provinceId: record.provinceId,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedArtisan) return;
    try {
      const values = await editForm.validateFields();
      setSaving(true);
      await updateArtisan(parseInt(selectedArtisan.id), {
        specialization: values.specialization,
        bio: values.bio,
        profileImageUrl: values.profileImageUrl || "",
        workshopAddress: values.workshopAddress,
        provinceId: values.provinceId,
      });
      message.success("Cập nhật nghệ nhân thành công");
      setEditModalOpen(false);
      setSelectedArtisan(null);
      fetchArtisans();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: artisans.length,
    active: artisans.filter((a) => a.status === "ACTIVE").length,
    totalTours: artisans.reduce((sum, a) => sum + (a.totalTours || 0), 0),
    avgRating:
      artisans.length > 0
        ? (
            artisans.reduce((sum, a) => sum + (a.averageRating || 0), 0) /
            artisans.length
          ).toFixed(1)
        : "0.0",
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Header Card */}
      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: "#262626",
              }}
            >
              Quản lý Nghệ nhân
            </h2>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#8c8c8c",
                fontSize: 14,
              }}
            >
              Quản lý thông tin nghệ nhân và tour liên quan
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              size="large"
              style={{
                height: 44,
                fontSize: 15,
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(139, 0, 0, 0.2)",
              }}
            >
              Thêm nghệ nhân mới
            </Button>
          </Col>
        </Row>
      </Card>

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
                  Tổng Nghệ nhân
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
              background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
              border: "none",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={
                <span style={{ color: "#fff", opacity: 0.9 }}>
                  Đang hoạt động
                </span>
              }
              value={stats.active}
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
                <span style={{ color: "#fff", opacity: 0.9 }}>Tổng Tour</span>
              }
              value={stats.totalTours}
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
                <span style={{ color: "#fff", opacity: 0.9 }}>Đánh giá TB</span>
              }
              value={stats.avgRating}
              suffix={
                <span style={{ color: "#fff", fontSize: 20, marginLeft: 4 }}>
                  ⭐
                </span>
              }
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
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Tỉnh thành"
              value={filter.location}
              onChange={(value) => setFilter({ ...filter, location: value })}
              size="large"
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {uniqueProvinces.map((province) => (
                <Select.Option key={province} value={province}>
                  {province}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
              size="large"
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
              size="large"
            />
          </Col>
        </Row>

        {fallbackNotice && (
          <Alert
            message={fallbackNotice}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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
        ) : filteredArtisans.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#8c8c8c" }}>Không tìm thấy nghệ nhân nào.</p>
          </div>
        ) : (
          <Table
            columns={[
              {
                title: "Nghệ nhân",
                key: "artisan",
                width: 250,
                fixed: "left",
                render: (_, record) => (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <Avatar
                      size={50}
                      src={record.profileImageUrl}
                      style={{
                        backgroundColor: "#8B0000",
                        flexShrink: 0,
                      }}
                      icon={
                        !record.profileImageUrl ? <UserOutlined /> : undefined
                      }
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#262626",
                          marginBottom: 4,
                        }}
                      >
                        {record.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8B0000",
                          fontWeight: 500,
                        }}
                      >
                        {record.title}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Chuyên môn",
                key: "specialty",
                width: 200,
                render: (_, record) => (
                  <div>
                    <TrophyOutlined
                      style={{ color: "#faad14", marginRight: 6 }}
                    />
                    <span style={{ fontWeight: 500 }}>{record.specialty}</span>
                  </div>
                ),
              },
              {
                title: "Giới thiệu",
                key: "bio",
                width: 250,
                render: (_, record) => (
                  <div>
                    {record.bio ? (
                      <Tooltip title={record.bio}>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#595959",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {record.bio}
                        </div>
                      </Tooltip>
                    ) : (
                      <span style={{ color: "#8c8c8c", fontStyle: "italic" }}>
                        Chưa có
                      </span>
                    )}
                  </div>
                ),
              },
              {
                title: "Địa điểm",
                key: "location",
                width: 200,
                render: (_, record) => (
                  <div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <EnvironmentOutlined style={{ color: "#52c41a" }} />
                      <span style={{ fontWeight: 500 }}>{record.location}</span>
                    </div>
                    {record.workshopAddress && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#8c8c8c",
                          marginTop: 4,
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <HomeOutlined />
                        {record.workshopAddress}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: "Kinh nghiệm",
                key: "experience",
                width: 120,
                align: "center",
                render: (_, record) => (
                  <div style={{ textAlign: "center" }}>
                    <CalendarOutlined
                      style={{
                        color: "#1890ff",
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    />
                    <div style={{ fontWeight: 600, color: "#1890ff" }}>
                      {record.experience}
                    </div>
                  </div>
                ),
              },
              {
                title: "Đánh giá",
                key: "rating",
                width: 120,
                align: "center",
                render: (_, record) => {
                  const rating = record.averageRating || 0;
                  if (rating === 0) {
                    return (
                      <span style={{ color: "#8c8c8c", fontStyle: "italic" }}>
                        Chưa có
                      </span>
                    );
                  }
                  return (
                    <div style={{ textAlign: "center" }}>
                      <StarOutlined
                        style={{
                          color: "#faad14",
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      />
                      <div style={{ fontWeight: 600, color: "#faad14" }}>
                        {rating.toFixed(1)}/5
                      </div>
                    </div>
                  );
                },
              },
              {
                title: "Tổng Tour",
                key: "totalTours",
                width: 120,
                align: "center",
                render: (_, record) => (
                  <div style={{ textAlign: "center" }}>
                    <TeamOutlined
                      style={{
                        color: "#52c41a",
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    />
                    <div style={{ fontWeight: 600, color: "#52c41a" }}>
                      {record.totalTours || 0}
                    </div>
                  </div>
                ),
              },
              {
                title: "Trạng thái",
                key: "status",
                width: 130,
                render: (_, record) => (
                  <Tag
                    color={record.status === "ACTIVE" ? "success" : "default"}
                    style={{
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 12,
                      fontWeight: 500,
                    }}
                  >
                    {record.status === "ACTIVE"
                      ? "✓ Hoạt động"
                      : "○ Không hoạt động"}
                  </Tag>
                ),
              },
              {
                title: "Thao tác",
                key: "action",
                width: 180,
                fixed: "right",
                render: (_, record) => (
                  <Space>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(record)}
                      style={{ padding: 0 }}
                    >
                      Xem
                    </Button>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit(record)}
                      style={{ padding: 0 }}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="link"
                      danger={record.status === "ACTIVE"}
                      onClick={() =>
                        handleStatusChange(
                          record.id,
                          record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                        )
                      }
                      style={{ padding: 0 }}
                    >
                      {record.status === "ACTIVE" ? "Ẩn" : "Hiện"}
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={filteredArtisans}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} nghệ nhân`,
            }}
          />
        )}
      </Card>

      <Modal
        title="Thêm nghệ nhân mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên nghệ nhân"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chức danh"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chuyên môn"
            name="specialty"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Địa điểm"
                name="location"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Đắk Lắk">Đắk Lắk</Select.Option>
                  <Select.Option value="Gia Lai">Gia Lai</Select.Option>
                  <Select.Option value="Kon Tum">Kon Tum</Select.Option>
                  <Select.Option value="Đắk Nông">Đắk Nông</Select.Option>
                  <Select.Option value="Lâm Đồng">Lâm Đồng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kinh nghiệm"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: 40 năm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() => message.success("Đã thêm nghệ nhân thành công")}
              >
                Tạo
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết nghệ nhân"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedArtisan(null);
        }}
        footer={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailModalOpen(false);
              if (selectedArtisan) handleOpenEdit(selectedArtisan);
            }}
          >
            Chỉnh sửa
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedArtisan(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedArtisan && (
          <PersonDetailCard
            avatarUrl={selectedArtisan.profileImageUrl}
            name={selectedArtisan.name}
            subtitle={selectedArtisan.title}
            status={selectedArtisan.status}
            infoSections={[
              {
                rows: [
                  {
                    label: "Chuyên môn",
                    value: selectedArtisan.specialty,
                    icon: <TrophyOutlined />,
                  },
                  {
                    label: "Địa điểm",
                    value: selectedArtisan.location,
                    icon: <EnvironmentOutlined />,
                  },
                  {
                    label: "Địa chỉ xưởng",
                    value: selectedArtisan.workshopAddress || "Chưa có",
                    icon: <HomeOutlined />,
                  },
                  {
                    label: "Kinh nghiệm / Đánh giá",
                    value: (
                      <>
                        {selectedArtisan.experience} ·{" "}
                        {(selectedArtisan.averageRating || 0).toFixed(1)}/5 (
                        {selectedArtisan.totalTours || 0} tour)
                      </>
                    ),
                    icon: <CalendarOutlined />,
                  },
                ],
              },
              {
                title: "Giới thiệu",
                rows: [
                  {
                    label: "",
                    value: selectedArtisan.bio || "Chưa có",
                  },
                ],
              },
            ]}
            extraContent={
              selectedArtisan.images && selectedArtisan.images.length > 0 ? (
                <Card
                  size="small"
                  title="Hình ảnh"
                  style={{
                    marginTop: 20,
                    borderRadius: 12,
                    border: "1px solid #e8e8e8",
                  }}
                  styles={{ body: { padding: 16 } }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {selectedArtisan.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              ) : undefined
            }
          />
        )}
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa nghệ nhân"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedArtisan(null);
        }}
        onOk={handleSaveEdit}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Hủy"
        width={560}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Chuyên môn"
            name="specialization"
            rules={[{ required: true, message: "Vui lòng nhập chuyên môn" }]}
          >
            <Input placeholder="VD: Gốm, Đan lát..." />
          </Form.Item>
          <Form.Item label="Giới thiệu" name="bio">
            <Input.TextArea rows={4} placeholder="Mô tả ngắn về nghệ nhân" />
          </Form.Item>
          <Form.Item label="Ảnh đại diện (URL)" name="profileImageUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Tỉnh thành" name="provinceId">
            <Select placeholder="Chọn tỉnh thành" allowClear>
              {provinces.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Địa chỉ xưởng" name="workshopAddress">
            <Input placeholder="Địa chỉ cụ thể" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
