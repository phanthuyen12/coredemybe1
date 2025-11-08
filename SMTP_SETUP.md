# Hướng dẫn cấu hình SMTP cho chức năng Quên mật khẩu

## Lỗi hiện tại: "Username and Password not accepted"

Lỗi này xảy ra vì bạn đang sử dụng mật khẩu Gmail thông thường thay vì **App Password**.

## Cách khắc phục cho Gmail:

### Bước 1: Bật 2-Step Verification
1. Vào: https://myaccount.google.com/security
2. Tìm mục "2-Step Verification" và bật nó
3. Làm theo hướng dẫn để xác thực số điện thoại

### Bước 2: Tạo App Password
1. Vào: https://myaccount.google.com/apppasswords
2. Chọn "Mail" từ dropdown "Select app"
3. Chọn "Other (Custom name)" từ dropdown "Select device"
4. Nhập tên: "NestJS Backend" hoặc tên bạn muốn
5. Click "Generate"
6. **Copy App Password** (16 ký tự, có thể có khoảng trắng - xóa khoảng trắng khi dùng)

### Bước 3: Tạo file .env
Tạo file `.env` trong thư mục root của project với nội dung:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_RESET_PASSWORD_URL=http://localhost:3000/reset-password

# Environment
NODE_ENV=development
```

**Lưu ý quan trọng:**
- `SMTP_PASS` phải là **App Password** (16 ký tự), KHÔNG phải mật khẩu Gmail thông thường
- Xóa tất cả khoảng trắng trong App Password nếu có
- Không commit file `.env` vào git (đã có trong .gitignore)

### Bước 4: Khởi động lại server
Sau khi cấu hình xong, khởi động lại NestJS server để áp dụng cấu hình mới.

## Cấu hình cho các SMTP khác:

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Kiểm tra cấu hình:

Sau khi khởi động server, bạn sẽ thấy log:
- ✅ `SMTP connection verified successfully` - Cấu hình đúng
- ❌ `SMTP connection failed` - Kiểm tra lại cấu hình

## Troubleshooting:

1. **Lỗi EAUTH (Authentication failed):**
   - Kiểm tra SMTP_USER và SMTP_PASS
   - Với Gmail: Đảm bảo dùng App Password, không dùng mật khẩu thường
   - Đảm bảo đã bật 2-Step Verification

2. **Lỗi ECONNECTION:**
   - Kiểm tra SMTP_HOST và SMTP_PORT
   - Kiểm tra firewall/network

3. **Email không gửi được:**
   - Kiểm tra log trong console
   - Kiểm tra spam folder
   - Thử với email khác



