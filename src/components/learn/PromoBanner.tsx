import { Sparkles } from 'lucide-react';
import '../../styles/components/_promo-banner.scss';

export default function PromoBanner() {
  return (
    <div className="promo-banner">
      <Sparkles size={20} className="promo-banner__icon" />
      <span className="promo-banner__text">
        Học xong nhận Chứng chỉ mini + ưu đãi giảm 5% tour
      </span>
      <Sparkles size={20} className="promo-banner__icon" />
    </div>
  );
}
