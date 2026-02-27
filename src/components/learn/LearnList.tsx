/**
 * Learn – Trang danh sách module (gộp: LearnPageContent, CategoryFilter, LessonCard, LessonCardSkeleton, PromoBanner)
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { LearnCategory, LearnModule } from '../../types';
import '../../styles/pages/_learn.scss';
import '../../styles/components/_category-filter.scss';
import '../../styles/components/_lesson-card.scss';
import '../../styles/components/_loading.scss';
import '../../styles/components/_promo-banner.scss';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface LessonGroup {
  id: number;
  title: string;
  slug: string;
  /** Tên danh mục (hiển thị) */
  category: string;
  /** Slug danh mục (URL, filter) – từ API categories hoặc slugify(categoryName) */
  categorySlug: string;
  thumbnailUrl: string;
  lessonCount: number;
  totalDuration: number;
}

// ---------------------------------------------------------------------------
// CategoryFilter – dùng danh mục từ GET /api/learn/public/categories
// ---------------------------------------------------------------------------
interface CategoryFilterProps {
  categories: LearnCategory[];
  activeCategorySlug: string;
  onCategoryChange: (slug: string) => void;
}

function CategoryFilter({ categories, activeCategorySlug, onCategoryChange }: CategoryFilterProps) {
  const sorted = [...categories].sort((a, b) => a.orderIndex - b.orderIndex);
  return (
    <div className="category-filter">
      <button
        onClick={() => onCategoryChange('all')}
        className={`category-filter__btn ${activeCategorySlug === 'all' ? 'category-filter__btn--active' : ''}`}
      >
        Tất cả
      </button>
      {sorted.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          className={`category-filter__btn ${activeCategorySlug === cat.slug ? 'category-filter__btn--active' : ''}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonCard
// ---------------------------------------------------------------------------
interface LessonCardProps {
  lesson: LessonGroup;
  module?: LearnModule;
}

function LessonCard({ lesson, module }: LessonCardProps) {
  const lessonUrl = `/learn/${lesson.categorySlug || 'all'}/${lesson.slug}`;

  return (
    <Link to={lessonUrl} state={{ moduleData: module }} className="lesson-card">
      {lesson.thumbnailUrl ? (
        <div className="lesson-card__image">
          <img 
            src={lesson.thumbnailUrl} 
            alt={lesson.title}
            onError={(e) => {
              console.error('[LessonCard] Failed to load image:', lesson.thumbnailUrl);
              (e.target as HTMLImageElement).src = '/nen.png';
            }}
          />
        </div>
      ) : (
        <div className="lesson-card__image">
          <img src="/nen.png" alt={lesson.title} />
        </div>
      )}
      <div className="lesson-card__content">
        <h3 className="lesson-card__title">{lesson.title}</h3>
        <div className="lesson-card__meta">
          {typeof lesson.lessonCount === 'number' && (
            <span className="lesson-card__count">{lesson.lessonCount} bài</span>
          )}
          {typeof lesson.totalDuration === 'number' && (
            <span className="lesson-card__duration">{lesson.totalDuration} phút</span>
          )}
        </div>
        <div className="lesson-card__progress">
          <div className="lesson-card__progress-bar" />
        </div>
        <div className="lesson-card__button">Học ngay</div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// LessonCardSkeleton
// ---------------------------------------------------------------------------
function LessonCardSkeleton() {
  return (
    <div className="loading-skeleton__card">
      <div className="loading-skeleton__image" />
      <div className="loading-skeleton__content">
        <div className="loading-skeleton__title" />
        <div className="loading-skeleton__meta">
          <div className="loading-skeleton__meta-item" />
          <div className="loading-skeleton__meta-item" />
        </div>
        <div className="loading-skeleton__progress">
          <div className="loading-skeleton__progress-bar" />
        </div>
        <div className="loading-skeleton__button" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PromoBanner
// ---------------------------------------------------------------------------
function PromoBanner() {
  return (
    <div className="promo-banner">
      <Sparkles size={20} className="promo-banner__icon" />
      <span className="promo-banner__text">
        Học xong nhận Chứng chỉ mini + ưu đãi giảm 5% tour
      </span>
      <Sparkles size={20} className="promo-banner__icon" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// LearnPageContent (default export)
// ---------------------------------------------------------------------------
interface LearnPageContentProps {
  lessonGroups: LessonGroup[];
  categories: LearnCategory[];
  modules?: LearnModule[];
  loading: boolean;
}

export default function LearnPageContent({ lessonGroups, categories, modules = [], loading }: LearnPageContentProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');

  const filteredLessons =
    activeCategorySlug === 'all'
      ? lessonGroups
      : lessonGroups.filter((group) => group.categorySlug === activeCategorySlug);

  return (
    <div className="learn-page">
      <div className="learn-page__container">
        <div className="learn-page__header">
          <h1 className="learn-page__title">HỌC NHANH VĂN HOÁ TÂY NGUYÊN</h1>
          <p className="learn-page__subtitle">
            3 phút/bài - Tìm hiểu về văn hóa đặc sắc của vùng đất Tây Nguyên
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          activeCategorySlug={activeCategorySlug}
          onCategoryChange={setActiveCategorySlug}
        />

        <PromoBanner />

        {loading ? (
          <div className="learn-page__loading-container">
            <div className="loading-skeleton">
              {[...Array(6)].map((_, index) => (
                <LessonCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="learn-page__empty">
            <p>Chưa có bài học nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="learn-page__grid">
            {filteredLessons.map((group) => (
              <LessonCard key={group.id} lesson={group} module={modules.find((m) => m.id === group.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
