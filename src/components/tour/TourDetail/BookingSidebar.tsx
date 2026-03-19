import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Check, ChevronDown, Users } from 'lucide-react';
import type { Tour } from '../../../types';
import { formatPrice } from './utils';

interface BookingSidebarProps {
  tour: Tour;
}

export default function BookingSidebar({ tour }: BookingSidebarProps) {
  const [participants, setParticipants] = useState(1);
  const [showParticipants, setShowParticipants] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowParticipants(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const maxParticipants = Math.max(1, tour.maxParticipants || 15);
  const displayPrice = tour.price;

  return (
    <div className="td-booking-sidebar" ref={cardRef}>
      <div className="td-booking-sidebar__card">
        <p className="td-booking-sidebar__price-label">Giá mỗi người</p>
        <div className="td-booking-sidebar__price-row">
          <p className="td-booking-sidebar__price">{formatPrice(displayPrice)} VND</p>
        </div>

        <div className="td-booking-sidebar__field">
          <label className="td-booking-sidebar__label">Số người tham gia</label>
          <div
            className="td-booking-sidebar__select"
            onClick={() => setShowParticipants((v) => !v)}
          >
            <span className="td-booking-sidebar__select-value">
              <Users size={16} />
              {participants} người
            </span>
            <ChevronDown size={18} className={`td-booking-sidebar__chevron ${showParticipants ? 'td-booking-sidebar__chevron--open' : ''}`} />
          </div>
          {showParticipants && (
            <div className="td-booking-sidebar__dropdown">
              {Array.from({ length: maxParticipants }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`td-booking-sidebar__option ${participants === n ? 'td-booking-sidebar__option--active' : ''}`}
                  onClick={() => {
                    setParticipants(n);
                    setShowParticipants(false);
                  }}
                >
                  {n} người
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          to={`/tours/${tour.id}/booking?participants=${participants}`}
          className="td-booking-sidebar__btn"
        >
          <Calendar size={18} />
          Đặt tour ngay
        </Link>

        <div className="td-booking-sidebar__divider" />
        <ul className="td-booking-sidebar__trust">
          <li><Check size={16} /> Thanh toán an toàn</li>
          <li><Check size={16} /> Hướng dẫn viên địa phương</li>
          <li><Check size={16} /> Miễn phí hủy trước 7 ngày</li>
        </ul>
      </div>
    </div>
  );
}
