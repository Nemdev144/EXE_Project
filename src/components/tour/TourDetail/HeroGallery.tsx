import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Calendar } from 'lucide-react';
import type { Tour } from '../../../types';
import { parseImages, renderStars } from './utils';

interface HeroGalleryProps {
  tour: Tour;
  provinceName?: string;
  provinceId?: number;
}

export default function HeroGallery({ tour, provinceName, provinceId }: HeroGalleryProps) {
  const images = parseImages(tour.images);
  const allImages = tour.thumbnailUrl && images.length === 0
    ? [tour.thumbnailUrl]
    : images.length > 0
      ? images
      : [tour.thumbnailUrl || '/nen.png'];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <section className="td-hero">
      <div className="td-hero__gallery">
        <img
          className="td-hero__image"
          src={allImages[currentIndex]}
          alt={`${tour.title} - ảnh ${currentIndex + 1}`}
        />
        <div className="td-hero__overlay">
          <div className="td-hero__overlay-content">
            {provinceName && (
              <Link
                to={provinceId ? `/tours?province=${provinceId}` : '/tours'}
                className="td-hero__location"
              >
                {provinceName}
              </Link>
            )}
            <h1 className="td-hero__title">{tour.title}</h1>
            <div className="td-hero__meta">
              {tour.averageRating > 0 && (
                <span className="td-hero__rating">
                  {renderStars(tour.averageRating, `hero-${tour.id}`)}
                  <span>{tour.averageRating.toFixed(1)}</span>
                </span>
              )}
              {tour.totalBookings != null && tour.totalBookings > 0 && (
                <span className="td-hero__bookings">{tour.totalBookings} đặt tour</span>
              )}
            </div>
            <Link to={`/tours/${tour.id}/booking`} className="td-hero__cta">
              <Calendar size={18} />
              Đặt tour ngay
            </Link>
          </div>
        </div>
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              className="td-hero__nav td-hero__nav--prev"
              onClick={goPrev}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              className="td-hero__nav td-hero__nav--next"
              onClick={goNext}
              aria-label="Ảnh sau"
            >
              <ChevronRight size={28} />
            </button>
            <span className="td-hero__counter">{currentIndex + 1} / {allImages.length}</span>
            <div className="td-hero__dots">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`td-hero__dot ${i === currentIndex ? 'td-hero__dot--active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Xem ảnh ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
