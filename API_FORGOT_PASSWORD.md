# API Hướng dẫn sử dụng - Quên mật khẩu và Đặt lại mật khẩu

## Tổng quan

Hệ thống cung cấp 2 API để xử lý quên mật khẩu:
1. **POST /auth/forgot-password** - Yêu cầu gửi email đặt lại mật khẩu
2. **POST /auth/reset-password** - Đặt lại mật khẩu mới bằng token

## Flow hoàn chỉnh

```
1. User nhập email → POST /auth/forgot-password
2. Server tạo token và gửi email chứa link reset
3. User click link trong email (chứa token)
4. Frontend hiển thị form nhập mật khẩu mới
5. User nhập mật khẩu mới → POST /auth/reset-password
6. Server xác thực token và cập nhật mật khẩu
```

---

## API 1: Quên mật khẩu

### Endpoint
```
POST /auth/forgot-password
```

### Mô tả
Gửi email chứa link đặt lại mật khẩu đến địa chỉ email của người dùng. Server sẽ tạo một token duy nhất và gửi link reset password qua email.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ Yes | Email của tài khoản cần đặt lại mật khẩu |
| `resetUrl` | string | ❌ No | URL frontend để reset password (mặc định lấy từ env) |

### Request Example

```json
{
  "email": "user@example.com",
  "resetUrl": "http://localhost:3000/reset-password"
}
```

**Lưu ý:** 
- `resetUrl` là tùy chọn. Nếu không cung cấp, server sẽ sử dụng giá trị từ biến môi trường `FRONTEND_RESET_PASSWORD_URL` hoặc mặc định `http://localhost:3000/reset-password`
- Link reset sẽ có format: `{resetUrl}?token={resetToken}`

### Response Success (200)

```json
{
  "data": {
    "message": "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu"
  },
  "statusCode": 200,
  "message": "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu"
}
```

**Lưu ý bảo mật:** API luôn trả về message thành công kể cả khi email không tồn tại để tránh tiết lộ thông tin.

### Response Error (400)

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "email should not be empty"],
  "error": "Bad Request"
}
```

### Response Error (500)

```json
{
  "statusCode": 500,
  "message": "Lỗi xác thực email. Vui lòng kiểm tra cấu hình SMTP trong file .env. Xem log trên để biết chi tiết.",
  "error": "Internal Server Error"
}
```

### Email được gửi

Người dùng sẽ nhận được email với:
- **Subject:** "Đặt lại mật khẩu"
- **Nội dung:** HTML email chứa:
  - Link button "Đặt lại mật khẩu"
  - Link text đầy đủ để copy/paste
  - Thông báo token hết hạn sau 1 giờ

**Ví dụ link trong email:**
```
http://localhost:3000/reset-password?token=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## API 2: Đặt lại mật khẩu

### Endpoint
```
POST /auth/reset-password
```

### Mô tả
Đặt lại mật khẩu mới cho tài khoản sử dụng token từ email. Token có thời hạn 1 giờ kể từ khi được tạo.

### Request Body

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `token` | string | ✅ Yes | Not empty | Token từ link trong email |
| `newPassword` | string | ✅ Yes | Min 6 characters | Mật khẩu mới |

### Request Example

```json
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "newPassword": "newPassword123"
}
```

### Response Success (200)

```json
{
  "data": {
    "message": "Đặt lại mật khẩu thành công"
  },
  "statusCode": 200,
  "message": "Đặt lại mật khẩu thành công"
}
```

### Response Error (400) - Token không hợp lệ

```json
{
  "statusCode": 400,
  "message": "Token không hợp lệ hoặc đã hết hạn",
  "error": "Bad Request"
}
```

### Response Error (400) - Token đã hết hạn

```json
{
  "statusCode": 400,
  "message": "Token đã hết hạn. Vui lòng yêu cầu lại link đặt lại mật khẩu",
  "error": "Bad Request"
}
```

### Response Error (400) - Validation error

```json
{
  "statusCode": 400,
  "message": [
    "token should not be empty",
    "newPassword must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## Ví dụ sử dụng với cURL

### 1. Yêu cầu quên mật khẩu

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "resetUrl": "http://localhost:3000/reset-password"
  }'
```

### 2. Đặt lại mật khẩu

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    "newPassword": "newSecurePassword123"
  }'
