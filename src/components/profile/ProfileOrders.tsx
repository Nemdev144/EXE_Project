import { useState, useMemo } from 'react';
import { Search, Eye, FileX, MessageCircle, X, Calendar, Clock, MapPin, Users, Mail, Phone, User as UserIcon, CreditCard, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserBooking } from '../../services/profileApi';
import '../../styles/components/profile/_profile-orders.scss';

interface ProfileOrdersProps {
  bookings: UserBooking[];
}

const ITEMS_PER_PAGE = 10;

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Chờ xác nhận', cls: 'pending' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'confirmed' },
  COMPLETED: { label: 'Hoàn thành', cls: 'completed' },
  CANCELLED: { label: 'Đã huỷ', cls: 'cancelled' },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  UNPAID: { label: 'Chờ thanh toán', cls: 'unpaid' },
  PENDING_CASH: { label: 'Thanh toán tại chỗ', cls: 'unpaid' },
  PAID: { label: 'Đã thanh toán', cls: 'paid' },
  REFUNDED: { label: 'Đã hoàn tiền', cls: 'refunded' },
  FAILED: { label: 'Thanh toán thất bại', cls: 'cancelled' },
};

function formatPrice(n: number): string {
  return n.toLocaleString('vi-VN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatDateFull(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function mapPaymentMethod(method: string | undefined): string {
  switch (method) {
    case 'VNPAY': return 'VNPay';
    case 'MOMO': return 'MoMo';
    case 'CASH': return 'Tiền mặt (tại điểm hẹn)';
    case 'CREDIT_CARD': return 'Thẻ tín dụng';
    case 'BANK_TRANSFER': return 'Chuyển khoản';
    default: return method || 'Tiền mặt';
  }
}

type FilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// ---------------------------------------------------------------------------
// Ticket Modal – hiển thị giống e-ticket card
// ---------------------------------------------------------------------------
function TicketModal({ booking, onClose }: { booking: UserBooking; onClose: () => void }) {
  const statusInfo = STATUS_MAP[booking.status] ?? { label: booking.status, cls: 'default' };
  const paymentInfo = PAYMENT_STATUS_MAP[booking.paymentStatus] ?? { label: booking.paymentStatus, cls: 'default' };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="ticket-modal__close" onClick={onClose} aria-label="Đóng">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="ticket-modal__header">
          <div className="ticket-modal__header-info">
            <span className={`ticket-modal__badge ticket-modal__badge--${statusInfo.cls}`}>
              {statusInfo.label}
            </span>
            <h3 className="ticket-modal__tour-title">{booking.tourTitle}</h3>
          </div>
        </div>

        {/* Divider */}
        <div className="ticket-modal__divider">
          <div className="ticket-modal__divider-notch ticket-modal__divider-notch--left" />
          <div className="ticket-modal__divider-line" />
          <div className="ticket-modal__divider-notch ticket-modal__divider-notch--right" />
        </div>

        {/* Body */}
        <div className="ticket-modal__body">
          {/* Code */}
          <div className="ticket-modal__code-section">
            <span className="ticket-modal__code-label">Mã đặt tour</span>
            <span className="ticket-modal__code-value">{booking.bookingCode}</span>
          </div>

          {/* Grid */}
          <div className="ticket-modal__grid">
            <div className="ticket-modal__field">
              <div className="ticket-modal__field-icon"><Calendar size={16} /></div>
              <div>
                <span className="ticket-modal__field-label">Ngày khởi hành</span>
                <span className="ticket-modal__field-value">{formatDateFull(booking.tourDate)}</span>
              </div>
            </div>
            <div className="ticket-modal__field">
              <div className="ticket-modal__field-icon"><Clock size={16} /></div>
              <div>
                <span className="ticket-modal__field-label">Giờ tập trung</span>
                <span className="ticket-modal__field-value">{formatTime(booking.tourStartTime)}</span>
              </div>
            </div>
            <div className="ticket-modal__field">
              <div className="ticket-modal__field-icon"><Users size={16} /></div>
              <div>
                <span className="ticket-modal__field-label">Số người</span>
                <span className="ticket-modal__field-value">{booking.numParticipants} người</span>
              </div>
            </div>
            <div className="ticket-modal__field">
              <div className="ticket-modal__field-icon"><MapPin size={16} /></div>
              <div>
                <span className="ticket-modal__field-label">Ngày đặt</span>
                <span className="ticket-modal__field-value">{formatDateFull(booking.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="ticket-modal__section">
            <h4 className="ticket-modal__section-title">Thông tin liên hệ</h4>
            <div className="ticket-modal__info-rows">
              <div className="ticket-modal__info-row">
                <UserIcon size={14} />
                <span className="ticket-modal__info-label">Họ tên:</span>
                <span className="ticket-modal__info-value">{booking.contactName || '—'}</span>
              </div>
              <div className="ticket-modal__info-row">
                <Mail size={14} />
                <span className="ticket-modal__info-label">Email:</span>
                <span className="ticket-modal__info-value">{booking.contactEmail || '—'}</span>
              </div>
              <div className="ticket-modal__info-row">
                <Phone size={14} />
                <span className="ticket-modal__info-label">SĐT:</span>
                <span className="ticket-modal__info-value">{booking.contactPhone || '—'}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="ticket-modal__section">
            <h4 className="ticket-modal__section-title">Thanh toán</h4>
            <div className="ticket-modal__info-rows">
              <div className="ticket-modal__info-row">
                <CreditCard size={14} />
                <span className="ticket-modal__info-label">Phương thức:</span>
                <span className="ticket-modal__info-value">{mapPaymentMethod(booking.paymentMethod)}</span>
              </div>
              <div className="ticket-modal__info-row">
                <Tag size={14} />
                <span className="ticket-modal__info-label">Trạng thái:</span>
                <span className={`ticket-modal__info-value ticket-modal__payment--${paymentInfo.cls}`}>
                  {paymentInfo.label}
                </span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="ticket-modal__info-row">
                  <Tag size={14} />
                  <span className="ticket-modal__info-label">Giảm giá:</span>
                  <span className="ticket-modal__info-value ticket-modal__info-value--discount">
                    -{formatPrice(booking.discountAmount)} VND
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="ticket-modal__total">
            <span>Tổng thanh toán</span>
            <strong>{formatPrice(booking.finalAmount)} VND</strong>
          </div>

          {/* Note */}
          <div className="ticket-modal__note">
            <p>Vui lòng đến điểm hẹn đúng giờ và mang theo mã đặt tour để xác nhận.</p>
            <p>Mọi thắc mắc xin liên hệ hotline: <strong>1900 xxxx</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileOrders – bảng booking + phân trang + modal ticket
// ---------------------------------------------------------------------------
export default function ProfileOrders({ bookings }: ProfileOrdersProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);

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

  // Reset page when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const paginatedItems = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers to show (max 5 visible)
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="profile-orders">
      <h3 className="profile-orders__title">Đơn của tôi</h3>

      {/* Filters */}
      <div className="profile-orders__filters">
        <select
          className="profile-orders__select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setCurrentPage(1); }}
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
          onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          placeholder="MM/DD/YYYY"
        />

        <div className="profile-orders__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc tên tour"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Result count */}
      <div className="profile-orders__result-info">
        Hiển thị {paginatedItems.length} / {filtered.length} đơn hàng
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="profile-orders__empty">
          <p>Không có đơn hàng nào.</p>
        </div>
      ) : (
        <>
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
                {paginatedItems.map((b) => {
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
                        <button
                          className="profile-orders__action"
                          title="Xem ticket"
                          onClick={() => setSelectedBooking(b)}
                        >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="profile-orders__pagination">
              <button
                className="profile-orders__page-btn profile-orders__page-btn--nav"
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                aria-label="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="profile-orders__page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`profile-orders__page-btn ${p === safePage ? 'profile-orders__page-btn--active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className="profile-orders__page-btn profile-orders__page-btn--nav"
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                aria-label="Trang sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Ticket Modal */}
      {selectedBooking && (
        <TicketModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
