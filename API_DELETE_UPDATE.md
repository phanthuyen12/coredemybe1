# API Hướng dẫn sử dụng - Xóa và Cập nhật

## Tổng quan

Tài liệu này mô tả các API để:
1. **Xóa danh mục videos (Category)** - `DELETE /categories/:id`
2. **Xóa khóa học (Course)** - `DELETE /courses/:id`
3. **Xóa videos** - `DELETE /videos/:id`
4. **Cập nhật user** - `PUT /user/:id`

---

## 1. API Xóa Danh mục Videos (Category)

### Endpoint
```
DELETE /categories/:id
```

### Mô tả
Xóa một danh mục videos (category) theo ID. Khi xóa category, các video thuộc category đó cũng sẽ bị xóa (CASCADE).

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | ✅ Yes | ID của category cần xóa |

### Request Example

```bash
DELETE /categories/1
```

### Response Success (200)

```json
{
  "data": null,
  "statusCode": 200,
  "message": "Category deleted successfully"
}
```

### Response Error (404)

```json
{
  "statusCode": 404,
  "message": "Category with ID 1 not found",
  "error": "Not Found"
}
```

### Ví dụ sử dụng

#### cURL
```bash
curl -X DELETE http://localhost:3000/categories/1
```

#### JavaScript/TypeScript
```javascript
async function deleteCategory(categoryId) {
  try {
    const response = await fetch(`http://localhost:3000/categories/${categoryId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Category deleted successfully:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('Error:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
deleteCategory(1);
```

#### React Example
```jsx
import React, { useState } from 'react';

