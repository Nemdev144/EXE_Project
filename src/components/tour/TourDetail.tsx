import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Play, Calendar,
  Car, BookOpen, Utensils, Landmark, HandHeart
} from 'lucide-react';

import {
  getTourById,
  getToursByProvince,
  getCultureItemsByProvince,
  getProvinceById,
} from '../../services/api';
import type { Tour, CultureItem, Province } from '../../types';
import '../../styles/pages/tourDetail.scss';

type TabKey = 'intro' | 'highlights' | 'videos' | 'festivals' | 'food';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  { key: 'intro', label: 'Giới thiệu chung', icon: <BookOpen size={16} /> },
  { key: 'highlights', label: 'Địa điểm nổi bật', icon: <MapPin size={16} /> },
  { key: 'videos', label: 'Videos/Story', icon: <Play size={16} /> },
  { key: 'festivals', label: 'Lễ hội – phong tục', icon: <Landmark size={16} /> },
  { key: 'food', label: 'Ẩm thực địa phương', icon: <Utensils size={16} /> },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

const parseImages = (images?: string | string[]): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  const trimmed = String(images).trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
};

const renderStars = (rating: number, prefix = 'star') =>
  Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={`${prefix}-${i}`}
      className={`td-star ${i < Math.floor(rating) ? 'td-star--active' : 'td-star--inactive'}`}
    />
  ));

