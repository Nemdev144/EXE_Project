import { MapPin } from 'lucide-react';
import type { Tour, CultureItem, Province } from '../../../types';
import { parseImages } from './utils';

interface HighlightsSectionProps {
  tour: Tour;
  province: Province | null;
  cultureItems: CultureItem[];
  highlights: CultureItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

export default function HighlightsSection({
  tour,
  province,
  cultureItems,
  highlights,
  sectionRef,
}: HighlightsSectionProps) {
  return (
    <section className="td-section td-highlights" ref={sectionRef}>
      <div className="td-section__container">
        <h2 className="td-section__title td-section__title--stamp">ĐỊA ĐIỂM NỔI BẬT</h2>
        <div className="td-highlights__grid">
          {(highlights.length > 0 ? highlights : cultureItems).slice(0, 3).map((item) => (
            <article key={item.id} className="td-stamp-card">
              <div className="td-stamp-card__image-wrapper">
                <div className="td-stamp-card__image-frame">
                  <img
                    className="td-stamp-card__image"
                    src={item.thumbnailUrl || '/nen.png'}
                    alt={item.title}
                  />
                </div>
              </div>
              <div className="td-stamp-card__content">
                <h3 className="td-stamp-card__title">{item.title}</h3>
                <div className="td-stamp-card__meta">
                  <span><MapPin size={14} /> {province?.name || 'Tây Nguyên'}</span>
                </div>
                <p className="td-stamp-card__desc">{item.description}</p>
              </div>
            </article>
          ))}
          {cultureItems.length === 0 && (
            <>
              {parseImages(tour.images).slice(0, 3).map((img: string, i: number) => (
                <article key={i} className="td-stamp-card">
                  <div className="td-stamp-card__image-wrapper">
                    <div className="td-stamp-card__image-frame">
                      <img className="td-stamp-card__image" src={img} alt={`Điểm nổi bật ${i + 1}`} />
                    </div>
                  </div>
                  <div className="td-stamp-card__content">
                    <h3 className="td-stamp-card__title">Điểm tham quan {i + 1}</h3>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
