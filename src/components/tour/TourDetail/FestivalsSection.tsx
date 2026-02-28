import { Landmark, HandHeart, Camera, Volume2, Shirt, Footprints } from 'lucide-react';
import type { CultureItem } from '../../../types';

/* ── Hardcoded fallback festivals ── */
const FALLBACK_FESTIVALS: Pick<CultureItem, 'id' | 'title' | 'description'>[] = [
  {
    id: -1,
    title: 'Lễ hội cầu mùa',
    description:
      'Nghi lễ truyền thống của người Bahnar diễn ra vào dịp mùa khô, cầu mong một năm mưa thuận gió hoà, mùa màng bội thu.',
  },
  {
    id: -2,
    title: 'Không gian Cồng chiêng',
    description:
      'Di sản văn hoá phi vật thể của nhân loại, thể hiện tâm linh và nhịp sống của người Tây Nguyên qua âm thanh cồng chiêng.',
  },
];

/* ── Hardcoded cultural tips ── */
const CULTURE_TIPS = [
  { icon: <Shirt size={18} />, text: 'Mặc trang phục lịch sự, kín đáo khi tham dự các nghi lễ truyền thống' },
  { icon: <Footprints size={18} />, text: 'Xin phép trước khi bước vào nhà rông hoặc khu vực sinh hoạt cộng đồng' },
  { icon: <Camera size={18} />, text: 'Luôn xin phép trước khi chụp ảnh hoặc quay phim người dân địa phương' },
  { icon: <Volume2 size={18} />, text: 'Giữ yên lặng và không làm ồn trong khu vực lễ hội thiêng' },
];

interface FestivalsSectionProps {
  festivals: CultureItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

export default function FestivalsSection({
  festivals,
  sectionRef,
}: FestivalsSectionProps) {
  const displayFestivals =
    festivals.length > 0 ? festivals.slice(0, 2) : FALLBACK_FESTIVALS;

  return (
    <section className="td-section td-festivals" ref={sectionRef}>
      <div className="td-section__container">
        <h2 className="td-section__title td-section__title--decorated">
          LỄ HỘI &amp; PHONG TỤC
        </h2>

        {/* Festival cards — max 2 */}
        <div className="td-festivals__cards">
          {displayFestivals.map((item, idx) => (
            <div key={item.id} className="td-festivals__card">
              <span className="td-festivals__card-number">0{idx + 1}</span>
              <div className="td-festivals__card-icon">
                <Landmark size={28} />
              </div>
              <h4 className="td-festivals__card-title">{item.title}</h4>
              <p className="td-festivals__card-desc">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Cultural behavior tips — hardcoded */}
        <div className="td-festivals__tips-card">
          <h4 className="td-festivals__tips-heading">
            <HandHeart size={20} />
            Lưu ý ứng xử văn hoá
          </h4>
          <div className="td-festivals__tips-grid">
            {CULTURE_TIPS.map((tip, i) => (
              <div key={i} className="td-festivals__tip">
                <span className="td-festivals__tip-icon">{tip.icon}</span>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
