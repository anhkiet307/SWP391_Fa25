import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/header.jsx";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Space,
  message,
  Spin,
  Result,
  Divider,
  Tabs,
  Tag,
  Alert,
} from "antd";
import {
  PoweroffOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LeftOutlined,
  CheckOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  DollarOutlined,
  AimOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { batteryStations } from "../../data/stations";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Tạo icon tùy chỉnh
const createBatteryIcon = (color) => {
  return L.divIcon({
    className: "custom-battery-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        ⚡
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: "custom-user-icon",
    html: `
      <div style="
        background-color: #4285F4;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      ">
        📍
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createNearestStationIcon = (color) => {
  return L.divIcon({
    className: "custom-nearest-station-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 4px solid #FFD700;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3), 0 4px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        animation: pulse 2s infinite;
      ">
        ⚡
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

const createSelectedStationIcon = (color) => {
  return L.divIcon({
    className: "custom-selected-station-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 4px solid #3B82F6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        animation: pulse 2s infinite;
      ">
        🎯
      </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

export default function Booking() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [activeTab, setActiveTab] = useState("today");
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [selectedCity, setSelectedCity] = useState("HN");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const summaryCardRef = useRef(null);
  const [summaryCardHeight, setSummaryCardHeight] = useState(null);

  const [formValues, setFormValues] = useState({
    station: null,
    date: null,
    time: null,
    vehicle: null,
  });

  // Set default date for "today" tab
  useEffect(() => {
    if (activeTab === "today") {
      const today = dayjs();
      setSelectedDate(today);
      setFormValues((prev) => ({ ...prev, date: today }));
    }
  }, [activeTab]);

  const watchedStation = formValues.station;
  const watchedDate = formValues.date;
  const watchedTime = formValues.time;
  const watchedVehicle = formValues.vehicle;

  const serviceFee = 50000;
  const formatVND = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const stations = batteryStations;

  const selectedStationData = stations.find(
    (s) => s.name === formValues.station
  );
  const stationInventory = selectedStationData?.inventory || [];

  const selectedVehicleObj = (user?.vehicles || []).find(
    (v) => v.name === watchedVehicle
  );

  const compatibleBatteryType =
    selectedVehicleObj?.type || selectedVehicleObj?.battery || null;

  // Thống kê tổng quan toàn trạm
  const totalBatteriesAll = stationInventory.length;
  const countsByTypeAll = stationInventory.reduce((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {});
  const availableByTypeAll = stationInventory.reduce((acc, b) => {
    if (b.status === "available") {
      acc[b.type] = (acc[b.type] || 0) + 1;
    }
    return acc;
  }, {});

  const compatibleAvailableInventory = stationInventory.filter(
    (b) =>
      (!compatibleBatteryType || b.type === compatibleBatteryType) &&
      b.status === "available"
  );

  // Thống kê bổ sung: tổng khả dụng toàn trạm và danh sách tương thích đầy đủ
  const totalAvailableAll = stationInventory.filter(
    (b) => b.status === "available"
  ).length;
  const compatibleInventoryAll = stationInventory
    .filter((b) => !compatibleBatteryType || b.type === compatibleBatteryType)
    .slice()
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "available" ? -1 : 1;
      return b.soc - a.soc;
    });

  useEffect(() => {
    const stationId = searchParams.get("stationId");
    const stationName = searchParams.get("stationName");

    if (stationId && stationName) {
      const selectedStation = stations.find(
        (station) => station.id === parseInt(stationId)
      );

      if (selectedStation) {
        form.setFieldsValue({ station: selectedStation.name });
        setFormValues((prev) => ({
          ...prev,
          station: selectedStation.name,
        }));

        const cityCode = selectedStation.city === "Hà Nội" ? "HN" : "HCM";
        setSelectedCity(cityCode);
        form.setFieldsValue({ city: cityCode });
        setFormValues((prev) => ({
          ...prev,
          city: cityCode,
        }));

        navigate("/booking", { replace: true });
      }
    }
  }, [searchParams, stations, form, navigate]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endMinute = minute + 10;
        const endHour = endMinute >= 60 ? hour + 1 : hour;
        const endMinuteFormatted = endMinute >= 60 ? endMinute - 60 : endMinute;
        const endTime = `${endHour
          .toString()
          .padStart(2, "0")}:${endMinuteFormatted.toString().padStart(2, "0")}`;

        if (endHour < 20 || (endHour === 20 && endMinuteFormatted === 0)) {
          slots.push(`${startTime} - ${endTime}`);
        }
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Đồng bộ chiều cao: đo chiều cao card Tóm tắt để áp cho card Tồn kho
  useEffect(() => {
    if (summaryCardRef.current) {
      setSummaryCardHeight(summaryCardRef.current.offsetHeight);
    }
  }, [
    watchedStation,
    watchedDate,
    watchedTime,
    watchedVehicle,
    selectedTimeSlot,
    isBooking,
  ]);

  // Component hiển thị lỗi validation
  const ValidationErrorsAlert = () => {
    if (validationErrors.length === 0) return null;

    return (
      <Alert
        message="⚠ Thiếu thông tin bắt buộc"
        description={
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Vui lòng hoàn thiện các thông tin sau:</strong>
            </div>
            <ul
              style={{
                margin: "8px 0",
                paddingLeft: "20px",
                fontSize: "14px",
              }}
            >
              {validationErrors.map((error, index) => (
                <li
                  key={index}
                  style={{ color: "#dc2626", marginBottom: "4px" }}
                >
                  • {error}
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              💡 <strong>Gợi ý:</strong> Điền đầy đủ thông tin để có thể đặt
              lịch thành công!
            </div>
          </div>
        }
        type="error"
        showIcon
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)",
          border: "1px solid rgba(220, 38, 38, 0.2)",
        }}
      />
    );
  };

  const DynamicTimeAlert = () => {
    if (!selectedTimeSlot) return null;

    return (
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
              {selectedDate && activeTab === "future" && (
                <li>
                  <strong>Ngày đã chọn:</strong>{" "}
                  <strong style={{ color: "#00083B" }}>
                    {selectedDate.format("DD/MM/YYYY")}
                  </strong>
                </li>
              )}
              <li>
                <strong>Slot đã chọn:</strong>{" "}
                <strong style={{ color: "#00083B" }}>{selectedTimeSlot}</strong>
              </li>
              <li>
                ✅ <strong>Được phép:</strong> Đến từ{" "}
                <strong style={{ color: "#10b981" }}>
                  {selectedTimeSlot.split(" - ")[0]}
                </strong>{" "}
                đến{" "}
                <strong style={{ color: "#10b981" }}>
                  {selectedTimeSlot.split(" - ")[1]}
                </strong>
              </li>
              <li>
                ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                <strong style={{ color: "#dc2626" }}>
                  {selectedTimeSlot.split(" - ")[1]}
                </strong>
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
              💡 <strong>Gợi ý:</strong> Hãy đến trong khung giờ{" "}
              <strong>{selectedTimeSlot}</strong> để đảm bảo không bị hủy lịch!
            </div>
          </div>
        }
        type="warning"
        showIcon
        style={{
          marginBottom: "32px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
        }}
      />
    );
  };

  // Hàm tính khoảng cách
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Lấy vị trí người dùng
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);

        // Tìm trạm gần nhất
        let minDistance = Infinity;
        let nearest = null;

        stations.forEach((station) => {
          const distance = calculateDistance(
            userPos[0],
            userPos[1],
            station.position[0],
            station.position[1]
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearest = { ...station, distance };
          }
        });

        setNearestStation(nearest);
        setIsLoadingLocation(false);
        message.success("Đã định vị thành công!");
      },
      (error) => {
        setIsLoadingLocation(false);
        message.error("Không thể lấy vị trí hiện tại");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Set default date for today tab on component mount
  useEffect(() => {
    if (activeTab === "today") {
      const today = dayjs();
      setSelectedDate(today);
      form.setFieldsValue({ date: today });
      setFormValues((prev) => ({ ...prev, date: today }));
    }
  }, []);

  // Handler để cập nhật formValues
  const handleFormChange = (changedValues, allValues) => {
    setFormValues((prev) => ({ ...prev, ...changedValues }));
  };

  // Không tự động chuyển thành phố theo trạm gần nhất để tránh làm thay đổi lựa chọn của người dùng

  const handleBooking = async (values) => {
    // Validate form data
    const errors = [];

    if (!values.station) {
      errors.push("Vui lòng chọn trạm đổi pin");
    }

    if (!values.time) {
      errors.push("Vui lòng chọn khung giờ");
    }

    if (!values.vehicle) {
      errors.push("Vui lòng chọn loại xe");
    }

    if (activeTab === "future" && !values.date) {
      errors.push("Vui lòng chọn ngày đặt lịch");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setValidationErrors([]);
    setIsBooking(true);

    // Chuẩn hóa dữ liệu trước khi điều hướng (serialize date)
    const normalizedValues = {
      ...values,
      date:
        activeTab === "today"
          ? dayjs().format("YYYY-MM-DD")
          : values?.date
          ? dayjs(values.date).format("YYYY-MM-DD")
          : null,
    };
    setBookingData(normalizedValues);

    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      message.success("Đặt lịch thành công!");

      // Navigate to success page with booking data
      try {
        console.log(
          "Navigating to booking-success with data:",
          normalizedValues
        );
        navigate("/booking-success", {
          state: { bookingData: normalizedValues },
        });
      } catch (error) {
        console.error("Navigation error:", error);
        message.error("Có lỗi khi chuyển trang. Vui lòng thử lại!");
      }
    }, 2000);
  };

  const resetBooking = () => {
    form.resetFields();
    setBookingSuccess(false);
    setBookingData(null);
    setSelectedTimeSlot(null);
    setSelectedDate(null);
  };

  // Get tomorrow's date as minimum date
  const tomorrow = dayjs();
  dayjs().add(1, "day");
  const minDate = tomorrow.format("YYYY-MM-DD");

  if (bookingSuccess) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div className="flex items-center justify-center px-4 py-16">
          <Card
            style={{
              maxWidth: "600px",
              width: "100%",
              borderRadius: "24px",
              boxShadow:
                "0 20px 40px rgba(0, 8, 59, 0.15), 0 8px 16px rgba(0, 8, 59, 0.1)",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "2px solid #00083B",
            }}
          >
            <Result
              status="success"
              icon={
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    boxShadow:
                      "0 12px 24px rgba(16, 185, 129, 0.3), 0 4px 8px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <CheckOutlined style={{ fontSize: "40px", color: "white" }} />
                </div>
              }
              title={
                <Title level={2} style={{ color: "#00083B", margin: 0 }}>
                  Đặt Lịch Thành Công!
                </Title>
              }
              subTitle={
                <Paragraph
                  style={{ color: "#64748b", fontSize: "16px", margin: 0 }}
                >
                  Thông tin đặt lịch của bạn đã được xác nhận
                </Paragraph>
              }
              extra={[
                <Button
                  type="primary"
                  key="new"
                  onClick={resetBooking}
                  size="large"
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                    border: "none",
                    marginRight: "12px",
                  }}
                >
                  Đặt Lịch Mới
                </Button>,
                <Link key="home" to="/">
                  <Button
                    size="large"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      border: "2px solid #cbd5e1",
                      color: "#475569",
                    }}
                  >
                    Về Trang Chủ
                  </Button>
                </Link>,
              ]}
            >
              <Card
                size="small"
                style={{
                  marginTop: "24px",
                  textAlign: "left",
                  borderRadius: "16px",
                  background: "rgba(0, 8, 59, 0.05)",
                  border: "1px solid rgba(0, 8, 59, 0.1)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Space>
                    <EnvironmentOutlined
                      style={{ color: "#00083B", fontSize: "18px" }}
                    />
                    <strong style={{ color: "#00083B" }}>Trạm:</strong>
                    <span style={{ color: "#475569" }}>
                      {bookingData?.station}
                    </span>
                  </Space>
                  {bookingData?.date && (
                    <Space>
                      <CalendarOutlined
                        style={{ color: "#00083B", fontSize: "18px" }}
                      />
                      <strong style={{ color: "#00083B" }}>Ngày:</strong>
                      <span style={{ color: "#475569" }}>
                        {bookingData?.date?.format("DD/MM/YYYY")}
                      </span>
                    </Space>
                  )}
                  <Space>
                    <ClockCircleOutlined
                      style={{ color: "#00083B", fontSize: "18px" }}
                    />
                    <strong style={{ color: "#00083B" }}>Giờ:</strong>
                    <span style={{ color: "#475569" }}>
                      {bookingData?.time}
                    </span>
                  </Space>
                </Space>
              </Card>
              <Paragraph
                style={{
                  marginTop: "20px",
                  color: "#64748b",
                  fontSize: "14px",
                  textAlign: "center",
                  background: "rgba(0, 8, 59, 0.05)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 8, 59, 0.1)",
                }}
              >
                ⏰ Vui lòng đến đúng giờ để đổi pin. Chúng tôi sẽ gửi thông báo
                nhắc nhở trước 30 phút.
              </Paragraph>

              <Alert
                message="⚠️ Lưu ý quan trọng"
                description={
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Quy định về thời gian đến:</strong>
                    </div>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                      <li>
                        <strong>Slot đã chọn:</strong>{" "}
                        <strong style={{ color: "#00083B" }}>
                          {bookingData?.time}
                        </strong>
                      </li>
                      <li>
                        ✅ <strong>Được phép:</strong> Đến từ{" "}
                        <strong style={{ color: "#10b981" }}>
                          {bookingData?.time?.split(" - ")[0]}
                        </strong>{" "}
                        đến{" "}
                        <strong style={{ color: "#10b981" }}>
                          {bookingData?.time?.split(" - ")[1]}
                        </strong>
                      </li>
                      <li>
                        ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                        <strong style={{ color: "#dc2626" }}>
                          {bookingData?.time?.split(" - ")[1]}
                        </strong>
                      </li>
                      <li>
                        Lịch đổi pin sẽ bị{" "}
                        <strong style={{ color: "#dc2626" }}>
                          hủy tự động
                        </strong>{" "}
                        nếu đến muộn
                      </li>
                    </ul>
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      💡 <strong>Gợi ý:</strong> Hãy đến trong khung giờ{" "}
                      <strong>{bookingData?.time}</strong> để đảm bảo không bị
                      hủy lịch!
                    </div>
                  </div>
                }
                type="warning"
                showIcon
                style={{
                  marginTop: "16px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                }}
              />
            </Result>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      {/* Clean Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,8,59,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,8,59,0.02)_0%,transparent_50%)]" />

      <Header />

      {/* Main Content */}
      <div
        className="max-w-7xl mx-auto px-6 py-12"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)] mb-6 shadow-[0_8px_20px_rgba(0,8,59,0.15)]">
            <CalendarOutlined style={{ fontSize: "36px", color: "white" }} />
          </div>
          <Title
            level={1}
            className="text-[#00083B] mb-3 text-[36px] font-bold"
          >
            Đặt Lịch Đổi Pin Thông Minh
          </Title>
          <Paragraph className="text-slate-500 text-[18px] max-w-[600px] mx-auto leading-relaxed">
            Chọn thời gian và trạm phù hợp với lịch trình của bạn. Hệ thống sẽ
            tự động tìm trạm gần nhất và gợi ý thời gian tối ưu.
          </Paragraph>
        </div>

        {/* Validation Errors Alert */}
        <ValidationErrorsAlert />

        <Row gutter={[32, 32]}>
          {/* Left Side - Booking Form */}
          <Col
            xs={24}
            lg={14}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] relative overflow-hidden"
              style={{ height: 1050 }}
            >
              {/* Simple Decorative Elements */}
              <div className="absolute -top-[30px] -right-[30px] w-[60px] h-[60px] bg-[rgba(0,8,59,0.05)] rounded-full z-0" />
              <div className="absolute -bottom-[20px] -left-[20px] w-[40px] h-[40px] bg-[rgba(16,185,129,0.05)] rounded-full z-0" />

              <div
                className="text-center mb-8"
                style={{ position: "relative", zIndex: 1 }}
              >
                <Title
                  level={2}
                  className="mb-2 text-[#00083B] text-[28px] font-semibold"
                >
                  Chọn Thông Tin Đặt Lịch
                </Title>
                <Paragraph className="text-slate-500 text-[16px]">
                  Điền đầy đủ thông tin để đặt lịch đổi pin
                </Paragraph>
              </div>

              <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                  setActiveTab(key);
                  // Clear date when switching tabs, keep other fields
                  if (key === "future") {
                    form.setFieldsValue({ date: null });
                    setSelectedDate(null);
                    setFormValues((prev) => ({ ...prev, date: null }));
                  } else if (key === "today") {
                    const today = dayjs();
                    form.setFieldsValue({ date: today });
                    setSelectedDate(today);
                    setFormValues((prev) => ({ ...prev, date: today }));
                  }
                }}
                style={{
                  marginBottom: "32px",
                  position: "relative",
                  zIndex: 1,
                }}
                tabBarStyle={{
                  background: "rgba(0, 8, 59, 0.05)",
                  borderRadius: "12px",
                  padding: "8px",
                  marginBottom: "24px",
                }}
              >
                <TabPane
                  tab={
                    <Space size="middle">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            activeTab === "today"
                              ? "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)"
                              : "rgba(0, 8, 59, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <ClockCircleOutlined
                          style={{
                            color: activeTab === "today" ? "white" : "#00083B",
                            fontSize: "18px",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#00083B",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          Đổi trong ngày
                        </div>
                        <div style={{ color: "#64748b", fontSize: "12px" }}>
                          Ngay hôm nay
                        </div>
                      </div>
                    </Space>
                  }
                  key="today"
                >
                  <Alert
                    message={
                      <Space>
                        <ThunderboltOutlined style={{ color: "#00083B" }} />
                        <span style={{ fontWeight: "600" }}>
                          Đổi pin trong ngày
                        </span>
                      </Space>
                    }
                    description="Chọn thời gian từ bây giờ đến hết ngày hôm nay. Thời gian hoạt động: 8:00 - 20:00"
                    type="info"
                    showIcon
                    style={{
                      marginBottom: "16px",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
                      border: "1px solid rgba(0, 8, 59, 0.1)",
                    }}
                  />

                  <Form
                    form={form}
                    onFinish={handleBooking}
                    onValuesChange={handleFormChange}
                    layout="vertical"
                    size="large"
                  >
                    <Row gutter={[24, 24]}>
                      {/* Station Selection */}
                      <Col xs={24}>
                        <Form.Item
                          name="station"
                          label={
                            <Space>
                              <EnvironmentOutlined
                                style={{ color: "#00083B" }}
                              />
                              <span
                                style={{ color: "#00083B", fontWeight: "600" }}
                              >
                                Chọn trạm đổi pin
                              </span>
                            </Space>
                          }
                          rules={[
                            { required: true, message: "Vui lòng chọn trạm!" },
                          ]}
                        >
                          <div>
                            {nearestStation && (
                              <button
                                type="button"
                                onClick={() => {
                                  form.setFieldsValue({
                                    station: nearestStation.name,
                                  });
                                  setFormValues((prev) => ({
                                    ...prev,
                                    station: nearestStation.name,
                                  }));
                                }}
                                className="w-full mb-3 text-left"
                              >
                                <div className="p-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_6px_14px_rgba(34,211,238,0.25)]">
                                  <div className="flex items-center gap-3 rounded-full px-4 py-2 bg-[#0b1448]/90 border border-white/10">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                                      <AimOutlined
                                        style={{
                                          fontSize: 16,
                                          color: "#67e8f9",
                                        }}
                                      />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] leading-none text-cyan-200/80">
                                        Vị trí gần nhất
                                      </div>
                                      <div className="text-white font-semibold truncate">
                                        {nearestStation.name}
                                      </div>
                                    </div>
                                    {nearestStation?.distance !== undefined && (
                                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-cyan-200 border border-cyan-400/40 bg-cyan-500/10">
                                        {nearestStation.distance.toFixed(1)} km
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )}

                            {/* City toggle */}
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => setSelectedCity("HN")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                  selectedCity === "HN"
                                    ? "bg-cyan-600 text-white border-cyan-500"
                                    : "bg-white/40 text-[#00083B] border-slate-300 hover:bg-white"
                                }`}
                              >
                                Hà Nội
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedCity("HCM")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                  selectedCity === "HCM"
                                    ? "bg-cyan-600 text-white border-cyan-500"
                                    : "bg-white/40 text-[#00083B] border-slate-300 hover:bg-white"
                                }`}
                              >
                                TP.HCM
                              </button>
                              <span className="ml-2 text-xs text-slate-500">
                                Chọn thành phố để lọc danh sách trạm
                              </span>
                            </div>
                            <Select
                              placeholder="-- Chọn trạm --"
                              size="large"
                              style={{ borderRadius: "12px" }}
                              dropdownStyle={{
                                borderRadius: 12,
                                padding: 8,
                                background:
                                  "linear-gradient(135deg,#ffffff,#f8fbff)",
                                boxShadow:
                                  "0 12px 24px rgba(0,8,59,0.12), 0 4px 10px rgba(0,8,59,0.08)",
                              }}
                              onDropdownVisibleChange={undefined}
                              optionLabelProp="label"
                              showSearch
                              filterOption={(input, option) =>
                                (option?.value || "")
                                  .toLowerCase()
                                  .includes((input || "").toLowerCase())
                              }
                              value={form.getFieldValue("station")}
                              onChange={(value) => {
                                // Update both form value and formValues state
                                form.setFieldsValue({ station: value });
                                setFormValues((prev) => ({
                                  ...prev,
                                  station: value,
                                }));
                              }}
                            >
                              {(() => {
                                const items = stations
                                  .filter((s) =>
                                    selectedCity === "HN"
                                      ? s.city === "Hà Nội"
                                      : s.city === "TP.HCM"
                                  )
                                  .map((s) => ({
                                    ...s,
                                    distance: userLocation
                                      ? calculateDistance(
                                          userLocation[0],
                                          userLocation[1],
                                          s.position[0],
                                          s.position[1]
                                        )
                                      : Number.POSITIVE_INFINITY,
                                  }))
                                  .sort(
                                    (a, b) =>
                                      (a.distance || 0) - (b.distance || 0)
                                  );

                                const nearestId =
                                  nearestStation?.id || items[0]?.id;
                                const renderOption = (station, highlight) => (
                                  <Option
                                    key={station.id}
                                    value={station.name}
                                    label={
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                        }}
                                      >
                                        <span style={{ fontWeight: 700 }}>
                                          {station.name}
                                        </span>
                                        {userLocation && (
                                          <span
                                            style={{
                                              padding: "2px 6px",
                                              borderRadius: 8,
                                              border:
                                                "1px solid rgba(34,197,94,0.3)",
                                              background:
                                                "rgba(34,197,94,0.08)",
                                              color: "#15803d",
                                              fontSize: 10,
                                              fontWeight: 700,
                                            }}
                                          >
                                            {station.distance.toFixed(1)} km
                                          </span>
                                        )}
                                      </div>
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 32,
                                          height: 32,
                                          borderRadius: 16,
                                          background: highlight
                                            ? "linear-gradient(135deg,#06b6d4 0%, #3b82f6 100%)"
                                            : "linear-gradient(135deg,#22d3ee 0%, #3b82f6 100%)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxShadow:
                                            "0 6px 12px rgba(34,211,238,0.25)",
                                          flex: "0 0 auto",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "white",
                                            fontSize: 16,
                                          }}
                                        >
                                          ⚡
                                        </span>
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontWeight: 700,
                                              color: "#0f172a",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            {station.name}
                                          </div>
                                          {highlight && (
                                            <span
                                              style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4,
                                                padding: "2px 8px",
                                                borderRadius: 9999,
                                                background:
                                                  "linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(59,130,246,0.25) 100%)",
                                                border:
                                                  "1px solid rgba(34,211,238,0.6)",
                                                color: "#06b6d4",
                                                fontSize: 10,
                                                fontWeight: 800,
                                                letterSpacing: 0.3,
                                                boxShadow:
                                                  "0 0 0 1px rgba(255,255,255,0.1) inset, 0 6px 12px rgba(34,211,238,0.25)",
                                              }}
                                            >
                                              <span style={{ fontSize: 12 }}>
                                                🎯
                                              </span>
                                              <span>Gần nhất</span>
                                            </span>
                                          )}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 12,
                                            color: "#64748b",
                                          }}
                                        >
                                          {station.address}
                                        </div>
                                      </div>
                                      {userLocation && (
                                        <span
                                          style={{
                                            padding: "2px 8px",
                                            borderRadius: 8,
                                            border:
                                              "1px solid rgba(34,197,94,0.3)",
                                            background: "rgba(34,197,94,0.08)",
                                            color: "#15803d",
                                            fontSize: 12,
                                            fontWeight: 700,
                                          }}
                                        >
                                          {station.distance.toFixed(1)} km
                                        </span>
                                      )}
                                    </div>
                                  </Option>
                                );

                                const elements = [];
                                const nearest = items.find(
                                  (i) => i.id === nearestId
                                );
                                if (nearest) {
                                  elements.push(
                                    <Option
                                      disabled
                                      key="hdr-nearest"
                                      value="hdr-nearest"
                                    >
                                      <div
                                        style={{
                                          fontSize: 11,
                                          fontWeight: 800,
                                          letterSpacing: 1,
                                          color: "#0891b2",
                                          padding: "6px 8px",
                                        }}
                                      >
                                        ĐỀ XUẤT GẦN NHẤT
                                      </div>
                                    </Option>
                                  );
                                  elements.push(renderOption(nearest, true));
                                  elements.push(
                                    <Option
                                      disabled
                                      key="sep-nearest"
                                      value="sep-nearest"
                                    >
                                      <div
                                        style={{
                                          height: 1,
                                          background: "#e2e8f0",
                                          margin: "6px 0",
                                        }}
                                      />
                                    </Option>
                                  );
                                }

                                items
                                  .filter((i) => i.id !== nearestId)
                                  .forEach((i) =>
                                    elements.push(renderOption(i, false))
                                  );
                                return elements;
                              })()}
                            </Select>
                          </div>
                        </Form.Item>
                      </Col>

                      {/* Time Selection */}

                      {/* Time Selection */}
                      <Col xs={24}>
                        <Form.Item
                          name="time"
                          label={
                            <Space>
                              <ClockCircleOutlined
                                style={{ color: "#00083B" }}
                              />
                              <span
                                style={{ color: "#00083B", fontWeight: "600" }}
                              >
                                Chọn giờ (8:00 - 20:00)
                              </span>
                            </Space>
                          }
                          rules={[
                            { required: true, message: "Vui lòng chọn giờ!" },
                          ]}
                        >
                          <Select
                            placeholder="-- Chọn giờ --"
                            size="large"
                            style={{ borderRadius: "12px" }}
                            onChange={(value) => {
                              setSelectedTimeSlot(value);
                              setFormValues((prev) => ({
                                ...prev,
                                time: value,
                              }));
                            }}
                          >
                            {timeSlots.map((time, index) => (
                              <Option key={index} value={time}>
                                {time}
                              </Option>
                            ))}
                          </Select>
                          {/* Thông tin xe hiển thị dưới Select xe, không đặt ở đây */}
                        </Form.Item>
                      </Col>

                      {/* Thông tin người dùng + chọn loại xe (tab Đổi trong ngày) */}
                      <Col xs={24}>
                        <div
                          style={{
                            marginTop: 8,
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              background: "#00083B",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                            }}
                          >
                            {(user?.name || "U").charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#00083B" }}>
                              {user?.name || "User"}
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              {user?.email}
                            </div>
                          </div>
                        </div>
                        <Form.Item
                          name="vehicle"
                          label={
                            <span style={{ color: "#00083B", fontWeight: 600 }}>
                              Chọn loại xe đã liên kết
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn loại xe!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="-- Chọn loại xe --"
                            size="large"
                            style={{ borderRadius: 12 }}
                            value={form.getFieldValue("vehicle")}
                            onChange={(value) => {
                              form.setFieldsValue({ vehicle: value });
                              setFormValues((prev) => ({
                                ...prev,
                                vehicle: value,
                              }));
                            }}
                          >
                            {(user?.vehicles || []).map((v) => (
                              <Option key={v.id} value={v.name}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 12,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {v.name} - {v.plate || "-"}
                                  </span>
                                  <span
                                    style={{ fontSize: 12, color: "#64748b" }}
                                  >
                                    {v.type || v.battery}
                                  </span>
                                </div>
                              </Option>
                            ))}
                          </Select>
                          {watchedVehicle && (
                            <Card
                              size="small"
                              style={{
                                marginTop: 8,
                                borderRadius: 12,
                                background:
                                  "linear-gradient(135deg, rgba(0,8,59,0.04) 0%, rgba(0,8,59,0.02) 100%)",
                                border: "1px solid rgba(0,8,59,0.1)",
                              }}
                              bodyStyle={{ padding: 12 }}
                            >
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "110px 1fr",
                                  rowGap: 6,
                                  fontSize: 13,
                                  color: "#0f172a",
                                }}
                              >
                                <span style={{ color: "#64748b" }}>Xe</span>
                                <span style={{ fontWeight: 700 }}>
                                  {watchedVehicle}
                                </span>
                                <span style={{ color: "#64748b" }}>
                                  Biển số
                                </span>
                                <span>
                                  {(() => {
                                    const v = (user?.vehicles || []).find(
                                      (x) => x.name === watchedVehicle
                                    );
                                    return v?.plate || "-";
                                  })()}
                                </span>
                                <span style={{ color: "#64748b" }}>Pin xe</span>
                                <span>
                                  {(() => {
                                    const v = (user?.vehicles || []).find(
                                      (x) => x.name === watchedVehicle
                                    );
                                    return v?.type || v?.battery || "-";
                                  })()}
                                </span>
                                <span style={{ color: "#64748b" }}>
                                  Mã số Pin
                                </span>
                                <span>
                                  {(() => {
                                    const v = (user?.vehicles || []).find(
                                      (x) => x.name === watchedVehicle
                                    );
                                    return v?.currentBattery
                                      ? `${v.currentBattery.id}`
                                      : "-";
                                  })()}
                                </span>
                              </div>
                            </Card>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Action Buttons removed per request */}
                  </Form>
                </TabPane>

                <TabPane
                  tab={
                    <Space size="middle">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            activeTab === "future"
                              ? "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)"
                              : "rgba(0, 8, 59, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <CalendarOutlined
                          style={{
                            color: activeTab === "future" ? "white" : "#00083B",
                            fontSize: "18px",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#00083B",
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          Đặt trước
                        </div>
                        <div style={{ color: "#64748b", fontSize: "12px" }}>
                          3 ngày tới
                        </div>
                      </div>
                    </Space>
                  }
                  key="future"
                >
                  <Alert
                    message={
                      <Space>
                        <CalendarOutlined style={{ color: "#00083B" }} />
                        <span style={{ fontWeight: "600" }}>
                          Đặt lịch trước
                        </span>
                      </Space>
                    }
                    description="Đặt lịch đổi pin trong vòng 3 ngày tới. Thời gian hoạt động: 8:00 - 20:00"
                    type="success"
                    showIcon
                    style={{
                      marginBottom: "16px",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  />

                  <Form
                    form={form}
                    onFinish={handleBooking}
                    onValuesChange={handleFormChange}
                    layout="vertical"
                    size="large"
                  >
                    <Row gutter={[24, 24]}>
                      {/* Station Selection */}
                      <Col xs={24}>
                        <Form.Item
                          name="station"
                          label={
                            <Space>
                              <EnvironmentOutlined
                                style={{ color: "#00083B" }}
                              />
                              <span
                                style={{ color: "#00083B", fontWeight: "600" }}
                              >
                                Chọn trạm đổi pin
                              </span>
                            </Space>
                          }
                          rules={[
                            { required: true, message: "Vui lòng chọn trạm!" },
                          ]}
                        >
                          <div>
                            {nearestStation && (
                              <button
                                type="button"
                                onClick={() => {
                                  form.setFieldsValue({
                                    station: nearestStation.name,
                                  });
                                  setFormValues((prev) => ({
                                    ...prev,
                                    station: nearestStation.name,
                                  }));
                                }}
                                className="w-full mb-3 text-left"
                              >
                                <div className="p-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_6px_14px_rgba(34,211,238,0.25)]">
                                  <div className="flex items-center gap-3 rounded-full px-4 py-2 bg-[#0b1448]/90 border border-white/10">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                                      <AimOutlined
                                        style={{
                                          fontSize: 16,
                                          color: "#67e8f9",
                                        }}
                                      />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] leading-none text-cyan-200/80">
                                        Vị trí gần nhất
                                      </div>
                                      <div className="text-white font-semibold truncate">
                                        {nearestStation.name}
                                      </div>
                                    </div>
                                    {nearestStation?.distance !== undefined && (
                                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-cyan-200 border border-cyan-400/40 bg-cyan-500/10">
                                        {nearestStation.distance.toFixed(1)} km
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )}

                            {/* City toggle */}
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => setSelectedCity("HN")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                  selectedCity === "HN"
                                    ? "bg-cyan-600 text-white border-cyan-500"
                                    : "bg-white/40 text-[#00083B] border-slate-300 hover:bg-white"
                                }`}
                              >
                                Hà Nội
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedCity("HCM")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                  selectedCity === "HCM"
                                    ? "bg-cyan-600 text-white border-cyan-500"
                                    : "bg-white/40 text-[#00083B] border-slate-300 hover:bg-white"
                                }`}
                              >
                                TP.HCM
                              </button>
                              <span className="ml-2 text-xs text-slate-500">
                                Chọn thành phố để lọc danh sách trạm
                              </span>
                            </div>
                            <Select
                              placeholder="-- Chọn trạm --"
                              size="large"
                              style={{ borderRadius: "12px" }}
                              dropdownStyle={{
                                borderRadius: 12,
                                padding: 8,
                                background:
                                  "linear-gradient(135deg,#ffffff,#f8fbff)",
                                boxShadow:
                                  "0 12px 24px rgba(0,8,59,0.12), 0 4px 10px rgba(0,8,59,0.08)",
                              }}
                              onDropdownVisibleChange={undefined}
                              optionLabelProp="label"
                              showSearch
                              filterOption={(input, option) =>
                                (option?.value || "")
                                  .toLowerCase()
                                  .includes((input || "").toLowerCase())
                              }
                              value={form.getFieldValue("station")}
                              onChange={(value) => {
                                // Update both form value and formValues state
                                form.setFieldsValue({ station: value });
                                setFormValues((prev) => ({
                                  ...prev,
                                  station: value,
                                }));
                              }}
                            >
                              {(() => {
                                const items = stations
                                  .filter((s) =>
                                    selectedCity === "HN"
                                      ? s.city === "Hà Nội"
                                      : s.city === "TP.HCM"
                                  )
                                  .map((s) => ({
                                    ...s,
                                    distance: userLocation
                                      ? calculateDistance(
                                          userLocation[0],
                                          userLocation[1],
                                          s.position[0],
                                          s.position[1]
                                        )
                                      : Number.POSITIVE_INFINITY,
                                  }))
                                  .sort(
                                    (a, b) =>
                                      (a.distance || 0) - (b.distance || 0)
                                  );

                                const nearestId =
                                  nearestStation?.id || items[0]?.id;
                                const renderOption = (station, highlight) => (
                                  <Option
                                    key={station.id}
                                    value={station.name}
                                    label={
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                        }}
                                      >
                                        <span style={{ fontWeight: 700 }}>
                                          {station.name}
                                        </span>
                                        {userLocation && (
                                          <span
                                            style={{
                                              padding: "2px 6px",
                                              borderRadius: 8,
                                              border:
                                                "1px solid rgba(34,197,94,0.3)",
                                              background:
                                                "rgba(34,197,94,0.08)",
                                              color: "#15803d",
                                              fontSize: 10,
                                              fontWeight: 700,
                                            }}
                                          >
                                            {station.distance.toFixed(1)} km
                                          </span>
                                        )}
                                      </div>
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 32,
                                          height: 32,
                                          borderRadius: 16,
                                          background: highlight
                                            ? "linear-gradient(135deg,#06b6d4 0%, #3b82f6 100%)"
                                            : "linear-gradient(135deg,#22d3ee 0%, #3b82f6 100%)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          boxShadow:
                                            "0 6px 12px rgba(34,211,238,0.25)",
                                          flex: "0 0 auto",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "white",
                                            fontSize: 16,
                                          }}
                                        >
                                          ⚡
                                        </span>
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontWeight: 700,
                                              color: "#0f172a",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            {station.name}
                                          </div>
                                          {highlight && (
                                            <span
                                              style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4,
                                                padding: "2px 8px",
                                                borderRadius: 9999,
                                                background:
                                                  "linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(59,130,246,0.25) 100%)",
                                                border:
                                                  "1px solid rgba(34,211,238,0.6)",
                                                color: "#06b6d4",
                                                fontSize: 10,
                                                fontWeight: 800,
                                                letterSpacing: 0.3,
                                                boxShadow:
                                                  "0 0 0 1px rgba(255,255,255,0.1) inset, 0 6px 12px rgba(34,211,238,0.25)",
                                              }}
                                            >
                                              <span style={{ fontSize: 12 }}>
                                                🎯
                                              </span>
                                              <span>Gần nhất</span>
                                            </span>
                                          )}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 12,
                                            color: "#64748b",
                                          }}
                                        >
                                          {station.address}
                                        </div>
                                      </div>
                                      {userLocation && (
                                        <span
                                          style={{
                                            padding: "2px 8px",
                                            borderRadius: 8,
                                            border:
                                              "1px solid rgba(34,197,94,0.3)",
                                            background: "rgba(34,197,94,0.08)",
                                            color: "#15803d",
                                            fontSize: 12,
                                            fontWeight: 700,
                                          }}
                                        >
                                          {station.distance.toFixed(1)} km
                                        </span>
                                      )}
                                    </div>
                                  </Option>
                                );

                                const elements = [];
                                const nearest = items.find(
                                  (i) => i.id === nearestId
                                );
                                if (nearest) {
                                  elements.push(
                                    <Option
                                      disabled
                                      key="hdr-nearest"
                                      value="hdr-nearest"
                                    >
                                      <div
                                        style={{
                                          fontSize: 11,
                                          fontWeight: 800,
                                          letterSpacing: 1,
                                          color: "#0891b2",
                                          padding: "6px 8px",
                                        }}
                                      >
                                        ĐỀ XUẤT GẦN NHẤT
                                      </div>
                                    </Option>
                                  );
                                  elements.push(renderOption(nearest, true));
                                  elements.push(
                                    <Option
                                      disabled
                                      key="sep-nearest"
                                      value="sep-nearest"
                                    >
                                      <div
                                        style={{
                                          height: 1,
                                          background: "#e2e8f0",
                                          margin: "6px 0",
                                        }}
                                      />
                                    </Option>
                                  );
                                }

                                items
                                  .filter((i) => i.id !== nearestId)
                                  .forEach((i) =>
                                    elements.push(renderOption(i, false))
                                  );
                                return elements;
                              })()}
                            </Select>
                          </div>
                        </Form.Item>
                      </Col>

                      {/* Date Selection */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="date"
                          label={
                            <Space>
                              <CalendarOutlined style={{ color: "#00083B" }} />
                              <span
                                style={{ color: "#00083B", fontWeight: "600" }}
                              >
                                Chọn ngày
                              </span>
                            </Space>
                          }
                          rules={[
                            { required: true, message: "Vui lòng chọn ngày!" },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%", borderRadius: "12px" }}
                            placeholder="Chọn ngày"
                            size="large"
                            onChange={(date) => {
                              setSelectedDate(date);
                              // Update both form value and formValues state
                              form.setFieldsValue({ date: date });
                              setFormValues((prev) => ({
                                ...prev,
                                date: date,
                              }));
                            }}
                            disabledDate={(current) => {
                              const today = dayjs();
                              const maxDate = dayjs().add(3, "day");
                              return (
                                current &&
                                (current < today || current > maxDate)
                              );
                            }}
                          />
                        </Form.Item>
                      </Col>

                      {/* Time Selection */}
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="time"
                          label={
                            <Space>
                              <ClockCircleOutlined
                                style={{ color: "#00083B" }}
                              />
                              <span
                                style={{ color: "#00083B", fontWeight: "600" }}
                              >
                                Chọn giờ (8:00 - 20:00)
                              </span>
                            </Space>
                          }
                          rules={[
                            { required: true, message: "Vui lòng chọn giờ!" },
                          ]}
                        >
                          <Select
                            placeholder="-- Chọn giờ --"
                            size="large"
                            style={{ borderRadius: "12px" }}
                            onChange={(value) => {
                              setSelectedTimeSlot(value);
                              setFormValues((prev) => ({
                                ...prev,
                                time: value,
                              }));
                            }}
                          >
                            {timeSlots.map((time, index) => (
                              <Option key={index} value={time}>
                                {time}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      {/* Thông tin người dùng + chọn loại xe */}
                      <Col xs={24}>
                        <div
                          style={{
                            marginTop: 8,
                            marginBottom: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              background: "#00083B",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                            }}
                          >
                            {(user?.name || "U").charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#00083B" }}>
                              {user?.name || "User"}
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              {user?.email}
                            </div>
                          </div>
                        </div>
                        <Form.Item
                          name="vehicle"
                          label={
                            <span style={{ color: "#00083B", fontWeight: 600 }}>
                              Chọn loại xe đã liên kết
                            </span>
                          }
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn loại xe!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="-- Chọn loại xe --"
                            size="large"
                            style={{ borderRadius: 12 }}
                            value={form.getFieldValue("vehicle")}
                            onChange={(value) => {
                              form.setFieldsValue({ vehicle: value });
                              setFormValues((prev) => ({
                                ...prev,
                                vehicle: value,
                              }));
                            }}
                          >
                            {(user?.vehicles || []).map((v) => (
                              <Option key={v.id} value={v.name}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{v.name}</span>
                                  <div style={{ display: "flex", gap: 10 }}>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: "#64748b",
                                      }}
                                    >
                                      {v.type || v.battery}
                                    </span>
                                    {v.currentBattery && (
                                      <span
                                        style={{
                                          fontSize: 12,
                                          color: "#059669",
                                        }}
                                      >
                                        {`ID ${v.currentBattery.id}`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Option>
                            ))}
                          </Select>
                          {/* Thông tin xe và pin hiện tại dưới phần chọn xe (tab hôm nay) */}
                          {watchedVehicle && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 12, color: "#475569" }}>
                                <strong>Xe:</strong>{" "}
                                {(() => {
                                  const v = (user?.vehicles || []).find(
                                    (x) => x.name === watchedVehicle
                                  );
                                  return v?.plate
                                    ? `${watchedVehicle} • ${v.plate}`
                                    : watchedVehicle;
                                })()}
                              </div>
                              <div style={{ fontSize: 12, color: "#475569" }}>
                                <strong>Pin xe:</strong>{" "}
                                {(() => {
                                  const v = (user?.vehicles || []).find(
                                    (x) => x.name === watchedVehicle
                                  );
                                  return v?.type || v?.battery || "-";
                                })()}
                              </div>
                              <div style={{ fontSize: 12, color: "#475569" }}>
                                <strong>Mã số Pin hiện tại:</strong>{" "}
                                {(() => {
                                  const v = (user?.vehicles || []).find(
                                    (x) => x.name === watchedVehicle
                                  );
                                  return v?.currentBattery
                                    ? `${v.currentBattery.id}`
                                    : "-";
                                })()}
                              </div>
                            </div>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Action Buttons removed per request */}
                  </Form>
                </TabPane>
              </Tabs>
            </Card>
            {/* Inventory card moved to bottom full width */}
            {false && selectedStationData && watchedVehicle && (
              <Card
                style={{
                  marginTop: 16,
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
                  border: "1px solid rgba(0,8,59,0.08)",
                  boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
                }}
                bodyStyle={{ padding: 20 }}
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
                  <span
                    style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}
                  >
                    Tồn kho pin tại trạm đã chọn
                  </span>
                </div>
                <div style={{ color: "#475569", fontSize: 14 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>Trạm</div>
                      <div style={{ fontWeight: 700 }}>
                        {selectedStationData.name}
                      </div>
                    </div>
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Tổng pin / Khả dụng
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {totalBatteriesAll} / {totalAvailableAll}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Tổng quan theo loại:</strong>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {Object.keys(countsByTypeAll).map((type) => (
                        <div
                          key={type}
                          style={{
                            border: `2px solid ${
                              compatibleBatteryType === type
                                ? "#06b6d4"
                                : "rgba(0,8,59,0.1)"
                            }`,
                            borderRadius: 10,
                            padding: 10,
                            background:
                              compatibleBatteryType === type
                                ? "rgba(6,182,212,0.06)"
                                : "transparent",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              color:
                                compatibleBatteryType === type
                                  ? "#0e7490"
                                  : "#0f172a",
                            }}
                          >
                            {type}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Khả dụng: {availableByTypeAll[type] || 0}/
                            {countsByTypeAll[type]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>
                      Danh sách chi tiết
                      {compatibleBatteryType
                        ? ` (loại tương thích: ${compatibleBatteryType})`
                        : ""}
                      :
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {compatibleInventoryAll.slice().map((bat) => (
                      <div
                        key={bat.id}
                        style={{
                          border: "1px solid rgba(0,8,59,0.1)",
                          borderRadius: 12,
                          padding: 12,
                          background: "rgba(0, 8, 59, 0.03)",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {bat.type}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          Mã số Pin: {bat.id}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>
                          SoH: <strong>{bat.soh}%</strong>
                        </div>
                        <div style={{ fontSize: 13 }}>
                          SoC: <strong>{bat.soc}%</strong>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color:
                              bat.status === "available"
                                ? "#059669"
                                : "#a16207",
                          }}
                        >
                          Trạng thái:{" "}
                          {bat.status === "available" ? "Sẵn sàng" : "Đang sạc"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </Col>

          {/* Right Side - Map + Summary */}
          <Col
            xs={24}
            lg={10}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <Card
                className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] relative"
                style={{ height: 1050, overflow: "hidden" }}
              >
                {/* Simple Decorative Elements */}
                <div className="absolute -top-[30px] -left-[30px] w-[60px] h-[60px] bg-[rgba(0,8,59,0.05)] rounded-full z-0" />
                <div className="absolute -bottom-[20px] -right-[20px] w-[40px] h-[40px] bg-[rgba(16,185,129,0.05)] rounded-full z-0" />

                <div
                  className="text-center mb-8"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      marginBottom: "16px",
                      boxShadow: "0 8px 20px rgba(0, 8, 59, 0.15)",
                    }}
                  >
                    <EnvironmentOutlined
                      style={{ fontSize: "28px", color: "white" }}
                    />
                  </div>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#00083B",
                      fontSize: "18px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    Vị trí của bạn
                  </Title>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      marginTop: 4,
                    }}
                  >
                    Tìm trạm đổi pin gần nhất
                  </div>
                </div>

                {/* Location Info */}
                {nearestStation && (
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      marginBottom: "20px",
                    }}
                  >
                    <Card
                      size="small"
                      style={{
                        borderRadius: "18px",
                        background:
                          "linear-gradient(135deg, rgba(0,8,59,0.65) 0%, rgba(2,12,80,0.45) 100%)",
                        border: "1px solid rgba(56, 189, 248, 0.35)",
                        boxShadow:
                          "0 12px 30px rgba(2, 8, 23, 0.45), 0 6px 14px rgba(2, 8, 23, 0.25)",
                        backdropFilter: "blur(6px)",
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div className="flex items-start justify-between">
                        <Space>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 6px 14px rgba(34,211,238,0.35)",
                            }}
                          >
                            <StarOutlined
                              style={{ color: "white", fontSize: "16px" }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                color: "#e2e8f0",
                                fontSize: "12px",
                                letterSpacing: "0.02em",
                              }}
                            >
                              Trạm gần nhất
                            </div>
                            <div
                              style={{
                                color: "#ffffff",
                                fontWeight: 700,
                                fontSize: "16px",
                              }}
                            >
                              {nearestStation.name}
                            </div>
                          </div>
                        </Space>
                        <div
                          className="px-2 py-1 rounded-md text-[10px] font-semibold border"
                          style={{
                            color: "#22d3ee",
                            borderColor: "rgba(34,211,238,0.4)",
                            background: "rgba(34,211,238,0.08)",
                          }}
                        >
                          NEARBY
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                          {nearestStation.address}
                        </div>
                        <div className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 font-semibold">
                          🚗 Cách bạn: {nearestStation.distance.toFixed(1)} km
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Map */}
                <div
                  style={{
                    height: "560px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 1,
                    boxShadow:
                      "0 8px 20px rgba(0, 8, 59, 0.1), 0 4px 8px rgba(0, 8, 59, 0.05)",
                    border: "2px solid rgba(0, 8, 59, 0.08)",
                  }}
                >
                  {userLocation ? (
                    <MapContainer
                      center={userLocation}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* User Location */}
                      <Marker position={userLocation} icon={createUserIcon()}>
                        <Popup>
                          <div className="p-3 min-w-[240px] sm:min-w-[260px]">
                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "8px",
                                }}
                              >
                                <h3 className="text-base font-bold text-[#00083B] m-0 leading-tight">
                                  Vị trí của bạn
                                </h3>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white px-2 py-0.5 rounded-md text-[10px] font-bold border border-blue-500 shadow">
                                  📍 HIỆN TẠI
                                </div>
                              </div>
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "8px",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: "12px", color: "white" }}
                                  >
                                    🎯
                                  </span>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      color: "#00083B",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    Trạng thái định vị
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "#475569",
                                    }}
                                  >
                                    Đã xác định vị trí thành công
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "8px",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: "12px", color: "white" }}
                                  >
                                    🔍
                                  </span>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      color: "#00083B",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    Độ chính xác
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "#475569",
                                    }}
                                  >
                                    GPS độ chính xác cao
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-[linear-gradient(135deg,rgba(0,8,59,0.05)_0%,rgba(0,8,59,0.02)_100%)] border border-[rgba(0,8,59,0.1)] rounded-xl p-3 text-center">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "8px",
                                  }}
                                >
                                  <EnvironmentOutlined
                                    style={{ fontSize: "10px", color: "white" }}
                                  />
                                </div>
                                <span className="text-[12px] font-semibold text-[#00083B]">
                                  Trạm đổi pin VoltSwap
                                </span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Battery Stations */}
                      {stations.map((station) => {
                        // Kiểm tra xem đây có phải trạm gần nhất không
                        const isNearest =
                          nearestStation && nearestStation.id === station.id;

                        return (
                          <Marker
                            key={station.id}
                            position={station.position}
                            icon={
                              isNearest
                                ? createNearestStationIcon(
                                    station.id <= 5 ? "#00ff00" : "#ff6b35"
                                  )
                                : createBatteryIcon(
                                    station.id <= 5 ? "#00ff00" : "#ff6b35"
                                  )
                            }
                          >
                            <Popup>
                              <div className="p-3 min-w-[240px] sm:min-w-[260px]">
                                <div style={{ marginBottom: "16px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <h3 className="text-base font-bold text-[#00083B] m-0 leading-tight">
                                      {station.name}
                                    </h3>
                                    <div
                                      style={{ display: "flex", gap: "4px" }}
                                    >
                                      {isNearest && (
                                        <div className="bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900 px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-500 shadow">
                                          ⭐ GẦN NHẤT
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ marginBottom: "16px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background:
                                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "8px",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <EnvironmentOutlined
                                        style={{
                                          fontSize: "10px",
                                          color: "white",
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          color: "#00083B",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        Địa chỉ
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          color: "#475569",
                                          lineHeight: "1.4",
                                        }}
                                      >
                                        {station.address}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background:
                                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "8px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: "white",
                                        }}
                                      >
                                        🏙️
                                      </span>
                                    </div>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          color: "#00083B",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        Thành phố
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          color: "#475569",
                                        }}
                                      >
                                        {station.address
                                          .split(",")[1]
                                          ?.trim() || "Hà Nội"}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background:
                                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "8px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: "white",
                                        }}
                                      >
                                        📍
                                      </span>
                                    </div>
                                    <div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          color: "#00083B",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        Quận/Huyện
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          color: "#475569",
                                        }}
                                      >
                                        {station.address
                                          .split(",")[2]
                                          ?.trim() || "Ba Đình"}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {isNearest && (
                                  <div
                                    style={{
                                      background:
                                        "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)",
                                      border:
                                        "1px solid rgba(220, 38, 38, 0.1)",
                                      borderRadius: "12px",
                                      padding: "12px",
                                      marginBottom: "16px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                          borderRadius: "50%",
                                          background:
                                            "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          marginRight: "8px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            color: "white",
                                          }}
                                        >
                                          🚗
                                        </span>
                                      </div>
                                      <div>
                                        <div
                                          style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color: "#00083B",
                                            marginBottom: "2px",
                                          }}
                                        >
                                          Khoảng cách
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "14px",
                                            color: "#dc2626",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {nearestStation.distance.toFixed(1)}{" "}
                                          km
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="bg-[linear-gradient(135deg,rgba(0,8,59,0.05)_0%,rgba(0,8,59,0.02)_100%)] border border-[rgba(0,8,59,0.1)] rounded-xl p-3 mb-4 text-center">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background:
                                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "8px",
                                      }}
                                    >
                                      <PoweroffOutlined
                                        style={{
                                          fontSize: "10px",
                                          color: "white",
                                        }}
                                      />
                                    </div>
                                    <span className="text-[12px] font-semibold text-[#00083B]">
                                      Trạm đổi pin VoltSwap
                                    </span>
                                  </div>
                                </div>

                                {/* Chỉ giữ nút Chỉ đường */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      // Sử dụng địa chỉ văn bản thay vì tọa độ
                                      const stationAddress = station.address
                                        .replace(/ /g, "+")
                                        .replace(/,/g, "%2C");

                                      if (userLocation) {
                                        // Nếu có vị trí người dùng, tạo chỉ đường từ vị trí hiện tại
                                        const userLat = userLocation[0];
                                        const userLng = userLocation[1];
                                        const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${stationAddress}`;
                                        window.open(googleMapsUrl, "_blank");
                                      } else {
                                        // Nếu chưa có vị trí, chỉ hiển thị vị trí trạm
                                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${stationAddress}`;
                                        window.open(googleMapsUrl, "_blank");
                                      }
                                    }}
                                    className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-3 py-2 rounded-xl text-[13px] font-semibold border-0 cursor-pointer transition-all flex items-center justify-center gap-1 shadow hover:-translate-y-0.5"
                                  >
                                    <EnvironmentOutlined
                                      style={{ fontSize: "12px" }}
                                    />
                                    <span>Chỉ đường</span>
                                  </button>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f5f5f5",
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <Spin size="large" />
                        <div style={{ marginTop: "16px", color: "#666" }}>
                          Đang định vị vị trí của bạn...
                        </div>
                        <Button
                          type="primary"
                          onClick={getUserLocation}
                          loading={isLoadingLocation}
                          style={{ marginTop: "16px" }}
                        >
                          Định vị lại
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Info - gọn lại, không dư khoảng trống */}
                <div style={{ marginTop: "12px" }}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div
                        style={{
                          textAlign: "center",
                          padding: "12px 10px",
                          background:
                            "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
                          borderRadius: "12px",
                          border: "1px solid rgba(0, 8, 59, 0.1)",
                          transition: "all 0.3s ease",
                        }}
                        className="hover:shadow-md"
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                          }}
                        >
                          <ThunderboltOutlined
                            style={{ fontSize: "16px", color: "white" }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#00083B",
                            fontWeight: "600",
                          }}
                        >
                          5 phút
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                          Nhanh chóng
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          textAlign: "center",
                          padding: "12px 10px",
                          background:
                            "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
                          borderRadius: "12px",
                          border: "1px solid rgba(0, 8, 59, 0.1)",
                          transition: "all 0.3s ease",
                        }}
                        className="hover:shadow-md"
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                          }}
                        >
                          <SafetyOutlined
                            style={{ fontSize: "16px", color: "white" }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#00083B",
                            fontWeight: "600",
                          }}
                        >
                          An toàn
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                          100% chính hãng
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div
                        style={{
                          textAlign: "center",
                          padding: "12px 10px",
                          background:
                            "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
                          borderRadius: "12px",
                          border: "1px solid rgba(0, 8, 59, 0.1)",
                          transition: "all 0.3s ease",
                        }}
                        className="hover:shadow-md"
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 6px",
                          }}
                        >
                          <DollarOutlined
                            style={{ fontSize: "16px", color: "white" }}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#00083B",
                            fontWeight: "600",
                          }}
                        >
                          50k/lần
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                          Tiết kiệm
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* Booking Summary moved out to bottom-right card */}
                {false && (
                  <div style={{ marginTop: 16 }}>
                    <Card
                      style={{
                        borderRadius: 16,
                        background:
                          "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
                        border: "1px solid rgba(0,8,59,0.08)",
                        boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
                      }}
                      bodyStyle={{ padding: 20 }}
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
                        <span
                          style={{
                            color: "#00083B",
                            fontWeight: 700,
                            fontSize: 18,
                          }}
                        >
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
                        <span style={{ color: "#0f172a" }}>
                          {activeTab === "today"
                            ? dayjs().format("DD/MM/YYYY")
                            : watchedDate
                            ? watchedDate.format("DD/MM/YYYY")
                            : "Chưa chọn"}
                        </span>
                        <span>Giờ:</span>
                        <span style={{ color: "#0f172a" }}>
                          {watchedTime || "Chưa chọn"}
                        </span>
                        <span>Loại xe:</span>
                        <span style={{ color: "#0f172a" }}>
                          {watchedVehicle || "Chưa chọn"}
                        </span>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>
                          Phí dịch vụ:
                        </span>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>
                          {formatVND(serviceFee)}
                        </span>
                      </div>

                      {selectedTimeSlot && (
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
                                {selectedDate && activeTab === "future" && (
                                  <li>
                                    <strong>Ngày đã chọn:</strong>{" "}
                                    <strong style={{ color: "#00083B" }}>
                                      {selectedDate.format("DD/MM/YYYY")}
                                    </strong>
                                  </li>
                                )}
                                <li>
                                  <strong>Slot đã chọn:</strong>{" "}
                                  <strong style={{ color: "#00083B" }}>
                                    {selectedTimeSlot}
                                  </strong>
                                </li>
                                <li>
                                  ✅ <strong>Được phép:</strong> Đến từ{" "}
                                  <strong style={{ color: "#10b981" }}>
                                    {selectedTimeSlot.split(" - ")[0]}
                                  </strong>{" "}
                                  đến{" "}
                                  <strong style={{ color: "#10b981" }}>
                                    {selectedTimeSlot.split(" - ")[1]}
                                  </strong>
                                </li>
                                <li>
                                  ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                                  <strong style={{ color: "#dc2626" }}>
                                    {selectedTimeSlot.split(" - ")[1]}
                                  </strong>
                                </li>
                                <li>
                                  Lịch đổi pin sẽ bị{" "}
                                  <strong style={{ color: "#dc2626" }}>
                                    hủy tự động
                                  </strong>{" "}
                                  nếu đến muộn
                                </li>
                              </ul>
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
                      )}

                      <div style={{ marginTop: 16 }}>
                        <Button
                          type="primary"
                          size="large"
                          loading={isBooking}
                          style={{
                            height: 48,
                            borderRadius: 12,
                            background:
                              "linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)",
                            border: "none",
                            fontWeight: 700,
                          }}
                          onClick={() => {
                            form
                              .validateFields()
                              .then((values) => handleBooking(values))
                              .catch(() => {
                                message.error(
                                  "Vui lòng điền đầy đủ thông tin!"
                                );
                              });
                          }}
                        >
                          {isBooking ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            </div>
            {/* Booking Summary moved below the row to avoid increasing right column height */}
          </Col>
        </Row>

        {/* Bottom grid: Inventory (left) and Booking Summary (right) */}
        <Row gutter={[32, 32]} style={{ marginTop: 16 }}>
          {selectedStationData && watchedVehicle ? (
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
                  border: "1px solid rgba(0,8,59,0.08)",
                  boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
                  height: summaryCardHeight ? summaryCardHeight + 10 : 690,
                }}
                bodyStyle={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
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
                  <span
                    style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}
                  >
                    Tồn kho pin tại trạm đã chọn
                  </span>
                </div>
                <div style={{ color: "#475569", fontSize: 14 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>Trạm</div>
                      <div style={{ fontWeight: 700 }}>
                        {selectedStationData.name}
                      </div>
                    </div>
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Tổng pin / Khả dụng
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {totalBatteriesAll} / {totalAvailableAll}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Tổng quan theo loại:</strong>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {Object.keys(countsByTypeAll).map((type) => (
                        <div
                          key={type}
                          style={{
                            border: `2px solid ${
                              compatibleBatteryType === type
                                ? "#06b6d4"
                                : "rgba(0,8,59,0.1)"
                            }`,
                            borderRadius: 10,
                            padding: 10,
                            background:
                              compatibleBatteryType === type
                                ? "rgba(6,182,212,0.06)"
                                : "transparent",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              color:
                                compatibleBatteryType === type
                                  ? "#0e7490"
                                  : "#0f172a",
                            }}
                          >
                            {type}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Khả dụng: {availableByTypeAll[type] || 0}/
                            {countsByTypeAll[type]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>
                      Danh sách chi tiết
                      {compatibleBatteryType
                        ? ` (loại tương thích: ${compatibleBatteryType})`
                        : ""}
                      :
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 12,
                      flex: 1,
                      minHeight: 0,
                      maxHeight: 280,
                      overflowY: "auto",
                      paddingRight: 6,
                    }}
                  >
                    {compatibleInventoryAll.slice().map((bat) => (
                      <div
                        key={bat.id}
                        style={{
                          border: "1px solid rgba(0,8,59,0.1)",
                          borderRadius: 12,
                          padding: 12,
                          background: "rgba(0, 8, 59, 0.03)",
                          height: 130,
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {bat.type}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          Mã số Pin: {bat.id}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>
                          SoH: <strong>{bat.soh}%</strong>
                        </div>
                        <div style={{ fontSize: 13 }}>
                          SoC: <strong>{bat.soc}%</strong>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color:
                              bat.status === "available"
                                ? "#059669"
                                : "#a16207",
                          }}
                        >
                          Trạng thái:{" "}
                          {bat.status === "available" ? "Sẵn sàng" : "Đang sạc"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ) : (
            <Col xs={24} lg={14} />
          )}
          <Col xs={24} lg={10}>
            <Card
              ref={summaryCardRef}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)",
                border: "1px solid rgba(0,8,59,0.08)",
                boxShadow: "0 8px 24px rgba(0,8,59,0.08)",
              }}
              bodyStyle={{ padding: 20 }}
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
                <span
                  style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}
                >
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
                <span style={{ color: "#0f172a" }}>
                  {activeTab === "today"
                    ? dayjs().format("DD/MM/YYYY")
                    : watchedDate
                    ? watchedDate.format("DD/MM/YYYY")
                    : "Chưa chọn"}
                </span>
                <span>Giờ:</span>
                <span style={{ color: "#0f172a" }}>
                  {watchedTime || "Chưa chọn"}
                </span>
                <span>Loại xe:</span>
                <span style={{ color: "#0f172a" }}>
                  {watchedVehicle || "Chưa chọn"}
                </span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>
                  Phí dịch vụ:
                </span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>
                  {formatVND(serviceFee)}
                </span>
              </div>
              {/* Lưu ý quan trọng về thời gian */}
              {selectedTimeSlot && (
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
                        {selectedDate && activeTab === "future" && (
                          <li>
                            <strong>Ngày đã chọn:</strong>{" "}
                            <strong style={{ color: "#00083B" }}>
                              {selectedDate.format("DD/MM/YYYY")}
                            </strong>
                          </li>
                        )}
                        <li>
                          <strong>Slot đã chọn:</strong>{" "}
                          <strong style={{ color: "#00083B" }}>
                            {selectedTimeSlot}
                          </strong>
                        </li>
                        <li>
                          ✅ <strong>Được phép:</strong> Đến từ{" "}
                          <strong style={{ color: "#10b981" }}>
                            {selectedTimeSlot.split(" - ")[0]}
                          </strong>{" "}
                          đến{" "}
                          <strong style={{ color: "#10b981" }}>
                            {selectedTimeSlot.split(" - ")[1]}
                          </strong>
                        </li>
                        <li>
                          ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                          <strong style={{ color: "#dc2626" }}>
                            {selectedTimeSlot.split(" - ")[1]}
                          </strong>
                        </li>
                        <li>
                          Lịch đổi pin sẽ bị{" "}
                          <strong style={{ color: "#dc2626" }}>
                            hủy tự động
                          </strong>{" "}
                          nếu đến muộn
                        </li>
                      </ul>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        💡 <strong>Gợi ý:</strong> Hãy đến trong khung giờ{" "}
                        <strong>{selectedTimeSlot}</strong> để đảm bảo không bị
                        hủy lịch!
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
              )}

              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  size="large"
                  loading={isBooking}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)",
                    border: "none",
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    // Trigger form submission manually
                    console.log(
                      "Button clicked, attempting form submission..."
                    );
                    console.log("Form values:", form.getFieldsValue());
                    console.log("Form errors:", form.getFieldsError());

                    // Validate form first
                    form
                      .validateFields()
                      .then((values) => {
                        console.log(
                          "Form validation successful, calling handleBooking..."
                        );
                        handleBooking(values);
                      })
                      .catch((errorInfo) => {
                        console.log("Form validation failed:", errorInfo);
                        message.error("Vui lòng điền đầy đủ thông tin!");
                      });
                  }}
                >
                  {isBooking ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Removed obsolete full-width inventory duplicate */}
        {false && selectedStationData && watchedVehicle && (
          <Row gutter={[32, 32]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={24}>
              <Card style={{ borderRadius: 16 }} bodyStyle={{ padding: 20 }}>
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
                  <span
                    style={{ color: "#00083B", fontWeight: 700, fontSize: 18 }}
                  >
                    Tồn kho pin tại trạm đã chọn
                  </span>
                </div>
                <div style={{ color: "#475569", fontSize: 14 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>Trạm</div>
                      <div style={{ fontWeight: 700 }}>
                        {selectedStationData.name}
                      </div>
                    </div>
                    <div
                      style={{
                        border: "1px solid rgba(0,8,59,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        background: "rgba(0,8,59,0.03)",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        Tổng pin / Khả dụng
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {totalBatteriesAll} / {totalAvailableAll}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Tổng quan theo loại:</strong>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {Object.keys(countsByTypeAll).map((type) => (
                        <div
                          key={type}
                          style={{
                            border: `2px solid ${
                              compatibleBatteryType === type
                                ? "#06b6d4"
                                : "rgba(0,8,59,0.1)"
                            }`,
                            borderRadius: 10,
                            padding: 10,
                            background:
                              compatibleBatteryType === type
                                ? "rgba(6,182,212,0.06)"
                                : "transparent",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              color:
                                compatibleBatteryType === type
                                  ? "#0e7490"
                                  : "#0f172a",
                            }}
                          >
                            {type}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            Khả dụng: {availableByTypeAll[type] || 0}/
                            {countsByTypeAll[type]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>
                      Danh sách chi tiết
                      {compatibleBatteryType
                        ? ` (loại tương thích: ${compatibleBatteryType})`
                        : ""}
                      :
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {compatibleInventoryAll.slice().map((bat) => (
                      <div
                        key={bat.id}
                        style={{
                          border: "1px solid rgba(0,8,59,0.1)",
                          borderRadius: 12,
                          padding: 12,
                          background: "rgba(0, 8, 59, 0.03)",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {bat.type}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          Mã số Pin: {bat.id}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13 }}>
                          SoH: <strong>{bat.soh}%</strong>
                        </div>
                        <div style={{ fontSize: 13 }}>
                          SoC: <strong>{bat.soc}%</strong>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color:
                              bat.status === "available"
                                ? "#059669"
                                : "#a16207",
                          }}
                        >
                          Trạng thái:{" "}
                          {bat.status === "available" ? "Sẵn sàng" : "Đang sạc"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
