import type { ContactInfo } from '../ContactForm';
import type { BookingDetailsData } from '../BookingDetails';
import '../../../styles/components/tourBookingscss/step2/_confirm-guest-info.scss';

interface ConfirmGuestInfoProps {
  contactInfo: ContactInfo;
  bookingDetails: BookingDetailsData;
  onEditClick: () => void;
}

function formatDateFull(date: Date | null): string {
  if (!date) return '—';
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dayName}, ${dd}/${mm}/${yyyy}`;
}

function buildParticipantSummary(adults: number, children: number): string {
  const parts: string[] = [];
  if (adults > 0) parts.push(`Người lớn ${adults < 10 ? '0' : ''}${adults}`);
  if (children > 0) parts.push(`Trẻ em ${children < 10 ? '0' : ''}${children}`);
  return parts.join(' • ');
}

export default function ConfirmGuestInfo({
  contactInfo,
  bookingDetails,
  onEditClick,
}: ConfirmGuestInfoProps) {
  return (
    <div className="confirm-guest-info">
      <div className="confirm-guest-info__label">
        <span className="confirm-guest-info__label-icon">👤</span>
        Khách &amp; lịch khởi hành
      </div>

      <div className="confirm-guest-info__rows">
        <div className="confirm-guest-info__row">
          <span className="confirm-guest-info__key">Tên khách</span>
          <span className="confirm-guest-info__value">{contactInfo.fullName || '—'}</span>
        </div>
        <div className="confirm-guest-info__row">
          <span className="confirm-guest-info__key">Ngày khởi hành</span>
          <span className="confirm-guest-info__value">
            {formatDateFull(bookingDetails.departureDate)}
          </span>
        </div>
        <div className="confirm-guest-info__row">
          <span className="confirm-guest-info__key">Số lượng</span>
          <span className="confirm-guest-info__value">
            {buildParticipantSummary(bookingDetails.adults, bookingDetails.children)}
          </span>
        </div>
      </div>

      <button type="button" className="confirm-guest-info__edit-btn" onClick={onEditClick}>
        ← Quay lại chỉnh sửa
      </button>
    </div>
  );
}