```

---

## Ví dụ sử dụng với JavaScript/TypeScript

### 1. Yêu cầu quên mật khẩu

```javascript
async function forgotPassword(email, resetUrl) {
  try {
    const response = await fetch('http://localhost:3000/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        resetUrl: resetUrl || 'http://localhost:3000/reset-password'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Email đã được gửi:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('Lỗi:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
forgotPassword('user@example.com', 'http://localhost:3000/reset-password');
```

### 2. Đặt lại mật khẩu

```javascript
async function resetPassword(token, newPassword) {
  try {
    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        newPassword: newPassword
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Đặt lại mật khẩu thành công:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('Lỗi:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng (token từ URL query parameter)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
resetPassword(token, 'newSecurePassword123');
```

---

## Ví dụ sử dụng với React

### Component ForgotPassword

```jsx
import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          resetUrl: window.location.origin + '/reset-password'
        })
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Quên mật khẩu</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email của bạn"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### Component ResetPassword

```jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ. Vui lòng yêu cầu lại link đặt lại mật khẩu.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Token không hợp lệ</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đặt lại mật khẩu</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu mới"
        required
        minLength={6}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Xác nhận mật khẩu"
        required
        minLength={6}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </form>
  );
}
```

---

## Lưu ý quan trọng

### Bảo mật
1. **Token hết hạn:** Token chỉ có hiệu lực trong 1 giờ kể từ khi được tạo
2. **Token một lần:** Sau khi đặt lại mật khẩu thành công, token sẽ bị xóa và không thể sử dụng lại
3. **Email validation:** Server luôn trả về message thành công để không tiết lộ email có tồn tại hay không

### Validation
- Email phải đúng format email
- Mật khẩu mới phải có ít nhất 6 ký tự
- Token phải được cung cấp và không được để trống

### Error Handling
- Luôn kiểm tra `response.ok` hoặc `statusCode` trước khi xử lý data
- Hiển thị thông báo lỗi rõ ràng cho người dùng
- Xử lý trường hợp token hết hạn hoặc không hợp lệ

### Frontend Integration
1. **Trang quên mật khẩu:** Form nhập email → gọi API `/auth/forgot-password`
2. **Trang reset password:** 
   - Lấy token từ URL query parameter (`?token=...`)
   - Form nhập mật khẩu mới → gọi API `/auth/reset-password`
   - Redirect về trang login sau khi thành công

---

## Testing

### Test Case 1: Quên mật khẩu thành công
```bash
POST /auth/forgot-password
Body: { "email": "existing@example.com" }
Expected: 200, message thành công
```

### Test Case 2: Email không tồn tại
```bash
POST /auth/forgot-password
Body: { "email": "notexist@example.com" }
Expected: 200, message thành công (bảo mật)
```

### Test Case 3: Đặt lại mật khẩu thành công
```bash
POST /auth/reset-password
Body: { "token": "valid-token", "newPassword": "newpass123" }
Expected: 200, message thành công
```

### Test Case 4: Token không hợp lệ
```bash
POST /auth/reset-password
Body: { "token": "invalid-token", "newPassword": "newpass123" }
Expected: 400, "Token không hợp lệ hoặc đã hết hạn"
```

### Test Case 5: Token hết hạn
```bash
POST /auth/reset-password
Body: { "token": "expired-token", "newPassword": "newpass123" }
Expected: 400, "Token đã hết hạn. Vui lòng yêu cầu lại link đặt lại mật khẩu"
```

### Test Case 6: Mật khẩu quá ngắn
```bash
POST /auth/reset-password
Body: { "token": "valid-token", "newPassword": "123" }
Expected: 400, validation error
```

---

## Troubleshooting

### Email không được gửi
- Kiểm tra cấu hình SMTP trong file `.env`
- Xem log server để biết lỗi cụ thể
- Đảm bảo đã cấu hình App Password cho Gmail (nếu dùng Gmail)

### Token không hoạt động
- Kiểm tra token có đúng format không
- Kiểm tra token có hết hạn chưa (1 giờ)
- Đảm bảo token chưa được sử dụng

### Lỗi validation
- Kiểm tra email đúng format
- Đảm bảo mật khẩu có ít nhất 6 ký tự
- Kiểm tra tất cả field required đã được gửi

---

## Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra log server
2. Xem file `SMTP_SETUP.md` để cấu hình email
3. Kiểm tra file `.env` có đúng cấu hình không



