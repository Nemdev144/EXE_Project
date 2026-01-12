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
  AreaChart,
  Area,
  BarChart,
  Bar,
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

const bookingByTour = [
  { name: "Lễ hội Cồng chiêng", bookings: 45, revenue: 67.5 },
  { name: "Tour Ẩm thực", bookings: 38, revenue: 95 },
  { name: "Làng nghề Gốm", bookings: 32, revenue: 25.6 },
  { name: "Nhà Rông", bookings: 28, revenue: 22.4 },
  { name: "Cồng chiêng Gia Lai", bookings: 25, revenue: 37.5 },
];

const tourByProvince = [
  { name: "Đắk Lắk", value: 35, color: "#8B0000" },
  { name: "Gia Lai", value: 28, color: "#C41E3A" },
  { name: "Kon Tum", value: 22, color: "#DC143C" },
  { name: "Lâm Đồng", value: 15, color: "#FF6347" },
];

const userGrowthData = [
  { month: "T1", users: 450 },
  { month: "T2", users: 520 },
  { month: "T3", users: 580 },
  { month: "T4", users: 650 },
  { month: "T5", users: 720 },
  { month: "T6", users: 800 },
  { month: "T7", users: 890 },
  { month: "T8", users: 980 },
  { month: "T9", users: 1080 },
  { month: "T10", users: 1150 },
  { month: "T11", users: 1200 },
  { month: "T12", users: 1248 },
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
      {/* Stats Cards with Mini Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Tour"
              value={24}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: "#8B0000" }}
              suffix={
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  <ArrowUpOutlined /> +3
                </span>
              }
            />
            <div style={{ marginTop: 16, height: 40 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData.slice(-6)}>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B0000"
                    fill="#8B0000"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Booking Hôm nay"
              value={12}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#8B0000" }}
              suffix={
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  <ArrowUpOutlined /> +5
                </span>
              }
            />
            <div style={{ marginTop: 16, height: 40 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingByTour.slice(0, 5)}>
                  <Bar dataKey="bookings" fill="#8B0000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Nội dung Văn hóa"
              value={156}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#8B0000" }}
              suffix={
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  <ArrowUpOutlined /> +12
                </span>
              }
            />
            <div style={{ marginTop: 16, height: 40 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-6)}>
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B0000"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Nghệ nhân"
              value={18}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#8B0000" }}
              suffix={
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  <ArrowUpOutlined /> +2
                </span>
              }
            />
            <div style={{ marginTop: 16, height: 40 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData.slice(-6)}>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card>
            <Statistic
              title="Doanh thu Tháng"
              value={125.5}
              prefix={<DollarOutlined />}
              suffix="M"
              precision={1}
              valueStyle={{ color: "#8B0000", fontSize: 32 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#52c41a" }}>
              <RiseOutlined /> +15% so với tháng trước
            </div>
            <div style={{ marginTop: 16, height: 60 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B0000"
                    strokeWidth={3}
                    dot={{ fill: "#8B0000", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#d9d9d9"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card>
            <Statistic
              title="User Đăng ký"
              value={1248}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#8B0000", fontSize: 32 }}
              suffix={
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  <ArrowUpOutlined /> +89
                </span>
              }
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#52c41a" }}>
              <RiseOutlined /> Tăng trưởng ổn định
            </div>
            <div style={{ marginTop: 16, height: 60 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B0000" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B0000" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#8B0000"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={5} style={{ margin: 0 }}>
                  Doanh thu theo tháng
                </Title>
                <Select defaultValue="2025" style={{ width: 100 }}>
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
          <Card title={<Title level={5} style={{ margin: 0 }}>Phân bố Tour theo Tỉnh</Title>}>
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
            <div style={{ marginTop: 16 }}>
              {tourByProvince.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: index < tourByProvince.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <strong>{item.value} tour</strong>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Booking theo Tour</Title>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingByTour} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" name="Số lượng booking" fill="#8B0000" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Title level={5} style={{ margin: 0 }}>Doanh thu theo Tour</Title>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingByTour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: number | undefined) => value ? [`${value}M VNĐ`, "Doanh thu"] : ["", ""]} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu (M VNĐ)" fill="#C41E3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Booking Gần đây" extra={<a href="#">Xem tất cả</a>}>
            <Table
              columns={bookingColumns}
              dataSource={bookingData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái Tour" extra={<a href="#">Xem tất cả</a>}>
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
