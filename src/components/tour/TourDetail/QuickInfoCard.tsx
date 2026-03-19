import { Link } from 'react-router-dom';
import { Clock, Users, Star, Calendar } from 'lucide-react';
import type { Tour } from '../../../types';
import { formatPrice } from './utils';

interface QuickInfoCardProps {
  tour: Tour;
}

function formatDuration(hours: number): string {
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    const nights = Math.max(0, days - 1);
    return nights > 0 ? `${nights}N${days}Đ` : `${days} ngày`;
  }
  return `${Math.round(hours)} giờ`;
}

export default function QuickInfoCard({ tour }: QuickInfoCardProps) {
  const duration = tour.durationHours != null ? formatDuration(tour.durationHours) : null;

  return (
    <div className="td-quick-card">
      <div className="td-quick-card__price">
        <span className="td-quick-card__price-label">Từ</span>
        <span className="td-quick-card__price-value">{formatPrice(tour.price)} VND</span>
        <span className="td-quick-card__price-unit">/ người</span>
      </div>
      <div className="td-quick-card__meta">
        {duration && (
          <span className="td-quick-card__meta-item">
            <Clock size={16} />
            {duration}
          </span>
        )}
        {tour.maxParticipants > 0 && (
          <span className="td-quick-card__meta-item">
            <Users size={16} />
            Tối đa {tour.maxParticipants} khách
          </span>
        )}
        {tour.averageRating > 0 && (
          <span className="td-quick-card__meta-item">
            <Star size={16} fill="currentColor" />
            {tour.averageRating.toFixed(1)}
          </span>
        )}
      </div>
      <Link to={`/tours/${tour.id}/booking`} className="td-quick-card__cta">
        <Calendar size={18} />
        Đặt tour ngay
      </Link>
    </div>
  );
}
