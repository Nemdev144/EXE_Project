import { Users, BadgeCheck, UserX, Star, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface ArtisanSummaryStats {
  total: number;
  active: number;
  inactive: number;
  avgRating: string;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface ArtisanSummaryCardsProps {
  stats: ArtisanSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: ArtisanSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "total",
      title: "Tổng Nghệ nhân",
      value: stats.total,
      icon: Users,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "active",
      title: "Đang hoạt động",
      value: stats.active,
      icon: BadgeCheck,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "inactive",
      title: "Ngừng hoạt động",
      value: stats.inactive,
      icon: UserX,
      accentClass: "rose",
      subText: SUBTEXT,
    },
    {
      key: "rating",
      title: "Đánh giá TB",
      value: `${stats.avgRating} / 5`,
      icon: Star,
      accentClass: "amber",
      subText: SUBTEXT,
    },
  ];
}

export default function ArtisanSummaryCards({ stats }: ArtisanSummaryCardsProps) {
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
