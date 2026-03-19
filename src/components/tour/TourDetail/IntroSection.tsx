import type { Tour } from '../../../types';
import type { TourProvince } from '../../../types';

interface IntroSectionProps {
  tour: Tour;
  province: TourProvince | { id?: number; name?: string; description?: string } | null;
  introRef: (el: HTMLElement | null) => void;
}

export default function IntroSection({ tour, province, introRef }: IntroSectionProps) {
  return (
    <section className="td-section td-intro" ref={introRef}>
      <div className="td-section__container">
        <div className="td-intro__text">
          <p>{tour.description}</p>
          {province?.description && tour.description !== province.description && (
            <p>{province.description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
