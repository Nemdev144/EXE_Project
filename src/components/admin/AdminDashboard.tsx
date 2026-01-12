import { Card, Row, Col, Statistic, Table, Tag, Progress, Space, Select, Typography } from "antd";
import {
  ArrowUpOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface BookingData {
  key: string;
  id: string;
  tour: string;
  customer: string;
  date: string;
  status: string;
  amount: string;
}

interface TourStatusData {
  key: string;
  tour: string;
  date: string;
  status: string;
  participants: string;
  progress: number;
}

// Data for charts
const revenueData = [
  { month: "T1", revenue: 45, target: 50 },
  { month: "T2", revenue: 52, target: 50 },
  { month: "T3", revenue: 48, target: 50 },
  { month: "T4", revenue: 61, target: 50 },
  { month: "T5", revenue: 55, target: 50 },
  { month: "T6", revenue: 67, target: 50 },
  { month: "T7", revenue: 72, target: 50 },
  { month: "T8", revenue: 68, target: 50 },
  { month: "T9", revenue: 75, target: 50 },
  { month: "T10", revenue: 82, target: 50 },
  { month: "T11", revenue: 88, target: 50 },
  { month: "T12", revenue: 95, target: 50 },
];

const tourByProvince = [
  { name: "Đắk Lắk", value: 35, color: "#8B0000" },
  { name: "Gia Lai", value: 28, color: "#C41E3A" },
  { name: "Kon Tum", value: 22, color: "#DC143C" },
  { name: "Lâm Đồng", value: 15, color: "#FF6347" },
];

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
      const color = status === "PAID" ? "green" : "orange";
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
    key: "amount",
    render: (text) => <span style={{ color: "#8B0000", fontWeight: 600 }}>{text}</span>,
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
    amount: "3.000.000đ",
  },
  {
    key: "2",
    id: "BK002",
    tour: "Tour Ẩm thực Tây Nguyên",
    customer: "Trần Thị B",
    date: "01/02/2025",
    status: "PENDING",
    amount: "5.000.000đ",
  },
  {
    key: "3",
    id: "BK003",
    tour: "Làng nghề Gốm",
    customer: "Lê Văn C",
    date: "08/02/2025",
    status: "PAID",
    amount: "1.600.000đ",
  },
];

const tourStatusData: TourStatusData[] = [
  {
    key: "1",
    tour: "Lễ hội Cồng chiêng",
    date: "25/01/2025",
    status: "Near deadline",
    participants: "7/10",
    progress: 70,
  },
  {
    key: "2",
    tour: "Tour Ẩm thực",
    date: "01/02/2025",
    status: "Open",
    participants: "10/12",
    progress: 83,
  },
  {
    key: "3",
    tour: "Làng nghề Gốm",
    date: "08/02/2025",
    status: "Not enough",
    participants: "2/8",
    progress: 25,
  },
];

export default function AdminDashboard() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Tổng Tour</span>}
              value={24}
              prefix={<EnvironmentOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
              suffix={
                <span className="text-sm text-green-500 font-semibold">
                  <ArrowUpOutlined /> +3
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
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
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Nội dung Văn hóa</span>}
              value={156}
              prefix={<FileTextOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
              suffix={
                <span className="text-sm text-green-500 font-semibold">
                  <ArrowUpOutlined /> +12
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Nghệ nhân</span>}
              value={18}
              prefix={<TeamOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontWeight: 700 }}
              suffix={
                <span className="text-sm text-green-500 font-semibold">
                  <ArrowUpOutlined /> +2
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>Doanh thu Tháng</span>}
              value={125.5}
              prefix={<DollarOutlined style={{ color: "#8B0000" }} />}
              suffix="M"
              precision={1}
              valueStyle={{ color: "#8B0000", fontSize: 32, fontWeight: 700 }}
            />
            <div className="mt-2 text-xs text-green-500 font-medium">
              <RiseOutlined /> +15% so với tháng trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card className="admin-card" style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title={<span style={{ color: "#6b7280", fontWeight: 500 }}>User Đăng ký</span>}
              value={1248}
              prefix={<UserOutlined style={{ color: "#8B0000" }} />}
              valueStyle={{ color: "#8B0000", fontSize: 32, fontWeight: 700 }}
              suffix={
                <span className="text-sm text-green-500 font-semibold">
                  <ArrowUpOutlined /> +89
                </span>
              }
            />
            <div className="mt-2 text-xs text-green-500 font-medium">
              <RiseOutlined /> Tăng trưởng ổn định
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            className="admin-card"
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            title={
              <div className="flex justify-between items-center">
                <Title level={5} className="m-0" style={{ color: "#111827", fontWeight: 600 }}>
                  Doanh thu theo tháng
                </Title>
                <Select defaultValue="2025" className="w-24">
                  <Select.Option value="2025">2025</Select.Option>
                  <Select.Option value="2024">2024</Select.Option>
                </Select>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number | undefined) => value ? [`${value}M VNĐ`, "Doanh thu"] : ["", ""]}
                  labelStyle={{ color: "#8B0000" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu thực tế"
                  stroke="#8B0000"
                  strokeWidth={3}
                  dot={{ fill: "#8B0000", r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Mục tiêu"
                  stroke="#d9d9d9"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            className="admin-card" 
            style={{ border: "1px solid #d1d5db", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            title={<Title level={5} className="m-0" style={{ color: "#111827", fontWeight: 600 }}>Phân bố Tour theo Tỉnh</Title>}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tourByProvince}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tourByProvince.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4">
              {tourByProvince.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-2 ${
                    index < tourByProvince.length - 1 ? "border-b border-gray-200" : ""
                  } transition-all duration-200 hover:bg-gray-50 rounded px-2`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <strong className="text-gray-800">{item.value} tour</strong>
                </div>
              ))}
            </div>
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
            extra={<a href="#" style={{ color: "#8B0000", fontWeight: 500 }}>Xem tất cả</a>}
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
            title={<span style={{ color: "#111827", fontWeight: 600 }}>Trạng thái Tour</span>} 
            extra={<a href="#" style={{ color: "#8B0000", fontWeight: 500 }}>Xem tất cả</a>}
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
                        item.status === "Open"
                          ? "green"
                          : item.status === "Near deadline"
                          ? "orange"
                          : "red"
                      }
                    >
                      {item.status}
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
