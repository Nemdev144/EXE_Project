import { useState, useEffect } from "react";
import {
  App,
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
  Alert,
  Tooltip,
  Table,
  Empty,
} from "antd";
import {
  EyeOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  StarOutlined,
  CalendarOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PersonDetailCard from "../admin/PersonDetailCard";
import ArtisanSummaryCards from "../admin/ArtisanSummaryCards";
import { getAdminArtisans } from "../../services/adminApi";
import { getArtisans, getProvinces } from "../../services/api";
import dayjs from "dayjs";

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
  const { message } = App.useApp();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    location: string;
    status: string;
    search: string;
  }>({
    location: "all",
    status: "all",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);

  const mapApiToArtisan = (item: unknown): Artisan => {
    const a = item as Record<string, unknown>;
    const province = a.province as { id?: number; name?: string } | undefined;
    const provinceName = province?.name ?? (a.provinceName as string);
    const provinceId = province?.id ?? (a.provinceId as number);
    const totalCount = (a.totalTours as number) ?? (a.totalReviews as number) ?? 0;
    const isActive = a.isActive as boolean | undefined;
    const status = isActive === false ? "INACTIVE" : "ACTIVE";
    const fullName = (a.fullName as string) ?? (a.name as string);
    const specialization = (a.specialization as string) ?? (a.specialty as string);
    const createdAt = (a.createdAt as string) ?? "";
    const yearsSince = dayjs().diff(dayjs(createdAt), "year");
    const experience = yearsSince > 0 ? `${yearsSince} năm` : "Mới";
    return {
      id: String(a.id),
      name: fullName,
      title: `Nghệ nhân ${specialization}`,
      specialty: specialization,
      location: provinceName || "Tây Nguyên",
      provinceId,
      experience,
      tours: totalCount > 0 ? [`${totalCount} tour`] : [],
      status: status as "ACTIVE" | "INACTIVE",
      profileImageUrl: (a.profileImageUrl as string) ?? (a.avatarUrl as string),
      bio: a.bio as string,
      workshopAddress: a.workshopAddress as string,
      totalTours: totalCount,
      averageRating: (a.averageRating as number) ?? 0,
      images: (a.images as string[]) ?? [],
      createdAt,
    };
  };

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getAdminArtisans();
        const rawList = (data || []) as unknown[];
        setArtisans(rawList.map(mapApiToArtisan));
      } catch {
        const raw = await getArtisans();
        const apiArtisans = Array.isArray(raw) ? raw : [];
        setArtisans(apiArtisans.map(mapApiToArtisan));
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

  useEffect(() => {
    getProvinces().then((list) =>
      setProvinces(list.map((p) => ({ id: p.id, name: p.name }))),
    );
  }, []);

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
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase();
      return artisan.name?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleViewDetail = (record: Artisan) => {
    setSelectedArtisan(record);
    setDetailModalOpen(true);
  };

  const stats = {
    total: artisans.length,
    active: artisans.filter((a) => a.status === "ACTIVE").length,
    inactive: artisans.filter((a) => a.status === "INACTIVE").length,
    avgRating:
      artisans.length > 0
        ? (
            artisans.reduce((sum, a) => sum + (a.averageRating || 0), 0) /
            artisans.length
          ).toFixed(1)
        : "0.0",
  };

  const columns = [
    {
      title: "Nghệ nhân",
      key: "artisan",
      width: 250,
      fixed: "left" as const,
      render: (_: unknown, record: Artisan) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={50}
            src={record.profileImageUrl}
            style={{ backgroundColor: "#8B0000", flexShrink: 0 }}
            icon={!record.profileImageUrl ? <UserOutlined /> : undefined}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#262626", marginBottom: 4 }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#8B0000", fontWeight: 500 }}>
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
      render: (_: unknown, record: Artisan) => (
        <div>
          <TrophyOutlined style={{ color: "#faad14", marginRight: 6 }} />
          <span style={{ fontWeight: 500 }}>{record.specialty}</span>
        </div>
      ),
    },
    {
      title: "Địa điểm",
      key: "location",
      width: 150,
      render: (_: unknown, record: Artisan) => (
        <div>
          <EnvironmentOutlined style={{ color: "#52c41a", marginRight: 6 }} />
          {record.location}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      render: (_: unknown, record: Artisan) => (
        <Tag color={record.status === "ACTIVE" ? "success" : "default"}>
          {record.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      fixed: "right" as const,
      render: (_: unknown, record: Artisan) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              Quản lý Nghệ nhân
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Xem thông tin nghệ nhân (chỉ xem, không có quyền chỉnh sửa)
            </p>
          </Col>
        </Row>
        <Alert
          message="Lưu ý"
          description="Staff chỉ có quyền xem thông tin nghệ nhân. Không có quyền thêm, sửa hoặc xóa."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      <ArtisanSummaryCards stats={stats} />

      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 4, fontSize: 13, color: "#595959" }}>Địa điểm</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Tất cả địa điểm"
              value={filter.location}
              onChange={(value) => setFilter({ ...filter, location: value })}
            >
              <Select.Option value="all">Tất cả địa điểm</Select.Option>
              {uniqueProvinces.map((province) => (
                <Select.Option key={province} value={province}>
                  {province}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 4, fontSize: 13, color: "#595959" }}>Trạng thái</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Tất cả trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="ACTIVE">Hoạt động</Select.Option>
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={{ marginBottom: 4, fontSize: 13, color: "#595959" }}>Tìm kiếm</div>
            <Input
              placeholder="Tìm theo tên nghệ nhân..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={() => setFilter({ ...filter, search: searchInput })}
              allowClear
              onClear={() => setFilter({ ...filter, search: "" })}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              style={{ marginTop: 22 }}
              onClick={() => setFilter({ ...filter, search: searchInput })}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {loading ? (
          <Table
            columns={columns}
            dataSource={[]}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={false}
          />
        ) : filteredArtisans.length === 0 ? (
          <Empty
            description="Chưa có nghệ nhân nào."
            style={{ padding: "48px 0" }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredArtisans}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} nghệ nhân`,
            }}
          />
        )}
      </Card>

      {/* Modal Chi tiết */}
      <Modal
        title="Chi tiết nghệ nhân"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedArtisan(null);
        }}
        footer={[
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
                  { label: "Chuyên môn", value: selectedArtisan.specialty, icon: <TrophyOutlined /> },
                  { label: "Địa điểm", value: selectedArtisan.location, icon: <EnvironmentOutlined /> },
                  { label: "Địa chỉ xưởng", value: selectedArtisan.workshopAddress || "Chưa có", icon: <HomeOutlined /> },
                  {
                    label: "Kinh nghiệm / Đánh giá",
                    value: (
                      <>
                        {selectedArtisan.experience} · {(selectedArtisan.averageRating || 0).toFixed(1)}/5 (
                        {selectedArtisan.totalTours || 0} tour)
                      </>
                    ),
                    icon: <CalendarOutlined />,
                  },
                ],
              },
              {
                title: "Giới thiệu",
                rows: [{ label: "", value: selectedArtisan.bio || "Chưa có" }],
              },
            ]}
            extraContent={
              selectedArtisan.images && selectedArtisan.images.length > 0 ? (
                <Card size="small" title="Hình ảnh" style={{ marginTop: 20, borderRadius: 12, border: "1px solid #e8e8e8" }} styles={{ body: { padding: 16 } }}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {selectedArtisan.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }} />
                    ))}
                  </div>
                </Card>
              ) : undefined
            }
          />
        )}
      </Modal>
    </Space>
  );
}
