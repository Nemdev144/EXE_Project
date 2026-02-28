import { FolderOpen, BookOpen, FileText, HelpCircle, type LucideIcon } from "lucide-react";
import styles from "./SummaryCards.module.scss";

export interface LearnSummaryStats {
  totalCategories: number;
  totalModules: number;
  totalLessons: number;
  totalQuizzes: number;
}

export interface SummaryCardConfig {
  key: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  accentClass: "indigo" | "emerald" | "rose" | "amber";
  subText: string;
}

interface LearnSummaryCardsProps {
  stats: LearnSummaryStats;
}

const SUBTEXT = "Cập nhật theo dữ liệu hiện tại";

function buildCardsConfig(stats: LearnSummaryStats): SummaryCardConfig[] {
  return [
    {
      key: "categories",
      title: "Danh mục",
      value: stats.totalCategories,
      icon: FolderOpen,
      accentClass: "indigo",
      subText: SUBTEXT,
    },
    {
      key: "modules",
      title: "Module",
      value: stats.totalModules,
      icon: BookOpen,
      accentClass: "emerald",
      subText: SUBTEXT,
    },
    {
      key: "lessons",
      title: "Bài học",
      value: stats.totalLessons,
      icon: FileText,
      accentClass: "rose",
      subText: SUBTEXT,
    },
    {
      key: "quizzes",
      title: "Quiz",
      value: stats.totalQuizzes,
      icon: HelpCircle,
      accentClass: "amber",
      subText: SUBTEXT,
    },
  ];
}

export default function LearnSummaryCards({ stats }: LearnSummaryCardsProps) {
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
