import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Tour } from '../../types';
import type { BookingDetailsData } from './BookingDetails';
import { formatPrice } from '../tour/TourDetail/utils';
import '../../styles/components/tourBookingscss/_booking-sidebar.scss';

interface BookingSidebarProps {
  tour: Tour;
  bookingDetails: BookingDetailsData;
}

function formatDuration(hours: number): string {
  const days = Math.ceil(hours / 24);
  const nights = days - 1;
  if (days <= 1) return `${hours} giờ`;
  return `${days} ngày ${nights} đêm`;
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function BookingSidebar({ tour, bookingDetails }: BookingSidebarProps) {
  const totalPrice = bookingDetails.participants * tour.price;

  return (
    <div className="booking-sidebar">
      {/* Tour thumbnail */}
      <div className="booking-sidebar__image">
        <img src={tour.thumbnailUrl || '/nen.png'} alt={tour.title} />
      </div>

      {/* Tour summary */}
      <div className="booking-sidebar__content">
        <h3 className="booking-sidebar__title">{tour.title}</h3>

        <div className="booking-sidebar__meta">
          <div className="booking-sidebar__meta-item">
            <Calendar size={14} />
            <span>Lịch khởi hành</span>
            <strong>{formatDate(bookingDetails.departureDate)}</strong>
          </div>
          <div className="booking-sidebar__meta-item">
            <Clock size={14} />
            <span>Thời lượng</span>
            <strong>{formatDuration(tour.durationHours)}</strong>
          </div>
          <div className="booking-sidebar__meta-item">
            <MapPin size={14} />
            <span>Điểm đến</span>
            <strong>{tour.provinceName || 'Việt Nam'}</strong>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="booking-sidebar__pricing">
          <h4 className="booking-sidebar__pricing-title">Giá tham chiếu</h4>
          <div className="booking-sidebar__price-row">
            <span>{formatPrice(tour.price)} × {bookingDetails.participants} người</span>
            <strong>{formatPrice(totalPrice)} VND</strong>
          </div>
          <div className="booking-sidebar__price-total">
            <span>Tổng tạm tính</span>
            <strong>{formatPrice(totalPrice)} VND</strong>
          </div>
          <p className="booking-sidebar__price-note">
            Giá có thể thay đổi theo ngày khởi hành
          </p>
          <a href="#" className="booking-sidebar__refund-link">
            Xem chính sách hoàn huỷ
          </a>
        </div>

        {/* Map placeholder */}
        <div className="booking-sidebar__map">
          <div className="booking-sidebar__map-placeholder">
            <MapPin size={20} className="booking-sidebar__map-pin" />
            <span>{tour.provinceName || 'Việt Nam'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
