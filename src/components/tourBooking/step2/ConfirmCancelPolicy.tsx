import { ExternalLink } from 'lucide-react';
import '../../../styles/components/tourBookingscss/step2/_confirm-cancel-policy.scss';

const POLICIES = [
  { period: 'Trước 7 ngày', refund: 'Hoàn 80%' },
  { period: 'Từ 3 – 6 ngày', refund: 'Hoàn 50%' },
  { period: 'Dưới 3 ngày', refund: 'Không hoàn' },
];

export default function ConfirmCancelPolicy() {
  return (
    <div className="confirm-cancel-policy">
      <div className="confirm-cancel-policy__label">
        <span className="confirm-cancel-policy__label-icon">⚠️</span>
        Chính sách hoàn huỷ
      </div>

      <div className="confirm-cancel-policy__content">
        <div className="confirm-cancel-policy__table">
          {POLICIES.map((p) => (
            <div key={p.period} className="confirm-cancel-policy__row">
              <span className="confirm-cancel-policy__period">{p.period}</span>
              <span className="confirm-cancel-policy__refund">{p.refund}</span>
            </div>
          ))}
        </div>

        <div className="confirm-cancel-policy__note">
          <p>
            Thời gian tính huỷ dựa trên ngày làm việc, không tính Thứ Bảy – Chủ Nhật và ngày Lễ,
            Tết.
          </p>
        </div>
      </div>

      <a href="#" className="confirm-cancel-policy__link">
        Xem chi tiết điều khoản <ExternalLink size={13} />
      </a>
    </div>
  );
}
