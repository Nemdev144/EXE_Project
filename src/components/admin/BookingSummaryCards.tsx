import { CalendarCheck, BadgeCheck, XCircle, Banknote, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface BookingSummaryStats {
  total: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: string;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface BookingSummaryCardsProps {
  stats: BookingSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: BookingSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "total",
      title: "Tổng Booking",
      value: stats.total,
      icon: CalendarCheck,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "confirmed",
      title: "Đã xác nhận",
      value: stats.confirmed,
      icon: BadgeCheck,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "cancelled",
      title: "Đã hủy",
      value: stats.cancelled,
      icon: XCircle,
      accentClass: "rose",
      subText: SUBTEXT,
    },
    {
      key: "revenue",
      title: "Doanh thu",
      value: stats.totalRevenue,
      icon: Banknote,
      accentClass: "amber",
      subText: SUBTEXT,
    },
  ];
}

export default function BookingSummaryCards({ stats }: BookingSummaryCardsProps) {
  const cardsConfig = buildCardsConfig(stats);

  return (
    <div className={styles.summaryCards}>
      {cardsConfig.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.key} className={styles.summaryCards__card}>
            <div
              className={`${styles.summaryCards__iconWrap} ${styles[`summaryCards__iconWrap--${card.accentClass}`]}`}
            >
              <IconComponent className={styles.summaryCards__icon} size={22} strokeWidth={2} />
            </div>
            <div className={styles.summaryCards__content}>
              <div className={styles.summaryCards__title}>{card.title}</div>
              <div className={styles.summaryCards__value}>{card.value}</div>
              <div className={styles.summaryCards__subtext}>{card.subText}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
