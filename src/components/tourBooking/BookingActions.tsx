import { useNavigate } from 'react-router-dom';
import '../../styles/components/tourBookingscss/_booking-actions.scss';

interface BookingActionsProps {
  tourId: number;
  canSubmit: boolean;
  onSubmit: () => void;
}

export default function BookingActions({ tourId, canSubmit, onSubmit }: BookingActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="booking-actions">
      <button
        type="button"
        className="booking-actions__btn booking-actions__btn--primary"
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        Xác nhận
      </button>
      <button
        type="button"
        className="booking-actions__btn booking-actions__btn--outline"
        onClick={() => navigate(`/tours/${tourId}`)}
      >
        Quay lại chi tiết tour
      </button>
    </div>
  );
}
