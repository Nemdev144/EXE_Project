import { useNavigate } from 'react-router-dom';
import type { Tour } from '../../types';
import '../../styles/components/tourCard.scss';

const formatPrice = (value?: number) => {
  if (!value && value !== 0) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const buildImageUrl = (tour: Tour) => {
  if (tour.thumbnailUrl) return tour.thumbnailUrl;
  if (tour.images && tour.images.length > 0) return tour.images[0];
  return '/nen.png';
};

type TourCardProps = {
  tour: Tour;
};

export default function TourCard({ tour }: TourCardProps) {
  const navigate = useNavigate();

  return (
    <article className="tour-card" onClick={() => navigate(`/tours/${tour.id}`)} style={{ cursor: 'pointer' }}>
      <div className="tour-card__image-wrapper">
        <div className="tour-card__image-frame">
          <img className="tour-card__image" src={buildImageUrl(tour)} alt={tour.title} />
        </div>
      </div>

      <div className="tour-card__content">
        <h3 className="tour-card__title">{tour.title}</h3>
        <p className="tour-card__description">{tour.description}</p>

        <div className="tour-card__footer">
          <div className="tour-card__price">
            <span className="tour-card__price-value">{formatPrice(tour.price)} VND</span>
          </div>
          <button type="button" className="tour-card__cta">
            Đặt ngay
          </button>
        </div>
      </div>
    </article>
  );
}
