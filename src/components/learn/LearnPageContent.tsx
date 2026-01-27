import { useState } from 'react';
import LessonCardSkeleton from './LessonCardSkeleton';
import LessonCard from './LessonCard';
import CategoryFilter from './CategoryFilter';
import PromoBanner from './PromoBanner';
import '../../styles/pages/_learn.scss';

export interface LessonGroup {
  id: number;
  title: string;
  slug: string;
  category: string;
  thumbnailUrl: string;
  lessonCount: number;
  totalDuration: number; // in minutes
}

interface LearnPageContentProps {
  lessonGroups: LessonGroup[];
  loading: boolean;
}

export default function LearnPageContent({ lessonGroups, loading }: LearnPageContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Cồng chiêng', 'Lễ hội', 'Ẩm thực', 'Trang phục', 'Truyền thuyết'];

  const filteredLessons = activeCategory === 'all' 
    ? lessonGroups 
    : lessonGroups.filter(group => group.category === activeCategory);

  return (
    <div className="learn-page">
      <div className="learn-page__container">
        {/* Header */}
        <div className="learn-page__header">
          <h1 className="learn-page__title">HỌC NHANH VĂN HOÁ TÂY NGUYÊN</h1>
          <p className="learn-page__subtitle">
            3 phút/bài - Tìm hiểu về văn hóa đặc sắc của vùng đất Tây Nguyên
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Promotional Banner */}
        <PromoBanner />

        {/* Lessons Grid */}
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
              <LessonCard key={group.id} lesson={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
