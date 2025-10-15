import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function BookingSuccessLite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Safely extract booking data on mount
  useEffect(() => {
    try {
      const data = location.state?.bookingData || null;
      setBookingData(data);
      if (!data) {
        console.warn("No booking data found in location state");
      }
    } catch (error) {
      console.error("Error loading booking data:", error);
      setBookingData(null);
    } finally {
      setIsLoading(false);
    }
  }, [location.state]);

  const formatVND = (value) => {
    try {
      if (typeof value !== "number") return "0 VND";
      return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    } catch (error) {
      console.error("Error formatting VND:", error);
      return `${value} VND`;
    }
  };

  const formatDate = (date) => {
    try {
      if (!date) return "";
      const parsed = dayjs(date);
      return parsed.isValid() ? parsed.format("DD/MM/YYYY") : String(date);
    } catch (error) {
      console.error("Error parsing date:", error);
      return String(date);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8fafc" }}
      >
        <div>Đang tải...</div>
      </div>
    );
  }

  // Show error state
  if (!bookingData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8fafc" }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            textAlign: "center",
            padding: 24,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            Không tìm thấy thông tin đặt lịch
          </div>
          <div style={{ color: "#64748b", marginBottom: 16 }}>
            Vui lòng thực hiện đặt lịch lại
          </div>
          <Link
            to="/booking"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              background: "#00083B",
              color: "white",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Đặt lịch lại
          </Link>
        </div>
      </div>
    );
  }

  const selectedSlotId = bookingData?.selectedSlot ?? null;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#00083B" }}>
            Đặt lịch thành công!
          </div>
          <div style={{ color: "#64748b", marginTop: 6 }}>
            Thông tin đặt lịch của bạn đã được xác nhận.
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#00083B",
              marginBottom: 12,
            }}
          >
            Thông tin đặt lịch
          </div>

          {bookingData?.station && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#64748b", fontSize: 13 }}>Trạm đổi pin</div>
              <div style={{ color: "#0f172a", fontWeight: 700 }}>
                {bookingData.station}
              </div>
            </div>
          )}

          {bookingData?.date && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                Ngày đặt lịch
              </div>
              <div style={{ color: "#0f172a" }}>
                {formatDate(bookingData.date)}
              </div>
            </div>
          )}

          {selectedSlotId && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: "#64748b", fontSize: 13 }}>Ổ pin</div>
              <div style={{ color: "#0f172a" }}>Ổ pin #{selectedSlotId}</div>
            </div>
          )}

          {typeof bookingData?.amount === "number" && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ color: "#475569" }}>Phí dịch vụ đổi pin</div>
                <div style={{ color: "#10b981", fontWeight: 700 }}>
                  {formatVND(bookingData.amount)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            to="/booking"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              background: "#00083B",
              color: "white",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              marginRight: 12,
            }}
          >
            Đặt lịch mới
          </Link>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              background: "#f1f5f9",
              color: "#475569",
              border: "2px solid #cbd5e1",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
