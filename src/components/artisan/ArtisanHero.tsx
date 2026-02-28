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
          Gặp gỡ những nghệ nhân tài hoa đang gìn giữ và truyền lửa cho các
          nghề thủ công truyền thống của đồng bào dân tộc Tây Nguyên
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
