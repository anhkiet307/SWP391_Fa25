/**
 * File cấu hình API - Quản lý tất cả endpoints và cấu hình API
 *
 * Thư viện sử dụng:
 * - Fetch API (native browser API) - không cần cài đặt thêm
 * - Hỗ trợ CORS và các header mặc định
 * - Cấu hình timeout và retry
 *
 * Cấu trúc:
 * - API_CONFIG: Object chứa tất cả cấu hình (domain, base URL, endpoints, timeout, headers)
 * - ENDPOINTS: Object lồng nhau chứa tất cả các endpoint được phân loại theo chức năng
 * - Helper functions: buildApiUrl, getEndpoint, getApiUrl để build URL động
 */
// Cấu hình API endpoints - có thể thay đổi dễ dàng
const API_CONFIG = {
  // Domain chính của API (dùng cho các endpoint không có prefix /api)
  DOMAIN:
    process.env.REACT_APP_DOMAIN ||
    "https://hal-proteiform-erna.ngrok-free.dev",

  // Base URL cho tất cả API calls (có prefix /api)
  BASE_URL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://hal-proteiform-erna.ngrok-free.dev/api",

  // Các endpoint cụ thể - được phân loại theo chức năng (AUTH, USER, STATION, ...)
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: "/login",
      REGISTER: "/auth/register",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      REFRESH_TOKEN: "/auth/refresh-token",
      LOGOUT: "/auth/logout",
    },

    // User management endpoints
    USER: {
      PROFILE: "/user/profile",
      UPDATE_PROFILE: "/user/update-profile",
      CHANGE_PASSWORD: "/user/change-password",
      DELETE_ACCOUNT: "/user/delete-account",
      ADD: "/user/add",
      LIST_DRIVERS: "/user/listDriver",
      LIST_STAFF: "/user/listStaff",
      UPDATE: "/user/update",
      UPDATE_STATUS: "/user/updateStatus",
    },

    // Station management endpoints
    STATION: {
      LIST: "/pinStation/list",
      DETAIL: "/pinStation/:stationID",
      CREATE: "/pinStation/create",
      UPDATE: "/pinStation/update",
      UPDATE_STATUS: "/pinStation/updateStatus",
      STATUS: "/pinStation/status",
      ASSIGN_STAFF: "/pinStation/assignStaff",
      CHECK_STAFF_ASSIGNMENT: "/pinStation/checkStaffAssignment",
      GET_BY_USER: "/pinStation/getByUser",
      NEARBY: "/stations/nearby", // Keep this for future use
    },

    // PinSlot management endpoints
    PINSLOT: {
      LIST: "/pinSlot/list",
      DETAIL: "/pinSlot/:pinID",
      CREATE: "/pinSlot/create",
      UPDATE: "/pinSlot/update",
      DELETE: "/pinSlot/delete",
      RESERVE: "/pinSlot/reserve",
      LIST_ALL: "/pinSlot/listAll",
      LIST_BY_STATION: "/pinSlot/list",
      UPDATE_SLOT: "/pinSlot/updateSlot",
      UNRESERVE: "/pinSlot/unreserve",
      SWAP: "/pinSlot/swap",
    },

    // Booking endpoints
    BOOKING: {
      CREATE: "/bookings",
      LIST: "/bookings",
      DETAIL: "/bookings/:id",
      UPDATE: "/bookings/:id",
      CANCEL: "/bookings/:id/cancel",
      HISTORY: "/bookings/history",
    },

    // Battery management endpoints
    BATTERY: {
      LIST: "/batteries",
      DETAIL: "/batteries/:id",
      DISPATCH: "/batteries/dispatch",
      RETURN: "/batteries/return",
      STATUS: "/batteries/:id/status",
    },

    // Subscription endpoints
    SUBSCRIPTION: {
      GET_USER_SUBSCRIPTION: "/subscription/getUserSubscription",
      CREATE: "/subscription/create",
      UPDATE: "/subscription/update",
      CANCEL: "/subscription/cancel",
      DECREMENT_TOTAL: "/subscription/decrementTotal",
    },

    // Service pack endpoints
    SERVICE_PACK: {
      LIST: "/servicePack/list",
      DETAIL: "/servicePack/:id",
      CREATE: "/servicePack/create",
      UPDATE: "/servicePack/update",
      UPDATE_STATUS: "/servicePack/updateStatus",
      DELETE: "/servicePack/:id",
    },

    // Vehicle endpoints
    VEHICLE: {
      BY_USER: "/vehicle/user",
      PIN_SWAP: "/vehicle/PinSwap",
      CREATE: "/vehicle/create",
      LIST: "/vehicle/list",
    },

    // Transaction endpoints
    TRANSACTION: {
      CREATE: "/transaction/create",
      LIST: "/transaction/list",
      DETAIL: "/transactions/:id",
      HISTORY: "/transactions/history",
      PAYMENT: "/transactions/payment",
      GET_BY_STATION: "/transaction/getByStation",
      UPDATE_STATUS: "/transaction/updateStatus",
    },

    // Rating endpoints
    RATING: {
      STATISTICS: "/rating/statistics/:stationID",
      CREATE: "/rating/create",
      UPDATE: "/rating/update",
      DELETE: "/rating/delete",
    },

    // Report endpoints
    REPORT: {
      ALL: "/report/all",
      UPDATE_STATUS: "/report/:reportId/status",
      DASHBOARD: "/reports/dashboard",
      STATION_REPORT: "/reports/stations",
      USER_REPORT: "/reports/users",
      TRANSACTION_REPORT: "/reports/transactions",
      EXPORT: "/reports/export",
    },

    // Admin endpoints
    ADMIN: {
      USERS: "/admin/users",
      STATIONS: "/admin/stations",
      REPORTS: "/admin/reports",
      SETTINGS: "/admin/settings",
    },

    // VNPay endpoints
    VNPAY: {
      CREATE_URL: "/vnpay/create-url",
      STATISTIC: "/vnpay/statistic/",
    },
  },

  // Cấu hình timeout cho API requests (30 giây)
  TIMEOUT: 30000, // 30 seconds
  // Số lần retry tối đa khi request thất bại
  MAX_RETRIES: 3,

  // Headers mặc định cho tất cả API requests
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
  },
};