export default function TourDetail() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [province, setProvince] = useState<Province | null>(null);
  const [cultureItems, setCultureItems] = useState<CultureItem[]>([]);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('intro');
  const sectionRefs = useRef<Record<TabKey, HTMLElement | null>>({
    intro: null,
    highlights: null,
    videos: null,
    festivals: null,
    food: null,
  });

  useEffect(() => {
    if (!id) return;
    const tourId = Number(id);
    setLoading(true);

    const fetchData = async () => {
      try {
        const tourData = await getTourById(tourId);
        console.log('=== TOUR DETAIL RAW ===', JSON.parse(JSON.stringify(tourData)));
        setTour(tourData);

        const [provinceData, culture, related] = await Promise.all([
          tourData.provinceId ? getProvinceById(tourData.provinceId) : Promise.resolve(null),
          tourData.provinceId ? getCultureItemsByProvince(tourData.provinceId) : Promise.resolve([]),
          tourData.provinceId ? getToursByProvince(tourData.provinceId) : Promise.resolve([]),
        ]);

        setProvince(provinceData);
        setCultureItems(culture);
        setRelatedTours(related.filter((t) => t.id !== tourId).slice(0, 3));
      } catch (err) {
        console.error('Failed to load tour detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const scrollToSection = (key: TabKey) => {
    setActiveTab(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="td-loading">
        <div className="td-loading__spinner" />
        <p>Đang tải thông tin tour...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="td-loading">
        <p>Không tìm thấy tour này.</p>
        <Link to="/tours" className="btn btn-primary">Quay lại danh sách tour</Link>
      </div>
    );
  }

  const festivals = cultureItems.filter((c) => c.category === 'FESTIVAL' || c.category === 'DANCE' || c.category === 'LEGEND');
  const foodItems = cultureItems.filter((c) => c.category === 'FOOD');
  const highlights = cultureItems.filter((c) => c.category === 'CRAFT' || c.category === 'INSTRUMENT' || c.category === 'COSTUME');
  const videoItem = cultureItems.find((c) => c.videoUrl);

  return (
    <div className="tour-detail">
      {/* Hero */}
      <section className="td-hero">
        <img
          className="td-hero__image"
          src={tour.thumbnailUrl || '/nen.png'}
          alt={tour.title}
        />
      </section>

      {/* Tabs */}
      <nav className="td-tabs">
        <div className="td-tabs__container">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`td-tabs__item ${activeTab === tab.key ? 'td-tabs__item--active' : ''}`}
              onClick={() => scrollToSection(tab.key)}
              type="button"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* GIỚI THIỆU CHUNG */}
      <section
        className="td-section td-intro"
        ref={(el) => { sectionRefs.current.intro = el; }}
      >
        <div className="td-section__container">
          <h2 className="td-section__title td-section__title--decorated">GIỚI THIỆU CHUNG</h2>
          <div className="td-intro__grid">
            <div className="td-intro__text">
              <p>{tour.description}</p>
              {province && <p>{province.description}</p>}
            </div>
            <div className="td-intro__sidebar">
              <div className="td-quick-info">
                <h3 className="td-quick-info__title">Thông tin nhanh</h3>
                <div className="td-quick-info__item">
                  <Calendar size={16} />
                  <div>
                    <strong>Thời điểm đẹp nhất</strong>
                    <p>Tháng 10 - Tháng 3 (mùa khô, thời tiết mát mẻ)</p>
                  </div>
                </div>
                <div className="td-quick-info__item">
                  <Car size={16} />
                  <div>
                    <strong>Cách di chuyển</strong>
                    <p>{province ? `Từ ${province.name}` : 'Liên hệ để biết thêm'}</p>
                  </div>
                </div>
                <div className="td-quick-info__item">
                  <HandHeart size={16} />
                  <div>
                    <strong>Lưu ý văn hoá</strong>
                    <p>Trang phục lịch sự, tôn trọng phong tục địa phương</p>
                  </div>
                </div>
                <Link to={`/tours/${tour.id}/booking`} className="btn btn-primary td-quick-info__cta">
                  Đặt ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        className="td-section td-video"
        ref={(el) => { sectionRefs.current.videos = el; }}
      >
        <div className="td-video__wrapper">
          {videoItem?.videoUrl ? (
            <iframe
              className="td-video__player"
              src={videoItem.videoUrl}
              title={videoItem.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="td-video__placeholder">
              <img
                src={parseImages(tour.images)[1] || tour.thumbnailUrl || '/nen.png'}
                alt="Video placeholder"
              />
              <div className="td-video__play-btn">
                <Play size={48} />
              </div>
            </div>
          )}
        </div>
        <div className="td-video__caption">
          <h3>Một ngày ở {province?.name || tour.title}</h3>
          <p>Trải nghiệm một ngày đầy thú vị khám phá rừng thông, thác nước và văn hoá bản địa</p>
        </div>
      </section>

      {/* ĐỊA ĐIỂM NỔI BẬT */}
      <section
        className="td-section td-highlights"
        ref={(el) => { sectionRefs.current.highlights = el; }}
      >
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
                {parseImages(tour.images).slice(0, 3).map((img, i) => (
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

      {/* LỄ HỘI - PHONG TỤC */}
      <section
        className="td-section td-festivals"
        ref={(el) => { sectionRefs.current.festivals = el; }}
      >
        <div className="td-section__container">
          <h2 className="td-section__title td-section__title--decorated">LỄ HỘI - PHONG TỤC</h2>
          <div className="td-festivals__grid">
            <div className="td-festivals__list">
              {festivals.length > 0 ? festivals.slice(0, 3).map((item) => (
                <div key={item.id} className="td-festivals__item">
                  <div className="td-festivals__icon">
                    <Landmark size={24} />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              )) : (
                <>
                  <div className="td-festivals__item">
                    <div className="td-festivals__icon"><Landmark size={24} /></div>
                    <div>
                      <h4>Lễ hội cầu mùa</h4>
                      <p>Nghi lễ truyền thống của người Bahnar diễn ra vào dịp mùa khô, cầu mong một năm mưa thuận gió hoà, mùa màng bội thu...</p>
                    </div>
                  </div>
                  <div className="td-festivals__item">
                    <div className="td-festivals__icon"><Landmark size={24} /></div>
                    <div>
                      <h4>Không gian Cồng chiêng</h4>
                      <p>Di sản văn hoá phi vật thể của nhân loại, thể hiện tâm linh và nhịp sống của người Tây Nguyên qua âm thanh cồng chiêng.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="td-festivals__tips">
              <div className="td-festivals__tips-card">
                <h4><HandHeart size={18} /> Lưu ý ứng xử văn hoá</h4>
                <ul>
                  <li>Trang phục lịch sự khi tham dự nghi lễ</li>
                  <li>Tôn trọng không gian sinh hoạt chung</li>
                  <li>Tuyệt đối không chụp ảnh người dân địa phương, lấy tự ý đồng ý trước khi chụp hay quay</li>
                  <li>Không làm ồn trong khu vực lễ hội thiêng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ẨM THỰC ĐỊA PHƯƠNG */}
      <section
        className="td-section td-food"
        ref={(el) => { sectionRefs.current.food = el; }}
      >
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

      {/* CTA Banner */}
      <section className="td-cta-banner">
        <div className="td-cta-banner__container">
          <h3>Sẵn sàng khám phá {province?.name || tour.title}?</h3>
          <p>Đặt tour văn hoá để trải nghiệm rừng thông, thác nước và cồng chiêng</p>
          <div className="td-cta-banner__buttons">
            <Link to={`/tours/${tour.id}/booking`} className="btn btn-primary">Đặt ngay</Link>
            <Link to="/tours" className="btn btn-outline">Xem tour tổng quan</Link>
          </div>
        </div>
      </section>

      {/* TOUR GỢI Ý LIÊN QUAN */}
      {relatedTours.length > 0 && (
        <section className="td-section td-related">
          <div className="td-section__container">
            <h2 className="td-section__title td-section__title--decorated">TOUR GỢI Ý LIÊN QUAN</h2>
            <div className="td-related__grid">
              {relatedTours.map((t) => (
                <Link to={`/tours/${t.id}`} key={t.id} className="td-related__card">
                  <div className="td-related__card-images">
                    {parseImages(t.images).slice(0, 3).map((img, i) => (
                      <img key={i} src={img} alt={`${t.title} ${i + 1}`} className="td-related__thumb" />
                    ))}
                    {parseImages(t.images).length === 0 && (
                      <img src={t.thumbnailUrl || '/nen.png'} alt={t.title} className="td-related__thumb td-related__thumb--full" />
                    )}
                  </div>
                  <div className="td-related__card-content">
                    <h4>{t.title}</h4>
                    <p className="td-related__price">{formatPrice(t.price)} VND</p>
                    <div className="td-related__stars">{renderStars(t.averageRating, `related-${t.id}`)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
