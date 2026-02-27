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
  Progress,
  Modal,
  Form,
  InputNumber,
  message,
  Tooltip,
  Alert,
  Input,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  PercentageOutlined,
  MailOutlined,
  AlertOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Breadcrumbs from "../Breadcrumbs";
import TourSummaryCards from "../admin/TourSummaryCards";

interface Tour {
  key: string;
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  paidParticipants: number;
  status: "OPEN" | "NEAR_DEADLINE" | "FULL" | "NOT_ENOUGH" | "CANCELLED";
  startDate: string;
  endDate: string;
  artisan?: string;
  artisanId?: string;
  daysUntil?: number;
  discount?: number;
  bookingCount: number;
}

const statusConfig: Record<string, { label: string; color: string; bgColor?: string }> = {
  OPEN: { label: "Mở đăng ký", color: "#52c41a", bgColor: "#f6ffed" },
  NEAR_DEADLINE: { label: "Gần hết hạn", color: "#faad14", bgColor: "#fffbe6" },
  FULL: { label: "Đã đầy", color: "#1890ff", bgColor: "#e6f7ff" },
  NOT_ENOUGH: { label: "Không đủ người", color: "#ff4d4f", bgColor: "#fff1f0" },
  CANCELLED: { label: "Đã hủy", color: "#8c8c8c", bgColor: "#fafafa" },
};

// Mock data nghệ nhân
const artisans = [
  { id: "1", name: "Nghệ nhân Y Kông", specialty: "Cồng chiêng" },
  { id: "2", name: "Bà H'Bla", specialty: "Dệt thổ cẩm" },
  { id: "3", name: "Ông A Pui", specialty: "Làm gốm" },
  { id: "4", name: "Nghệ nhân H'Rơi", specialty: "Hát kể sử thi" },
];