/**
 * Helper function: Build full URL từ endpoint và params
 * Thay thế các placeholder trong URL (ví dụ: :id, :stationID) bằng giá trị thực
 * @param {string} endpoint - Endpoint path (ví dụ: "/user/:id")
 * @param {Object} params - Object chứa các giá trị để thay thế (ví dụ: {id: 123})
 * @returns {string} Full URL đã được build
 */
export const buildApiUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;

  // Replace parameters in URL (e.g., :id → 123)
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

/**
 * Helper function: Lấy endpoint từ category và action
 * @param {string} category - Category name (ví dụ: "USER", "STATION")
 * @param {string} action - Action name (ví dụ: "PROFILE", "LIST")
 * @returns {string|undefined} Endpoint path hoặc undefined nếu không tìm thấy
 */
export const getEndpoint = (category, action) => {
  return API_CONFIG.ENDPOINTS[category]?.[action];
};

/**
 * Helper function: Lấy full URL từ category, action và params
 * Kết hợp getEndpoint và buildApiUrl để tạo URL hoàn chỉnh
 * @param {string} category - Category name
 * @param {string} action - Action name
 * @param {Object} params - Params để thay thế trong URL
 * @returns {string} Full URL đã được build
 * @throws {Error} Nếu không tìm thấy endpoint
 */
export const getApiUrl = (category, action, params = {}) => {
  const endpoint = getEndpoint(category, action);
  if (!endpoint) {
    throw new Error(`Endpoint not found: ${category}.${action}`);
  }
  return buildApiUrl(endpoint, params);
};

export default API_CONFIG;
