import { Landmark, HandHeart } from 'lucide-react';
import type { CultureItem } from '../../../types';

interface FestivalsSectionProps {
  festivals: CultureItem[];
  sectionRef: (el: HTMLElement | null) => void;
}

export default function FestivalsSection({
  festivals,
  sectionRef,
}: FestivalsSectionProps) {
  return (
    <section className="td-section td-festivals" ref={sectionRef}>
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
  );
}
