// Cấu hình API endpoints - có thể thay đổi dễ dàng
const API_CONFIG = {
  // Base URL cho tất cả API calls
  BASE_URL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://360f5548f479.ngrok-free.app/api",

  // Các endpoint cụ thể
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
      UPDATE: "/servicePack/:id",
      DELETE: "/servicePack/:id",
      DETAIL: "/service-packs/:id",
      CREATE: "/service-packs",
      UPDATE: "/service-packs/:id",
      UPDATE_STATUS: "/servicePack/updateStatus",
      DELETE: "/service-packs/:id",
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
      LIST: "/transactions",
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
  },

  // Cấu hình timeout và retry
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,

  // Headers mặc định
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
  },
};

// Helper function để build full URL
export const buildApiUrl = (endpoint, params = {}) => {
  let url = API_CONFIG.BASE_URL + endpoint;

  // Replace parameters in URL (e.g., :id)
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

// Helper function để get endpoint
export const getEndpoint = (category, action) => {
  return API_CONFIG.ENDPOINTS[category]?.[action];
};

// Helper function để get full URL
export const getApiUrl = (category, action, params = {}) => {
  const endpoint = getEndpoint(category, action);
  if (!endpoint) {
    throw new Error(`Endpoint not found: ${category}.${action}`);
  }
  return buildApiUrl(endpoint, params);
};

export default API_CONFIG;
