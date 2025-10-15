import React from "react";
import { Card } from "antd";
import dayjs from "dayjs";
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
} from "../../../../utils/pinSlotUtils";

const PinInventory = ({
  selectedStationData,
  pinSlots,
  watchedStation,
  selectedPinSlot,
  setSelectedPinSlot,
}) => {
  if (!selectedStationData) {
    return null;
  }

  const stationSlots = selectedStationData?.slots || [];

  // Thống kê tổng quan toàn trạm sử dụng utility functions
  const slotStatistics = calculateSlotStatistics(pinSlots);
  const totalSlotsAll = slotStatistics.total;
  const readySlotsAll = slotStatistics.available; // Slots khả dụng
  const bookedSlotsAll = slotStatistics.rented; // Slots đã cho thuê
  const maintenanceSlotsAll = slotStatistics.unavailable; // Slots không khả dụng
  const chargingSlotsAll = 0; // Không có thông tin charging trong API hiện tại

  // Sắp xếp tất cả ổ pin theo slotNumber từ 1-15
  const sortedAllSlots = stationSlots
    .slice()
    .sort((a, b) => a.slotNumber - b.slotNumber);

  return (
    <Card
      style={{
        borderRadius: 16,
        background: "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
        border: "1px solid rgba(0,8,59,0.08)",
        boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
        height: "100%",
      }}
      bodyStyle={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: "#10b981",
          }}
        />
        <span style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}>
          Tồn kho ổ pin tại {watchedStation || "trạm đã chọn"}
        </span>
      </div>

      {/* Instruction for pin selection */}
      {!selectedPinSlot && (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#1e40af",
          }}
        >
          💡 <strong>Hướng dẫn:</strong> Nhấp vào ổ pin khả dụng (màu xanh) để
          chọn ổ pin bạn muốn đặt lịch
        </div>
      )}

      {selectedPinSlot && (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#059669",
          }}
        >
          ✅ <strong>Đã chọn:</strong> Ổ pin #{selectedPinSlot.slotNumber} -
          SoC: {selectedPinSlot.socFormatted}, SoH:{" "}
          {selectedPinSlot.sohFormatted}
        </div>
      )}

      <div style={{ color: "#475569", fontSize: 14 }}>
        {/* Legend trạng thái màu sắc */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "#0f172a" }}>Khả dụng</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "#0f172a" }}>Đang sạc</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "#0f172a" }}>
              Đang cho thuê
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#6b7280",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "#0f172a" }}>
              Không khả dụng
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(0,8,59,0.1)",
              borderRadius: 12,
              padding: 12,
              background: "rgba(0,8,59,0.03)",
              width: "fit-content",
              minWidth: "200px",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Tổng ổ pin / Sẵn sàng
            </div>
            <div style={{ fontWeight: 700 }}>
              {totalSlotsAll} / {readySlotsAll}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Tổng quan theo trạng thái:</strong>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 8,
              marginTop: 8,
            }}
          >
            <div
              style={{
                border: "2px solid #10b981",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#f0fdf4",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#059669",
                }}
              >
                Khả dụng
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {readySlotsAll} ổ pin
              </div>
            </div>
            <div
              style={{
                border: "2px solid #f59e0b",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#fffbeb",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#d97706",
                }}
              >
                Đang sạc
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {chargingSlotsAll} ổ pin
              </div>
            </div>
            <div
              style={{
                border: "2px solid #6b7280",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#4b5563",
                }}
              >
                Không khả dụng
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {maintenanceSlotsAll} ổ pin
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>Danh sách ổ pin (chỉ xem):</strong>
          <span
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginLeft: "8px",
            }}
          >
            Tổng {sortedAllSlots.length} ổ
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            flex: 1,
            minHeight: 0,
            maxHeight: 304, // 2 hàng x (140px card + 12px gap)
            overflowY: "auto",
            paddingRight: 6,
          }}
        >
          {sortedAllSlots.map((slot) => {
            const isMaintenance = slot.status === SLOT_STATUS.UNAVAILABLE;
            const isRented = slot.status === SLOT_STATUS.RENTED;
            const socValue = slot.soc || 0;
            // Chỉ coi là "đầy" khi pinStatus = FULL (1), "đang sạc" khi pinStatus = NOT_FULL (0)
            const isFull = slot.pinStatus === PIN_STATUS.FULL;
            const isChargingVisual = slot.pinStatus === PIN_STATUS.NOT_FULL;
            const isSelected =
              selectedPinSlot?.pinID === (slot.pinID || slot.id);
            // Ổ pin chỉ khả dụng khi status = AVAILABLE và pinStatus = FULL
            const isAvailable =
              slot.status === SLOT_STATUS.AVAILABLE &&
              slot.pinStatus === PIN_STATUS.FULL;

            const remainingToFull = Math.max(0, 100 - socValue);
            const etaFullMinutes = remainingToFull; // 1%/phút
            const etaFullTime = dayjs()
              .add(etaFullMinutes, "minute")
              .format("HH:mm");

            const handleSlotClick = () => {
              if (isAvailable) {
                setSelectedPinSlot(slot);
              }
            };

            // Xác định màu nền của toàn bộ card theo yêu cầu
            let cardBackground = "#ffffff"; // mặc định trắng
            if (isChargingVisual) {
              // pinStatus = 0 => vàng, không thể click
              cardBackground = "#fff7ed"; // vàng nhạt
            } else if (isFull) {
              // pinStatus = 1 => xét theo status
              if (isMaintenance) {
                cardBackground = "#f3f4f6"; // xám nhạt
              } else if (isRented) {
                cardBackground = "#fee2e2"; // đỏ nhạt
              } else if (isAvailable) {
                cardBackground = "#ffffff"; // trắng
              } else {
                cardBackground = "#ffffff";
              }
            }

            return (
              <div
                key={slot.pinID || slot.id}
                onClick={handleSlotClick}
                style={{
                  border: isSelected
                    ? "2px solid #10b981"
                    : "1px solid rgba(0,8,59,0.1)",
                  borderRadius: 12,
                  padding: 12,
                  background: cardBackground,
                  borderLeft: `4px solid ${
                    isChargingVisual
                      ? "#f59e0b" // vàng
                      : isMaintenance
                      ? "#6b7280" // xám
                      : isRented
                      ? "#ef4444" // đỏ
                      : isAvailable
                      ? "#10b981" // xanh lá
                      : "#e5e7eb"
                  }`,
                  opacity: isMaintenance || isRented ? 0.9 : 1,
                  position: "relative",
                  height: 140,
                  overflow: "hidden",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(16, 185, 129, 0.3)"
                    : "none",
                  ...(isMaintenance && {
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.06) 10px, rgba(0,0,0,0.06) 20px)",
                  }),
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </div>
                )}
                <div style={{ fontWeight: 700, color: "#0f172a" }}>
                  Ổ pin #{slot.slotNumber}
                </div>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  SoH:{" "}
                  <strong className={slot.sohColor}>{slot.sohFormatted}</strong>
                </div>
                <div style={{ fontSize: 13 }}>
                  SoC:{" "}
                  <strong className={slot.socColor}>{slot.socFormatted}</strong>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isMaintenance
                      ? "#4b5563"
                      : isRented
                      ? "#2563eb"
                      : isFull
                      ? "#059669"
                      : isChargingVisual
                      ? "#a16207"
                      : "#6b7280",
                    fontWeight: 600,
                    marginTop: 8,
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: isMaintenance
                      ? "#f3f4f6"
                      : isRented
                      ? "#e0e7ff"
                      : isFull
                      ? "#dcfce7"
                      : isChargingVisual
                      ? "#ffedd5"
                      : "#f3f4f6",
                    textAlign: "center",
                  }}
                >
                  {isMaintenance
                    ? slot.statusText
                    : isRented
                    ? slot.statusText
                    : isFull
                    ? "Sẵn sàng"
                    : "Đang sạc"}
                </div>
                {!isMaintenance && !isRented && isChargingVisual && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#0f172a",
                    }}
                  >
                    ETA đầy 100%: <strong>{etaFullTime}</strong> (
                    {etaFullMinutes} phút)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default PinInventory;
