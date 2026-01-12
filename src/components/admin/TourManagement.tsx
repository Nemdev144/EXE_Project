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
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface Tour {
  key: string;
  id: string;
  title: string;
  location: string;
  price: number;
  minParticipants: number;
  maxParticipants: number;
  currentParticipants: number;
  status: "OPEN" | "NEAR_DEADLINE" | "FULL" | "NOT_ENOUGH" | "CANCELLED";
  startDate: string;
  endDate: string;
  artisan?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Mở đăng ký", color: "success" },
  NEAR_DEADLINE: { label: "Gần hết hạn", color: "warning" },
  FULL: { label: "Đã đầy", color: "default" },
  NOT_ENOUGH: { label: "Không đủ người", color: "error" },
  CANCELLED: { label: "Đã hủy", color: "default" },
};

export default function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([
    {
      key: "1",
      id: "1",
      title: "Lễ hội Cồng chiêng",
      location: "Đắk Lắk",
      price: 1500000,
      minParticipants: 10,
      maxParticipants: 20,
      currentParticipants: 7,
      status: "NOT_ENOUGH",
      startDate: "25/01/2025",
      endDate: "26/01/2025",
      artisan: "Nghệ nhân Y Kông",
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
      status: "NOT_ENOUGH",
      startDate: "01/02/2025",
      endDate: "03/02/2025",
      artisan: "Nghệ nhân H'Rơi",
    },
    {
      key: "3",
      id: "3",
      title: "Làng nghề Gốm",
      location: "Gia Lai",
      price: 800000,
      minParticipants: 8,
      maxParticipants: 15,
      currentParticipants: 5,
      status: "NOT_ENOUGH",
      startDate: "08/02/2025",
      endDate: "08/02/2025",
      artisan: "Ông A Pui",
    },
  ]);

  const [filter, setFilter] = useState<{ status: string }>({ status: "all" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredTours = tours.filter((tour) => {
    if (filter.status !== "all" && tour.status !== filter.status) return false;
    return true;
  });

  const getProgress = (tour: Tour) => {
    return Math.round((tour.currentParticipants / tour.minParticipants) * 100);
  };

  const columns: ColumnsType<Tour> = [
    {
      title: "Tour",
      key: "tour",
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
      render: (_, record) => (
        <div>
          <CalendarOutlined /> {record.startDate} - {record.endDate}
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <div>
          <DollarOutlined style={{ color: "#8B0000" }} />{" "}
          <strong style={{ color: "#8B0000", fontSize: 16 }}>
            {price.toLocaleString("vi-VN")}đ
          </strong>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>/ người</div>
        </div>
      ),
    },
    {
      title: "Đăng ký",
      key: "participants",
      render: (_, record) => {
        const progress = getProgress(record);
        const remaining = record.minParticipants - record.currentParticipants;
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <strong>{record.currentParticipants}</strong> / {record.minParticipants}
            </div>
            <Progress
              percent={progress}
              status={progress >= 100 ? "success" : progress >= 80 ? "active" : "exception"}
              size="small"
            />
            {remaining > 0 && (
              <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
                Còn {remaining} chỗ
              </div>
            )}
          </div>
        );
      },
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
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button type="link" icon={<EditOutlined />} size="small">
            Xem chi tiết
          </Button>
          <Button type="link" icon={<UserOutlined />} size="small">
            Gắn nghệ nhân
          </Button>
          {record.status === "NOT_ENOUGH" && (
            <>
              <Button type="link" size="small" style={{ color: "#8B0000" }}>
                Giảm giá
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<AlertOutlined />}
                onClick={() => message.warning("Xác nhận hủy tour?")}
              >
                Hủy tour
              </Button>
            </>
          )}
          {record.status === "OPEN" && (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => message.warning("Xác nhận hủy tour?")}
            >
              Hủy tour
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
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Quản lý Tour</h2>
            <p style={{ margin: "4px 0 0 0", color: "#8c8c8c", fontSize: 14 }}>
              Quản lý tour và trạng thái tour
            </p>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Tạo tour mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
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
        </Row>

        <Table
          columns={columns}
          dataSource={filteredTours}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tour`,
          }}
        />
      </Card>

      <Modal
        title="Tạo tour mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên tour" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Địa điểm" name="location" rules={[{ required: true }]}>
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
              <Form.Item label="Giá (VNĐ)" name="price" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số người tối thiểu" name="minParticipants" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số người tối đa" name="maxParticipants" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Thời gian" name="dateRange" rules={[{ required: true }]}>
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => message.success("Đã tạo tour thành công")}>
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
