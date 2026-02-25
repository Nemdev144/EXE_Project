import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Tour } from '../../../types';
import type { BookingDetailsData } from '../BookingDetails';
import { formatPrice } from '../../tour/TourDetail/utils';
import '../../../styles/components/tourBookingscss/step2/_confirm-sidebar.scss';

interface ConfirmSidebarProps {
  tour: Tour;
  bookingDetails: BookingDetailsData;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmSidebar({
  tour,
  bookingDetails,
  onConfirm,
  onBack,
}: ConfirmSidebarProps) {
  const adultTotal = bookingDetails.adults * tour.price;
  const childPrice = Math.round(tour.price * 0.3);
  const childTotal = bookingDetails.children * childPrice;
  const totalPrice = adultTotal + childTotal;

  const [infoChecked, setInfoChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const canConfirm = infoChecked && termsChecked;

  return (
    <div className="confirm-sidebar">
      {/* Price summary */}
      <div className="confirm-sidebar__section">
        <h3 className="confirm-sidebar__heading">Tóm tắt &amp; Thành tiền</h3>

        <div className="confirm-sidebar__price-rows">
          <div className="confirm-sidebar__price-row">
            <span>Giá Người lớn × {bookingDetails.adults}</span>
            <strong>{formatPrice(adultTotal)} VND</strong>
          </div>
          {bookingDetails.children > 0 && (
            <div className="confirm-sidebar__price-row">
              <span>Giá Trẻ em × {bookingDetails.children}</span>
              <strong>{formatPrice(childTotal)} VND</strong>
            </div>
          )}
        </div>

        <div className="confirm-sidebar__total">
          <span>Tổng tiền</span>
          <strong>{formatPrice(totalPrice)} VND</strong>
        </div>

        <p className="confirm-sidebar__tax-note">
          Giá đã bao gồm thuế &amp; phí cơ bản
        </p>

        {/* Checkboxes */}
        <div className="confirm-sidebar__checks">
          <label className="confirm-sidebar__check-label">
            <input
              type="checkbox"
              checked={infoChecked}
              onChange={(e) => setInfoChecked(e.target.checked)}
            />
            <span>Tôi đã kiểm tra đúng thông tin.</span>
          </label>
          <label className="confirm-sidebar__check-label">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
            />
            <span>
              Tôi đồng ý với{' '}
              <a href="#" className="confirm-sidebar__terms-link">
                điều khoản dịch vụ &amp; chính sách huỷ
              </a>
              .
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="confirm-sidebar__actions">
          <button
            type="button"
            className="confirm-sidebar__btn confirm-sidebar__btn--primary"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            Xác nhận và thanh toán
          </button>
          <button
            type="button"
            className="confirm-sidebar__btn confirm-sidebar__btn--outline"
            onClick={onBack}
          >
            Quay lại bước trước
          </button>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="confirm-sidebar__map">
        <div className="confirm-sidebar__map-placeholder">
          <MapPin size={20} className="confirm-sidebar__map-pin" />
          <span>{tour.provinceName || 'Việt Nam'}</span>
        </div>
      </div>
    </div>
  );
}
