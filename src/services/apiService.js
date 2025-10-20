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

    // Thêm header cho ngrok
    headers["ngrok-skip-browser-warning"] = "true";

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
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
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
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  // POST request
  async post(url, data = {}) {
    return this.makeRequest(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
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

  async listDrivers() {
    const url = getApiUrl("USER", "LIST_DRIVERS");
    return this.get(url);
  }

  async listStaff() {
    const url = getApiUrl("USER", "LIST_STAFF");
    return this.get(url);
  }

  async updateUser(userData) {
    const url = getApiUrl("USER", "UPDATE");
    // API này sử dụng PUT với query parameters
    const queryString = new URLSearchParams(userData).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateUserStatus(userId) {
    const url = getApiUrl("USER", "UPDATE_STATUS");
    // API sử dụng PUT với query parameter userID
    const queryString = new URLSearchParams({ userID: userId }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  // ===== STATION METHODS =====
  async getStations(params = {}) {
    const url = getApiUrl("STATION", "LIST");
    return this.get(url, params);
  }

  async getStationsByUser(userId) {
    const url = getApiUrl("STATION", "GET_BY_USER");
    // API sử dụng GET với query parameter userID
    return this.get(url, { userID: userId });
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
      y: parseFloat(stationData.y),
    };

    // API uses POST with query parameters
    const queryString = new URLSearchParams(cleanData).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateStation(stationData) {
    const url = this.baseURL + "/pinStation/update";

    // Format data for API - only required fields (no status field)
    const cleanData = {
      stationID: parseInt(stationData.stationID),
      stationName: stationData.stationName,
      location: stationData.location,
      x: parseFloat(stationData.x),
      y: parseFloat(stationData.y),
    };

    // API uses PUT with query parameters
    const queryString = new URLSearchParams(cleanData).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateStationStatus(stationId) {
    const url = getApiUrl("STATION", "UPDATE_STATUS");
    return this.get(url, { stationID: stationId });
  }

  async assignStaff(userId, stationId) {
    const url = getApiUrl("STATION", "ASSIGN_STAFF");
    // API sử dụng PUT với query parameters userID và stationID
    const queryString = new URLSearchParams({
      userID: userId,
      stationID: stationId,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async checkStaffAssignment(userId) {
    const url = getApiUrl("STATION", "CHECK_STAFF_ASSIGNMENT");
    const queryString = new URLSearchParams({
      userID: userId,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "GET",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async getStationStatus() {
    const url = getApiUrl("STATION", "STATUS");
    return this.get(url);
  }

  // PinSlot management methods
  async getPinslots() {
    const url = getApiUrl("PINSLOT", "LIST_ALL");
    return this.get(url);
  }

  async getPinslotsByStation(stationId) {
    const url = getApiUrl("PINSLOT", "LIST_BY_STATION");
    return this.get(url, { stationID: stationId });
  }

  async updatePinSlot(pinId, pinData) {
    const url = getApiUrl("PINSLOT", "UPDATE_SLOT");
    // API sử dụng PUT với query parameters
    const params = {
      pinID: pinId,
      pinPercent: pinData.pinPercent,
      pinHealth: pinData.pinHealth,
    };
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  // Pin station methods
  async getPinStations() {
    const url = getApiUrl("STATION", "LIST");
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

  async getPinStations() {
    const url = getApiUrl("STATION", "LIST");
    return this.get(url);
  }

  async getStationDetail(stationId) {
    const url = getApiUrl("STATION", "DETAIL", { stationID: stationId });
    return this.get(url);
  }

  /**
   * Lấy danh sách pin slots của một trạm sạc
   * @param {number} stationId - ID của trạm sạc
   * @returns {Promise<Object>} Response chứa danh sách pin slots
   *
   * Response format:
   * {
   *   status: "success",
   *   message: string,
   *   data: [
   *     {
   *       pinID: number,        // ID của pin slot
   *       pinPercent: number,   // SoC (State of Charge) - % pin hiện tại (0-100)
   *       pinStatus: number,    // Trạng thái pin: 0=chưa đầy, 1=đầy
   *       pinHealth: number,    // SoH (State of Health) - % sức khỏe pin (0-100)
   *       status: number,       // Trạng thái khả dụng: 1=khả dụng, 0=không khả dụng, 2=đã cho thuê
   *       userID: number|null,  // ID người dùng đang thuê (null nếu chưa có)
   *       stationID: number     // ID trạm sạc
   *     }
   *   ],
   *   error: null,
   *   timestamp: number
   * }
   */
  async getPinSlots(stationId) {
    const url = getApiUrl("PINSLOT", "LIST");
    return this.get(url, { stationID: stationId });
  }

  /**
   * Đặt giữ một pin slot
   * API yêu cầu method PUT với query params: pinID, userID
   */
  async reservePinSlot(pinID, userID) {
    const url = getApiUrl("PINSLOT", "RESERVE");
    const queryString = new URLSearchParams({ pinID, userID }).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  /**
   * Bỏ giữ một pin slot (set status=0, userID=null)
   */
  async unreservePinSlot(pinID) {
    const fullUrl =
      this.baseURL + `/pinSlot/unreserve?pinID=${encodeURIComponent(pinID)}`;
    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
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
    const url = this.baseURL + "/servicePack/create";
    
    // API sử dụng POST với query parameters
    const queryString = new URLSearchParams({
      adminUserID: packData.adminUserID || 1,
      packName: packData.packName,
      description: packData.description,
      total: packData.total,
      price: packData.price,
      status: packData.status,
    }).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateServicePack(packId, packData) {
    const url = this.baseURL + "/servicePack/update";
    
    // API sử dụng PUT với query parameters theo documentation
    const queryString = new URLSearchParams({
      packID: packId,
      adminUserID: packData.adminUserID || 1, // Sử dụng adminUserID từ packData hoặc default là 1
      packName: packData.packName,
      description: packData.description,
      total: packData.total,
      price: packData.price,
    }).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateServicePackStatus(packId, adminUserID, status) {
    const url = getApiUrl("SERVICE_PACK", "UPDATE_STATUS");
    // API sử dụng PUT với query parameters
    const queryString = new URLSearchParams({
      packID: packId,
      adminUserID: adminUserID,
      status: status,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
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

  async getTransactionsByStation(stationId) {
    const url = getApiUrl("TRANSACTION", "GET_BY_STATION");
    return this.get(url, { stationID: stationId });
  }

  async updateTransactionStatus(transactionId, status) {
    const url = getApiUrl("TRANSACTION", "UPDATE_STATUS");
    const queryString = new URLSearchParams({
      transactionID: transactionId,
      status,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async processPayment(paymentData) {
    const url = getApiUrl("TRANSACTION", "PAYMENT");
    return this.post(url, paymentData);
  }

  // ===== REPORT METHODS =====
  async getAllReports(adminID = 1) {
    const url = getApiUrl("REPORT", "ALL");
    return this.get(url, { adminID });
  }

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

  // Lấy danh sách báo cáo của user
  async getUserReports(userID) {
    const url = `${this.baseURL}/report/my-reports?userID=${userID}`;
    return this.get(url);
  }

  // Tạo báo cáo mới
  async createReport(userID, type, description) {
    const url = `${
      this.baseURL
    }/report/create?userID=${userID}&type=${type}&description=${encodeURIComponent(
      description
    )}`;
    return this.post(url);
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

  // ===== RATING METHODS =====
  async getRatingStatistics(stationId) {
    const url = getApiUrl("RATING", "STATISTICS", { stationID: stationId });
    return this.get(url);
  }

  // ===== VEHICLE METHODS =====
  async getVehiclesByUser(userId) {
    const url = getApiUrl("VEHICLE", "BY_USER");
    return this.get(url, { userID: userId });
  }

  async vehiclePinSwap(vehicleId, pinSlotId) {
    const url = getApiUrl("VEHICLE", "PIN_SWAP");
    const queryString = new URLSearchParams({
      vehicleID: vehicleId,
      pinSlotID: pinSlotId,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async createVehicle(vehicleData) {
    const url = getApiUrl("VEHICLE", "CREATE");
    // API sử dụng POST với query parameters
    const queryString = new URLSearchParams({
      userID: vehicleData.userID,
      licensePlate: vehicleData.licensePlate,
      vehicleType: vehicleData.vehicleType,
      pinPercent: vehicleData.pinPercent,
      pinHealth: vehicleData.pinHealth,
    }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async getVehicles() {
    const url = getApiUrl("VEHICLE", "LIST");
    return this.get(url);
  }

  async unreservePin(pinId) {
    const url = getApiUrl("PINSLOT", "UNRESERVE");
    const queryString = new URLSearchParams({ pinID: pinId }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async createRating(ratingData) {
    const url = getApiUrl("RATING", "CREATE");
    // API sử dụng query parameters thay vì body
    const queryString = new URLSearchParams(ratingData).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async updateRating(ratingId, ratingData) {
    const url = getApiUrl("RATING", "UPDATE", { id: ratingId });
    return this.put(url, ratingData);
  }

  async deleteRating(ratingId) {
    const url = getApiUrl("RATING", "DELETE", { id: ratingId });
    return this.delete(url);
  }

  // ===== SUBSCRIPTION METHODS =====
  /**
   * Lấy thông tin subscription của user
   * @param {number} userId - ID của user
   * @returns {Promise<Object>} - Thông tin subscription
   */
  async getUserSubscription(userId) {
    const url = getApiUrl("SUBSCRIPTION", "GET_USER_SUBSCRIPTION");
    return this.get(`${url}?userID=${userId}`);
  }

  async createSubscription(subscriptionData) {
    const url = getApiUrl("SUBSCRIPTION", "CREATE");
    return this.post(url, subscriptionData);
  }

  async updateSubscription(subscriptionId, subscriptionData) {
    const url = getApiUrl("SUBSCRIPTION", "UPDATE", { id: subscriptionId });
    return this.put(url, subscriptionData);
  }

  async cancelSubscription(subscriptionId) {
    const url = getApiUrl("SUBSCRIPTION", "CANCEL", { id: subscriptionId });
    return this.delete(url);
  }

  /**
   * Giảm số lần sử dụng còn lại của subscription
   * @param {number} userId - ID của user
   * @returns {Promise<Object>} - Kết quả giảm subscription
   */
  async decrementSubscriptionTotal(userId) {
    const url = getApiUrl("SUBSCRIPTION", "DECREMENT_TOTAL");
    const queryString = new URLSearchParams({ userID: userId }).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  // ===== SERVICE PACK METHODS =====
  /**
   * Lấy danh sách service pack
   * @returns {Promise<Object>} - Danh sách service pack
   */
  async getServicePacks() {
    const url = getApiUrl("SERVICE_PACK", "LIST");
    return this.get(url);
  }

  async getServicePackDetail(packId) {
    const url = getApiUrl("SERVICE_PACK", "DETAIL", { id: packId });
    return this.get(url);
  }


  // ===== TRANSACTION METHODS =====
  /**
   * Tạo transaction mới
   * @param {Object} transactionData - Dữ liệu transaction
   * @param {number} transactionData.userID - ID của user
   * @param {number} transactionData.amount - Số tiền
   * @param {number} transactionData.pack - ID của pack
   * @param {number} transactionData.stationID - ID của trạm
   * @param {number} transactionData.pinID - ID của pin
   * @param {number} transactionData.status - Trạng thái (mặc định 0)
   * @returns {Promise<Object>} - Kết quả tạo transaction
   */
  async createTransaction(transactionData) {
    const url = getApiUrl("TRANSACTION", "CREATE");
    const queryString = new URLSearchParams(transactionData).toString();
    const fullUrl = `${url}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  async getTransactions(params = {}) {
    const url = getApiUrl("TRANSACTION", "LIST");
    return this.get(url, params);
  }

  /**
   * Lấy lịch sử giao dịch theo user hiện tại
   * API thật: /transaction/getByUser?userID=:userID
   */
  async getTransactionsByUser(userId) {
    const base = this.baseURL + "/transaction/getByUser";
    const fullUrl = `${base}?userID=${encodeURIComponent(userId)}`;
    return this.get(fullUrl);
  }

  async getTransactionDetail(transactionId) {
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

  // ===== VNPay METHODS =====
  // Tạo URL thanh toán VNPay cho mua gói dịch vụ
  async createVnpayUrl(data) {
    // VNPay endpoint nằm ngoài prefix /api → gọi trực tiếp root
    const rootBase = this.baseURL.replace(/\/_?api$/, "");
    // Backend yêu cầu POST với query parameters
    const queryString = new URLSearchParams({
      userID: data.userID,
      packID: data.packID,
      amount: data.amount,
      orderInfo: data.orderInfo,
      total: data.total,
    }).toString();
    const fullUrl = `${rootBase}/vnpay/create-url?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  /**
   * Cập nhật trạng thái transaction
   * Only supports updating via query params: transactionID, status
   */
  async updateTransactionStatus(transactionId, status) {
    const base = this.baseURL + "/transaction/updateStatus";
    const queryString = new URLSearchParams({
      transactionID: transactionId,
      status,
    }).toString();
    const fullUrl = `${base}?${queryString}`;

    return this.makeRequest(fullUrl, {
      method: "PUT",
      headers: {
        ...this.buildHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
