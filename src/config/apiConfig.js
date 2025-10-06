// Cấu hình API endpoints - có thể thay đổi dễ dàng
const API_CONFIG = {
  // Base URL cho tất cả API calls
  BASE_URL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://8d7ef022eb57.ngrok-free.app/api",

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
    },

    // Station management endpoints
    STATION: {
      LIST: "/stations",
      DETAIL: "/stations/:id",
      CREATE: "/stations",
      UPDATE: "/stations/:id",
      DELETE: "/stations/:id",
      NEARBY: "/stations/nearby",
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

    // Service pack endpoints
    SERVICE_PACK: {
      LIST: "/service-packs",
      DETAIL: "/service-packs/:id",
      CREATE: "/service-packs",
      UPDATE: "/service-packs/:id",
      DELETE: "/service-packs/:id",
    },

    // Transaction endpoints
    TRANSACTION: {
      LIST: "/transactions",
      DETAIL: "/transactions/:id",
      HISTORY: "/transactions/history",
      PAYMENT: "/transactions/payment",
    },

    // Report endpoints
    REPORT: {
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
