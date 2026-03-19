import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { TourArtisan, CultureItem } from '../../../types';

interface NarrativeBlock {
  title?: string;
  content?: string;
  imageUrl?: string;
}

function parseNarrative(content?: string): NarrativeBlock[] {
  if (!content?.trim()) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface FourBlockGridProps {
  artisan: TourArtisan | null;
  highlights: CultureItem[];
  foodItems: CultureItem[];
  bestSeason?: string;
  provinceName?: string;
  /** Chỉ render Thời điểm đẹp nhất (dùng trong cột có sidebar) */
  onlyTop?: boolean;
  /** Chỉ render 3 section Địa điểm, Nghệ nhân, Ẩm thực (dùng full width) */
  onlySections?: boolean;
}

export default function FourBlockGrid({
  artisan,
  highlights,
  foodItems,
  bestSeason,
  provinceName,
  onlyTop,
  onlySections,
}: FourBlockGridProps) {
  const showTop = !onlySections;
  const showSections = !onlyTop;

  return (
    <div className="td-four-block">
      {showTop && (
        <div className="td-four-block__top td-four-block__top--framed">
          <h3 className="td-four-block__top-title">Thời điểm đẹp nhất</h3>
          <p className="td-four-block__top-value">{bestSeason || 'Quanh năm'}</p>
        </div>
      )}

      {showSections && (
        <>
      {/* 1. Địa điểm nổi bật - full width, vertical */}
      <section className="td-four-block__section">
        <h4 className="td-four-block__section-title">Địa điểm nổi bật</h4>
        <div className="td-four-block__highlights-grid">
          {highlights.length > 0 ? (
            highlights.map((item) => (
              <article key={item.id} className="td-four-block__card td-four-block__card--hover">
                <div className="td-four-block__card-image">
                  <img src={item.thumbnailUrl || '/nen.png'} alt={item.title} />
                </div>
                <div className="td-four-block__card-overlay">
                  <h3 className="td-four-block__card-title">{item.title}</h3>
                  {provinceName && (
                    <span className="td-four-block__card-meta">
                      <MapPin size={14} /> {provinceName}
                    </span>
                  )}
                  {item.description && (
                    <p className="td-four-block__card-desc">{item.description}</p>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="td-four-block__empty">Đang cập nhật...</p>
          )}
        </div>
      </section>

      {/* 2. Nghệ nhân - full width, vertical */}
      <section className="td-four-block__section">
        <h4 className="td-four-block__section-title">Nghệ nhân</h4>
        {artisan ? (
          <div className="td-four-block__artisan">
            <div className="td-four-block__artisan-header">
              <img
                src={artisan.profileImageUrl || '/nen.png'}
                alt={artisan.fullName}
                className="td-four-block__artisan-avatar"
              />
              <div className="td-four-block__artisan-info">
                <h3 className="td-four-block__artisan-name">{artisan.fullName}</h3>
                {artisan.heroSubtitle && (
                  <p className="td-four-block__artisan-subtitle">{artisan.heroSubtitle}</p>
                )}
                <div className="td-four-block__artisan-tags">
                  {artisan.specialization && (
                    <span className="td-four-block__tag">{artisan.specialization}</span>
                  )}
                  {artisan.ethnicity && (
                    <span className="td-four-block__tag">{artisan.ethnicity}</span>
                  )}
                </div>
                {artisan.workshopAddress && (
                  <p className="td-four-block__artisan-address">
                    <MapPin size={14} /> {artisan.workshopAddress}
                  </p>
                )}
              </div>
            </div>
            {artisan.bio && (
              <div className="td-four-block__artisan-bio">
                <p>{artisan.bio}</p>
              </div>
            )}
            {parseNarrative(artisan.narrativeContent).length > 0 && (
              <div className="td-four-block__artisan-narrative">
                {parseNarrative(artisan.narrativeContent).slice(0, 2).map((block, i) => (
                  <div key={i} className="td-four-block__narrative-block">
                    {block.imageUrl && (
                      <img src={block.imageUrl} alt={block.title ?? ''} className="td-four-block__narrative-img" />
                    )}
                    {block.title && <h4>{block.title}</h4>}
                    {block.content && <p>{block.content}</p>}
                  </div>
                ))}
              </div>
            )}
            {artisan.id && (
              <Link to={`/artisans/${artisan.id}`} className="td-four-block__link">
                Xem chi tiết nghệ nhân
              </Link>
            )}
          </div>
        ) : (
          <p className="td-four-block__empty">Đang cập nhật...</p>
        )}
      </section>

      {/* 3. Ẩm thực địa phương - full width, vertical */}
      <section className="td-four-block__section">
        <h4 className="td-four-block__section-title">Ẩm thực địa phương</h4>
        <div className="td-four-block__food-grid">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <article key={item.id} className="td-four-block__card td-four-block__card--hover">
                <div className="td-four-block__card-image">
                  <img src={item.thumbnailUrl || '/nen.png'} alt={item.title} />
                </div>
                <div className="td-four-block__card-overlay">
                  <h3 className="td-four-block__card-title">{item.title}</h3>
                  {item.description && (
                    <p className="td-four-block__card-desc">{item.description}</p>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="td-four-block__empty">Đang cập nhật...</p>
          )}
        </div>
      </section>
        </>
      )}
    </div>
  );
}
