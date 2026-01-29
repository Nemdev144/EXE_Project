import type { Tour } from '../../types';
import TourCard from './TourCard';
import '../../styles/components/tourGrid.scss';

type TourGridProps = {
  tours: Tour[];
  loading: boolean;
  error: string | null;
};

export default function TourGrid({ tours, loading, error }: TourGridProps) {
  if (loading) {
    return (
      <div className="tour-grid tour-grid--state">
        <div className="tour-grid__message">Đang tải danh sách tour...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-grid tour-grid--state">
        <div className="tour-grid__message tour-grid__message--error">{error}</div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="tour-grid tour-grid--state">
        <div className="tour-grid__message">Chưa có tour phù hợp.</div>
      </div>
    );
  }

  return (
    <div className="tour-grid">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
