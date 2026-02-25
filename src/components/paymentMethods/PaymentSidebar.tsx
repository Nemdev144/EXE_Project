import { MapPin } from 'lucide-react';
import type { Tour } from '../../types';
import type { BookingDetailsData } from '../tourBooking/BookingDetails';
import { formatPrice } from '../tour/TourDetail/utils';
import '../../styles/components/paymentMethodscss/_payment-sidebar.scss';

interface PaymentSidebarProps {
  tour: Tour;
  bookingDetails: BookingDetailsData;
}

function formatDuration(hours: number): string {
  const days = Math.ceil(hours / 24);
  const nights = days - 1;
  if (days <= 1) return `${hours} giờ`;
  return `${days}N${nights}Đ`;
}

export default function PaymentSidebar({ tour, bookingDetails }: PaymentSidebarProps) {
  const adultTotal = bookingDetails.adults * tour.price;
  const childPrice = Math.round(tour.price * 0.3);
  const childTotal = bookingDetails.children * childPrice;
  const totalPrice = adultTotal + childTotal;

  return (
    <div className="payment-sidebar">
      {/* Tour thumbnail */}
      <div className="payment-sidebar__image">
        <img src={tour.thumbnailUrl || '/nen.png'} alt={tour.title} />
      </div>

      {/* Tour title */}
      <div className="payment-sidebar__content">
        <h3 className="payment-sidebar__title">
          {tour.title}
          <span className="payment-sidebar__duration">
            {' '}
            {formatDuration(tour.durationHours)}
          </span>
        </h3>
        <p className="payment-sidebar__subtitle">
          Khám phá văn hoá đại ngàn
        </p>

        {/* Price breakdown */}
        <div className="payment-sidebar__pricing">
          <div className="payment-sidebar__price-row">
            <span>Giá Người lớn × {bookingDetails.adults}</span>
            <strong>{formatPrice(adultTotal)} VND</strong>
          </div>
          {bookingDetails.children > 0 && (
            <div className="payment-sidebar__price-row">
              <span>Giá Trẻ em × {bookingDetails.children}</span>
              <strong>{formatPrice(childTotal)} VND</strong>
            </div>
          )}
        </div>

        <div className="payment-sidebar__total">
          <span>Tổng tiền</span>
          <strong>{formatPrice(totalPrice)} VND</strong>
        </div>

        <p className="payment-sidebar__tax-note">
          Giá đã bao gồm thuế &amp; phí cơ bản. Đã tính chiết khấu hợp tác viên.
        </p>

        {/* Location */}
        <div className="payment-sidebar__location">
          <MapPin size={14} className="payment-sidebar__location-icon" />
          <span>{tour.provinceName || 'Việt Nam'}</span>
        </div>
      </div>
    </div>
  );
}
