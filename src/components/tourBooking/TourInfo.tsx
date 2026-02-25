import { MapPin, Clock, Wallet } from 'lucide-react';
import type { Tour } from '../../types';
import { formatPrice } from '../tour/TourDetail/utils';
import '../../styles/components/tourBookingscss/_tour-info.scss';

interface TourInfoProps {
  tour: Tour;
}

function formatDuration(hours: number): string {
  const days = Math.ceil(hours / 24);
  const nights = days - 1;
  if (days <= 1) return `${hours} giờ`;
  return `${days} ngày ${nights} đêm`;
}

export default function TourInfo({ tour }: TourInfoProps) {
  return (
    <div className="tour-info-box">
      <h2 className="tour-info-box__heading">Thông tin tour</h2>
      <div className="tour-info-box__card">
        <h3 className="tour-info-box__title">{tour.title}</h3>
        <div className="tour-info-box__meta">
          <span className="tour-info-box__meta-item">
            <MapPin size={14} />
            {tour.provinceName || 'Việt Nam'}
          </span>
          <span className="tour-info-box__meta-item">
            <Clock size={14} />
            {formatDuration(tour.durationHours)}
          </span>
          <span className="tour-info-box__meta-item">
            <Wallet size={14} />
            {formatPrice(tour.price)} VND
          </span>
        </div>
      </div>
    </div>
  );
}
