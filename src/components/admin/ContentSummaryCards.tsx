import { FileText, Edit3, CheckCircle, Archive, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface ContentSummaryStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface ContentSummaryCardsProps {
  stats: ContentSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: ContentSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "total",
      title: "Tổng mục văn hóa",
      value: stats.total,
      icon: FileText,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "draft",
      title: "Bản nháp",
      value: stats.draft,
      icon: Edit3,
      accentClass: "amber",
      subText: SUBTEXT,
    },
    {
      key: "published",
      title: "Đã xuất bản",
      value: stats.published,
      icon: CheckCircle,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "archived",
      title: "Đã lưu trữ",
      value: stats.archived,
      icon: Archive,
      accentClass: "rose",
      subText: SUBTEXT,
    },
  ];
}

export default function ContentSummaryCards({ stats }: ContentSummaryCardsProps) {
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
