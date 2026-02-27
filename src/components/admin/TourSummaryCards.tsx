import { MapPin, BadgeCheck, UserMinus, Clock, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface TourSummaryStats {
  total: number;
  open: number;
  notEnough: number;
  nearDeadline: number;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface TourSummaryCardsProps {
  stats: TourSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: TourSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "total",
      title: "Tổng Tour",
      value: stats.total,
      icon: MapPin,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "open",
      title: "Mở đăng ký",
      value: stats.open,
      icon: BadgeCheck,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "notEnough",
      title: "Không đủ người",
      value: stats.notEnough,
      icon: UserMinus,
      accentClass: "rose",
      subText: SUBTEXT,
    },
    {
      key: "nearDeadline",
      title: "Gần hết hạn",
      value: stats.nearDeadline,
      icon: Clock,
      accentClass: "amber",
      subText: SUBTEXT,
    },
  ];
}

export default function TourSummaryCards({ stats }: TourSummaryCardsProps) {
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
