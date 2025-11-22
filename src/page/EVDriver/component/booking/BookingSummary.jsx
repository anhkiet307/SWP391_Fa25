// Component tóm tắt thông tin đặt lịch và nút xác nhận đặt lịch
import React from "react";
import { Card, Button, Alert, message } from "antd";
import dayjs from "dayjs";
import { useAuth } from "../../../../contexts/AuthContext";

/**
 * Component BookingSummary - Tóm tắt thông tin đặt lịch
 * Chức năng:
 * 1. Hiển thị tóm tắt thông tin đặt lịch (trạm, ngày, giờ, xe, ổ pin)
 * 2. Tính phí dịch vụ dựa trên subscription (miễn phí nếu có subscription, không thì tính theo gói cơ bản)
 * 3. Validate form và gọi handleBooking khi click xác nhận
 * 4. Hiển thị cảnh báo về quy định thời gian đến
 */
const BookingSummary = ({
  watchedStation,
  isBooking,
  handleBooking,
  form,
  userSubscription,
  servicePacks,
  loadingSubscription,
  selectedStationId,
  selectedPinSlotId,
  selectedVehicle,
}) => {
  const { user } = useAuth();
  // Hàm format số tiền theo định dạng VND
  const formatVND = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Hàm tính phí dịch vụ: miễn phí nếu có subscription, không thì tính theo gói cơ bản
  const getServiceFee = () => {
    if (loadingSubscription) return 0;
    if (userSubscription) return 0; // Có subscription thì miễn phí
    const basicPack = servicePacks.find(
      (pack) => pack.packID === 1 && pack.status === 1
    );
    return basicPack?.price || 0; // Không có subscription thì tính theo gói cơ bản
  };

  // Hàm lấy packID: trả về packID của subscription nếu có, không thì trả về packID của gói cơ bản
  const getPackId = () => {
    if (userSubscription) return userSubscription.packID;
    const basicPack = servicePacks.find(
      (pack) => pack.packID === 1 && pack.status === 1
    );
    return basicPack?.packID || 1;
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        background: "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
        border: "1px solid rgba(0,8,59,0.08)",
        boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
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
            background: "#00083B",
          }}
        />
        <span style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}>
          Tóm tắt đặt lịch
        </span>
      </div>
      <div
        style={{
          color: "#475569",
          fontSize: 14,
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          rowGap: 12,
        }}
      >
        <span>Trạm:</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {watchedStation || "Chưa chọn"}
        </span>
        <span>Ngày:</span>
        <span style={{ color: "#0f172a" }}>{dayjs().format("DD/MM/YYYY")}</span>
        <span>Thời gian:</span>
        <span style={{ color: "#0f172a" }}>1 tiếng từ lúc đặt lịch</span>
        <span>Người dùng:</span>
        <span style={{ color: "#0f172a" }}>
          {user?.name || user?.email || `User #${user?.userID}`}
        </span>
        <span>Ổ pin:</span>
        <span style={{ color: "#0f172a" }}>
          {selectedPinSlotId ? `Ổ pin #${selectedPinSlotId}` : "Chưa chọn"}
        </span>
        <span>Xe:</span>
        <span style={{ color: "#0f172a" }}>
          {selectedVehicle ? selectedVehicle.licensePlate : "Chưa chọn"}
        </span>
        <span>Giá dịch vụ:</span>
        <span style={{ color: "#0f172a" }}>
          {getServiceFee().toLocaleString("vi-VN")}
        </span>

        <span>Gói dịch vụ:</span>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>
          {loadingSubscription
            ? "Đang kiểm tra..."
            : userSubscription
            ? `✅ ${userSubscription.packName || "Có subscription"}`
            : "📦 Basic Pack"}
        </span>
        <span style={{ color: "#10b981", fontWeight: 700 }}>Phí dịch vụ:</span>
        <span style={{ color: "#10b981", fontWeight: 700 }}>
          {loadingSubscription
            ? "Đang tính..."
            : userSubscription
            ? "🆓 Miễn phí (có subscription)"
            : formatVND(getServiceFee())}
        </span>
      </div>

      {/* Thông tin subscription */}
      {!loadingSubscription && (
        <Alert
          message={
            userSubscription ? (
              <span style={{ color: "#10b981" }}>
                🎉 Bạn đang sử dụng gói subscription - Miễn phí đổi pin!
              </span>
            ) : (
              <span style={{ color: "#f59e0b" }}>
                💰 Sử dụng gói cơ bản - Phí: {formatVND(getServiceFee())}
              </span>
            )
          }
          type={userSubscription ? "success" : "warning"}
          showIcon
          style={{
            marginTop: "16px",
            borderRadius: "12px",
            background: userSubscription
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)"
              : "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
            border: userSubscription
              ? "1px solid rgba(16, 185, 129, 0.2)"
              : "1px solid rgba(245, 158, 11, 0.2)",
          }}
        />
      )}

      {/* Lưu ý quan trọng về thời gian */}
      <Alert
        message="⚠️ Lưu ý quan trọng về thời gian"
        description={
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Quy định về thời gian đến:</strong>
            </div>
            <ul
              style={{
                margin: "8px 0",
                paddingLeft: "20px",
                fontSize: "13px",
              }}
            >
              <li>
                <strong>Thời gian đặt lịch:</strong>{" "}
                <strong style={{ color: "#00083B" }}>
                  1 tiếng từ lúc tạo transaction
                </strong>
              </li>
              <li>
                ✅ <strong>Được phép:</strong> Đến trong vòng{" "}
                <strong style={{ color: "#10b981" }}>1 tiếng</strong> kể từ lúc
                đặt lịch
              </li>
              <li>
                ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                <strong style={{ color: "#dc2626" }}>1 tiếng</strong> từ lúc đặt
                lịch
              </li>
              <li>
                Lịch đổi pin sẽ bị{" "}
                <strong style={{ color: "#dc2626" }}>hủy tự động</strong> nếu
                đến muộn
              </li>
            </ul>
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              💡 <strong>Gợi ý:</strong> Hãy đến trong vòng{" "}
              <strong>1 tiếng</strong> để đảm bảo không bị hủy lịch!
            </div>
          </div>
        }
        type="warning"
        showIcon
        style={{
          marginTop: "16px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        }}
      />

      {/* Nút xác nhận đặt lịch - validate form trước khi gọi handleBooking */}
      <div style={{ marginTop: "auto" }}>
        <Button
          type="primary"
          size="large"
          loading={isBooking}
          style={{
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)",
            border: "none",
            fontWeight: 700,
          }}
          onClick={() => {
            // Validate form trước khi submit
            form
              .validateFields()
              .then((values) => {
                // Nếu validation thành công, gọi handleBooking để tạo transaction và reserve pin slot
                handleBooking(values);
              })
              .catch((errorInfo) => {
                // Hiển thị lỗi nếu validation thất bại
                message.error("Vui lòng điền đầy đủ thông tin!");
              });
          }}
        >
          {isBooking ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </Button>
      </div>
    </Card>
  );
};

export default BookingSummary;
