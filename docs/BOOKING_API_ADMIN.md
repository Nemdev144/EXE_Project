# Tổng kết API Booking cho Admin

Theo **Swagger – Booking controller** (các endpoint có khóa = cần xác thực):

| # | Method | Path | Mục đích | Trong code hiện tại |
|---|--------|------|----------|----------------------|
| 1 | GET | `/api/bookings` | Danh sách booking (có phân trang/lọc) | `getAdminBookings()` → `/api/admin/bookings` |
| 2 | POST | `/api/bookings` | Tạo booking mới | Chưa có |
| 3 | POST | `/api/bookings/suggest` | Gợi ý (slots/giá/…) trước khi đặt | Chưa có |
| 4 | GET | `/api/bookings/{id}` | Chi tiết một booking | `getAdminBookingById(id)` → `/api/admin/bookings/{id}` |
| 5 | DELETE | `/api/bookings/{id}` | Hủy booking | `cancelBooking(id)` → DELETE `/api/bookings/{id}` ✓ |
| 6 | GET | `/api/bookings/{id}/cancellation-fee` | Lấy phí hủy theo booking | `getBookingCancellationFee()` ✓ |
| 7 | GET | `/api/bookings/check-availability` | Kiểm tra còn chỗ / khả dụng | `checkBookingAvailability()` ✓ |

**Lưu ý:** Swagger dùng base path `/api/bookings`; code hiện tại dùng `/api/admin/bookings`. Nếu backend của bạn chỉ có `/api/bookings` thì cần đổi base path trong `adminApi.ts` cho các hàm booking.

---

## Cần bổ sung cho admin

1. **GET cancellation-fee** – Dùng khi hủy: lấy phí hủy từ server thay vì tính tay trong `BookingManagement`.
2. **GET check-availability** – Dùng khi tạo/sửa booking hoặc trang đặt tour: kiểm tra còn chỗ theo tour + ngày.
3. **POST /api/bookings** – Nếu admin cần tạo booking thay khách (tạo mới).
4. **POST suggest** – Nếu có bước “gợi ý ngày/giá” trước khi tạo booking.
5. ~~DELETE thay POST cancel~~ – Đã cập nhật: `cancelBooking` dùng DELETE `/api/bookings/{id}`.

File gọi API: `src/services/adminApi.ts`.  
UI admin: `src/components/admin/BookingManagement.tsx`.
