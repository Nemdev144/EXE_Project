import type { PublicArtisan } from "../../types";
import ArtisanCard from "./ArtisanCard";
import "../../styles/components/artisan/_artisan-grid.scss";

interface Props {
  artisans: PublicArtisan[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <article className="artisan-card artisan-card--skeleton">
      <div className="artisan-card__stamp">
        <div className="artisan-card__img-wrap skeleton-pulse" />
      </div>
      <div className="artisan-card__info">
        <div className="skeleton-line skeleton-line--name" />
        <div className="skeleton-line skeleton-line--spec" />
        <div className="skeleton-line skeleton-line--link" />
      </div>
    </article>
  );
}

export default function ArtisanGrid({ artisans, loading }: Props) {
  return (
    <section className="artisan-grid">
      <div className="artisan-grid__inner">
        <h2 className="artisan-grid__title">Nghệ nhân tiêu biểu</h2>

        <div className="artisan-grid__list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </div>

        {!loading && artisans.length === 0 && (
          <p className="artisan-grid__empty">
            Chưa có nghệ nhân nào được hiển thị.
          </p>
        )}
      </div>
    </section>
  );
}
