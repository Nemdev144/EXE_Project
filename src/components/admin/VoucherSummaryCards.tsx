import { Ticket, CheckCircle, XCircle, Percent, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface VoucherSummaryStats {
  total: number;
  active: number;
  inactive: number;
  totalUsage: number;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface VoucherSummaryCardsProps {
  stats: VoucherSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: VoucherSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "total",
      title: "Tổng voucher",
      value: stats.total,
      icon: Ticket,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "active",
      title: "Đang hoạt động",
      value: stats.active,
      icon: CheckCircle,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "inactive",
      title: "Đã tắt",
      value: stats.inactive,
      icon: XCircle,
      accentClass: "rose",
      subText: SUBTEXT,
    },
    {
      key: "usage",
      title: "Lượt sử dụng",
      value: stats.totalUsage,
      icon: Percent,
      accentClass: "amber",
      subText: SUBTEXT,
    },
  ];
}

export default function VoucherSummaryCards({ stats }: VoucherSummaryCardsProps) {
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
