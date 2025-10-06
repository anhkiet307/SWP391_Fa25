# Hướng dẫn sử dụng API Configuration System

## Tổng quan

Hệ thống này được thiết kế để quản lý các API endpoints một cách linh hoạt và dễ dàng thay đổi.

## Cấu trúc file

### 1. `src/config/apiConfig.js`

File cấu hình chính chứa tất cả các API endpoints và cài đặt.

### 2. `src/services/apiService.js`

Service class để thực hiện các API calls với các method đã được định nghĩa sẵn.

## Cách sử dụng

### 1. Cấu hình API Base URL

Tạo file `.env` trong thư mục gốc của project:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### 2. Sử dụng trong component

```javascript
import apiService from "../services/apiService";

// Ví dụ: Lấy danh sách stations
const fetchStations = async () => {
  try {
    const stations = await apiService.getStations();
    console.log(stations);
  } catch (error) {
    console.error("Error fetching stations:", error);
  }
};

// Ví dụ: Tạo booking mới
const createBooking = async (bookingData) => {
  try {
    const result = await apiService.createBooking(bookingData);
    return result;
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};
```

### 3. Thay đổi API endpoints

Để thay đổi API endpoints, chỉ cần sửa file `src/config/apiConfig.js`:

```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api",

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login", // Thay đổi endpoint này
      // ... các endpoints khác
    },
  },
};
```

### 4. Thêm endpoints mới

Để thêm endpoint mới:

1. Thêm vào `apiConfig.js`:

```javascript
ENDPOINTS: {
  NEW_FEATURE: {
    LIST: '/new-feature',
    CREATE: '/new-feature',
    UPDATE: '/new-feature/:id'
  }
}
```

2. Thêm method vào `apiService.js`:

```javascript
async getNewFeatures(params = {}) {
  const url = getApiUrl('NEW_FEATURE', 'LIST');
  return this.get(url, params);
}
```

## Các tính năng

### 1. Auto Token Management

Service tự động thêm Bearer token vào headers nếu có token trong localStorage.

### 2. Error Handling

Tất cả API calls đều có error handling cơ bản.

### 3. Flexible URL Building

Hỗ trợ dynamic parameters trong URL (ví dụ: `/stations/:id`).

### 4. Environment Support

Hỗ trợ nhiều môi trường khác nhau thông qua biến môi trường.

## Ví dụ sử dụng chi tiết

### Authentication

```javascript
// Login
const login = async (email, password) => {
  const result = await apiService.login({ email, password });
  localStorage.setItem("authToken", result.token);
  return result;
};

// Logout
const logout = async () => {
  await apiService.logout();
  localStorage.removeItem("authToken");
};
```

### Station Management

```javascript
// Lấy stations gần đây
const getNearbyStations = async (lat, lng) => {
  return await apiService.getNearbyStations(lat, lng, 5); // radius 5km
};

// Tạo station mới (admin)
const createStation = async (stationData) => {
  return await apiService.createStation(stationData);
};
```

### Booking Management

```javascript
// Lấy lịch sử booking
const getBookingHistory = async (userId) => {
  return await apiService.getBookingHistory({ userId });
};

// Hủy booking
const cancelBooking = async (bookingId) => {
  return await apiService.cancelBooking(bookingId);
};
```

## Lưu ý quan trọng

1. **Luôn sử dụng try-catch** khi gọi API để handle errors.
2. **Kiểm tra token** trước khi gọi API cần authentication.
3. **Cập nhật BASE_URL** khi chuyển môi trường (dev/staging/production).
4. **Backup cấu hình** trước khi thay đổi endpoints quan trọng.

## Troubleshooting

### Lỗi CORS

Nếu gặp lỗi CORS, kiểm tra:

- API server có cấu hình CORS đúng không
- BASE_URL có đúng không

### Lỗi 401 Unauthorized

- Kiểm tra token có hợp lệ không
- Kiểm tra token có hết hạn không

### Lỗi 404 Not Found

- Kiểm tra endpoint có đúng không
- Kiểm tra API server có chạy không
