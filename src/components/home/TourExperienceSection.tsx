import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Tag } from 'lucide-react';
import { getPublicTours } from '../../services/api';
import type { Tour } from '../../types';
import '../../styles/components/tourExperienceSection.scss';

interface TourExperienceSectionProps {
  tours?: Tour[];
  limit?: number;
}

const DEFAULT_LIMIT = 3;

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

  const formatPrice = (value?: number) => {
    if (!value && value !== 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const buildImageUrl = (tour: Tour) => {
    if (tour.thumbnailUrl) return tour.thumbnailUrl;
    if (tour.images && tour.images.length > 0) return tour.images[0];
    return '/nen.png';
  };

  const formatDuration = (hours: number) => {
    const days = Math.floor(hours / 24);
    const nights = days > 0 ? days - 1 : 0;
    if (days > 0) return `${days} ngày ${nights > 0 ? `${nights} đêm` : ''}`;
    return `${hours}h`;
  };

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

  const navigate = useNavigate();

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
            Khám phá văn hoá Tây Nguyên qua những chuyến đi đáng nhớ
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
                <article key={tour.id} className="tour-experience__card">
                  <div className="tour-experience__image-wrapper">
                    <div className="tour-experience__image-frame">
                      <img
                        className="tour-experience__image"
                        src={buildImageUrl(tour)}
                        alt={tour.title}
                      />
                    </div>
                  </div>

                  <div className="tour-experience__content">
                    <h3 className="tour-experience__card-title">{tour.title}</h3>

                    <div className="tour-experience__meta">
                      <span className="tour-experience__meta-item">
                        <Clock className="tour-experience__meta-icon" />
                        {formatDuration(tour.durationHours)}
                      </span>
                      <span className="tour-experience__meta-item">
                        <Tag className="tour-experience__meta-icon" />
                        {formatPrice(tour.price)}VND
                      </span>
                    </div>

                    <div className="tour-experience__rating">
                      <div className="tour-experience__stars">
                        {renderStars(ratingValue)}
                      </div>
                      <span className="tour-experience__rating-text">
                        {ratingValue.toFixed(1)} ({ratingCount} đánh giá)
                      </span>
                    </div>

                    <button
                      type="button"
                      className="tour-experience__cta"
                      onClick={() => navigate(`/tours/${tour.id}`)}
                    >
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
