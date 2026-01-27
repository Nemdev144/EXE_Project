'use client';

import { Tour } from '@/lib/types';
import { Star, Clock, Users, MapPin } from 'lucide-react';

interface TourExperienceSectionProps {
  tours: Tour[];
}

export default function TourExperienceSection({ tours }: TourExperienceSectionProps) {
  const displayTours = tours.slice(0, 4);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <section className="section-container bg-[var(--color-primary)]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="tour-section-title text-4xl md:text-5xl text-center text-white mb-4">
          TOUR TRẢI NGHIỆM VĂN HÓA
        </h2>
        <p className="text-center text-white/80 max-w-2xl mx-auto mb-12">
          Khám phá văn hóa Tây Nguyên qua những chuyến tour trải nghiệm độc đáo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTours.map((tour) => (
            <div
              key={tour.id}
              className="stamp-card group overflow-hidden"
              style={{
                borderColor: 'white',
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${tour.thumbnailUrl}')`,
                  }}
                  role="img"
                  aria-label={tour.title}
                />
                {tour.provinceName && (
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-primary)]">
                    {tour.provinceName}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-base mb-2 text-[var(--color-text)] line-clamp-2 h-12">
                  {tour.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--color-text-light)] mb-3 line-clamp-2">
                  {tour.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">{renderStars(tour.averageRating)}</div>
                  <span className="text-xs font-semibold text-[var(--color-text)]">
                    {tour.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[var(--color-text-light)]">
                    ({tour.totalReviews} {tour.totalReviews === 1 ? 'đánh giá' : 'đánh giá'})
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 py-3 border-y border-gray-200">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span className="text-[var(--color-text-light)]">{tour.durationHours}h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span className="text-[var(--color-text-light)]">
                      Max {tour.maxParticipants}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[var(--color-text-light)]">
                    Giá:
                  </span>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    {formatPrice(tour.price)}
                  </span>
                </div>

                {/* Button */}
                <button className="btn btn-primary w-full text-sm font-semibold">
                  Đặt ngay
                </button>
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white text-lg">Chưa có tour nào</p>
          </div>
        )}
      </div>
    </section>
  );
}
