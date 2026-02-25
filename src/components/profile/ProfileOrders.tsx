import { useState, useMemo } from 'react';
import { Search, Eye, FileX, MessageCircle } from 'lucide-react';
import type { UserBooking } from '../../services/profileApi';
import '../../styles/components/profile/_profile-orders.scss';

interface ProfileOrdersProps {
  bookings: UserBooking[];
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Chờ xác nhận', cls: 'pending' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'confirmed' },
  COMPLETED: { label: 'Hoàn thành', cls: 'completed' },
  CANCELLED: { label: 'Đã huỷ', cls: 'cancelled' },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  UNPAID: { label: 'Chờ thanh toán', cls: 'unpaid' },
  PAID: { label: 'Đã thanh toán', cls: 'paid' },
  REFUNDED: { label: 'Đã hoàn tiền', cls: 'refunded' },
};

function formatPrice(n: number): string {
  return n.toLocaleString('vi-VN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export default function ProfileOrders({ bookings }: ProfileOrdersProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...bookings];

    if (statusFilter !== 'ALL') {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (dateFilter) {
      list = list.filter((b) => b.tourDate.startsWith(dateFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.tourTitle.toLowerCase().includes(q),
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [bookings, statusFilter, dateFilter, search]);

  return (
    <div className="profile-orders">
      <h3 className="profile-orders__title">Đơn của tôi</h3>

      {/* Filters */}
      <div className="profile-orders__filters">
        <select
          className="profile-orders__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã huỷ</option>
        </select>

        <input
          type="date"
          className="profile-orders__date-input"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          placeholder="MM/DD/YYYY"
        />

        <div className="profile-orders__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm mã đơn"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="profile-orders__empty">
          <p>Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="profile-orders__table-wrap">
          <table className="profile-orders__table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Tên tour</th>
                <th>Ngày khởi hành</th>
                <th>Số khách</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const statusInfo = STATUS_MAP[b.status] ?? {
                  label: b.status,
                  cls: 'default',
                };
                const paymentInfo = PAYMENT_STATUS_MAP[b.paymentStatus] ?? {
                  label: b.paymentStatus,
                  cls: 'default',
                };

                return (
                  <tr key={b.id}>
                    <td className="profile-orders__code">{b.bookingCode}</td>
                    <td className="profile-orders__tour-name">{b.tourTitle}</td>
                    <td>{formatDate(b.tourDate)}</td>
                    <td>{b.numParticipants}</td>
                    <td className="profile-orders__price">
                      {formatPrice(b.finalAmount)} VND
                    </td>
                    <td>
                      <span className={`profile-orders__badge profile-orders__badge--${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                      <span className={`profile-orders__badge profile-orders__badge--${paymentInfo.cls}`}>
                        {paymentInfo.label}
                      </span>
                    </td>
                    <td className="profile-orders__actions-cell">
                      <button className="profile-orders__action" title="Xem ticket">
                        <Eye size={14} /> Xem ticket
                      </button>
                      {b.status === 'PENDING' && (
                        <button className="profile-orders__action profile-orders__action--cancel" title="Tải hoá đơn">
                          <FileX size={14} /> Tải hoá đơn
                        </button>
                      )}
                      <button className="profile-orders__action" title="Liên hệ">
                        <MessageCircle size={14} /> Liên hệ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