function DeleteCategoryButton({ categoryId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        onDelete(categoryId);
        alert('Xóa danh mục thành công');
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Đang xóa...' : 'Xóa danh mục'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 2. API Xóa Khóa học (Course)

### Endpoint
```
DELETE /courses/:id
```

### Mô tả
Xóa một khóa học theo ID. Khi xóa course, các category và video thuộc course đó cũng sẽ bị xóa (CASCADE).

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | ✅ Yes | ID của course cần xóa |

### Request Example

```bash
DELETE /courses/1
```

### Response Success (200)

```json
{
  "data": null,
  "statusCode": 200,
  "message": "Course deleted successfully"
}
```

### Response Error (404)

```json
{
  "statusCode": 404,
  "message": "Course with ID 1 not found",
  "error": "Not Found"
}
```

### Ví dụ sử dụng

#### cURL
```bash
curl -X DELETE http://localhost:3000/courses/1
```

#### JavaScript/TypeScript
```javascript
async function deleteCourse(courseId) {
  try {
    const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Course deleted successfully:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('Error:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
deleteCourse(1);
```

#### React Example
```jsx
import React, { useState } from 'react';

function DeleteCourseButton({ courseId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này? Tất cả danh mục và video sẽ bị xóa.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        onDelete(courseId);
        alert('Xóa khóa học thành công');
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Đang xóa...' : 'Xóa khóa học'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 3. API Xóa Videos

### Endpoint
```
DELETE /videos/:id
```

### Mô tả
Xóa một video theo ID.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | ✅ Yes | ID của video cần xóa |

### Request Example

```bash
DELETE /videos/1
```

### Response Success (200)

```json
{
  "data": null,
  "statusCode": 200,
  "message": "Video deleted successfully"
}
```

### Response Error (404)

```json
{
  "statusCode": 404,
  "message": "Video with ID 1 not found",
  "error": "Not Found"
}
```

### Ví dụ sử dụng

#### cURL
```bash
curl -X DELETE http://localhost:3000/videos/1
```

#### JavaScript/TypeScript
```javascript
async function deleteVideo(videoId) {
  try {
    const response = await fetch(`http://localhost:3000/videos/${videoId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Video deleted successfully:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('Error:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
deleteVideo(1);
```

#### React Example
```jsx
import React, { useState } from 'react';

function DeleteVideoButton({ videoId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/videos/${videoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        onDelete(videoId);
        alert('Xóa video thành công');
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Đang xóa...' : 'Xóa video'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

## 4. API Cập nhật User

### Endpoint
```
PUT /user/:id
```

### Mô tả
Cập nhật thông tin của một user theo ID. Có thể cập nhật username, email, role, và password.

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | ✅ Yes | ID của user cần cập nhật |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | ❌ No | Tên đăng nhập mới |
| `email` | string | ❌ No | Email mới |
| `role` | string | ❌ No | Vai trò mới (ctv, admin, user) |
| `password` | string | ❌ No | Mật khẩu mới (sẽ được hash tự động) |

**Lưu ý:** Tất cả các field đều là tùy chọn. Chỉ cần gửi các field muốn cập nhật.

### Request Example

```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "role": "admin",
  "password": "newpassword123"
}
```

### Response Success (200)

```json
{
  "data": {
    "id": 1,
    "username": "newusername",
    "email": "newemail@example.com",
    "role": "admin",
    "status": "Active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statusCode": 200,
  "message": "Update user success"
}
```

### Response Error (404)

```json
{
  "statusCode": 404,
  "message": "User with ID 1 not found",
  "error": "Not Found"
}
```

### Response Error (400)

```json
{
  "statusCode": 400,
  "message": "Username \"newusername\" already exists",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Email \"newemail@example.com\" already exists",
  "error": "Bad Request"
}
```

### Ví dụ sử dụng

#### cURL
```bash
curl -X PUT http://localhost:3000/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "email": "newemail@example.com",
    "role": "admin"
  }'
```

#### JavaScript/TypeScript
```javascript
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('User updated successfully:', data.data);
      return { success: true, data: data.data };
    } else {
      console.error('Error:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
updateUser(1, {
  username: 'newusername',
  email: 'newemail@example.com',
  role: 'admin'
});
```

#### React Example
```jsx
import React, { useState } from 'react';

function UpdateUserForm({ userId, initialData, onUpdate }) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Chỉ gửi các field có giá trị
    const updateData = {};
    if (formData.username) updateData.username = formData.username;
    if (formData.email) updateData.email = formData.email;
    if (formData.role) updateData.role = formData.role;
    if (formData.password) updateData.password = formData.password;

    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cập nhật user thành công');
        onUpdate(data.data);
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="ctv">CTV</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label>New Password (optional):</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Leave empty to keep current password"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Đang cập nhật...' : 'Cập nhật User'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}
```

---

## Lưu ý quan trọng

### Xóa dữ liệu (CASCADE)

1. **Xóa Course:**
   - Tự động xóa tất cả Category thuộc course đó
   - Tự động xóa tất cả Video thuộc các category đó

2. **Xóa Category:**
   - Tự động xóa tất cả Video thuộc category đó

3. **Xóa Video:**
   - Chỉ xóa video đó, không ảnh hưởng đến category hoặc course

### Validation

1. **Update User:**
   - Username và Email phải unique (không trùng với user khác)
   - Password sẽ được hash tự động
   - Chỉ cần gửi các field muốn cập nhật

2. **Delete Operations:**
   - ID phải tồn tại trong database
   - Nếu không tìm thấy, sẽ trả về lỗi 404

### Error Handling

Luôn kiểm tra response status trước khi xử lý:
- `200`: Thành công
- `404`: Không tìm thấy resource
- `400`: Dữ liệu không hợp lệ (username/email trùng, etc.)
- `500`: Lỗi server

### Security

- Nên thêm authentication/authorization cho các API này
- Xác nhận trước khi xóa (confirmation dialog)
- Log các thao tác xóa để audit

---

## Testing

### Test Case 1: Xóa Category thành công
```bash
DELETE /categories/1
Expected: 200, "Category deleted successfully"
```

### Test Case 2: Xóa Category không tồn tại
```bash
DELETE /categories/999
Expected: 404, "Category with ID 999 not found"
```

### Test Case 3: Xóa Course thành công
```bash
DELETE /courses/1
Expected: 200, "Course deleted successfully"
```

### Test Case 4: Cập nhật User thành công
```bash
PUT /user/1
Body: { "username": "newuser", "role": "admin" }
Expected: 200, User data updated
```

### Test Case 5: Cập nhật User với email trùng
```bash
PUT /user/1
Body: { "email": "existing@example.com" }
Expected: 400, "Email already exists"
```

---

## Troubleshooting

### Lỗi 404 khi xóa
- Kiểm tra ID có đúng không
- Kiểm tra resource có tồn tại trong database không

### Lỗi 400 khi cập nhật User
- Kiểm tra username/email có trùng với user khác không
- Kiểm tra format dữ liệu có đúng không

### Lỗi CASCADE
- Khi xóa Course, tất cả Category và Video sẽ bị xóa
- Đảm bảo người dùng hiểu rõ hậu quả trước khi xóa

---

## Support

Nếu gặp vấn đề:
1. Kiểm tra log server
2. Kiểm tra database connection
3. Kiểm tra ID có đúng format không
4. Kiểm tra quyền truy cập (nếu có authentication)


