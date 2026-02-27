import { useNavigate } from "react-router-dom";
import "../../styles/components/artisan/_artisan-hero.scss";

export default function ArtisanHero() {
  const navigate = useNavigate();

  return (
    <section className="artisan-hero">
      <img
        src="/dauvao.png"
        alt="Văn hoá Tây Nguyên"
        className="artisan-hero__img"
      />

      <div className="artisan-hero__overlay">
        <h1 className="artisan-hero__title">Khám phá văn hoá Tây Nguyên</h1>
        <p className="artisan-hero__subtitle">
          Hành trình khám phá nền văn hoá độc đáo của người dân tộc thiểu số với
          những truyền thống lâu đời và cảnh quan thiên nhiên hùng vĩ
        </p>
        <button
          className="artisan-hero__btn"
          onClick={() => navigate("/tours")}
        >
          Khám phá ngay
        </button>
      </div>
    </section>
  );
}
