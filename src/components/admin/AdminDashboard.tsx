import { useState, useEffect } from "react";
import { Card, Row, Col, Table, Tag, Progress, Space, Select, Typography, Divider } from "antd";
import {
  ArrowUpOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
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
  Area,
  AreaChart,
} from "recharts";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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


const bookingColumns: ColumnsType<BookingData> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 100,
    render: (text) => <Text strong style={{ color: "#8B0000" }}>{text}</Text>,
  },
  {
    title: "Tour",
    dataIndex: "tour",
    key: "tour",
    render: (text) => <Text strong>{text}</Text>,
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
      const color = status === "PAID" ? "success" : "warning";
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: "amount",
    key: "amount",
    render: (text) => <Text strong style={{ color: "#8B0000", fontSize: 14 }}>{text}</Text>,
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

// Mock data - Sau này sẽ thay bằng API calls
const mockTours = [
  { id: "1", title: "Lễ hội Cồng chiêng", location: "Đắk Lắk", status: "OPEN" },
  { id: "2", title: "Tour Ẩm thực Tây Nguyên", location: "Kon Tum", status: "OPEN" },
  { id: "3", title: "Làng nghề Gốm", location: "Gia Lai", status: "OPEN" },
];

const mockBookings = [
  {
    id: "BK001",
    tour: "Lễ hội Cồng chiêng",
    customer: "Nguyễn Văn A",
    date: "25/01/2025",
    status: "PAID",
    amount: 3000000,
    bookingDate: "15/01/2025",
  },
  {
    id: "BK002",
    tour: "Tour Ẩm thực Tây Nguyên",
    customer: "Trần Thị B",
    date: "01/02/2025",
    status: "PENDING",
    amount: 5000000,
    bookingDate: "18/01/2025",
  },
  {
    id: "BK003",
    tour: "Làng nghề Gốm",
    customer: "Lê Văn C",
    date: "08/02/2025",
    status: "PAID",
    amount: 1600000,
    bookingDate: "20/01/2025",
  },
];

const mockContent = [
  { id: "1", title: "Lễ hội Cồng chiêng", status: "PUBLISHED" },
  { id: "2", title: "Rượu cần", status: "PUBLISHED" },
  { id: "3", title: "Trang phục Êđê", status: "DRAFT" },
];

export default function AdminDashboard() {
  // Tính toán số liệu từ dữ liệu thực tế
  const [stats, setStats] = useState({
    totalTours: 0,
    bookingsToday: 0,
    totalBookings: 0,
    totalContent: 0,
    monthlyRevenue: 0,
    tourGrowth: 0,
    bookingGrowth: 0,
    contentGrowth: 0,
    revenueGrowth: 0,
  });

  useEffect(() => {
    // Tính toán số liệu
    const today = dayjs().format("DD/MM/YYYY");
    const bookingsTodayCount = mockBookings.filter(
      (b) => b.bookingDate === today
    ).length;

    const totalRevenue = mockBookings
      .filter((b) => b.status === "PAID")
      .reduce((sum, b) => sum + b.amount, 0);

    const monthlyRevenue = totalRevenue / 1000000; // Convert to millions

    setStats({
      totalTours: mockTours.length,
      bookingsToday: bookingsTodayCount || mockBookings.length, // Fallback nếu không có booking hôm nay
      totalBookings: mockBookings.length,
      totalContent: mockContent.length,
      monthlyRevenue: monthlyRevenue || 125.5, // Fallback value
      tourGrowth: 3, // Mock growth
      bookingGrowth: 5, // Mock growth
      contentGrowth: 12, // Mock growth
      revenueGrowth: 15, // Mock growth percentage
    });
  }, []);

  // Tính toán phân bố tour theo tỉnh từ dữ liệu thực tế
  const calculateTourByProvince = () => {
    const provinceMap: Record<string, number> = {};
    mockTours.forEach((tour) => {
      provinceMap[tour.location] = (provinceMap[tour.location] || 0) + 1;
    });

    const colors = ["#8B0000", "#C41E3A", "#DC143C", "#FF6347"];
    return Object.entries(provinceMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const tourByProvinceData = calculateTourByProvince();

  // Lấy booking gần đây (3 booking mới nhất)
  const recentBookings = mockBookings.slice(0, 3).map((b) => ({
    key: b.id,
    id: b.id,
    tour: b.tour,
    customer: b.customer,
    date: b.date,
    status: b.status,
    amount: `${(b.amount / 1000000).toFixed(1)}Mđ`,
  }));

  return (
    <div style={{ width: "100%" }}>
      {/* Header Section */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Tổng quan hệ thống và thống kê
        </Text>
      </div>

      {/* Stats Cards - All Equal Size, Revenue Highlighted */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {/* Tổng Tour */}
        <div style={{ flex: "1 1 0", minWidth: "180px" }}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.25)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "100%",
              height: "100%",
            }}
            bodyStyle={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.25)";
            }}
          >
            <div>
              <EnvironmentOutlined style={{ fontSize: 32, color: "#fff", marginBottom: 12 }} />
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 12 }}>
                Tổng Tour
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {stats.totalTours}
              </Text>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpOutlined style={{ color: "#4ade80", fontSize: 14 }} />
              <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>+{stats.tourGrowth}</Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11, marginLeft: 4 }}>tháng trước</Text>
            </div>
          </Card>
        </div>

        {/* Booking Hôm nay */}
        <div style={{ flex: "1 1 0", minWidth: "180px" }}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              boxShadow: "0 8px 24px rgba(245, 87, 108, 0.25)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "100%",
              height: "100%",
            }}
            bodyStyle={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(245, 87, 108, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(245, 87, 108, 0.25)";
            }}
          >
            <div>
              <CalendarOutlined style={{ fontSize: 32, color: "#fff", marginBottom: 12 }} />
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 12 }}>
                Booking Hôm nay
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {stats.bookingsToday}
              </Text>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpOutlined style={{ color: "#4ade80", fontSize: 14 }} />
              <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>+{stats.bookingGrowth}</Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11, marginLeft: 4 }}>hôm qua</Text>
            </div>
          </Card>
        </div>

        {/* Tổng Booking */}
        <div style={{ flex: "1 1 0", minWidth: "180px" }}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              boxShadow: "0 8px 24px rgba(168, 237, 234, 0.25)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "100%",
              height: "100%",
            }}
            bodyStyle={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(168, 237, 234, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(168, 237, 234, 0.25)";
            }}
          >
            <div>
              <CalendarOutlined style={{ fontSize: 32, color: "#fff", marginBottom: 12 }} />
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 12 }}>
                Tổng Booking
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {stats.totalBookings}
              </Text>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpOutlined style={{ color: "#4ade80", fontSize: 14 }} />
              <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>+{stats.bookingGrowth}</Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11, marginLeft: 4 }}>tăng trưởng</Text>
            </div>
          </Card>
        </div>

        {/* Nội dung Văn hóa */}
        <div style={{ flex: "1 1 0", minWidth: "180px" }}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              boxShadow: "0 8px 24px rgba(79, 172, 254, 0.25)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              width: "100%",
              height: "100%",
            }}
            bodyStyle={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(79, 172, 254, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(79, 172, 254, 0.25)";
            }}
          >
            <div>
              <FileTextOutlined style={{ fontSize: 32, color: "#fff", marginBottom: 12 }} />
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 12 }}>
                Nội dung Văn hóa
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {stats.totalContent}
              </Text>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpOutlined style={{ color: "#4ade80", fontSize: 14 }} />
              <Text style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>+{stats.contentGrowth}</Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11, marginLeft: 4 }}>trong tuần</Text>
            </div>
          </Card>
        </div>

        {/* Doanh thu - Nổi bật nhưng cùng kích thước */}
        <div style={{ flex: "1 1 0", minWidth: "180px" }}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              border: "2px solid rgba(255, 255, 255, 0.4)",
              background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)",
              boxShadow: "0 12px 40px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
            bodyStyle={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px", position: "relative", zIndex: 1 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 16px 50px rgba(255, 107, 107, 0.5), 0 0 30px rgba(255, 107, 107, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.2)";
            }}
          >
            {/* Glow effect background */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.15)",
                filter: "blur(30px)",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <DollarOutlined style={{ fontSize: 32, color: "#fff" }} />
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", fontSize: 13, fontWeight: 600 }}>
                  Doanh thu Tháng
                </Text>
              </div>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  display: "block",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                {stats.monthlyRevenue.toFixed(1)}M
              </Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14, marginTop: 4, fontWeight: 500 }}>
                VNĐ
              </Text>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <RiseOutlined style={{ color: "#4ade80", fontSize: 14 }} />
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>+{stats.revenueGrowth}%</Text>
              </div>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 11 }}>tháng trước</Text>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>
                  Doanh thu theo tháng
                </Title>
                <Select
                  defaultValue="2025"
                  style={{ width: 120 }}
                  size="large"
                >
                  <Select.Option value="2025">2025</Select.Option>
                  <Select.Option value="2024">2024</Select.Option>
                </Select>
              </div>
            }
            bodyStyle={{ padding: 24 }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B0000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B0000" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d9d9d9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d9d9d9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number | undefined) =>
                    value ? [`${value}M VNĐ`, "Doanh thu"] : ["", ""]
                  }
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu thực tế"
                  stroke="#8B0000"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
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
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            title={
              <Title level={5} style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>
                Phân bố Tour theo Tỉnh
              </Title>
            }
            bodyStyle={{ padding: 24 }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tourByProvinceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tourByProvinceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <Divider style={{ margin: "16px 0" }} />
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              {tourByProvinceData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 8,
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 3px ${item.color}20`,
                      }}
                    />
                    <Text style={{ color: "#374151", fontWeight: 500 }}>{item.name}</Text>
                  </div>
                  <Text strong style={{ color: "#1a1a1a", fontSize: 15 }}>
                    {item.value}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tables Section */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            title={
              <Title level={5} style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>
                Booking Gần đây
              </Title>
            }
            extra={
              <a
                href="/admin/bookings"
                style={{
                  color: "#8B0000",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Xem tất cả →
              </a>
            }
            bodyStyle={{ padding: 24 }}
          >
            <Table
              columns={bookingColumns}
              dataSource={recentBookings}
              pagination={false}
              size="middle"
              style={{ borderRadius: 8 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            title={
              <Title level={5} style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>
                Trạng thái Tour
              </Title>
            }
            extra={
              <a
                href="/admin/tours"
                style={{
                  color: "#8B0000",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Xem tất cả →
              </a>
            }
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {tourStatusData.map((item) => (
                <div
                  key={item.key}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <Text strong style={{ fontSize: 15, color: "#1a1a1a" }}>
                        {item.tour}
                      </Text>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                        {item.date}
                      </div>
                    </div>
                    <Tag
                      color={
                        item.status === "Open"
                          ? "success"
                          : item.status === "Near deadline"
                          ? "warning"
                          : "error"
                      }
                      style={{
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontWeight: 500,
                      }}
                    >
                      {item.status}
                    </Tag>
                  </div>
                  <Progress
                    percent={item.progress}
                    status={
                      item.progress >= 80
                        ? "success"
                        : item.progress >= 50
                        ? "active"
                        : "exception"
                    }
                    strokeColor={
                      item.progress >= 80
                        ? "#52c41a"
                        : item.progress >= 50
                        ? "#1890ff"
                        : "#ff4d4f"
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={{ fontSize: 13, color: "#6b7280" }}>
                    {item.participants} người tham gia
                  </Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
