import { Clock, Users, Calendar, Car } from 'lucide-react';
import type { Tour } from '../../../types';

interface QuickInfoBarProps {
  tour: Tour;
  bestSeason?: string;
  transportation?: string;
}

function formatDuration(hours: number): string {
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    const nights = Math.max(0, days - 1);
    return nights > 0 ? `${nights}N${days}Đ` : `${days} ngày`;
  }
  return `${Math.round(hours)} giờ`;
}

export default function QuickInfoBar({ tour, bestSeason, transportation }: QuickInfoBarProps) {
  const duration = tour.durationHours != null ? formatDuration(tour.durationHours) : null;

  const topCard = bestSeason
    ? { icon: <Calendar size={24} />, label: 'Thời điểm đẹp nhất', value: bestSeason }
    : null;

  const bottomCards = [
    duration && { icon: <Clock size={22} />, label: 'Thời lượng', value: duration },
    tour.maxParticipants > 0 && { icon: <Users size={22} />, label: 'Số khách tối đa', value: `${tour.maxParticipants} người` },
    transportation && { icon: <Car size={22} />, label: 'Di chuyển', value: transportation },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  if (!topCard && bottomCards.length === 0) return null;

  return (
    <div className="td-quick-grid">
      {topCard && (
        <div className="td-quick-grid__card td-quick-grid__card--top">
          <span className="td-quick-grid__icon">{topCard.icon}</span>
          <span className="td-quick-grid__label">{topCard.label}</span>
          <span className="td-quick-grid__value">{topCard.value}</span>
        </div>
      )}
      {bottomCards.map((card, i) => (
        <div key={i} className="td-quick-grid__card td-quick-grid__card--bottom">
          <span className="td-quick-grid__icon">{card.icon}</span>
          <span className="td-quick-grid__label">{card.label}</span>
          <span className="td-quick-grid__value">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
