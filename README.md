# 🌾 Cội Việt

Nền tảng bảo tồn và trải nghiệm văn hóa địa phương Việt Nam

## 📖 Giới thiệu

Cội Việt là nền tảng số (web/app) nhằm bảo tồn và lan tỏa văn hóa vùng miền Việt Nam, giúp người trẻ kết nối với cội nguồn, du khách hiểu sâu về bản sắc Việt, và nghệ nhân có không gian truyền dạy.

## ✨ Tính năng chính

### 🌍 Bản đồ Văn hóa số
- Bản đồ tương tác khu vực Tây Nguyên
- Click vào từng tỉnh thành để xem:
  - Lễ hội đặc trưng
  - Ẩm thực truyền thống
  - Trang phục, ngôn ngữ, nhạc cụ, múa hát
  - Truyền thuyết dân gian, truyện cổ
  - Nghệ nhân / nhân vật văn hóa địa phương

### 🗺️ Tour trải nghiệm văn hóa
- Booking tour địa phương (chợ nổi, nhà rường, làng nghề, lễ hội…)
- Feedback người dùng (giới hạn 3 ảnh)
- Xử lý tour không đủ người (giảm giá, voucher)
- AI suggest tour dựa trên vị trí và thời điểm

### 📚 Học nhanh văn hóa Tây Nguyên
- Video/Story ngắn (3 phút hiểu về Hát Chèo, Sự tích Bánh Chưng Bánh Dày, Múa Xòe Thái...)
- Blog và bài đăng truyền tải thông điệp văn hóa

### 👨‍🎨 Góc nghệ nhân
- Card hiển thị thông tin nghệ nhân
- Gắn nghệ nhân với tour tương ứng

### 💾 Ký ức địa phương
- Người dùng chia sẻ "ký ức vùng miền":
  - Hình ảnh làng xưa
  - Giọng nói địa phương
  - Món ăn mẹ nấu, khung cảnh Tết quê…

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 6
- **Charts**: Recharts
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4
- **Icons**: Ant Design Icons, Lucide React

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── components/          # Components chung (public)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── ...
├── components/admin/    # Admin components
│   ├── AdminLayout.tsx
│   ├── AdminDashboard.tsx
│   ├── ContentManagement.tsx
│   ├── TourManagement.tsx
│   ├── BookingManagement.tsx
│   ├── ArtisanManagement.tsx
│   ├── UserManagement.tsx
│   └── EmailTemplates.tsx
├── pages/              # Pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── admin/
├── config/             # Configuration
│   └── antd-theme.ts
└── lib/                # Utilities
    └── utils.ts
```

## 🎯 Đối tượng sử dụng

- **GEN-Z**: Sinh viên, học sinh cần làm bài/biết về văn hóa vùng
- **Kiều bào**: Muốn kết nối với quê gốc
- **Người cao tuổi**: Muốn chia sẻ ký ức
- **Du khách nước ngoài**: Tìm hiểu văn hóa sâu
- **Người trẻ mất gốc**: Muốn tìm lại "tôi là ai"

## 💰 Mô hình kinh doanh

- **Freemium**: Miễn phí cho đa số người dùng
- **Tour thực tế**: Thu phí từ tour du lịch
- **Tài trợ**: Từ tổ chức bảo tồn văn hóa, UNESCO...
- **Hợp tác**: Với bên thứ 3 - ăn uống ngủ nghỉ
- **Setup plan**: Nếu không đi tour thì bỏ tiền để app setup plan

## 📝 License

© 2025 Cội Việt. Tất cả quyền được bảo lưu.
