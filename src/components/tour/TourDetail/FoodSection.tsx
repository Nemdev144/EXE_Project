import type { CultureItem } from '../../../types';

interface FoodSectionProps {
  foodItems: CultureItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

export default function FoodSection({
  foodItems,
  sectionRef,
}: FoodSectionProps) {
  return (
    <section className="td-section td-food" ref={sectionRef}>
      <div className="td-section__container">
        <h2 className="td-section__title td-section__title--stamp">ẨM THỰC ĐỊA PHƯƠNG</h2>
        <div className="td-food__grid">
          {foodItems.length > 0 ? foodItems.slice(0, 3).map((item) => (
            <article key={item.id} className="td-stamp-card">
              <div className="td-stamp-card__image-wrapper">
                <div className="td-stamp-card__image-frame">
                  <img className="td-stamp-card__image" src={item.thumbnailUrl || '/nen.png'} alt={item.title} />
                </div>
              </div>
              <div className="td-stamp-card__content">
                <h3 className="td-stamp-card__title">{item.title}</h3>
                <p className="td-stamp-card__desc">{item.description}</p>
              </div>
            </article>
          )) : (
            <div className="td-food__empty">
              <p>Thông tin ẩm thực đang được cập nhật...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
