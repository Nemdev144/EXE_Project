# API Đổi mật khẩu (Admin reset password)

## Theo Swagger BE (exe-1-k8ma.onrender.com)

**user-controller:**
- POST /api/users/change-password – User tự đổi (cần oldPassword, newPassword)
- **Không có** /api/users/{id}/reset-password

**admin-user-controller:**
- PUT /api/admin/users/{id}/status
- PUT /api/admin/users/{id}/role
- **Không có** reset-password trong Swagger

## FE hiện dùng

- **Method:** `PUT`
- **Path:** `/api/admin/users/{id}/password`
- **Body:** `{ "newPassword": "string" }`
- Cùng pattern với status/role (admin cập nhật field user)

## Nếu vẫn lỗi 500/404

BE cần thêm endpoint. Đề xuất:

```
PUT /api/admin/users/{id}/password
Authorization: Bearer <admin_token>
Content-Type: application/json
Body: { "newPassword": "matkhau123" }
Response 200: { "success": true, ... }
```

Hoặc:

```
POST /api/admin/users/{id}/reset-password
Body: { "newPassword": "matkhau123" }
```
