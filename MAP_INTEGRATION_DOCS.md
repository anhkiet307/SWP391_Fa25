# Tính năng Map và Đề xuất Trạm Gần Nhất

## Tổng quan

Đã tích hợp thành công Map component và chức năng đề xuất trạm gần nhất vào màn hình booking. Người dùng giờ đây có thể:

1. **Định vị vị trí hiện tại** để tự động tìm trạm gần nhất
2. **Xem bản đồ** với tất cả các trạm sạc
3. **Tự động chọn trạm gần nhất** khi cho phép định vị
4. **Chỉ đường** đến trạm được chọn

## Các tính năng đã implement

### 1. 📍 Định vị vị trí người dùng

- **Nút "Định vị vị trí"**: Cho phép người dùng lấy vị trí GPS hiện tại
- **Loading state**: Hiển thị trạng thái đang định vị
- **Error handling**: Xử lý các lỗi định vị (từ chối quyền, timeout, etc.)

### 2. ⭐ Đề xuất trạm gần nhất

- **Tự động tính toán**: Sử dụng công thức Haversine để tính khoảng cách chính xác
- **Hiển thị khoảng cách**: Format khoảng cách (m/km) với màu sắc phù hợp
- **Tự động chọn**: Tự động chọn trạm gần nhất khi định vị thành công

### 3. 🗺️ Tích hợp bản đồ

- **Map component**: Hiển thị tất cả trạm sạc trên bản đồ
- **Toggle bản đồ**: Nút để hiện/ẩn bản đồ
- **Interactive markers**: Click vào marker để xem thông tin chi tiết

### 4. 🚗 Chỉ đường

- **Google Maps integration**: Tạo link chỉ đường đến trạm
- **Từ vị trí hiện tại**: Chỉ đường từ vị trí người dùng đến trạm
- **Fallback**: Nếu không có vị trí, chỉ hiển thị vị trí trạm

## API Endpoints sử dụng

### 1. Danh sách trạm sạc

```
GET https://bb2352c6ad88.ngrok-free.app/api/pinStation/list
```

**Response format:**

```json
{
  "status": "success",
  "message": "Get pin station list successfully",
  "data": [
    {
      "stationID": 11,
      "stationName": "Trạm Sạc quận 7",
      "location": "73 phường lạc trung",
      "status": 1,
      "createAt": "2025-10-13T12:59:01.577+00:00",
      "x": 21.424112,
      "y": 106.99999,
      "userID": 11
    }
  ]
}
```

### 2. Chi tiết pin slots của trạm

```
GET https://bb2352c6ad88.ngrok-free.app/api/pinSlot/list?stationID={stationID}
```

## Utility Functions

### Location Utils (`src/utils/locationUtils.js`)

#### `calculateDistance(lat1, lon1, lat2, lon2)`

Tính khoảng cách giữa 2 điểm bằng công thức Haversine.

#### `findNearestStation(stations, userLat, userLon)`

Tìm trạm gần nhất từ danh sách trạm.

#### `sortStationsByDistance(stations, userLat, userLon)`

Sắp xếp các trạm theo khoảng cách từ gần đến xa.

#### `getUserCurrentLocation()`

Lấy vị trí hiện tại của người dùng bằng GPS.

#### `formatDistance(distance)`

Format khoảng cách để hiển thị (m/km).

#### `createGoogleMapsUrl(userLat, userLng, destinationAddress)`

Tạo Google Maps URL để chỉ đường.

### PinSlot Utils (`src/utils/pinSlotUtils.js`)

Đã có sẵn các utility functions để xử lý dữ liệu pin slots.

## UI Components

### 1. Location Card

- **Header**: Tiêu đề và nút định vị
- **Error display**: Hiển thị lỗi định vị nếu có
- **Nearest station info**: Thông tin trạm gần nhất với khoảng cách
- **Action buttons**: Chọn trạm, chỉ đường, xem bản đồ

### 2. Station Select Dropdown

- **Sorted by distance**: Sắp xếp theo khoảng cách nếu có vị trí
- **Distance display**: Hiển thị khoảng cách cho mỗi trạm
- **Nearest badge**: Badge "GẦN NHẤT" cho trạm gần nhất
- **Color coding**: Màu sắc theo khoảng cách

