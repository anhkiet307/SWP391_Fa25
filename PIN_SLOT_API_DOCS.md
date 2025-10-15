# API PinSlot Documentation

## Tổng quan

API PinSlot cung cấp thông tin chi tiết về các pin slots trong hệ thống trạm đổi pin xe điện. Mỗi pin slot chứa thông tin về trạng thái pin, sức khỏe pin, và khả năng sử dụng.

## Endpoint

```
GET https://bb2352c6ad88.ngrok-free.app/api/pinSlot/list?stationID={stationID}
```

### Parameters

- `stationID` (required): ID của trạm sạc cần lấy thông tin pin slots

### Response Format

```json
{
  "status": "success",
  "message": "Get PinSlot list for station 4 successfully",
  "data": [
    {
      "pinID": 49,
      "pinPercent": 100,
      "pinStatus": 1,
      "pinHealth": 100,
      "status": 1,
      "userID": null,
      "stationID": 4
    }
  ],
  "error": null,
  "timestamp": 1760402715416
}
```

## Các trường dữ liệu

### pinID

- **Kiểu**: `number`
- **Mô tả**: ID duy nhất của pin slot
- **Ví dụ**: `49`

### pinPercent (SoC - State of Charge)

- **Kiểu**: `number`
- **Mô tả**: Phần trăm pin hiện tại (0-100)
- **Ý nghĩa**: Cho biết pin đã sạc được bao nhiêu phần trăm
- **Ví dụ**: `100` = pin đã đầy

### pinStatus

- **Kiểu**: `number`
- **Mô tả**: Trạng thái hiện tại của pin
- **Giá trị**:
  - `0`: Chưa đầy
  - `1`: Đầy
- **Ví dụ**: `1` = pin đã đầy

### pinHealth (SoH - State of Health)

- **Kiểu**: `number`
- **Mô tả**: Phần trăm sức khỏe pin (0-100)
- **Ý nghĩa**: Cho biết pin còn tốt đến mức nào, càng cao càng tốt
- **Ví dụ**: `100` = pin còn rất tốt

### status

- **Kiểu**: `number`
- **Mô tả**: Trạng thái khả dụng của pin slot
- **Giá trị**:
  - `0`: Không khả dụng (chưa sạc đầy hoặc bảo dưỡng)
  - `1`: Khả dụng (có thể đặt)
  - `2`: Đã cho thuê
- **Ví dụ**: `1` = slot có thể đặt

### userID

- **Kiểu**: `number | null`
- **Mô tả**: ID của người dùng đang thuê pin slot
- **Giá trị**: `null` nếu chưa có ai thuê
- **Ví dụ**: `null` = chưa có ai thuê

### stationID

- **Kiểu**: `number`
- **Mô tả**: ID của trạm sạc chứa pin slot này
- **Ví dụ**: `4`

## Cách sử dụng trong code

### 1. Import API Service và Utility Functions

```javascript
import apiService from "../services/apiService";
import {
  getPinStatusText,
  getSlotStatusText,
  isSlotAvailable,
  formatPinPercent,
  formatPinHealth,
  calculateSlotStatistics,
  SLOT_STATUS,
  PIN_STATUS,
} from "../utils/pinSlotUtils";
```

### 2. Lấy dữ liệu Pin Slots

```javascript
const fetchPinSlots = async (stationId) => {
  try {
    const response = await apiService.getPinSlots(stationId);

    if (response.status === "success") {
      const pinSlots = response.data;
      console.log("Pin slots:", pinSlots);

      // Tính toán thống kê
      const statistics = calculateSlotStatistics(pinSlots);
      console.log("Statistics:", statistics);

      return pinSlots;
    }
  } catch (error) {
    console.error("Error fetching pin slots:", error);
  }
};
```

### 3. Kiểm tra slot có khả dụng không

