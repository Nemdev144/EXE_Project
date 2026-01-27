import { useEffect, useMemo, useState } from 'react';
import { Star, Clock, Users } from 'lucide-react';
import { getPublicTours } from '../../services/api';
import type { Tour } from '../../types';
import '../../styles/components/tourExperienceSection.scss';

interface TourExperienceSectionProps {
  tours?: Tour[];
  limit?: number;
}

const DEFAULT_LIMIT = 4;

export default function TourExperienceSection({
  tours,
  limit = DEFAULT_LIMIT,
}: TourExperienceSectionProps) {
  const [tourItems, setTourItems] = useState<Tour[]>(tours ?? []);
  const [loading, setLoading] = useState(!(tours && tours.length > 0));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tours && tours.length > 0) {
      setTourItems(tours);
    }
  }, [tours]);

  useEffect(() => {
    let mounted = true;

    const fetchTours = async () => {
      if (!tours || tours.length === 0) {
        setLoading(true);
      }
      setError(null);

      try {
        console.log('[TourExperienceSection] 🚀 Fetching tours from /api/tours/public...');
        const data = await getPublicTours();
        console.log('[TourExperienceSection] ✅ API data received:', {
          tours: data?.length ?? 0,
        });
        if (!mounted) return;
        const fetchedTours = data ?? [];
        if (fetchedTours.length > 0 || !tours || tours.length === 0) {
          setTourItems(fetchedTours);
        }
      } catch (err) {
        console.error('[TourExperienceSection] ❌ API error:', err);
        if (!mounted) return;
        setError('Không thể tải dữ liệu tour trải nghiệm');
      } finally {
        if (mounted) {
          console.log('[TourExperienceSection] 🏁 Fetch completed');
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => {
      mounted = false;
    };
  }, [limit, tours]);

  const displayTours = useMemo(
    () => tourItems.slice(0, Math.max(1, limit)),
    [tourItems, limit]
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`tour-experience__star ${
          i < Math.floor(rating)
            ? 'tour-experience__star--active'
            : 'tour-experience__star--inactive'
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

  const hasTours = displayTours.length > 0;
  const shouldShowError = Boolean(error) && !loading && !hasTours;

  return (
    <section className="section-container tour-experience">
      <div className="tour-experience__container">
        <div className="tour-experience__header">
          <h2 className="tour-experience__title tour-section-title">
            TOUR TRẢI NGHIỆM VĂN HÓA
          </h2>
          <p className="tour-experience__subtitle">
            Khám phá văn hóa Tây Nguyên qua những chuyến tour trải nghiệm độc đáo
          </p>
        </div>

        {loading && (
          <div className="tour-experience__loading">
            <div className="tour-experience__spinner" aria-hidden="true" />
            <p>Đang tải tour trải nghiệm...</p>
          </div>
        )}

        {shouldShowError && (
          <div className="tour-experience__error">
            <p>{error}</p>
          </div>
        )}

        {hasTours && (
          <div className="tour-experience__grid">
            {displayTours.map((tour) => {
              const ratingValue = tour.averageRating ?? 0;
              const ratingCount = tour.totalReviews ?? 0;

              return (
                <article key={tour.id} className="stamp-card tour-experience__card">
                <div className="tour-experience__image-wrapper">
                  <div
                    className="tour-experience__image"
                    style={{
                      backgroundImage: `url('${tour.thumbnailUrl}')`,
                    }}
                    role="img"
                    aria-label={tour.title}
                  />
                  {tour.provinceName && (
                    <div className="tour-experience__badge">{tour.provinceName}</div>
                  )}
                </div>

                <div className="tour-experience__content">
                  <h3 className="tour-experience__card-title">{tour.title}</h3>
                  <p className="tour-experience__description">{tour.description}</p>

                  <div className="tour-experience__rating">
                    {ratingCount > 0 ? (
                      <>
                        <div className="tour-experience__stars">
                          {renderStars(ratingValue)}
                        </div>
                        <span className="tour-experience__rating-value">
                          {ratingValue.toFixed(1)}
                        </span>
                        <span className="tour-experience__rating-count">
                          ({ratingCount} đánh giá)
                        </span>
                      </>
                    ) : (
                      <span className="tour-experience__rating-empty">
                        Chưa có đánh giá
                      </span>
                    )}
                  </div>

                  <div className="tour-experience__details">
                    <div className="tour-experience__detail">
                      <Clock className="tour-experience__detail-icon" />
                      <span>{tour.durationHours}h</span>
                    </div>
                    <div className="tour-experience__detail">
                      <Users className="tour-experience__detail-icon" />
                      <span>Max {tour.maxParticipants}</span>
                    </div>
                  </div>

                  <div className="tour-experience__price">
                    <span className="tour-experience__price-label">Giá:</span>
                    <span className="tour-experience__price-value">
                      {formatPrice(tour.price)}
                    </span>
                  </div>

                  <button className="btn btn-primary tour-experience__button">
                    Đặt ngay
                  </button>
                </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !hasTours && (
          <div className="tour-experience__empty">
            <p>Chưa có tour nào</p>
          </div>
        )}
      </div>
    </section>
  );
}
