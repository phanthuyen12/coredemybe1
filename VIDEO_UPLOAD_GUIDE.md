# Hướng dẫn Upload Video - Tối ưu tốc độ và hỗ trợ HD

## Tổng quan

Hệ thống đã được cấu hình để hỗ trợ upload video lên đến **100MB** với chất lượng HD.

## Cấu hình hiện tại

### 1. Giới hạn file size
- **Tối đa:** 100MB (104,857,600 bytes)
- **Body parser limit:** 100MB
- **Multer file size limit:** 100MB

### 2. Định dạng video được hỗ trợ
- `.mp4` (video/mp4)
- `.mpeg` (video/mpeg)
- `.mov` (video/quicktime)
- `.avi` (video/x-msvideo)
- `.webm` (video/webm)
- `.mkv` (video/x-matroska)
- `.3gp` (video/3gpp)
- `.flv` (video/x-flv)

### 3. Tối ưu hóa
- **File size validation:** Kiểm tra kích thước trước khi upload
- **MIME type validation:** Chỉ chấp nhận file video
- **CORS caching:** Cache preflight requests (3600s)
- **Unique filename:** Tránh trùng lặp file

## API Upload Video

### Endpoint
```
POST /videos
```

### Request Format
- **Content-Type:** `multipart/form-data`
- **Field name:** `video` (cho file video)
- **Body fields:** `title`, `courseId`, `categoryId`, và các field khác

### Request Example (cURL)
```bash
curl -X POST http://localhost:3000/videos \
  -F "video=@/path/to/video.mp4" \
  -F "title=Video HD Test" \
  -F "courseId=1" \
  -F "categoryId=1" \
  -F "description=Video chất lượng HD" \
  -F "duration=3600" \
  -F "order=1" \
  -F "access=free" \
  -F "status=Active"
```

### Request Example (JavaScript/Fetch)
```javascript
async function uploadVideo(videoFile, videoData) {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('title', videoData.title);
  formData.append('courseId', videoData.courseId);
  formData.append('categoryId', videoData.categoryId);
  formData.append('description', videoData.description || '');
  formData.append('duration', videoData.duration || 0);
  formData.append('order', videoData.order || 0);
  formData.append('access', videoData.access || 'free');
  formData.append('status', videoData.status || 'Active');

  try {
    const response = await fetch('http://localhost:3000/videos', {
      method: 'POST',
      body: formData,
      // Không set Content-Type header, browser sẽ tự động set với boundary
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Upload thành công:', data);
      return { success: true, data: data.data };
    } else {
      console.error('Lỗi upload:', data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Lỗi kết nối:', error);
    return { success: false, message: 'Không thể kết nối đến server' };
  }
}

// Sử dụng
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

uploadVideo(file, {
  title: 'Video HD Test',
  courseId: 1,
  categoryId: 1,
  description: 'Video chất lượng HD',
  duration: 3600,
  order: 1,
  access: 'free',
  status: 'Active'
});
```

