import { MapPin } from 'lucide-react';
import type { TourProvince } from '../../../types';

interface ProvinceSectionProps {
  province: TourProvince | { id?: number; name?: string; description?: string; bestSeason?: string; transportation?: string; culturalTips?: string };
  sectionRef: (el: HTMLElement | null) => void;
}

export default function ProvinceSection({ province, sectionRef }: ProvinceSectionProps) {
  const hasContent =
    province.description || province.bestSeason || province.transportation || province.culturalTips;

  if (!hasContent) return null;

  return (
    <section className="td-section td-province" ref={sectionRef}>
      <div className="td-section__container">
        <h2 className="td-section__title td-section__title--decorated">
          VÙNG ĐẤT {province.name?.toUpperCase() ?? ''}
        </h2>
        <div className="td-province__card">
          {province.name && (
            <div className="td-province__badge">
              <MapPin size={18} />
              {province.name}
            </div>
          )}
          {province.description && (
            <div className="td-province__block">
              <h4>Giới thiệu</h4>
              <p>{province.description}</p>
            </div>
          )}
          {province.bestSeason && (
            <div className="td-province__block">
              <h4>Thời điểm đẹp nhất</h4>
              <p>{province.bestSeason}</p>
            </div>
          )}
          {province.transportation && (
            <div className="td-province__block">
              <h4>Di chuyển</h4>
              <p>{province.transportation}</p>
            </div>
          )}
          {province.culturalTips && (
            <div className="td-province__block">
              <h4>Lưu ý văn hóa</h4>
              <p>{province.culturalTips}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
