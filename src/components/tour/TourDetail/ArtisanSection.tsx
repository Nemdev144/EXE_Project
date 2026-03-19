import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { TourArtisan } from '../../../types';

interface ArtisanSectionProps {
  artisan: TourArtisan;
  sectionRef: (el: HTMLElement | null) => void;
}

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

export default function ArtisanSection({ artisan, sectionRef }: ArtisanSectionProps) {
  const narrative = parseNarrative(artisan.narrativeContent);

  return (
    <section className="td-section td-artisan" ref={sectionRef}>
      <div className="td-section__container">
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
          {narrative.length > 0 && (
            <div className="td-artisan__narrative">
              {narrative.map((block, i) => (
                <div key={i} className="td-artisan__narrative-block">
                  {block.imageUrl && (
                    <img
                      src={block.imageUrl}
                      alt={block.title ?? ''}
                      className="td-artisan__narrative-img"
                    />
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
    </section>
  );
}
