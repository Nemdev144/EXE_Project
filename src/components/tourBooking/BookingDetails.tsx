import { useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import '../../styles/components/tourBookingscss/_booking-details.scss';

export type TourType = 'individual' | 'group' | 'family';

export interface BookingDetailsData {
  departureDate: Date | null;
  participants: number;
  specialRequirements: string;
  tourType: TourType;
  notes: string;
  agreedToTerms: boolean;
}

interface BookingDetailsProps {
  value: BookingDetailsData;
  onChange: (data: BookingDetailsData) => void;
}

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BookingDetails({ value, onChange }: BookingDetailsProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    onChange({ ...value, departureDate: selected });
  };

  const isSelectedDate = (day: number) => {
    if (!value.departureDate) return false;
    return (
      value.departureDate.getDate() === day &&
      value.departureDate.getMonth() === viewMonth &&
      value.departureDate.getFullYear() === viewYear
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const updateParticipants = (delta: number) => {
    const newVal = Math.max(1, value.participants + delta);
    onChange({ ...value, participants: newVal });
  };

  const tourTypes: { key: TourType; label: string }[] = [
    { key: 'individual', label: 'Cá nhân' },
    { key: 'group', label: 'Nhóm' },
    { key: 'family', label: 'Gia đình' },
  ];

  // Build calendar grid
  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`blank-${i}`} className="booking-calendar__day booking-calendar__day--empty" />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const past = isPastDate(day);
    const selected = isSelectedDate(day);
    const todayClass = isToday(day);
    return (
      <button
        key={day}
        type="button"
        disabled={past}
        className={`booking-calendar__day ${past ? 'booking-calendar__day--disabled' : ''} ${
          selected ? 'booking-calendar__day--selected' : ''
        } ${todayClass ? 'booking-calendar__day--today' : ''}`}
        onClick={() => handleSelectDate(day)}
      >
        {day}
      </button>
    );
  });

  return (
    <div className="booking-details">
      <h2 className="booking-details__heading">Chi tiết đặt chỗ</h2>

      {/* Calendar */}
      <div className="booking-details__section">
        <label className="booking-details__label">
          Ngày khởi hành <span className="booking-details__required">*</span>
        </label>
        <div className="booking-calendar">
          <div className="booking-calendar__header">
            <span className="booking-calendar__month">{monthLabel} &gt;</span>
            <div className="booking-calendar__nav">
              <button type="button" onClick={handlePrevMonth} className="booking-calendar__nav-btn">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={handleNextMonth} className="booking-calendar__nav-btn">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="booking-calendar__weekdays">
            {DAYS_VI.map((d) => (
              <div key={d} className="booking-calendar__weekday">{d}</div>
            ))}
          </div>
          <div className="booking-calendar__grid">
            {blanks}
            {days}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="booking-details__section">
        <label className="booking-details__label">
          Số lượng người tham gia <span className="booking-details__required">*</span>
        </label>
        <div className="booking-details__participants">
          <div className="booking-details__participant-row">
            <span>Số người</span>
            <div className="booking-details__counter">
              <button type="button" onClick={() => updateParticipants(-1)} className="booking-details__counter-btn">
                <Minus size={14} />
              </button>
              <span className="booking-details__counter-value">{value.participants}</span>
              <button type="button" onClick={() => updateParticipants(1)} className="booking-details__counter-btn">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Special requirements */}
      <div className="booking-details__section">
        <input
          type="text"
          className="booking-details__input"
          placeholder="Chiều cao, cân nặng, tuổi,..."
          value={value.specialRequirements}
          onChange={(e) => onChange({ ...value, specialRequirements: e.target.value })}
        />
      </div>

      {/* Tour type */}
      <div className="booking-details__section">
        <div className="booking-details__tour-type">
          <span className="booking-details__tour-type-label">Loại tour</span>
          <div className="booking-details__tour-type-options">
            {tourTypes.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`booking-details__tour-type-btn ${
                  value.tourType === key ? 'booking-details__tour-type-btn--active' : ''
                }`}
                onClick={() => onChange({ ...value, tourType: key })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="booking-details__section">
        <label className="booking-details__label">Ghi chú cho nhà tổ chức</label>
        <input
          type="text"
          className="booking-details__input"
          placeholder="Yêu cầu ăn chay, xe đưa đón,..."
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>

      {/* Terms */}
      <div className="booking-details__terms">
        <label className="booking-details__checkbox-label">
          <input
            type="checkbox"
            checked={value.agreedToTerms}
            onChange={(e) => onChange({ ...value, agreedToTerms: e.target.checked })}
          />
          <span>
            Tôi đồng ý với{' '}
            <a href="#" className="booking-details__terms-link">
              điều khoản dịch vụ & chính sách huỷ
            </a>
          </span>
        </label>
      </div>
    </div>
  );
}
