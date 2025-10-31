# API Báo Cáo Hệ Thống

## Tổng Quan
Module báo cáo cung cấp các API để thống kê và báo cáo về:
- Số lượng user theo thời gian
- Tiến độ học tập của user
- Thời gian xem video
- Hoàn thành khóa học
- Tổng quan hệ thống

## Các API Endpoints

### 1. Báo Cáo Số Lượng User
**GET** `/reports/users`

**Query Parameters:**
- `period`: 'day' | 'week' | 'month' (mặc định: 'day')
- `startDate`: Ngày bắt đầu (format: YYYY-MM-DD)
- `endDate`: Ngày kết thúc (format: YYYY-MM-DD)

**Response:**
```json
{
  "data": {
    "period": "day",
    "dateRange": {
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-01T23:59:59.999Z"
    },
    "totalUsers": 1000,
    "newUsers": 50,
    "usersByRole": [
      { "role": "user", "count": "800" },
      { "role": "admin", "count": "10" },
      { "role": "ctv", "count": "190" }
    ],
    "usersByStatus": [
      { "status": "Active", "count": "950" },
      { "status": "Banned", "count": "50" }
    ]
  },
  "status": 200,
  "message": "User statistics retrieved successfully"
}
```

### 2. Báo Cáo Tiến Độ Học Tập
**GET** `/reports/learning-progress/:userId`

**Query Parameters:**
- `period`: 'day' | 'week' | 'month' (mặc định: 'day')
- `startDate`: Ngày bắt đầu
- `endDate`: Ngày kết thúc

**Response:**
```json
{
  "data": {
    "userId": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "period": "day",
    "statistics": {
      "totalEnrollments": 5,
      "activeEnrollments": 3,
      "totalVideos": 100,
      "completedVideos": 25,
      "totalWatchTime": 3600,
      "completionPercentage": 25.0
    },
    "enrollments": [
      {
        "id": 1,
        "courseId": 1,
        "courseTitle": "JavaScript Basics",
        "status": "active",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": null
      }
    ]
  },
  "status": 200,
  "message": "Learning progress retrieved successfully"
}
```

### 3. Báo Cáo Hoàn Thành Khóa Học
**GET** `/reports/course-completion/:userId/:courseId`

**Response:**
```json
{
  "data": {
    "userId": 1,
    "courseId": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "course": {
      "id": 1,
      "title": "JavaScript Basics",
      "description": "Learn JavaScript from scratch"
    },
    "enrollment": {
      "id": 1,
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": null,
      "paymentStatus": "paid"
    },
    "progress": {
      "totalVideos": 20,
      "completedVideos": 15,
      "totalDuration": 7200,
      "watchedDuration": 5400,
      "completionPercentage": 75.0,
      "watchPercentage": 75.0
    },
    "videos": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "duration": 300,
        "order": 1,
        "access": "Free",
        "status": "Active",
        "isCompleted": true,
        "watchTime": 300,
        "completionPercentage": 100.0,
        "lastWatchedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "status": 200,
  "message": "Course completion data retrieved successfully"
}
```

### 4. Báo Cáo Thời Gian Xem Video
**GET** `/reports/video-watch-time/:userId`

**Query Parameters:**
- `period`: 'day' | 'week' | 'month' (mặc định: 'day')
- `startDate`: Ngày bắt đầu
- `endDate`: Ngày kết thúc

**Response:**
```json
{
  "data": {
    "userId": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "period": "day",
    "totalWatchTime": 7200,
    "totalWatchTimeFormatted": "2h 0m 0s",
    "courseStats": [
      {
        "courseId": 1,
        "courseTitle": "JavaScript Basics",
        "totalVideos": 20,
        "totalDuration": 7200,
        "watchedDuration": 5400,
        "completedVideos": 15,
        "completionPercentage": 75.0
      }
    ]
  },
  "status": 200,
  "message": "Video watch time retrieved successfully"
}
```

### 5. Tổng Quan Báo Cáo
**GET** `/reports/overview`

**Query Parameters:**
- `period`: 'day' | 'week' | 'month' (mặc định: 'day')
- `startDate`: Ngày bắt đầu
- `endDate`: Ngày kết thúc

**Response:**
```json
{
  "data": {
    "period": "day",
    "users": {
      "total": 1000,
      "new": 50
    },
    "enrollments": {
      "total": 5000,
      "new": 200,
      "byStatus": [
        { "status": "active", "count": "4500" },
        { "status": "completed", "count": "500" }
      ]
    },
    "content": {
      "totalCourses": 100,
      "totalVideos": 2000
    }
  },
  "status": 200,
  "message": "Overview report retrieved successfully"
}
```

### 6. Track Video Watch Time
**POST** `/reports/track-video-watch`

**Request Body:**
```json
{
  "userId": 1,
  "videoId": 1,
  "watchTime": 300,
  "isCompleted": false
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "userId": 1,
    "videoId": 1,
    "watchTime": 300,
    "duration": 600,
    "completionPercentage": 50.0,
    "isCompleted": false,
    "lastWatchedAt": "2024-01-15T10:30:00.000Z"
  },
  "status": 200,
  "message": "Video watch time tracked successfully"
}
```

## Cách Sử Dụng

### 1. Lấy thống kê user theo ngày
```bash
GET /reports/users?period=day&startDate=2024-01-01&endDate=2024-01-01
```

### 2. Lấy tiến độ học của user theo tuần
```bash
GET /reports/learning-progress/1?period=week&startDate=2024-01-01&endDate=2024-01-07
```

### 3. Lấy báo cáo hoàn thành khóa học
```bash
GET /reports/course-completion/1/1
```

### 4. Track thời gian xem video
```bash
POST /reports/track-video-watch
Content-Type: application/json

{
  "userId": 1,
  "videoId": 1,
  "watchTime": 300,
  "isCompleted": false
}
```

## Lưu Ý

1. **VideoWatch Entity**: Cần tạo bảng `video_watches` để tracking thời gian xem video
2. **Date Filtering**: Tất cả API đều hỗ trợ filter theo thời gian
3. **Completion Logic**: Video được coi là hoàn thành khi xem >= 90% thời lượng
4. **Performance**: Các API có thể chậm với dataset lớn, nên cân nhắc thêm caching
5. **Authentication**: Cần thêm JWT authentication cho các API này

## Database Schema

### VideoWatch Table
```sql
CREATE TABLE video_watches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  videoId INT NOT NULL,
  watchTime INT DEFAULT 0,
  duration INT DEFAULT 0,
  completionPercentage DECIMAL(5,2) DEFAULT 0,
  isCompleted BOOLEAN DEFAULT FALSE,
  lastWatchedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (videoId) REFERENCES videos(id)
);
```

