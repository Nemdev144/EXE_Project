import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TourProvince, TourArtisan } from '../../../types';

interface NarrativeBlock {
  title?: string;
  content?: string;
  imageUrl?: string;
}

function parseNarrative(content?: string): NarrativeBlock[] {
  if (!content?.trim()) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface ProvinceArtisanSectionProps {
  province: TourProvince | { id?: number; name?: string; description?: string; bestSeason?: string; transportation?: string; culturalTips?: string };
  artisan: TourArtisan | null;
  provinceRef: (el: HTMLElement | null) => void;
  artisanRef: (el: HTMLElement | null) => void;
}

export default function ProvinceArtisanSection({
  province,
  artisan,
  provinceRef,
  artisanRef,
}: ProvinceArtisanSectionProps) {
  const hasProvince = province?.name && (province?.description || province?.bestSeason || province?.transportation || province?.culturalTips);
  const hasArtisan = artisan && (artisan.bio || artisan.specialization);

  if (!hasProvince && !hasArtisan) return null;

  return (
    <section className="td-section td-province-artisan">
      <div className="td-section__container td-province-artisan__grid">
        {/* Vùng đất - cột trái */}
        {hasProvince && province && (
          <div className="td-province-artisan__col" ref={provinceRef}>
            <h2 className="td-section__title td-section__title--decorated">
              VÙNG ĐẤT {province?.name?.toUpperCase() ?? ''}
            </h2>
            <div className="td-province__card">
              {province?.name && (
                <div className="td-province__badge">
                  <MapPin size={18} />
                  {province.name}
                </div>
              )}
              {province?.description && (
                <div className="td-province__block">
                  <h4>Giới thiệu</h4>
                  <p>{province.description}</p>
                </div>
              )}
              {province?.bestSeason && (
                <div className="td-province__block">
                  <h4>Thời điểm đẹp nhất</h4>
                  <p>{province.bestSeason}</p>
                </div>
              )}
              {province?.transportation && (
                <div className="td-province__block">
                  <h4>Di chuyển</h4>
                  <p>{province.transportation}</p>
                </div>
              )}
              {province?.culturalTips && (
                <div className="td-province__block">
                  <h4>Lưu ý văn hóa</h4>
                  <p>{province.culturalTips}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nghệ nhân - cột phải (xen kẽ) */}
        {hasArtisan && artisan && (
          <div className="td-province-artisan__col" ref={artisanRef}>
            <h2 className="td-section__title td-section__title--decorated">NGHỆ NHÂN ĐỒNG HÀNH</h2>
            <div className="td-artisan__card">
              <div className="td-artisan__header">
                <div className="td-artisan__avatar-wrap">
                  <img
                    src={artisan.profileImageUrl || '/nen.png'}
                    alt={artisan.fullName}
                    className="td-artisan__avatar"
                  />
                </div>
                <div className="td-artisan__info">
                  <h3 className="td-artisan__name">{artisan.fullName}</h3>
                  {artisan.heroSubtitle && (
                    <p className="td-artisan__subtitle">{artisan.heroSubtitle}</p>
                  )}
                  {artisan.specialization && (
                    <span className="td-artisan__specialty">{artisan.specialization}</span>
                  )}
                  {artisan.ethnicity && (
                    <span className="td-artisan__ethnicity">{artisan.ethnicity}</span>
                  )}
                  {artisan.workshopAddress && (
                    <p className="td-artisan__address">
                      <MapPin size={14} />
                      {artisan.workshopAddress}
                    </p>
                  )}
                </div>
              </div>
              {artisan.bio && (
                <div className="td-artisan__bio">
                  <p>{artisan.bio}</p>
                </div>
              )}
              {parseNarrative(artisan.narrativeContent).length > 0 && (
                <div className="td-artisan__narrative">
                  {parseNarrative(artisan.narrativeContent).slice(0, 2).map((block, i) => (
                    <div key={i} className="td-artisan__narrative-block">
                      {block.imageUrl && (
                        <img src={block.imageUrl} alt={block.title ?? ''} className="td-artisan__narrative-img" />
                      )}
                      {block.title && <h4>{block.title}</h4>}
                      {block.content && <p>{block.content}</p>}
                    </div>
                  ))}
                </div>
              )}
              {artisan.id && (
                <Link to={`/artisans/${artisan.id}`} className="td-artisan__link">
                  Xem chi tiết nghệ nhân
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
