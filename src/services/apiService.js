import API_CONFIG, { getApiUrl } from "../config/apiConfig";

// API Service class để quản lý tất cả API calls
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  // Helper method để get token từ localStorage
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  // Helper method để build headers
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic method để thực hiện API call
  async makeRequest(url, options = {}) {
    const config = {
      method: "GET",
      mode: "cors", // Explicitly enable CORS
      headers: this.buildHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, { 
      method: "GET",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true"
      }
    });
  }

  // POST request
  async post(url, data = {}) {
    return this.makeRequest(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true"
      }
    });
  }

  // PUT request
  async put(url, data = {}) {
    return this.makeRequest(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(url) {
    return this.makeRequest(url, { method: "DELETE" });
  }

  // PATCH request
  async patch(url, data = {}) {
    return this.makeRequest(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ===== AUTHENTICATION METHODS =====
  async login(credentials) {
    const url = getApiUrl("AUTH", "LOGIN");
    // API này sử dụng POST với query parameters
    const queryString = new URLSearchParams(credentials).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, { method: "POST" });
  }

  async register(userData) {
    const url = getApiUrl("AUTH", "REGISTER");
    return this.post(url, userData);
  }

  async forgotPassword(email) {
    const url = getApiUrl("AUTH", "FORGOT_PASSWORD");
    return this.post(url, { email });
  }

  async resetPassword(token, newPassword) {
    const url = getApiUrl("AUTH", "RESET_PASSWORD");
    return this.post(url, { token, newPassword });
  }

  async logout() {
    const url = getApiUrl("AUTH", "LOGOUT");
    return this.post(url);
  }

  // ===== USER METHODS =====
  async getUserProfile() {
    const url = getApiUrl("USER", "PROFILE");
    return this.get(url);
  }

  async updateUserProfile(profileData) {
    const url = getApiUrl("USER", "UPDATE_PROFILE");
    return this.put(url, profileData);
  }

  async changePassword(passwordData) {
    const url = getApiUrl("USER", "CHANGE_PASSWORD");
    return this.post(url, passwordData);
  }

  async addUser(userData) {
    const url = getApiUrl("USER", "ADD");
    // API này sử dụng POST với query parameters
    const queryString = new URLSearchParams(userData).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, { method: "POST" });
  }

  // ===== STATION METHODS =====
  async getStations(params = {}) {
    const url = getApiUrl("STATION", "LIST");
    return this.get(url, params);
  }

  async getStationById(stationId) {
    const url = getApiUrl("STATION", "DETAIL", { stationID: stationId });
    return this.get(url);
  }

  async createStation(stationData) {
    const url = this.baseURL + "/pinStation/create";
    
    // Format data for API - x and y should be float
    const cleanData = {
      stationName: stationData.stationName,
      location: stationData.location,
      status: parseInt(stationData.status),
      x: parseFloat(stationData.x),
      y: parseFloat(stationData.y)
    };
    
    // API uses POST with query parameters
    const queryString = new URLSearchParams(cleanData).toString();
    const fullUrl = `${url}?${queryString}`;
    
    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true"
      }
    });
  }

  async updateStation(stationData) {
    const url = getApiUrl("STATION", "UPDATE");
    return this.put(url, stationData);
  }

  async updateStationStatus(stationId, status) {
    const url = getApiUrl("STATION", "UPDATE_STATUS");
    return this.get(url, { stationId, status });
  }

  async getStationStatus() {
    const url = getApiUrl("STATION", "STATUS");
    return this.get(url);
  }

  async deleteStation(stationId) {
    // Note: DELETE endpoint not available in the API documentation
    // This method is kept for backward compatibility
    throw new Error("Delete station endpoint not available in current API");
  }

  async getNearbyStations(latitude, longitude, radius = 10) {
    const url = getApiUrl("STATION", "NEARBY");
    return this.get(url, { latitude, longitude, radius });
  }

  // ===== BOOKING METHODS =====
  async createBooking(bookingData) {
    const url = getApiUrl("BOOKING", "CREATE");
    return this.post(url, bookingData);
  }

  async getBookings(params = {}) {
    const url = getApiUrl("BOOKING", "LIST");
    return this.get(url, params);
  }

  async getBookingById(bookingId) {
    const url = getApiUrl("BOOKING", "DETAIL", { id: bookingId });
    return this.get(url);
  }

  async updateBooking(bookingId, bookingData) {
    const url = getApiUrl("BOOKING", "UPDATE", { id: bookingId });
    return this.put(url, bookingData);
  }

  async cancelBooking(bookingId) {
    const url = getApiUrl("BOOKING", "CANCEL", { id: bookingId });
    return this.post(url);
  }

  async getBookingHistory(params = {}) {
    const url = getApiUrl("BOOKING", "HISTORY");
    return this.get(url, params);
  }

  // ===== BATTERY METHODS =====
  async getBatteries(params = {}) {
    const url = getApiUrl("BATTERY", "LIST");
    return this.get(url, params);
  }

  async getBatteryById(batteryId) {
    const url = getApiUrl("BATTERY", "DETAIL", { id: batteryId });
    return this.get(url);
  }

  async dispatchBattery(batteryData) {
    const url = getApiUrl("BATTERY", "DISPATCH");
    return this.post(url, batteryData);
  }

  async returnBattery(batteryId, returnData) {
    const url = getApiUrl("BATTERY", "RETURN", { id: batteryId });
    return this.post(url, returnData);
  }

  async getBatteryStatus(batteryId) {
    const url = getApiUrl("BATTERY", "STATUS", { id: batteryId });
    return this.get(url);
  }

  // ===== SERVICE PACK METHODS =====
  async getServicePacks(params = {}) {
    const url = getApiUrl("SERVICE_PACK", "LIST");
    return this.get(url, params);
  }

  async getServicePackById(packId) {
    const url = getApiUrl("SERVICE_PACK", "DETAIL", { id: packId });
    return this.get(url);
  }

  async createServicePack(packData) {
    const url = getApiUrl("SERVICE_PACK", "CREATE");
    return this.post(url, packData);
  }

  async updateServicePack(packId, packData) {
    const url = getApiUrl("SERVICE_PACK", "UPDATE", { id: packId });
    return this.put(url, packData);
  }

  async deleteServicePack(packId) {
    const url = getApiUrl("SERVICE_PACK", "DELETE", { id: packId });
    return this.delete(url);
  }

  // ===== TRANSACTION METHODS =====
  async getTransactions(params = {}) {
    const url = getApiUrl("TRANSACTION", "LIST");
    return this.get(url, params);
  }

  async getTransactionById(transactionId) {
    const url = getApiUrl("TRANSACTION", "DETAIL", { id: transactionId });
    return this.get(url);
  }

  async getTransactionHistory(params = {}) {
    const url = getApiUrl("TRANSACTION", "HISTORY");
    return this.get(url, params);
  }

  async processPayment(paymentData) {
    const url = getApiUrl("TRANSACTION", "PAYMENT");
    return this.post(url, paymentData);
  }

  // ===== REPORT METHODS =====
  async getDashboardReport(params = {}) {
    const url = getApiUrl("REPORT", "DASHBOARD");
    return this.get(url, params);
  }

  async getStationReport(params = {}) {
    const url = getApiUrl("REPORT", "STATION_REPORT");
    return this.get(url, params);
  }

  async getUserReport(params = {}) {
    const url = getApiUrl("REPORT", "USER_REPORT");
    return this.get(url, params);
  }

  async getTransactionReport(params = {}) {
    const url = getApiUrl("REPORT", "TRANSACTION_REPORT");
    return this.get(url, params);
  }

  async exportReport(reportType, params = {}) {
    const url = getApiUrl("REPORT", "EXPORT");
    return this.get(url, { ...params, type: reportType });
  }

  // ===== ADMIN METHODS =====
  async getAdminUsers(params = {}) {
    const url = getApiUrl("ADMIN", "USERS");
    return this.get(url, params);
  }

  async getAdminStations(params = {}) {
    const url = getApiUrl("ADMIN", "STATIONS");
    return this.get(url, params);
  }

  async getAdminReports(params = {}) {
    const url = getApiUrl("ADMIN", "REPORTS");
    return this.get(url, params);
  }

  async getAdminSettings() {
    const url = getApiUrl("ADMIN", "SETTINGS");
    return this.get(url);
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