```javascript
const pinSlot = {
  pinID: 49,
  pinPercent: 100,
  pinStatus: 1,
  pinHealth: 100,
  status: 1,
  userID: null,
  stationID: 4,
};

// Kiểm tra slot có thể đặt không
const canBook = isSlotAvailable(pinSlot);
console.log("Can book:", canBook); // true

// Lấy text mô tả trạng thái
const statusText = getSlotStatusText(pinSlot.status);
console.log("Status:", statusText); // "Khả dụng"

const pinStatusText = getPinStatusText(pinSlot.pinStatus);
console.log("Pin status:", pinStatusText); // "Đầy"
```

### 4. Format dữ liệu hiển thị

```javascript
const pinSlot = {
  pinPercent: 85,
  pinHealth: 92,
};

// Format phần trăm
const socFormatted = formatPinPercent(pinSlot.pinPercent);
console.log("SoC:", socFormatted); // "85%"

const sohFormatted = formatPinHealth(pinSlot.pinHealth);
console.log("SoH:", sohFormatted); // "92%"
```

### 5. Tính toán thống kê

```javascript
const pinSlots = [
  { status: 1, pinPercent: 100, pinHealth: 95 },
  { status: 1, pinPercent: 85, pinHealth: 90 },
  { status: 2, pinPercent: 100, pinHealth: 88 },
  { status: 0, pinPercent: 50, pinHealth: 85 },
];

const statistics = calculateSlotStatistics(pinSlots);
console.log(statistics);
// {
//   total: 4,
//   available: 2,
//   rented: 1,
//   unavailable: 1,
//   availabilityRate: 50,
//   avgSoC: 83.75,
//   avgSoH: 89.5
// }
```

## Utility Functions

### Kiểm tra khả dụng

- `isSlotAvailable(slot)`: Kiểm tra slot có thể đặt không

### Format dữ liệu

- `formatPinPercent(percent)`: Format phần trăm pin
- `formatPinHealth(health)`: Format sức khỏe pin

### Lấy text mô tả

- `getPinStatusText(status)`: Lấy text trạng thái pin
- `getSlotStatusText(status)`: Lấy text trạng thái slot

### Lấy màu sắc

- `getPinStatusColor(status)`: Lấy CSS class màu cho trạng thái pin
- `getSlotStatusColor(status)`: Lấy CSS class màu cho trạng thái slot
- `getPinPercentColor(percent)`: Lấy CSS class màu cho phần trăm pin
- `getPinHealthColor(health)`: Lấy CSS class màu cho sức khỏe pin

### Tính toán thống kê

- `calculateSlotStatistics(slots)`: Tính toán thống kê tổng quan
- `getAvailableSlotsCount(slots)`: Đếm số slots khả dụng
- `getRentedSlotsCount(slots)`: Đếm số slots đã cho thuê
- `getUnavailableSlotsCount(slots)`: Đếm số slots không khả dụng

### Sắp xếp và lọc

- `sortSlotsByAvailability(slots)`: Sắp xếp slots theo khả dụng
- `filterSlotsByStatus(slots, status)`: Lọc slots theo trạng thái

## Constants

### SLOT_STATUS

```javascript
const SLOT_STATUS = {
  UNAVAILABLE: 0, // Không khả dụng
  AVAILABLE: 1, // Khả dụng
  RENTED: 2, // Đã cho thuê
};
```

### PIN_STATUS

```javascript
const PIN_STATUS = {
  NOT_FULL: 0, // Chưa đầy
  FULL: 1, // Đầy
};
```

## Ví dụ sử dụng

Xem file `src/examples/PinSlotExample.jsx` để có ví dụ đầy đủ về cách sử dụng API và utility functions.

## Lưu ý

1. **API Response**: Luôn kiểm tra `response.status === 'success'` trước khi sử dụng dữ liệu
2. **Error Handling**: Luôn wrap API calls trong try-catch để xử lý lỗi
3. **Loading States**: Hiển thị loading state khi đang fetch dữ liệu
4. **Data Validation**: Validate dữ liệu trước khi sử dụng utility functions
5. **Performance**: Sử dụng `useMemo` hoặc `useCallback` cho các tính toán phức tạp
