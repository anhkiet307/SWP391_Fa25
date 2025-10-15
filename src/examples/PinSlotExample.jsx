/**
 * Ví dụ sử dụng API PinSlot
 *
 * API endpoint: https://bb2352c6ad88.ngrok-free.app/api/pinSlot/list?stationID=4
 *
 * Response format:
 * {
 *   "status": "success",
 *   "message": "Get PinSlot list for station 4 successfully",
 *   "data": [
 *     {
 *       "pinID": 49,
 *       "pinPercent": 100,    // SoC (State of Charge) - % pin hiện tại
 *       "pinStatus": 1,       // Trạng thái pin: 0=chưa đầy, 1=đầy
 *       "pinHealth": 100,     // SoH (State of Health) - % sức khỏe pin
 *       "status": 1,          // Trạng thái khả dụng: 1=khả dụng, 0=không khả dụng, 2=đã cho thuê
 *       "userID": null,       // ID người dùng đang thuê (null nếu chưa có)
 *       "stationID": 4       // ID trạm sạc
 *     }
 *   ],
 *   "error": null,
 *   "timestamp": 1760402715416
 * }
 */

import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import {
  getPinStatusText,
  getSlotStatusText,
  getPinStatusColor,
  getSlotStatusColor,
  isSlotAvailable,
  getAvailableSlotsCount,
  getRentedSlotsCount,
  getUnavailableSlotsCount,
  formatPinPercent,
  formatPinHealth,
  getPinPercentColor,
  getPinHealthColor,
  sortSlotsByAvailability,
  calculateSlotStatistics,
  SLOT_STATUS,
  PIN_STATUS,
} from "../utils/pinSlotUtils";

const PinSlotExample = () => {
  const [pinSlots, setPinSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách pin slots của trạm
  const fetchPinSlots = async (stationId = 4) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getPinSlots(stationId);

      if (response.status === "success") {
        setPinSlots(response.data);
        console.log("Pin slots data:", response.data);
      } else {
        setError("Không thể tải dữ liệu pin slots");
      }
    } catch (err) {
      console.error("Error fetching pin slots:", err);
      setError("Lỗi khi tải dữ liệu pin slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinSlots();
  }, []);

  // Tính toán thống kê
  const statistics = calculateSlotStatistics(pinSlots);
  const sortedSlots = sortSlotsByAvailability(pinSlots);

  if (loading) {
    return <div>Đang tải dữ liệu pin slots...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Ví dụ sử dụng API PinSlot</h1>

      {/* Thống kê tổng quan */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Tổng số slots</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            {statistics.total}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#e8f5e8",
          }}
        >
          <h3>Khả dụng</h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              color: "green",
            }}
          >
            {statistics.available}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff3cd",
          }}
        >
          <h3>Đã cho thuê</h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              color: "orange",
            }}
          >
            {statistics.rented}
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
          }}
        >
          <h3>Không khả dụng</h3>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
              color: "red",
            }}
          >
            {statistics.unavailable}
          </p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div style={{ marginBottom: "24px" }}>
        <h3>Thông tin chi tiết:</h3>
        <ul>
          <li>Tỷ lệ khả dụng: {statistics.availabilityRate.toFixed(1)}%</li>
          <li>SoC trung bình: {statistics.avgSoC}%</li>
          <li>SoH trung bình: {statistics.avgSoH}%</li>
        </ul>
      </div>

      {/* Danh sách pin slots */}
      <h3>Danh sách Pin Slots (đã sắp xếp theo khả dụng):</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {sortedSlots.map((slot) => (
          <div
            key={slot.pinID}
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: isSlotAvailable(slot) ? "#e8f5e8" : "#f8d7da",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0" }}>Pin Slot #{slot.pinID}</h4>

            <div style={{ marginBottom: "8px" }}>
              <strong>SoC (State of Charge):</strong>{" "}
              <span style={{ color: getPinPercentColor(slot.pinPercent) }}>
                {formatPinPercent(slot.pinPercent)}
              </span>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <strong>SoH (State of Health):</strong>{" "}
              <span style={{ color: getPinHealthColor(slot.pinHealth) }}>
                {formatPinHealth(slot.pinHealth)}
              </span>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <strong>Trạng thái pin:</strong>{" "}
              <span style={{ color: getPinStatusColor(slot.pinStatus) }}>
                {getPinStatusText(slot.pinStatus)}
              </span>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <strong>Trạng thái slot:</strong>{" "}
              <span style={{ color: getSlotStatusColor(slot.status) }}>
                {getSlotStatusText(slot.status)}
              </span>
            </div>

            {slot.userID && (
              <div style={{ marginBottom: "8px" }}>
                <strong>Người thuê:</strong> User ID {slot.userID}
              </div>
            )}

            <div style={{ marginBottom: "8px" }}>
              <strong>Trạm:</strong> Station ID {slot.stationID}
            </div>

            <div
              style={{
                padding: "8px",
                backgroundColor: isSlotAvailable(slot) ? "#d4edda" : "#f8d7da",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {isSlotAvailable(slot) ? "✓ Có thể đặt" : "✗ Không thể đặt"}
            </div>
          </div>
        ))}
      </div>

      {/* Nút refresh */}
      <div style={{ marginTop: "24px" }}>
        <button
          onClick={() => fetchPinSlots()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default PinSlotExample;

