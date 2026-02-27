import { useEffect, useState } from "react";
import { getPublicArtisans } from "../../services/artisanApi";
import type { PublicArtisan } from "../../types";
import ArtisanHero from "./ArtisanHero";
import ArtisanGrid from "./ArtisanGrid";
import ArtisanCTA from "./ArtisanCTA";
import "../../styles/components/artisan/_artisan-page.scss";

export default function ArtisanPage() {
  const [artisans, setArtisans] = useState<PublicArtisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const data = await getPublicArtisans();
        if (!cancelled) {
          setArtisans(data.filter((a) => a.isActive));
        }
      } catch (err) {
        console.error("[ArtisanPage] Failed to fetch artisans:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArtisans();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="artisan-page">
      <ArtisanHero />
      <ArtisanGrid artisans={artisans} loading={loading} />
      <ArtisanCTA />
    </div>
  );
}
