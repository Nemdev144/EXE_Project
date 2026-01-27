# Hướng dẫn Setup Bản Đồ Tương Tác

## 1. File GeoJSON

Đặt file GeoJSON tại:
```
public/geo/vn-provinces.geojson
```

File này chứa ranh giới các tỉnh Việt Nam. Bạn có thể tải từ:
- [Vietnam Administrative Boundaries](https://github.com/...) 
- Hoặc tạo từ dữ liệu OpenStreetMap

**Lưu ý**: File GeoJSON cần có property chứa tên tỉnh (ví dụ: `NAME_1`, `name`, hoặc `NAME`). Component sẽ tự động tìm property này.

## 2. Cài đặt Dependencies

Component sử dụng **Leaflet** + **OpenStreetMap** (miễn phí, không cần API key):

```bash
npm install
```

Dependencies đã được thêm vào `package.json`:
- `leaflet` - Thư viện bản đồ
- `@types/leaflet` - TypeScript types

## 3. Import Component

Component đã được import sẵn trong `HomePage.tsx`:

```tsx
import { MapSection } from '../components/home';

// Sử dụng:
<MapSection provinces={data.provinces} />
```

**Lưu ý**: 
- Component có thể tự fetch `provinces` nếu không truyền props
- Component sẽ tự động fetch `cultureItems` khi hover/click tỉnh

## 4. Cấu trúc File

```
src/
  components/
    home/
      MapSection.tsx          # Component chính
      mapSection.scss         # Styles
  public/
    geo/
      vn-provinces.geojson    # File GeoJSON (cần tạo)
  .env                       # File env (cần tạo)
```

## 5. Tính năng

✅ Hiển thị Google Map với GeoJSON ranh giới tỉnh
✅ Chỉ 5 tỉnh Tây Nguyên có tương tác: Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông, Lâm Đồng
✅ Các tỉnh khác hiển thị mờ, không click được
✅ Hover tỉnh → hiển thị danh sách văn hóa (debounce 200ms)
✅ Click tỉnh → "lock" tỉnh đó, hiển thị danh sách văn hóa
✅ Panel desktop (bên phải) / Drawer mobile (bottom sheet)
✅ Cache API calls để tránh gọi lại
✅ Loading, Error, Empty states
✅ Mapping tự động province name → provinceId từ API

## 6. Troubleshooting

### Map không hiển thị:
- Kiểm tra console có lỗi không
- Đảm bảo file GeoJSON tồn tại tại `public/geo/vn-provinces.geojson`
- Kiểm tra Leaflet CSS đã được import chưa (đã có trong component)
- Nếu marker icon không hiển thị, component đã tự động fix bằng CDN

### Tỉnh không highlight:
- Kiểm tra tên tỉnh trong GeoJSON có khớp với tên trong database không
- Component dùng normalize (bỏ dấu, lowercase) để so sánh
- Kiểm tra `TAY_NGUYEN_PROVINCES` array trong component

### API không gọi:
- Kiểm tra service `getCultureItemsByProvince` có hoạt động không
- Kiểm tra network tab trong DevTools
- Kiểm tra `provinceMapRef` có được build đúng không

## 7. Customization

### Thay đổi màu sắc:
Sửa trong `mapSection.scss`:
```scss
fillColor: '#cc0000',  // Màu fill khi selected/hover
strokeColor: '#cc0000', // Màu viền
```

### Thay đổi tỉnh được highlight:
Sửa array `TAY_NGUYEN_PROVINCES` trong `MapSection.tsx`:
```tsx
const TAY_NGUYEN_PROVINCES = [
  'Kon Tum',
  'Gia Lai',
  // ... thêm tỉnh khác
];
```

### Thay đổi debounce time:
Sửa trong `loadCultureItems`:
```tsx
debounce(async (provinceId: number) => {
  // ...
}, 200) // Thay đổi 200ms thành giá trị khác
```
