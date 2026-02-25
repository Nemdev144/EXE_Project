import { Ticket, Clock, AlertCircle } from 'lucide-react';
import type { UserVoucher } from '../../services/profileApi';
import '../../styles/components/profile/_profile-voucher.scss';

interface ProfileVoucherProps {
  vouchers: UserVoucher[];
}

function formatPrice(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString('vi-VN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function ProfileVoucher({ vouchers }: ProfileVoucherProps) {
  const now = new Date();

  return (
    <div className="profile-voucher">
      <h3 className="profile-voucher__title">Ví voucher</h3>

      {vouchers.length === 0 ? (
        <div className="profile-voucher__empty">
          <Ticket size={40} />
          <p>Bạn chưa có voucher nào.</p>
          <p className="profile-voucher__empty-hint">
            Hoàn thành Quiz đạt 100%, tham gia Workshop hoặc đặt tour
            trong chương trình khuyến mãi đặc biệt
          </p>
        </div>
      ) : (
        <>
          <div className="profile-voucher__grid">
            {vouchers.map((v) => {
              const expired = new Date(v.validUntil) < now;
              const used = v.currentUsage >= v.maxUsage;
              const disabled = expired || used || !v.isActive;

              return (
                <div
                  key={v.id}
                  className={`profile-voucher__card ${disabled ? 'profile-voucher__card--disabled' : ''}`}
                >
                  {/* Left ticket stub */}
                  <div className="profile-voucher__card-left">
                    <span className="profile-voucher__amount">
                      {v.discountType === 'PERCENTAGE'
                        ? `${v.discountValue}%`
                        : formatPrice(v.discountValue)}
                    </span>
                    <span className="profile-voucher__code">{v.code}</span>
                  </div>

                  {/* Right info */}
                  <div className="profile-voucher__card-right">
                    <p className="profile-voucher__condition">
                      Áp dụng
                      {v.minPurchase > 0
                        ? ` đơn từ ${formatPrice(v.minPurchase)}`
                        : ' cho mọi đơn'}
                    </p>
                    <p className="profile-voucher__expiry">
                      {expired ? (
                        <span className="profile-voucher__expired">
                          <AlertCircle size={12} /> Đã sử dụng/hết hạn
                        </span>
                      ) : (
                        <span>
                          <Clock size={12} /> Hạn sử dụng: {formatDate(v.validUntil)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="profile-voucher__footer">
            <p className="profile-voucher__footer-title">Cách nhận thêm Voucher</p>
            <p className="profile-voucher__footer-text">
              Hoàn thành Quiz đạt 100%, tham gia Workshop hoặc đặt tour
              trong chương trình khuyến mãi đặc biệt
            </p>
          </div>
        </>
      )}
    </div>
  );
}
