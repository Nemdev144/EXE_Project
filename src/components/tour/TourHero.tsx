import '../../styles/components/tourHero.scss';

export default function TourHero() {
  return (
    <section className="tour-hero">
      <div className="tour-hero__container">
        <h1 className="tour-hero__title">Khám phá văn hoá Tây Nguyên</h1>
        <p className="tour-hero__subtitle">
          Hành trình khám phá nền văn hoá độc đáo của người dân tộc thiểu số với những
          truyền thống lâu đời và cảnh quan thiên nhiên hùng vĩ.
        </p>
        <button type="button" className="tour-hero__cta">
          Khám phá ngay
        </button>
      </div>
    </section>
  );
}
