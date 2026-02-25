import { MapPin, Clock, Tag } from 'lucide-react';
import type { Tour } from '../../../types';
import '../../../styles/components/tourBookingscss/step2/_confirm-tour-card.scss';

interface ConfirmTourCardProps {
  tour: Tour;
}

function formatDuration(hours: number): string {
  const days = Math.ceil(hours / 24);
  const nights = days - 1;
  if (days <= 1) return `${hours} giờ`;
  return `${days} ngày ${nights} đêm`;
}

function generateTourCode(tour: Tour): string {
  const slugPart = tour.slug
    ? tour.slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase())
        .join('')
        .slice(0, 4)
    : 'TOUR';
  const days = Math.ceil(tour.durationHours / 24);
  const nights = days - 1;
  return `${slugPart}-${days}N${nights}D`;
}

export default function ConfirmTourCard({ tour }: ConfirmTourCardProps) {
  const tourCode = generateTourCode(tour);

  return (
    <div className="confirm-tour-card">
      <div className="confirm-tour-card__label">
        <span className="confirm-tour-card__label-icon">📋</span>
        Thông tin tour đã chọn
      </div>

      <div className="confirm-tour-card__body">
        {/* Thumbnail */}
        <div className="confirm-tour-card__image">
          <img src={tour.thumbnailUrl || '/nen.png'} alt={tour.title} />
        </div>

        {/* Details */}
        <div className="confirm-tour-card__details">
          <h3 className="confirm-tour-card__title">{tour.title}</h3>
          <div className="confirm-tour-card__meta">
            <div className="confirm-tour-card__meta-row">
              <MapPin size={14} />
              <span className="confirm-tour-card__meta-label">Địa điểm</span>
              <span className="confirm-tour-card__meta-value">
                {tour.provinceName || 'Việt Nam'}
              </span>
            </div>
            <div className="confirm-tour-card__meta-row">
              <Clock size={14} />
              <span className="confirm-tour-card__meta-label">Thời lượng</span>
              <span className="confirm-tour-card__meta-value">
                {formatDuration(tour.durationHours)}
              </span>
            </div>
            <div className="confirm-tour-card__meta-row">
              <Tag size={14} />
              <span className="confirm-tour-card__meta-label">Mã tour</span>
              <span className="confirm-tour-card__meta-value">{tourCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