### 3. Map Integration

- **Toggle button**: Hiện/ẩn bản đồ
- **Full Map component**: Sử dụng Map component đã có
- **Interactive features**: Click markers, popup info

## Cách sử dụng

### 1. Định vị và chọn trạm tự động

```javascript
// Người dùng click nút "Định vị vị trí"
const handleGetUserLocation = async () => {
  const location = await getUserCurrentLocation();
  const nearest = findNearestStation(allStations, location.lat, location.lng);

  // Tự động chọn trạm gần nhất
  if (nearest) {
    form.setFieldsValue({ station: nearest.stationName });
    await fetchStationData(nearest.stationID);
  }
};
```

### 2. Chọn trạm từ dropdown

```javascript
// Dropdown hiển thị các trạm đã sắp xếp theo khoảng cách
const sortedStations = userLocation
  ? sortStationsByDistance(availableStations, userLocation[0], userLocation[1])
  : availableStations;
```

### 3. Chỉ đường đến trạm

```javascript
// Tạo Google Maps URL
const url = createGoogleMapsUrl(
  userLocation[0],
  userLocation[1],
  nearestStation.location
);
window.open(url, "_blank");
```

## States Management

### Location States

```javascript
const [userLocation, setUserLocation] = useState(null);
const [isLoadingLocation, setIsLoadingLocation] = useState(false);
const [locationError, setLocationError] = useState(null);
const [nearestStation, setNearestStation] = useState(null);
const [allStations, setAllStations] = useState([]);
const [showMap, setShowMap] = useState(false);
```

### Station States

```javascript
const [stationsList, setStationsList] = useState([]);
const [loadingStationsList, setLoadingStationsList] = useState(false);
const [stationDetail, setStationDetail] = useState(null);
const [pinSlots, setPinSlots] = useState([]);
```

## Error Handling

### 1. Location Errors

- **Permission denied**: Người dùng từ chối quyền định vị
- **Position unavailable**: Không thể lấy vị trí
- **Timeout**: Hết thời gian chờ định vị
- **Browser not supported**: Trình duyệt không hỗ trợ

### 2. API Errors

- **Network errors**: Lỗi mạng khi fetch dữ liệu
- **Invalid response**: Response không đúng format
- **Empty data**: Không có dữ liệu trạm

## Performance Optimizations

### 1. Memoization

- Sử dụng `useCallback` cho các functions
- Sử dụng `useMemo` cho các tính toán phức tạp

### 2. Lazy Loading

- Map component chỉ render khi `showMap = true`
- Station data chỉ fetch khi cần thiết

### 3. Efficient Sorting

- Chỉ sắp xếp lại khi có vị trí người dùng mới
- Cache kết quả tính toán khoảng cách

## Future Enhancements

### 1. Caching

- Cache vị trí người dùng trong localStorage
- Cache kết quả tính toán khoảng cách

### 2. Real-time Updates

- WebSocket để cập nhật trạng thái trạm real-time
- Push notifications cho trạm gần nhất

### 3. Advanced Features

- Filter trạm theo khoảng cách tối đa
- Sort theo rating và khoảng cách
- Bookmark các trạm yêu thích

## Testing

### 1. Unit Tests

- Test utility functions (calculateDistance, findNearestStation)
- Test error handling scenarios

### 2. Integration Tests

- Test API integration
- Test Map component integration

### 3. E2E Tests

- Test complete user flow từ định vị đến booking
- Test trên các thiết bị khác nhau

## Troubleshooting

### 1. Location không hoạt động

- Kiểm tra HTTPS (GPS yêu cầu HTTPS)
- Kiểm tra quyền browser
- Kiểm tra firewall/proxy

### 2. Map không hiển thị

- Kiểm tra internet connection
- Kiểm tra Leaflet CSS/JS loading
- Kiểm tra API keys (nếu có)

### 3. API errors

- Kiểm tra network connection
- Kiểm tra API endpoint availability
- Kiểm tra response format
