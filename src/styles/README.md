# SCSS Structure Guide

## 📁 Cấu trúc thư mục

```
src/styles/
├── main.scss                 # Entry point - Import tất cả
├── _variables.scss           # Variables (colors, spacing, typography)
├── _mixins.scss              # Reusable mixins
├── _base.scss                # Global resets & base styles
├── components/
│   ├── _button.scss          # Button component styles
│   ├── _card.scss            # Card component styles
│   ├── _form.scss            # Form component styles
│   ├── _layout.scss          # Layout components (Navbar, Footer)
│   └── _admin.scss           # Admin-specific styles
└── pages/
    ├── _login.scss           # Login page styles
    └── _register.scss        # Register page styles
```

## 🎨 Variables (_variables.scss)

Chứa tất cả các biến dùng chung:
- **Colors**: Primary, grays, reds, blues
- **Spacing**: xs, sm, md, lg, xl, 2xl
- **Typography**: Font sizes, weights, family
- **Border Radius**: sm, md, lg, xl, full
- **Shadows**: sm, md, lg, xl
- **Breakpoints**: sm, md, lg, xl, 2xl

## 🔧 Mixins (_mixins.scss)

Các mixin có thể tái sử dụng:
- `@include respond-to($breakpoint)` - Responsive breakpoints
- `@include flex-center` - Flexbox center
- `@include flex-between` - Flexbox space-between
- `@include form-input` - Form input styles
- `@include button-primary/secondary/danger` - Button variants
- `@include card` - Card styles
- `@include screen-full` - Full screen width/height

## 📄 Naming Convention

### BEM Methodology
- **Block**: `.login-page`
- **Element**: `.login-page__title`
- **Modifier**: `.button--primary`

### Ví dụ:
```scss
.login-page {
  &__title { }        // .login-page__title
  &__form { }         // .login-page__form
  &__input { }        // .login-page__input
}
```

## 🚀 Cách sử dụng

### 1. Import trong component:
```tsx
import '../styles/pages/_login.scss';
```

### 2. Hoặc import trong main.scss (khuyến nghị):
```scss
@import 'pages/login';
```

### 3. Sử dụng trong JSX:
```tsx
<div className="login-page">
  <h1 className="login-page__title">Đăng Nhập</h1>
</div>
```

## 📝 Best Practices

1. **Luôn import variables và mixins trước**:
   ```scss
   @import '../variables';
   @import '../mixins';
   ```

2. **Sử dụng BEM naming**:
   - Block: Component name
   - Element: `__element-name`
   - Modifier: `--modifier-name`

3. **Tận dụng mixins**:
   - Không viết lại code đã có trong mixins
   - Tạo mixin mới nếu pattern lặp lại 3+ lần

4. **Variables cho mọi giá trị**:
   - Không hardcode colors, spacing
   - Dùng variables từ `_variables.scss`

5. **Responsive với mixin**:
   ```scss
   @include respond-to(lg) {
     width: 60%;
   }
   ```

## 🔄 Migration từ Tailwind

### Trước (Tailwind):
```tsx
<div className="w-full bg-white rounded-lg p-4">
```

### Sau (SCSS):
```tsx
<div className="card">
```
```scss
.card {
  width: 100%;
  background-color: $color-white;
  border-radius: $radius-lg;
  padding: $spacing-md;
}
```

## ⚠️ Lưu ý

- **Không conflict với Ant Design**: SCSS chỉ dùng cho public pages (Login/Register)
- **Ant Design**: Vẫn dùng cho Admin/Staff dashboards
- **Isolation**: Login/Register pages có class riêng để tránh conflict