export default function TourCoordination() {
  const [tours, setTours] = useState<Tour[]>([
    {
      key: "1",
      id: "1",
      title: "Lễ hội Cồng chiêng",
      location: "Đắk Lắk",
      price: 1500000,
      originalPrice: 2000000,
      minParticipants: 10,
      maxParticipants: 20,
      currentParticipants: 7,
      paidParticipants: 5,
      status: "NOT_ENOUGH",
      startDate: "25/01/2025",
      endDate: "26/01/2025",
      artisan: "Nghệ nhân Y Kông",
      artisanId: "1",
      daysUntil: 12,
      discount: 25,
      bookingCount: 7,
    },
    {
      key: "2",
      id: "2",
      title: "Tour Ẩm thực Tây Nguyên",
      location: "Kon Tum",
      price: 2500000,
      minParticipants: 12,
      maxParticipants: 25,
      currentParticipants: 10,
      paidParticipants: 8,
      status: "NOT_ENOUGH",
      startDate: "01/02/2025",
      endDate: "03/02/2025",
      artisan: "Nghệ nhân H'Rơi",
      artisanId: "4",
      daysUntil: 8,
      bookingCount: 10,
    },
    {
      key: "3",
      id: "3",
      title: "Làng nghề Gốm",
      location: "Gia Lai",
      price: 800000,
      originalPrice: 1000000,
      minParticipants: 8,
      maxParticipants: 15,
      currentParticipants: 5,
      paidParticipants: 3,
      status: "NOT_ENOUGH",
      startDate: "08/02/2025",
      endDate: "08/02/2025",
      artisan: "Ông A Pui",
      artisanId: "3",
      daysUntil: 5,
      discount: 20,
      bookingCount: 5,
    },
  ]);

  const [filter, setFilter] = useState<{ status: string; location: string }>({
    status: "all",
    location: "all",
  });
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [artisanForm] = Form.useForm();
  const [proposalForm] = Form.useForm();

  const filteredTours = tours.filter((tour) => {
    if (filter.status !== "all" && tour.status !== filter.status) return false;
    if (filter.location !== "all" && tour.location !== filter.location) return false;
    return true;
  });

  const getProgress = (tour: Tour) => {
    return Math.round((tour.currentParticipants / tour.minParticipants) * 100);
  };

  const getDaysUntil = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    const tourDate = dayjs(`${year}-${month}-${day}`);
    return tourDate.diff(dayjs(), "day");
  };

  const handleAssignArtisan = (tourId: string, artisanId: string) => {
    const artisan = artisans.find((a) => a.id === artisanId);
    if (artisan) {
      setTours(
        tours.map((tour) =>
          tour.id === tourId
            ? { ...tour, artisan: artisan.name, artisanId: artisan.id }
            : tour
        )
      );
      message.success(`Đã gắn nghệ nhân ${artisan.name} vào tour`);
      setIsArtisanModalOpen(false);
    }
  };

  const handleSendEmail = (tour: Tour, template: string) => {
    message.success(`Đã gửi email "${template}" cho khách hàng của tour ${tour.title}`);
  };

  const handleProposeAction = (tour: Tour, action: string, data?: any) => {
    message.info(`Đã gửi đề xuất "${action}" cho Admin. Vui lòng chờ Admin xử lý.`);
    setIsProposalModalOpen(false);
  };

  const columns: ColumnsType<Tour> = [
    {
      title: "Tour",
      key: "tour",
      width: 250,
      render: (_, record) => (
        <div>
          <strong style={{ fontSize: 16 }}>{record.title}</strong>
          <div style={{ marginTop: 4, color: "#8c8c8c", fontSize: 12 }}>
            <EnvironmentOutlined /> {record.location}
          </div>
          {record.artisan && (
            <div style={{ marginTop: 4, color: "#8c8c8c", fontSize: 12 }}>
              <UserOutlined /> {record.artisan}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "date",
      width: 180,
      render: (_, record) => {
        const daysLeft = getDaysUntil(record.startDate);
        return (
          <div>
            <div>
              <CalendarOutlined /> {record.startDate} - {record.endDate}
            </div>
            {daysLeft !== undefined && (
              <div
                style={{
                  fontSize: 12,
                  color: daysLeft <= 3 ? "#ff4d4f" : daysLeft <= 7 ? "#faad14" : "#52c41a",
                  marginTop: 4,
                }}
              >
                Còn {daysLeft} ngày
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Giá",
      key: "price",
      width: 150,
      render: (_, record) => (
        <div>
          {record.originalPrice && (
            <div style={{ fontSize: 12, color: "#8c8c8c", textDecoration: "line-through" }}>
              {record.originalPrice.toLocaleString("vi-VN")}đ
            </div>
          )}
          <DollarOutlined style={{ color: "#8B0000" }} />{" "}
          <strong style={{ color: "#8B0000", fontSize: 16 }}>
            {record.price.toLocaleString("vi-VN")}đ
          </strong>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>/ người</div>
          {record.discount && (
            <Tag
              color="#ff4d4f"
              style={{
                marginTop: 4,
                backgroundColor: "#fff1f0",
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              -{record.discount}%
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Đăng ký",
      key: "participants",
      width: 200,
      render: (_, record) => {
        const progress = getProgress(record);
        const remaining = record.minParticipants - record.currentParticipants;
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>{record.currentParticipants}</strong> / {record.minParticipants} (Đã thanh toán:{" "}
              {record.paidParticipants})
            </div>
            <Progress
              percent={progress}
              status={progress >= 100 ? "success" : progress >= 80 ? "active" : "exception"}
              size="small"
              strokeColor={
                progress >= 100
                  ? "#52c41a"
                  : progress >= 80
                  ? "#1890ff"
                  : progress >= 50
                  ? "#faad14"
                  : "#ff4d4f"
              }
              trailColor="#f0f0f0"
            />
            <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
              Số booking: {record.bookingCount}
            </div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const config = statusConfig[status];
        return (
          <Tag
            color={config.color}
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.color,
              color: config.color,
              fontWeight: 500,
              padding: "4px 12px",
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 250,
      fixed: "right",
      render: (_, record) => {
        const daysLeft = getDaysUntil(record.startDate);
        const remaining = record.minParticipants - record.currentParticipants;
        return (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Button
              type="link"
              icon={<UserOutlined />}
              size="small"
              onClick={() => {
                setSelectedTour(record);
                artisanForm.setFieldsValue({ artisan: record.artisanId });
                setIsArtisanModalOpen(true);
              }}
            >
              Gắn nghệ nhân
            </Button>
            <Button
              type="link"
              icon={<MailOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: "Chọn template email",
                  content: (
                    <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
                      <Button
                        block
                        onClick={() => {
                          handleSendEmail(record, "Nhắc thanh toán");
                          Modal.destroyAll();
                        }}
                      >
                        Nhắc thanh toán
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          handleSendEmail(record, "Thông báo thiếu người");
                          Modal.destroyAll();
                        }}
                      >
                        Thông báo thiếu người
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          handleSendEmail(record, "Đề xuất đổi tour");
                          Modal.destroyAll();
                        }}
                      >
                        Đề xuất đổi tour
                      </Button>
                    </Space>
                  ),
                  okButtonProps: { style: { display: "none" } },
                  cancelText: "Đóng",
                });
              }}
            >
              Gửi email
            </Button>
            {record.status === "NOT_ENOUGH" && remaining > 0 && (
              <>
                <Button
                  type="link"
                  icon={<PercentageOutlined />}
                  size="small"
                  style={{ color: "#8B0000" }}
                  onClick={() => {
                    setSelectedTour(record);
                    proposalForm.setFieldsValue({ action: "discount", discount: 10 });
                    setIsProposalModalOpen(true);
                  }}
                >
                  Đề xuất giảm giá
                </Button>
                <Button
                  type="link"
                  icon={<SwapOutlined />}
                  size="small"
                  onClick={() => {
                    setSelectedTour(record);
                    proposalForm.setFieldsValue({ action: "change_tour" });
                    setIsProposalModalOpen(true);
                  }}
                >
                  Đề xuất đổi tour
                </Button>
                <Button
                  type="link"
                  danger
                  icon={<AlertOutlined />}
                  size="small"
                  onClick={() => {
                    setSelectedTour(record);
                    proposalForm.setFieldsValue({ action: "cancel" });
                    setIsProposalModalOpen(true);
                  }}
                >
                  Đề xuất hủy tour
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const stats = {
    total: tours.length,
    open: tours.filter((t) => t.status === "OPEN").length,
    notEnough: tours.filter((t) => t.status === "NOT_ENOUGH").length,
    nearDeadline: tours.filter((t) => {
      const days = getDaysUntil(t.startDate);
      return days !== undefined && days <= 7 && days > 0;
    }).length,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumbs
        items={[
          { label: "Dashboard", path: "/staff" },
          { label: "Điều phối Tour" },
        ]}
      />
      <TourSummaryCards stats={stats} />

      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#262626" }}>
              Điều phối Tour
            </h2>
            <p style={{ margin: "8px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Xem tour, gắn nghệ nhân, gửi email và đề xuất xử lý
            </p>
          </Col>
        </Row>
        <Alert
          message="Lưu ý"
          description="Staff không có quyền tạo tour mới, hủy tour, hoặc thay đổi giá/min-max participants. Chỉ có thể đề xuất cho Admin xử lý."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>

      <Card
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filter.status}
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="OPEN">Mở đăng ký</Select.Option>
              <Select.Option value="NEAR_DEADLINE">Gần hết hạn</Select.Option>
              <Select.Option value="FULL">Đã đầy</Select.Option>
              <Select.Option value="NOT_ENOUGH">Không đủ người</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
        </Row>

        <Table
          columns={columns}
          dataSource={filteredTours}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tour`,
          }}
        />
      </Card>

      {/* Modal Gắn nghệ nhân */}
      <Modal
        title="Gắn nghệ nhân vào tour"
        open={isArtisanModalOpen}
        onCancel={() => {
          setIsArtisanModalOpen(false);
          setSelectedTour(null);
        }}
        footer={null}
        width={500}
      >
        {selectedTour && (
          <Form
            form={artisanForm}
            layout="vertical"
            onFinish={(values) => handleAssignArtisan(selectedTour.id, values.artisan)}
          >
            <Form.Item label="Tour" name="tour">
              <Input value={selectedTour.title} disabled />
            </Form.Item>
            <Form.Item label="Nghệ nhân" name="artisan" rules={[{ required: true }]}>
              <Select placeholder="Chọn nghệ nhân">
                {artisans.map((artisan) => (
                  <Select.Option key={artisan.id} value={artisan.id}>
                    {artisan.name} - {artisan.specialty}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Gắn nghệ nhân
                </Button>
                <Button onClick={() => setIsArtisanModalOpen(false)}>Hủy</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal Đề xuất */}
      <Modal
        title="Gửi đề xuất cho Admin"
        open={isProposalModalOpen}
        onCancel={() => {
          setIsProposalModalOpen(false);
          setSelectedTour(null);
        }}
        footer={null}
        width={600}
      >
        {selectedTour && (
          <Form
            form={proposalForm}
            layout="vertical"
            onFinish={(values) => handleProposeAction(selectedTour, values.action, values)}
          >
            <Alert
              message="Thông tin tour"
              description={
                <div>
                  <div>
                    <strong>Tour:</strong> {selectedTour.title}
                  </div>
                  <div>
                    <strong>Còn thiếu:</strong>{" "}
                    {selectedTour.minParticipants - selectedTour.currentParticipants} người
                  </div>
                </div>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Form.Item label="Loại đề xuất" name="action" rules={[{ required: true }]}>
              <Select placeholder="Chọn loại đề xuất">
                <Select.Option value="discount">Đề xuất giảm giá</Select.Option>
                <Select.Option value="change_tour">Đề xuất đổi tour</Select.Option>
                <Select.Option value="cancel">Đề xuất hủy tour</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
            >
              {({ getFieldValue }) =>
                getFieldValue("action") === "discount" ? (
                  <Form.Item
                    label="Phần trăm giảm giá"
                    name="discount"
                    rules={[{ required: true, min: 1, max: 50 }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={1}
                      max={50}
                      addonAfter="%"
                      placeholder="Nhập % giảm giá"
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            <Form.Item label="Lý do đề xuất" name="reason">
              <Input.TextArea rows={4} placeholder="Nhập lý do đề xuất..." />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Gửi đề xuất
                </Button>
                <Button onClick={() => setIsProposalModalOpen(false)}>Hủy</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Space>
  );
}
