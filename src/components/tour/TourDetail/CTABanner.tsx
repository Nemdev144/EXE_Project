import { Link } from 'react-router-dom';
import type { Tour, Province } from '../../../types';

interface CTABannerProps {
  tour: Tour;
  province: Province | null;
}

export default function CTABanner({ tour, province }: CTABannerProps) {
  return (
    <section className="td-cta-banner">
      <div className="td-cta-banner__container">
        <h3>Sẵn sàng khám phá {province?.name || tour.title}?</h3>
        <p>Đặt tour văn hoá để trải nghiệm rừng thông, thác nước và cồng chiêng</p>
        <div className="td-cta-banner__buttons">
          <Link to={`/tours/${tour.id}/booking`} className="btn btn-primary">
            Đặt ngay
          </Link>
          <Link to="/tours" className="btn btn-outline">
            Xem tour tổng quan
          </Link>
        </div>
      </div>
    </section>
  );
}
