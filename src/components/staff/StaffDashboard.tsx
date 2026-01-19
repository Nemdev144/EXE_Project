import { Card, Row, Col, Statistic, Table, Tag, Progress, Space, Typography } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface BookingData {
  key: string;
  id: string;
  tour: string;
  customer: string;
  date: string;
  status: string;
  label?: string;
}

interface TourData {
  key: string;
  tour: string;
  date: string;
  status: string;
  participants: string;
  progress: number;
}

const bookingColumns: ColumnsType<BookingData> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
  },
  {
    title: "Tour",
    dataIndex: "tour",
    key: "tour",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const color = status === "PAID" ? "green" : status === "PENDING" ? "orange" : "red";
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Nhãn",
    dataIndex: "label",
    key: "label",
    render: (label) =>
      label ? (
        <Tag color="blue" style={{ backgroundColor: "#e6f7ff", borderColor: "#1890ff", color: "#1890ff" }}>
          {label}
        </Tag>
      ) : (
        "-"
      ),
  },
];

const bookingData: BookingData[] = [
  {
    key: "1",
    id: "BK001",
    tour: "Lễ hội Cồng chiêng",
    customer: "Nguyễn Văn A",
    date: "25/01/2025",
    status: "PAID",
    label: "Đã liên hệ",
  },
  {
    key: "2",
    id: "BK002",
    tour: "Tour Ẩm thực Tây Nguyên",
    customer: "Trần Thị B",
    date: "01/02/2025",
    status: "PENDING",
    label: "Khách không phản hồi",
  },
  {
    key: "3",
    id: "BK003",
    tour: "Làng nghề Gốm",
    customer: "Lê Văn C",
    date: "08/02/2025",
    status: "PAID",
  },
];

const tourStatusData: TourData[] = [
  {
    key: "1",
    tour: "Lễ hội Cồng chiêng",
    date: "25/01/2025",
    status: "NOT_ENOUGH",
    participants: "7/10",
    progress: 70,
  },
  {
    key: "2",
    tour: "Tour Ẩm thực",
    date: "01/02/2025",
    status: "NEAR_DEADLINE",
    participants: "10/12",
    progress: 83,
  },
  {
    key: "3",
    tour: "Làng nghề Gốm",
    date: "08/02/2025",
    status: "NOT_ENOUGH",
    participants: "2/8",
    progress: 25,
  },
];

export default function StaffDashboard() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Booking Hôm nay</span>}
              value={12}
              prefix={<CalendarOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
              suffix={
                <span className="text-sm text-green-500 font-semibold">
                  <ArrowUpOutlined /> +5
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Tour Cần Xử lý</span>}
              value={3}
              prefix={<WarningOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Nội dung DRAFT</span>}
              value={5}
              prefix={<FileTextOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Nghệ nhân</span>}
              value={18}
              prefix={<TeamOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            title={<span style={{ color: "#111827", fontWeight: 600 }}>Booking Gần đây</span>}
            extra={<a href="/staff/bookings" style={{ color: "#8B0000", fontWeight: 500 }}>Xem tất cả</a>}
          >
            <Table
              columns={bookingColumns}
              dataSource={bookingData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            title={<span style={{ color: "#111827", fontWeight: 600 }}>Tour Cần Xử lý</span>}
            extra={<a href="/staff/tours" style={{ color: "#8B0000", fontWeight: 500 }}>Xem tất cả</a>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {tourStatusData.map((item) => (
                <div key={item.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <strong>{item.tour}</strong>
                      <div style={{ fontSize: 12, color: "#8c8c8c" }}>{item.date}</div>
                    </div>
                    <Tag
                      color={
                        item.status === "OPEN"
                          ? "green"
                          : item.status === "NEAR_DEADLINE"
                          ? "orange"
                          : "red"
                      }
                    >
                      {item.status === "NOT_ENOUGH" ? "Không đủ người" : "Gần hết hạn"}
                    </Tag>
                  </div>
                  <Progress
                    percent={item.progress}
                    status={item.progress >= 80 ? "success" : item.progress >= 50 ? "active" : "exception"}
                    size="small"
                  />
                  <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 4 }}>
                    {item.participants}
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
