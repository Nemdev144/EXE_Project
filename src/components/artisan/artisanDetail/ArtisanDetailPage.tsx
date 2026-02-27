import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { getPublicArtisanById } from "../../../services/artisanApi";
import type { PublicArtisan } from "../../../types";
import Breadcrumbs from "../../Breadcrumbs";
import "../../../styles/components/artisan/artisanDetailscss/_artisan-detail.scss";

const FALLBACK_IMG = "/dauvao.png";

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<PublicArtisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchArtisan = async () => {
      try {
        setLoading(true);
        const data = await getPublicArtisanById(Number(id));
        if (!cancelled) setArtisan(data);
      } catch (err) {
        console.error("[ArtisanDetail] Failed to fetch artisan:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArtisan();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-loading__spinner" />
        <p>Đang tải thông tin nghệ nhân...</p>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (!artisan) {
    return (
      <div className="ad-loading">
        <p>Không tìm thấy nghệ nhân này.</p>
        <Link to="/artisans" className="ad-back-btn">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  /* ---------- Derived ---------- */
  const profileImg =
    !imgError && artisan.profileImageUrl
      ? artisan.profileImageUrl
      : artisan.user?.avatarUrl || FALLBACK_IMG;

  const joinDate = artisan.createdAt
    ? new Date(artisan.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      })
    : null;

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Nghệ nhân", path: "/artisans" },
    { label: artisan.fullName },
  ];

  return (
    <div className="artisan-detail">
      <Breadcrumbs items={breadcrumbItems} />

      {/* ── Back button ── */}
      <div className="artisan-detail__nav">
        <button className="ad-back-btn" onClick={() => navigate("/artisans")}>
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>
      </div>

      {/* ══════════════ Hero Section ══════════════ */}
      <section className="ad-hero">
        {/* Profile image with stamp frame */}
        <div className="ad-hero__stamp">
          <div className="ad-hero__img-wrap">
            <img
              src={profileImg}
              alt={artisan.fullName}
              className="ad-hero__img"
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        {/* Basic info */}
        <div className="ad-hero__info">
          <h1 className="ad-hero__name">{artisan.fullName}</h1>
          <p className="ad-hero__spec">{artisan.specialization}</p>

          {/* Rating */}
          {artisan.averageRating > 0 && (
            <div className="ad-hero__rating">
              <Star size={18} />
              <span className="ad-hero__rating-value">
                {artisan.averageRating.toFixed(1)}
              </span>
              <span className="ad-hero__rating-label">đánh giá trung bình</span>
            </div>
          )}

          {/* Quick stats */}
          <div className="ad-hero__stats">
            {artisan.totalTours > 0 && (
              <div className="ad-hero__stat">
                <Users size={16} />
                <span>
                  <strong>{artisan.totalTours}</strong> tour
                </span>
              </div>
            )}
            {artisan.province && (
              <div className="ad-hero__stat">
                <MapPin size={16} />
                <span>{artisan.province.name}</span>
              </div>
            )}
            {joinDate && (
              <div className="ad-hero__stat">
                <Calendar size={16} />
                <span>Tham gia từ {joinDate}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="ad-hero__actions">
            <Link to="/tours" className="ad-hero__btn ad-hero__btn--primary">
              <Briefcase size={16} />
              Xem tour của nghệ nhân
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ Bio Section ══════════════ */}
      {artisan.bio && (
        <section className="ad-section ad-bio">
          <div className="ad-section__container">
            <h2 className="ad-section__title">Giới thiệu</h2>
            <div className="ad-bio__content">
              <p>{artisan.bio}</p>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ Workshop & Location ══════════════ */}
      {(artisan.workshopAddress || artisan.province) && (
        <section className="ad-section ad-location">
          <div className="ad-section__container">
            <h2 className="ad-section__title">Xưởng & Địa điểm</h2>

            <div className="ad-location__grid">
              {/* Workshop address */}
              {artisan.workshopAddress && (
                <div className="ad-location__card">
                  <div className="ad-location__icon">
                    <MapPin size={24} />
                  </div>
                  <h3>Địa chỉ xưởng</h3>
                  <p>{artisan.workshopAddress}</p>
                </div>
              )}

              {/* Province info */}
              {artisan.province && (
                <div className="ad-location__card">
                  <div className="ad-location__icon">
                    <MapPin size={24} />
                  </div>
                  <h3>{artisan.province.name}</h3>
                  <p>{artisan.province.description}</p>
                  {artisan.province.bestSeason && (
                    <p className="ad-location__meta">
                      <strong>Mùa đẹp nhất:</strong>{" "}
                      {artisan.province.bestSeason}
                    </p>
                  )}
                  {artisan.province.transportation && (
                    <p className="ad-location__meta">
                      <strong>Di chuyển:</strong>{" "}
                      {artisan.province.transportation}
                    </p>
                  )}
                </div>
              )}

              {/* Cultural tips */}
              {artisan.province?.culturalTips && (
                <div className="ad-location__card ad-location__card--tips">
                  <div className="ad-location__icon">
                    <Briefcase size={24} />
                  </div>
                  <h3>Mẹo văn hoá</h3>
                  <p>{artisan.province.culturalTips}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ Contact Info ══════════════ */}
      {(artisan.user?.email || artisan.user?.phone) && (
        <section className="ad-section ad-contact">
          <div className="ad-section__container">
            <h2 className="ad-section__title">Liên hệ</h2>
            <div className="ad-contact__list">
              {artisan.user.email && (
                <div className="ad-contact__item">
                  <Mail size={20} />
                  <span>{artisan.user.email}</span>
                </div>
              )}
              {artisan.user.phone && (
                <div className="ad-contact__item">
                  <Phone size={20} />
                  <span>{artisan.user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ CTA Banner ══════════════ */}
      <section className="ad-cta">
        <div className="ad-cta__box">
          <p className="ad-cta__text">
            Bạn muốn trải nghiệm trực tiếp với nghệ nhân {artisan.fullName}?
          </p>
          <Link to="/tours" className="ad-cta__btn">
            Đặt tour ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
