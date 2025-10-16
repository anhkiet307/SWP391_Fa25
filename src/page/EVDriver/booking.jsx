import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/header.jsx";
import apiService from "../../services/apiService";
import dayjs from "dayjs";
import {
  calculateSlotStatistics,
  isSlotAvailable,
  getSlotStatusText,
  getPinStatusText,
  getSlotStatusColor,
  getPinStatusColor,
  formatPinPercent,
  formatPinHealth,
  getPinPercentColor,
  getPinHealthColor,
} from "../../utils/pinSlotUtils";
import {
  findNearestStation,
  getUserCurrentLocation,
  formatDistance,
} from "../../utils/locationUtils";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Typography,
  Space,
  message,
  Result,
  Alert,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckOutlined,
} from "@ant-design/icons";

// Import các component mới
import BookingForm from "./component/booking/BookingForm";
import LocationMap from "./component/booking/LocationMap";
import PinInventory from "./component/booking/PinInventory";
import BookingSummary from "./component/booking/BookingSummary";

const { Title, Paragraph } = Typography;

export default function Booking() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedCity, setSelectedCity] = useState("HN");

  // States cho service packs
  const [servicePacks, setServicePacks] = useState([]);
  const [loadingServicePacks, setLoadingServicePacks] = useState(false);

  // States cho subscription
  const [userSubscription, setUserSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  // States cho kiểm tra pin slot đang được user giữ
  const [userReservedSlots, setUserReservedSlots] = useState([]);
  const [loadingReservedSlots, setLoadingReservedSlots] = useState(false);
  const [showBookingAlert, setShowBookingAlert] = useState(false);

  // States cho station detail và pinSlots từ API
  const [stationDetail, setStationDetail] = useState(null);
  const [pinSlots, setPinSlots] = useState([]);

  // States cho danh sách trạm từ API
  const [stationsList, setStationsList] = useState([]);
  const [loadingStationsList, setLoadingStationsList] = useState(false);

  // States cho vị trí và trạm gần nhất
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [allStations, setAllStations] = useState([]);

  const [formValues, setFormValues] = useState({
    station: null,
    date: null,
    time: null,
    selectedSlot: null,
  });

  // State cho ổ pin được chọn
  const [selectedPinSlot, setSelectedPinSlot] = useState(null);

  // Chỉ cho phép đặt trong ngày: luôn dùng ngày hôm nay
  useEffect(() => {
    const today = dayjs();
    setFormValues((prev) => ({ ...prev, date: today }));
  }, []);

  // Fetch station data khi có StationID từ URL
  useEffect(() => {
    const stationID = searchParams.get("stationID");
    if (stationID && stationsList.length > 0) {
      const selectedStation = stationsList.find(
        (station) => station.stationID === parseInt(stationID)
      );

      if (selectedStation) {
        form.setFieldsValue({ station: selectedStation.stationName });
        setFormValues((prev) => ({
          ...prev,
          station: selectedStation.stationName,
        }));

        const cityCode = selectedStation.city === "Hà Nội" ? "HN" : "HCM";
        setSelectedCity(cityCode);
        form.setFieldsValue({ city: cityCode });
        setFormValues((prev) => ({
          ...prev,
          city: cityCode,
        }));

        // Fetch dữ liệu trạm được chọn
        fetchStationData(selectedStation.stationID);
      }
    }
  }, [searchParams, stationsList]);

  // Fetch danh sách trạm, service packs và subscription khi component mount
  useEffect(() => {
    fetchStationsList();
    fetchServicePacks();
    checkUserSubscription();
    checkUserReservedSlots();
  }, []);

  // Re-check subscription when user info is ready (fix F5 refresh case)
  useEffect(() => {
    if (user?.userID) {
      checkUserSubscription();
      checkUserReservedSlots();
    }
  }, [user]);

  // Function để lấy danh sách service packs
  const fetchServicePacks = async () => {
    console.log("Bắt đầu lấy danh sách service pack");
    setLoadingServicePacks(true);
    try {
      const response = await apiService.getServicePacks();
      console.log("Service pack response:", response);

      if (response?.status === "success") {
        setServicePacks(response.data);
        console.log("Danh sách service pack:", response.data);
      } else {
        console.log("❌ Service pack API không thành công:", response);
      }
    } catch (error) {
      console.error("Error fetching service packs:", error);
      message.error("Không thể tải danh sách gói dịch vụ");
    } finally {
      setLoadingServicePacks(false);
    }
  };

  // Function để kiểm tra subscription của user
  const checkUserSubscription = async () => {
    if (!user?.userID) {
      console.log("Không có user ID, không thể kiểm tra subscription");
      return;
    }

    console.log("Bắt đầu kiểm tra subscription cho user ID:", user.userID);
    setLoadingSubscription(true);
    try {
      const subscriptionResponse = await apiService.getUserSubscription(
        user.userID
      );
      console.log("Subscription response:", subscriptionResponse);

      if (subscriptionResponse?.status === "success") {
        if (subscriptionResponse.data && subscriptionResponse.data !== null) {
          // User có subscription
          setUserSubscription(subscriptionResponse.data);
          console.log("✅ User có subscription:", subscriptionResponse.data);
        } else {
          // User không có subscription (data = null)
          console.log("❌ User không có subscription (data = null)");
          setUserSubscription(null);
        }
      } else {
        console.log(
          "❌ Subscription API không thành công:",
          subscriptionResponse
        );
        setUserSubscription(null);
      }
    } catch (error) {
      console.error("Error checking user subscription:", error);
      message.error("Không thể kiểm tra subscription");
      setUserSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  };

  // Function để kiểm tra pin slot đang được user giữ
  const checkUserReservedSlots = async () => {
    if (!user?.userID) {
      console.log("Không có user ID, không thể kiểm tra pin slot đã giữ");
      return;
    }

    console.log("Bắt đầu kiểm tra pin slot đã giữ cho user ID:", user.userID);
    setLoadingReservedSlots(true);
    try {
      const response = await apiService.getPinslots();
      console.log("All pin slots response:", response);

      if (response?.status === "success") {
        // Lọc các pin slot có status = 2 (đã cho thuê) và userID trùng với user hiện tại
        const reservedSlots = response.data.filter(
          (slot) => slot.status === 2 && slot.userID === user.userID
        );

        console.log("Pin slots đang được user giữ:", reservedSlots);
        setUserReservedSlots(reservedSlots);

        // Hiển thị alert nếu có pin slot đang được giữ
        if (reservedSlots.length > 0) {
          setShowBookingAlert(true);
        } else {
          setShowBookingAlert(false);
        }
      } else {
        console.log("❌ Pin slots API không thành công:", response);
        setUserReservedSlots([]);
        setShowBookingAlert(false);
      }
    } catch (error) {
      console.error("Error checking user reserved slots:", error);
      message.error("Không thể kiểm tra pin slot đã giữ");
      setUserReservedSlots([]);
      setShowBookingAlert(false);
    } finally {
      setLoadingReservedSlots(false);
    }
  };

  // Function để hủy lịch đổi pin
  const handleCancelBooking = async (pinID) => {
    try {
      console.log("Hủy lịch cho pin ID:", pinID);
      const response = await apiService.unreservePinSlot(pinID);

      if (response?.status === "success") {
        message.success("Hủy lịch thành công!");
        // Refresh lại danh sách pin slot đã giữ
        await checkUserReservedSlots();
      } else {
        message.error("Không thể hủy lịch. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      message.error("Có lỗi khi hủy lịch. Vui lòng thử lại!");
    }
  };

  // Tự động định vị vị trí khi load trang
  useEffect(() => {
    const autoGetLocation = async () => {
      try {
        const location = await getUserCurrentLocation();
        setUserLocation([location.lat, location.lng]);

        // Tìm trạm gần nhất
        const nearest = findNearestStation(
          allStations,
          location.lat,
          location.lng
        );
        setNearestStation(nearest);

        // Tự động chọn trạm gần nhất nếu có
        if (nearest) {
          form.setFieldsValue({ station: nearest.stationName });
          setFormValues((prev) => ({
            ...prev,
            station: nearest.stationName,
          }));

          // Fetch dữ liệu trạm gần nhất
          await fetchStationData(nearest.stationID);

          message.success(
            `Đã tự động chọn trạm gần nhất: ${
              nearest.stationName
            } (${formatDistance(nearest.distance)})`
          );
        }
      } catch (error) {
        console.error("Error getting user location:", error);
        setLocationError(error.message);
        // Không hiển thị error message để không làm phiền người dùng
      }
    };

    // Chỉ tự động định vị nếu có danh sách trạm
    if (allStations.length > 0) {
      autoGetLocation();
    }
  }, [allStations]); // Chạy khi allStations thay đổi

  // Function để fetch danh sách trạm từ API
  const fetchStationsList = async () => {
    setLoadingStationsList(true);
    try {
      const response = await apiService.getPinStations();
      if (response?.status === "success") {
        // Chỉ lấy các trạm có status = 1 (đang hoạt động), ẩn các trạm status = 0 (bảo dưỡng)
        const activeStations = response.data.filter(
          (station) => station.status === 1
        );
        setStationsList(activeStations);
        setAllStations(activeStations); // Lưu các trạm đang hoạt động để tính toán khoảng cách
      }
    } catch (error) {
      console.error("Error fetching stations list:", error);
      message.error("Không thể tải danh sách trạm");
    } finally {
      setLoadingStationsList(false);
    }
  };

  // Function để lấy vị trí hiện tại của người dùng
  const handleGetUserLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const location = await getUserCurrentLocation();
      setUserLocation([location.lat, location.lng]);

      // Tìm trạm gần nhất
      const nearest = findNearestStation(
        allStations,
        location.lat,
        location.lng
      );
      setNearestStation(nearest);

      // Tự động chọn trạm gần nhất nếu có
      if (nearest) {
        form.setFieldsValue({ station: nearest.stationName });
        setFormValues((prev) => ({
          ...prev,
          station: nearest.stationName,
        }));

        // Fetch dữ liệu trạm gần nhất
        await fetchStationData(nearest.stationID);

        message.success(
          `Đã tự động chọn trạm gần nhất: ${
            nearest.stationName
          } (${formatDistance(nearest.distance)})`
        );
      }
    } catch (error) {
      console.error("Error getting user location:", error);
      setLocationError(error.message);
      message.error(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Function để fetch station detail và pinSlots
  const fetchStationData = async (stationID) => {
    try {
      // Fetch station detail
      const stationResponse = await apiService.getStationDetail(stationID);
      if (stationResponse?.status === "success") {
        setStationDetail(stationResponse.data);

        // Set station trong form
        // Set station name vào form (form expect string, không phải object)
        form.setFieldsValue({ station: stationResponse.data.stationName });
        setFormValues((prev) => ({
          ...prev,
          station: stationResponse.data.stationName,
        }));
      }

      // Fetch pinSlots
      const pinSlotsResponse = await apiService.getPinSlots(stationID);
      if (pinSlotsResponse?.status === "success") {
        setPinSlots(pinSlotsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching station data:", error);
      message.error("Không thể tải thông tin trạm");
    }
  };

  const watchedStation = formValues.station;
  const selectedStationForSummary = stationsList.find(
    (station) => station.stationName === watchedStation
  );
  const selectedStationIdForSummary = selectedStationForSummary?.stationID;

  // Sử dụng stationDetail từ API với format đúng
  const selectedStationData = stationDetail
    ? {
        ...stationDetail,
        slots: pinSlots.map((slot) => ({
          pinID: slot.pinID,
          id: slot.pinID,
          slotNumber: slot.pinID,
          soc: slot.pinPercent || 0, // SoC từ API
          soh: slot.pinHealth || 0, // SoH từ API
          status: slot.status, // Trạng thái khả dụng (0, 1, 2)
          pinStatus: slot.pinStatus, // Trạng thái pin (0, 1)
          userID: slot.userID, // ID người dùng đang thuê
          stationID: slot.stationID, // ID trạm sạc
          // Thêm các trường helper để dễ sử dụng
          isAvailable: isSlotAvailable(slot),
          statusText: getSlotStatusText(slot.status),
          pinStatusText: getPinStatusText(slot.pinStatus),
          statusColor: getSlotStatusColor(slot.status),
          pinStatusColor: getPinStatusColor(slot.pinStatus),
          socFormatted: formatPinPercent(slot.pinPercent),
          sohFormatted: formatPinHealth(slot.pinHealth),
          socColor: getPinPercentColor(slot.pinPercent),
          sohColor: getPinHealthColor(slot.pinHealth),
        })),
      }
    : null;

  // Thống kê tổng quan toàn trạm sử dụng utility functions
  // const slotStatistics = calculateSlotStatistics(pinSlots);

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

  // Component hiển thị thông báo chặn booking khi user đã có lịch chưa xử lý
  const BookingBlockAlert = () => {
    if (!showBookingAlert || userReservedSlots.length === 0) return null;

    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div className="w-full max-w-6xl">
          <Row gutter={[32, 32]} align="middle">
            {/* Left Side - Illustration/Info */}
            <Col xs={24} lg={10}>
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      boxShadow:
                        "0 20px 40px rgba(245, 158, 11, 0.3), 0 8px 16px rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <CalendarOutlined
                      style={{ fontSize: "60px", color: "white" }}
                    />
                  </div>
                  <Title
                    level={1}
                    style={{
                      color: "#00083B",
                      margin: 0,
                      fontSize: "36px",
                      fontWeight: "700",
                      marginBottom: "16px",
                    }}
                  >
                    Lịch Đổi Pin Chưa Xử Lý
                  </Title>
                  <Paragraph
                    style={{
                      color: "#64748b",
                      fontSize: "20px",
                      margin: 0,
                      fontWeight: "500",
                      lineHeight: "1.6",
                    }}
                  >
                    Bạn đang có lịch đổi pin chưa hoàn thành. Vui lòng hoàn
                    thành hoặc hủy lịch hiện tại trước khi đặt lịch mới.
                  </Paragraph>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/">
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        height: "56px",
                        fontSize: "18px",
                        fontWeight: "700",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                        border: "none",
                        padding: "0 32px",
                        boxShadow: "0 8px 24px rgba(0, 8, 59, 0.3)",
                        transition: "all 0.3s ease",
                        minWidth: "200px",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 12px 32px rgba(0, 8, 59, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 8px 24px rgba(0, 8, 59, 0.3)";
                      }}
                    >
                      Về Trang Chủ
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>

            {/* Right Side - Rules & Info */}
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: "24px",
                  boxShadow:
                    "0 20px 40px rgba(0, 8, 59, 0.15), 0 8px 16px rgba(0, 8, 59, 0.1)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  border: "2px solid #f59e0b",
                  height: "100%",
                }}
                bodyStyle={{ padding: "32px" }}
              >
                <div className="text-center mb-6">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      boxShadow:
                        "0 8px 16px rgba(245, 158, 11, 0.3), 0 4px 8px rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <span style={{ fontSize: "32px" }}>⚠️</span>
                  </div>
                  <Title
                    level={2}
                    style={{
                      color: "#00083B",
                      margin: 0,
                      fontSize: "24px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    Lưu ý quan trọng
                  </Title>
                  <Paragraph
                    style={{
                      color: "#64748b",
                      fontSize: "16px",
                      margin: 0,
                      fontWeight: "500",
                    }}
                  >
                    Quy định về đặt lịch đổi pin
                  </Paragraph>
                </div>

                <div className="space-y-4">
                  <div
                    className="flex items-start p-4 rounded-lg"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>1️⃣</span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#00083B",
                          marginBottom: "4px",
                        }}
                      >
                        Mỗi tài khoản chỉ được đặt 1 lịch đổi pin tại một thời
                        điểm
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        Đảm bảo công bằng và hiệu quả cho tất cả người dùng
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-start p-4 rounded-lg"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>2️⃣</span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#00083B",
                          marginBottom: "4px",
                        }}
                      >
                        Hoàn thành hoặc hủy lịch hiện tại trước khi đặt lịch mới
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        Tránh tình trạng đặt nhiều lịch cùng lúc
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-start p-4 rounded-lg"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>3️⃣</span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#00083B",
                          marginBottom: "4px",
                        }}
                      >
                        Hủy lịch nếu không thể đến đúng giờ để tránh bị tính phí
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        Giúp người khác có cơ hội sử dụng pin slot
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-start p-4 rounded-lg"
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>4️⃣</span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#00083B",
                          marginBottom: "4px",
                        }}
                      >
                        Hủy lịch sẽ giải phóng pin slot cho người khác sử dụng
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#64748b",
                        }}
                      >
                        Tạo cơ hội cho cộng đồng sử dụng dịch vụ
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  // Handler để cập nhật formValues
  const handleFormChange = (changedValues, allValues) => {
    setFormValues((prev) => ({ ...prev, ...changedValues }));
  };

  const handleBooking = async (values) => {
    // Validate form data
    const errors = [];

    if (!values.station) {
      errors.push("Vui lòng chọn trạm đổi pin");
    }

    if (!user?.userID) {
      errors.push("Vui lòng đăng nhập để đặt lịch");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setValidationErrors([]);
    setIsBooking(true);

    try {
      // Tìm trạm được chọn để lấy stationID
      const selectedStation = stationsList.find(
        (station) => station.stationName === values.station
      );

      if (!selectedStation) {
        message.error("Không tìm thấy thông tin trạm");
        return;
      }

      // Kiểm tra ổ pin được chọn
      if (!selectedPinSlot) {
        message.error("Vui lòng chọn ổ pin để đặt lịch");
        return;
      }

      // Kiểm tra pinStatus và status: chỉ cho phép khi pinStatus = 1 (đầy) và status = 1 (khả dụng)
      if (selectedPinSlot.pinStatus !== 1) {
        message.error("Ổ pin đang sạc, vui lòng chọn ổ pin khác");
        return;
      }
      if (selectedPinSlot.status !== 1) {
        message.error("Ổ pin đã chọn không khả dụng");
        return;
      }

      // Chuẩn bị dữ liệu transaction dựa trên subscription
      const basicPack = servicePacks.find(
        (pack) => pack.packID === 1 && pack.status === 1
      );

      const transactionData = {
        userID: user.userID,
        amount: userSubscription ? 0 : basicPack?.price || 0, // Nếu có subscription thì 0, không thì giá gói cơ bản
        // pack: 0 = thanh toán tiền mặt tại trạm, 1 = thanh toán bằng lượt (subscription)
        pack: userSubscription ? 1 : 0,
        stationID: selectedStation.stationID,
        pinID: selectedPinSlot.pinID, // Sử dụng ổ pin được chọn
        status: 0, // Mặc định là pending
      };

      console.log("Tạo transaction với dữ liệu:", transactionData);

      // Gọi đồng thời: tạo transaction và reserve pin slot
      const [transactionResponse, reserveResponse] = await Promise.all([
        apiService.createTransaction(transactionData),
        apiService.reservePinSlot(selectedPinSlot.pinID, user.userID),
      ]);

      if (
        transactionResponse?.status === "success" &&
        reserveResponse?.status === "success"
      ) {
        message.success("Đặt lịch thành công!");

        // Chuẩn hóa dữ liệu trước khi điều hướng
        const normalizedValues = {
          ...values,
          date: dayjs().format("YYYY-MM-DD"),
          selectedSlot: selectedPinSlot.pinID,
          transactionData: transactionResponse.data,
          amount: transactionData.amount,
          pack: transactionData.pack,
        };

        setBookingData(normalizedValues);
        setBookingSuccess(true);

        // Navigate to success page with booking data
        navigate("/booking-success", {
          state: { bookingData: normalizedValues },
        });
      } else {
        const errorMsg =
          transactionResponse?.message ||
          reserveResponse?.message ||
          "Có lỗi khi tạo giao dịch hoặc giữ ổ pin";
        message.error(errorMsg);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      message.error("Có lỗi khi đặt lịch. Vui lòng thử lại!");
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    form.resetFields();
    setBookingSuccess(false);
    setBookingData(null);
  };

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
                        {(() => {
                          const parsed = dayjs(bookingData?.date);
                          return parsed.isValid()
                            ? parsed.format("DD/MM/YYYY")
                            : bookingData?.date || "";
                        })()}
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
                          {bookingData?.time?.split(" - ")[0] || ""}
                        </strong>{" "}
                        đến{" "}
                        <strong style={{ color: "#10b981" }}>
                          {bookingData?.time?.split(" - ")[1] || ""}
                        </strong>
                      </li>
                      <li>
                        ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                        <strong style={{ color: "#dc2626" }}>
                          {bookingData?.time?.split(" - ")[1] || ""}
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

  // Nếu user đã có lịch chưa xử lý, hiển thị trang chặn booking
  if (showBookingAlert && userReservedSlots.length > 0) {
    return <BookingBlockAlert />;
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

        {/* Subscription info hidden - API vẫn gọi ngầm để tính phí, không hiển thị UI */}

        {/* Service packs UI ẩn - vẫn tải dữ liệu ngầm để xác định phí, không hiển thị */}

        {/* Loading UI cho service packs ẩn */}

        {/* Validation Errors Alert */}
        <ValidationErrorsAlert />

        <Row gutter={[32, 32]}>
          {/* Left Side - Booking Form */}
          <Col
            xs={24}
            lg={14}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <BookingForm
              form={form}
              stationsList={stationsList}
              loadingStationsList={loadingStationsList}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              nearestStation={nearestStation}
              userLocation={userLocation}
              isLoadingLocation={isLoadingLocation}
              locationError={locationError}
              handleGetUserLocation={handleGetUserLocation}
              handleFormChange={handleFormChange}
              fetchStationData={fetchStationData}
            />
          </Col>
          {/* Right Side - Map + Summary */}
          <Col
            xs={24}
            lg={10}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <LocationMap
                userLocation={userLocation}
                stationsList={stationsList}
                nearestStation={nearestStation}
                isLoadingLocation={isLoadingLocation}
                handleGetUserLocation={handleGetUserLocation}
              />
            </div>
          </Col>
        </Row>

        {/* Bottom grid: Inventory (left) and Booking Summary (right) */}
        <Row gutter={[32, 32]} align="stretch" style={{ marginTop: 16 }}>
          {selectedStationData ? (
            <Col xs={24} lg={14}>
              <PinInventory
                selectedStationData={selectedStationData}
                pinSlots={pinSlots}
                watchedStation={watchedStation}
                selectedPinSlot={selectedPinSlot}
                setSelectedPinSlot={setSelectedPinSlot}
              />
            </Col>
          ) : (
            <Col xs={24} lg={14} />
          )}
          <Col xs={24} lg={10}>
            <BookingSummary
              watchedStation={watchedStation}
              isBooking={isBooking}
              handleBooking={handleBooking}
              form={form}
              userSubscription={userSubscription}
              servicePacks={servicePacks}
              loadingSubscription={loadingSubscription}
              selectedStationId={selectedStationIdForSummary}
              selectedPinSlotId={selectedPinSlot?.pinID || null}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