### Request Example (React)
```jsx
import React, { useState } from 'react';

function VideoUploadForm({ courseId, categoryId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Kiểm tra file size (100MB)
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError(`File quá lớn. Kích thước tối đa là 100MB. File hiện tại: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
        setFile(null);
        return;
      }

      // Kiểm tra file type
      if (!selectedFile.type.startsWith('video/')) {
        setError('Chỉ chấp nhận file video');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Vui lòng chọn file video');
      return;
    }

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('courseId', courseId);
    formData.append('categoryId', categoryId);
    formData.append('description', description);
    formData.append('status', 'Active');
    formData.append('access', 'free');

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          onUploadSuccess(response.data);
          alert('Upload video thành công!');
          // Reset form
          setFile(null);
          setTitle('');
          setDescription('');
          setProgress(0);
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.message || 'Có lỗi xảy ra khi upload');
        }
        setLoading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Không thể kết nối đến server');
        setLoading(false);
      });

      xhr.open('POST', 'http://localhost:3000/videos');
      xhr.send(formData);
    } catch (error) {
      setError('Có lỗi xảy ra: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Chọn file video (tối đa 100MB):</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        {file && (
          <div>
            <p>File: {file.name}</p>
            <p>Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Loại: {file.type}</p>
          </div>
        )}
      </div>

      <div>
        <label>Tiêu đề:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label>Mô tả:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      {loading && (
        <div>
          <p>Đang upload... {progress.toFixed(1)}%</p>
          <progress value={progress} max="100" />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading || !file}>
        {loading ? 'Đang upload...' : 'Upload Video'}
      </button>
    </form>
  );
}
```

## Response

### Success (200)
```json
{
  "data": {
    "id": 1,
    "title": "Video HD Test",
    "url": "video-1234567890-123456789.mp4",
    "courseId": 1,
    "categoryId": 1,
    "description": "Video chất lượng HD",
    "duration": 3600,
    "order": 1,
    "access": "free",
    "status": "Active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statusCode": 200,
  "message": "Video created successfully"
}
```

### Error (400) - File quá lớn
```json
{
  "statusCode": 400,
  "message": "File quá lớn. Kích thước tối đa là 100MB. File hiện tại: 150.50MB",
  "error": "Bad Request"
}
```

### Error (400) - Định dạng không hợp lệ
```json
{
  "statusCode": 400,
  "message": "Chỉ chấp nhận file video. Định dạng image/jpeg không được hỗ trợ.",
  "error": "Bad Request"
}
```

## Tối ưu tốc độ upload

### 1. Frontend
- **Chunk upload:** Chia nhỏ file thành nhiều phần (nếu cần)
- **Progress tracking:** Hiển thị tiến trình upload
- **Compression:** Nén video trước khi upload (nếu có thể)
- **Resume upload:** Hỗ trợ tiếp tục upload nếu bị gián đoạn

### 2. Backend
- **Streaming:** Sử dụng streaming thay vì buffer toàn bộ file
- **Async processing:** Xử lý video sau khi upload (transcoding, thumbnail)
- **CDN:** Sử dụng CDN để phân phối video
- **Compression:** Nén video sau khi upload

### 3. Network
- **HTTPS:** Sử dụng HTTPS để tăng tốc độ
- **Compression:** Bật gzip compression
- **Connection pooling:** Tối ưu kết nối

## Lưu ý quan trọng

1. **File size:** Tối đa 100MB. Nếu cần upload file lớn hơn, cần tăng giới hạn trong `multer.config.ts` và `main.ts`

2. **Storage:** Đảm bảo có đủ dung lượng ổ cứng cho thư mục `uploads/videos/`

3. **Timeout:** Upload file lớn có thể mất nhiều thời gian. Có thể cần tăng timeout:
   ```typescript
   // Trong main.ts hoặc nginx config
   timeout: 300000 // 5 phút
   ```

4. **Memory:** Upload file lớn có thể tốn nhiều RAM. Đảm bảo server có đủ RAM

5. **Security:** 
   - Validate file type và size
   - Scan virus (nếu cần)
   - Giới hạn rate limit để tránh abuse

## Troubleshooting

### Lỗi "File too large"
- Kiểm tra file size có vượt quá 100MB không
- Kiểm tra cấu hình `multer.config.ts` và `main.ts`

### Lỗi "Request entity too large"
- Tăng `bodyParserOptions.limit` trong `main.ts`
- Kiểm tra nginx/proxy server có giới hạn body size không

### Upload chậm
- Kiểm tra băng thông mạng
- Kiểm tra tốc độ ổ cứng
- Sử dụng CDN hoặc object storage (S3, etc.)

### Lỗi "Invalid file type"
- Kiểm tra file có đúng định dạng video không
- Kiểm tra MIME type của file

## Nâng cấp (nếu cần)

### Tăng giới hạn lên 500MB hoặc 1GB
1. Cập nhật `MAX_FILE_SIZE` trong `multer.config.ts`
2. Cập nhật `bodyParserOptions.limit` trong `main.ts`
3. Cập nhật timeout settings
4. Đảm bảo server có đủ tài nguyên

### Hỗ trợ streaming upload
- Sử dụng tus protocol hoặc resumable.js
- Chia file thành chunks và upload từng phần

### Video processing
- Transcode video sau khi upload
- Tạo thumbnail tự động
- Tạo multiple quality versions (360p, 720p, 1080p)

