import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Table,
  Tag,
  Spin,
  Alert,
  Typography,
  Select,
  Space,
  Modal,
  Descriptions,
  DatePicker,
  Calendar,
  Button,
  Badge,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import {
  getMyArtisan,
  getMySchedules,
  type GetMySchedulesOptions,
} from "../../services/artisanPanelApi";
import type { AdminTourSchedule, TourScheduleStatus } from "../../services/adminApi";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/** Hôm nay + 2 ngày sau (đủ 3 ngày liên tiếp) — hiện badge "Sắp tới" */
function isWithinNext3Days(tourDateStr: string | undefined): boolean {
  if (!tourDateStr) return false;
  const d = dayjs(tourDateStr).startOf("day");
  const today = dayjs().startOf("day");
  const last = today.add(2, "day");
  return !d.isBefore(today, "day") && !d.isAfter(last, "day");
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: "Đã lên lịch", color: "blue" },
  CANCELLED: { label: "Đã hủy", color: "red" },
  COMPLETED: { label: "Hoàn thành", color: "green" },
  FULL: { label: "Đã đầy", color: "orange" },
};

type StatusFilter = "ALL" | TourScheduleStatus;

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "FULL", label: "Đã đầy" },
];

function formatStartTime(
  st?: { hour?: number; minute?: number } | string
): string {
  if (!st) return "-";
  let h: number, m: number;
  if (typeof st === "string") {
    const parts = st.split(":").map(Number);
    h = parts[0] ?? 0;
    m = parts[1] ?? 0;
  } else {
    h = st.hour ?? 0;
    m = st.minute ?? 0;
  }
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? "AM" : "PM";
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

function pickStr(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

function pickNum(v: unknown): number | undefined {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

/** Popup gọn: chỉ thông tin vận hành lịch + vài số liệu tour từ API (không mô tả marketing / ảnh / bio nghệ nhân). */
function ScheduleDetailModal({
  open,
  schedule,
  onClose,
}: {
  open: boolean;
  schedule: AdminTourSchedule | null;
  onClose: () => void;
}) {
  if (!schedule) return null;

  const tour = schedule.tour as Record<string, unknown>;
  const province = tour.province as Record<string, unknown> | undefined;

  const tourTitle = pickStr(tour.title) ?? "Chi tiết lịch";
  const tourId = pickNum(tour.id);
  const tourSlug = pickStr(tour.slug);
  const tourStatus = pickStr(tour.status);
  const provName = pickStr(province?.name);
  const totalBookings = pickNum(tour.totalBookings);
  const averageRating = pickNum(tour.averageRating);
  const durationHours = pickNum(tour.durationHours);
  const maxParticipants = pickNum(tour.maxParticipants);

  const tourPrice = pickNum(tour.price);
  const curPrice =
    schedule.currentPrice ??
    pickNum((schedule as Record<string, unknown>).price) ??
    tourPrice;
  const disc = pickNum(schedule.discountPercent);

  const booked = schedule.bookedSlots ?? 0;
  const maxS = schedule.maxSlots ?? 0;
  const remaining = Math.max(0, maxS - booked);

  const stCfg =
    STATUS_CONFIG[schedule.status ?? ""] ?? {
      label: String(schedule.status ?? "-"),
      color: "default",
    };

  return (
    <Modal
      title={tourTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnClose
    >
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Mã lịch (ID)">{schedule.id}</Descriptions.Item>
        {tourId != null && (
          <Descriptions.Item label="Mã tour (ID)">{tourId}</Descriptions.Item>
        )}
        {tourSlug && (
          <Descriptions.Item label="Slug tour">{tourSlug}</Descriptions.Item>
        )}
        {provName && (
          <Descriptions.Item label="Tỉnh">{provName}</Descriptions.Item>
        )}
        {tourStatus && (
          <Descriptions.Item label="Trạng thái tour (API)">
            <Tag>{tourStatus}</Tag>
          </Descriptions.Item>
        )}
        {(durationHours != null || maxParticipants != null) && (
          <Descriptions.Item label="Gói tour (rút gọn)">
            <Space size="middle" wrap>
              {durationHours != null && <Text>{durationHours} giờ</Text>}
              {maxParticipants != null && <Text>Tối đa {maxParticipants} khách/buổi</Text>}
            </Space>
          </Descriptions.Item>
        )}
        {totalBookings != null && (
          <Descriptions.Item label="Tổng booking (tour)">
            {totalBookings}
          </Descriptions.Item>
        )}
        {averageRating != null && (
          <Descriptions.Item label="Đánh giá TB (tour)">
            {averageRating.toFixed(1)} / 5
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Ngày chạy">
          {schedule.tourDate
            ? dayjs(schedule.tourDate).format("DD/MM/YYYY")
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Giờ bắt đầu">
          {formatStartTime(schedule.startTime)}
        </Descriptions.Item>
        <Descriptions.Item label="Đặt / Tối đa">
          {booked} / {maxS}
        </Descriptions.Item>
        <Descriptions.Item label="Slot còn lại">
          <Text strong>{remaining}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Giá buổi này">
          {curPrice != null && !Number.isNaN(curPrice)
            ? `${Number(curPrice).toLocaleString("vi-VN")} ₫`
            : "—"}
        </Descriptions.Item>
        {disc != null && disc > 0 && (
          <Descriptions.Item label="Giảm giá (%)">{disc}%</Descriptions.Item>
        )}
        <Descriptions.Item label="Trạng thái lịch">
          <Tag color={stCfg.color}>{stCfg.label}</Tag>
        </Descriptions.Item>
        {schedule.createdAt && (
          <Descriptions.Item label="Tạo lịch">
            {dayjs(schedule.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
}

export default function ArtisanSchedule() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artisanId, setArtisanId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<AdminTourSchedule[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  /** Lọc bảng theo khoảng ngày (tourDate); null = không lọc */
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );
  const [detailSchedule, setDetailSchedule] = useState<AdminTourSchedule | null>(
    null
  );

  const schedulesByDate = useMemo(() => {
    const m = new Map<string, AdminTourSchedule[]>();
    for (const s of schedules) {
      if (!s.tourDate) continue;
      const k = dayjs(s.tourDate).format("YYYY-MM-DD");
      const arr = m.get(k) ?? [];
      arr.push(s);
      m.set(k, arr);
    }
    return m;
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    if (
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      return schedules;
    }
    const start = dateRange[0].startOf("day");
    const end = dateRange[1].startOf("day");
    return schedules.filter((s) => {
      if (!s.tourDate) return false;
      const d = dayjs(s.tourDate).startOf("day");
      return !d.isBefore(start, "day") && !d.isAfter(end, "day");
    });
  }, [schedules, dateRange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const myArtisan = await getMyArtisan();
        if (cancelled) return;
        if (!myArtisan) {
          setError("Không tìm thấy hồ sơ nghệ nhân. Vui lòng liên hệ Admin.");
          setArtisanId(null);
          setSchedules([]);
          if (!cancelled) setLoading(false);
          return;
        }
        setArtisanId(myArtisan.id);
        /* loading: chờ loadSchedules (effect 2) */
      } catch (err) {
        if (cancelled) return;
        console.error("[ArtisanSchedule]", err);
        setError("Không thể tải lịch trình.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSchedules = useCallback(async () => {
    if (artisanId == null) return;
    setLoading(true);
    setError(null);
    try {
      const opts: GetMySchedulesOptions | undefined =
        statusFilter === "ALL" ? undefined : { status: statusFilter };
      const list = await getMySchedules(artisanId, opts);
      setSchedules(list);
    } catch (err) {
      console.error("[ArtisanSchedule] schedules", err);
      setError("Không thể tải lịch trình.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [artisanId, statusFilter]);

  useEffect(() => {
    if (artisanId == null) return;
    loadSchedules();
  }, [artisanId, loadSchedules]);

  const columns: ColumnsType<AdminTourSchedule> = [
    {
      title: "Tour",
      key: "tour",
      width: 260,
      ellipsis: true,
      render: (_, s) => {
        const soon = isWithinNext3Days(s.tourDate);
        return (
          <Space size={8} wrap>
            {soon && (
              <Tag
                icon={<ClockCircleOutlined />}
                color="magenta"
                style={{ marginInlineEnd: 0 }}
              >
                Sắp tới
              </Tag>
            )}
            <Text strong style={{ color: "#262626" }}>
              {s.tour?.title ?? "-"}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Ngày",
      dataIndex: "tourDate",
      key: "date",
      width: 110,
      render: (val: string) => (val ? dayjs(val).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Giờ",
      key: "time",
      width: 100,
      render: (_, s) => formatStartTime(s.startTime),
    },
    {
      title: "Slots",
      key: "slots",
      width: 90,
      render: (_, s) => (
        <Text type="secondary">
          {s.bookedSlots ?? 0}/{s.maxSlots ?? 0}
        </Text>
      ),
    },
    {
      title: "Giá",
      key: "price",
      width: 110,
      render: (_, s) => {
        const p =
          s.currentPrice ?? (s as { price?: number }).price ?? s.tour?.price;
        const n = typeof p === "string" ? parseFloat(p) : Number(p ?? 0);
        return (
          <Text>
            {Number.isNaN(n) ? "-" : `${n.toLocaleString("vi-VN")} ₫`}
          </Text>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (st: string) => {
        const cfg = STATUS_CONFIG[st ?? ""] ?? {
          label: st ?? "-",
          color: "default",
        };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
  ];

  if (loading && artisanId === null && !error) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "#666" }}>Đang tải lịch trình...</p>
      </div>
    );
  }

  if (error && artisanId === null) {
    return (
      <Alert
        type="warning"
        message={error}
        showIcon
        description="Bạn có thể cần liên hệ Admin để được gắn tài khoản với hồ sơ nghệ nhân."
      />
    );
  }

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 600, color: "#1a1a1a" }}>
          Lịch trình của tôi
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Lọc theo trạng thái (API) và theo ngày. Tag{" "}
          <Tag icon={<ClockCircleOutlined />} color="magenta">
            Sắp tới
          </Tag>{" "}
          = lịch trong 3 ngày tới (hôm nay + 2 ngày). Bấm dòng để xem chi tiết.
        </Text>
      </header>

      <Card
        style={{
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Space style={{ marginBottom: 16 }} wrap align="center">
          <Text type="secondary">Trạng thái:</Text>
          <Select
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
            style={{ width: 200 }}
            options={STATUS_FILTER_OPTIONS}
          />
          <Text type="secondary">Lịch chạy (ngày):</Text>
          <RangePicker
            value={dateRange}
            onChange={(d) => setDateRange(d)}
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            allowEmpty={[true, true]}
          />
          <Button
            type="link"
            disabled={!dateRange?.[0] && !dateRange?.[1]}
            onClick={() => setDateRange(null)}
          >
            Xóa lọc ngày
          </Button>
        </Space>

        <div style={{ marginBottom: 20, width: "100%" }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Lịch theo tháng
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: 12, display: "block", marginBottom: 12 }}
          >
            Badge đỏ = số buổi trong ngày. &quot;Sắp tới&quot; = có buổi trong 3 ngày tới. Bấm
            một ngày để lọc bảng. Gợi ý: dùng thêm{" "}
            <b>Lịch chạy (ngày)</b> hoặc bấm ngày trên lịch.
          </Text>
          <div
            className="artisan-schedule-calendar"
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: 16,
              background: "linear-gradient(180deg, #e8eaef 0%, #e2e5eb 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 14px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 12,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
            >
            <Calendar
              fullscreen
              style={{ width: "100%" }}
              onSelect={(d) => {
                setDateRange([d, d]);
              }}
              fullCellRender={(current, info) => {
                if (info.type !== "date") {
                  return info.originNode;
                }
                const list =
                  schedulesByDate.get(current.format("YYYY-MM-DD")) ?? [];
                const hasSoon = list.some((x) =>
                  isWithinNext3Days(x.tourDate)
                );
                return (
                  <div
                    className="ant-picker-cell-inner"
                    style={{
                      minHeight: 72,
                      padding: "4px 6px",
                      borderRadius: 6,
                      background: hasSoon
                        ? "rgba(235, 47, 150, 0.08)"
                        : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 6,
                      }}
                    >
                      {/* Chỉ dùng originNode — không gọi current.date() để tránh trùng với render mặc định */}
                      <div style={{ flex: 1, minWidth: 0 }}>{info.originNode}</div>
                      {list.length > 0 && (
                        <Badge
                          count={list.length}
                          size="small"
                          style={{ backgroundColor: "#8b0000" }}
                        />
                      )}
                    </div>
                    {hasSoon && (
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#c41d7f",
                          marginTop: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        Sắp tới
                      </div>
                    )}
                    {list.length > 0 && (
                      <ul
                        style={{
                          margin: "6px 0 0",
                          padding: 0,
                          listStyle: "none",
                          fontSize: 10,
                          lineHeight: 1.25,
                          color: "#595959",
                        }}
                      >
                        {list.slice(0, 2).map((sch) => (
                          <li
                            key={sch.id}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {sch.tour?.title ?? "Tour"}
                          </li>
                        ))}
                        {list.length > 2 && (
                          <li style={{ color: "#8c8c8c" }}>
                            +{list.length - 2}…
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              }}
            />
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredSchedules}
          rowKey="id"
          loading={loading && artisanId !== null}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t) => `Tổng ${t} lịch`,
          }}
          size="middle"
          locale={{ emptyText: "Chưa có lịch trình" }}
          onRow={(record) => ({
            onClick: () => setDetailSchedule(record),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <ScheduleDetailModal
        open={detailSchedule != null}
        schedule={detailSchedule}
        onClose={() => setDetailSchedule(null)}
      />
    </div>
  );
}
