/**
 * Utility functions để xử lý và format dữ liệu pinSlot
 */

/**
 * Enum cho trạng thái pin
 */
export const PIN_STATUS = {
  NOT_FULL: 0, // Chưa đầy
  FULL: 1, // Đầy
};

/**
 * Enum cho trạng thái khả dụng của pin slot
 */
export const SLOT_STATUS = {
  UNAVAILABLE: 0, // Không khả dụng (chưa sạc đầy)
  AVAILABLE: 1, // Khả dụng
  RENTED: 2, // Đã cho thuê
};

/**
 * Lấy text mô tả trạng thái pin
 * @param {number} pinStatus - Trạng thái pin (0 hoặc 1)
 * @returns {string} Text mô tả
 */
export const getPinStatusText = (pinStatus) => {
  switch (pinStatus) {
    case PIN_STATUS.NOT_FULL:
      return "Chưa đầy";
    case PIN_STATUS.FULL:
      return "Đầy";
    default:
      return "Không xác định";
  }
};

/**
 * Lấy text mô tả trạng thái khả dụng của slot
 * @param {number} status - Trạng thái slot (0, 1, hoặc 2)
 * @returns {string} Text mô tả
 */
export const getSlotStatusText = (status) => {
  switch (status) {
    case SLOT_STATUS.UNAVAILABLE:
      return "Không khả dụng";
    case SLOT_STATUS.AVAILABLE:
      return "Khả dụng";
    case SLOT_STATUS.RENTED:
      return "Đã cho thuê";
    default:
      return "Không xác định";
  }
};

/**
 * Lấy màu sắc cho trạng thái pin
 * @param {number} pinStatus - Trạng thái pin
 * @returns {string} CSS class hoặc màu
 */
export const getPinStatusColor = (pinStatus) => {
  switch (pinStatus) {
    case PIN_STATUS.NOT_FULL:
      return "text-orange-500"; // Màu cam cho chưa đầy
    case PIN_STATUS.FULL:
      return "text-green-500"; // Màu xanh cho đầy
    default:
      return "text-gray-500";
  }
};

/**
 * Lấy màu sắc cho trạng thái slot
 * @param {number} status - Trạng thái slot
 * @returns {string} CSS class hoặc màu
 */
export const getSlotStatusColor = (status) => {
  switch (status) {
    case SLOT_STATUS.UNAVAILABLE:
      return "text-red-500"; // Màu đỏ cho không khả dụng
    case SLOT_STATUS.AVAILABLE:
      return "text-green-500"; // Màu xanh cho khả dụng
    case SLOT_STATUS.RENTED:
      return "text-blue-500"; // Màu xanh dương cho đã cho thuê
    default:
      return "text-gray-500";
  }
};

/**
 * Kiểm tra pin slot có khả dụng để đặt không
 * @param {Object} pinSlot - Object pin slot
 * @returns {boolean} True nếu có thể đặt
 */
export const isSlotAvailable = (pinSlot) => {
  return (
    pinSlot.status === SLOT_STATUS.AVAILABLE &&
    pinSlot.pinStatus === PIN_STATUS.FULL
  );
};

/**
 * Lấy số lượng pin slots khả dụng
 * @param {Array} pinSlots - Mảng pin slots
 * @returns {number} Số lượng slots khả dụng
 */
export const getAvailableSlotsCount = (pinSlots) => {
  return pinSlots.filter(isSlotAvailable).length;
};

/**
 * Lấy số lượng pin slots đã cho thuê
 * @param {Array} pinSlots - Mảng pin slots
 * @returns {number} Số lượng slots đã cho thuê
 */
export const getRentedSlotsCount = (pinSlots) => {
  return pinSlots.filter((slot) => slot.status === SLOT_STATUS.RENTED).length;
};

/**
 * Lấy số lượng pin slots không khả dụng
 * @param {Array} pinSlots - Mảng pin slots
 * @returns {number} Số lượng slots không khả dụng
 */
export const getUnavailableSlotsCount = (pinSlots) => {
  return pinSlots.filter((slot) => slot.status === SLOT_STATUS.UNAVAILABLE)
    .length;
};

/**
 * Format phần trăm pin
 * @param {number} percent - Phần trăm (0-100)
 * @returns {string} String đã format
 */
export const formatPinPercent = (percent) => {
  return `${Math.round(percent)}%`;
};

/**
 * Format phần trăm sức khỏe pin
 * @param {number} health - Phần trăm sức khỏe (0-100)
 * @returns {string} String đã format
 */
export const formatPinHealth = (health) => {
  return `${Math.round(health)}%`;
};

/**
 * Lấy màu sắc cho phần trăm pin dựa trên mức độ
 * @param {number} percent - Phần trăm pin
 * @returns {string} CSS class màu
 */
export const getPinPercentColor = (percent) => {
  if (percent >= 80) return "text-green-500";
  if (percent >= 50) return "text-yellow-500";
  if (percent >= 20) return "text-orange-500";
  return "text-red-500";
};

/**
 * Lấy màu sắc cho sức khỏe pin dựa trên mức độ
 * @param {number} health - Phần trăm sức khỏe pin
 * @returns {string} CSS class màu
 */
export const getPinHealthColor = (health) => {
  if (health >= 90) return "text-green-500";
  if (health >= 70) return "text-yellow-500";
  if (health >= 50) return "text-orange-500";
  return "text-red-500";
};

/**
 * Sắp xếp pin slots theo trạng thái khả dụng
 * @param {Array} pinSlots - Mảng pin slots
 * @returns {Array} Mảng đã sắp xếp
 */
export const sortSlotsByAvailability = (pinSlots) => {
  return [...pinSlots].sort((a, b) => {
    // Ưu tiên: Available > Rented > Unavailable
    if (a.status !== b.status) {
      return a.status - b.status;
    }
    // Nếu cùng trạng thái, sắp xếp theo pinID
    return a.pinID - b.pinID;
  });
};

/**
 * Lọc pin slots theo trạng thái
 * @param {Array} pinSlots - Mảng pin slots
 * @param {number} status - Trạng thái cần lọc
 * @returns {Array} Mảng đã lọc
 */
export const filterSlotsByStatus = (pinSlots, status) => {
  return pinSlots.filter((slot) => slot.status === status);
};

/**
 * Tính toán thống kê pin slots
 * @param {Array} pinSlots - Mảng pin slots
 * @returns {Object} Object chứa thống kê
 */
export const calculateSlotStatistics = (pinSlots) => {
  const total = pinSlots.length;
  const available = getAvailableSlotsCount(pinSlots);
  const rented = getRentedSlotsCount(pinSlots);
  const unavailable = getUnavailableSlotsCount(pinSlots);

  const avgSoC =
    pinSlots.reduce((sum, slot) => sum + slot.pinPercent, 0) / total;
  const avgSoH =
    pinSlots.reduce((sum, slot) => sum + slot.pinHealth, 0) / total;

  return {
    total,
    available,
    rented,
    unavailable,
    availabilityRate: total > 0 ? (available / total) * 100 : 0,
    avgSoC: Math.round(avgSoC),
    avgSoH: Math.round(avgSoH),
  };
};
