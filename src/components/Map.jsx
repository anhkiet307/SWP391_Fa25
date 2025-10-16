import React, { useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Typography, Space, Button, Tag } from "antd";
import {
  PoweroffOutlined,
  EnvironmentOutlined,
  AimOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { batteryStations } from "../data/stations";
import apiService from "../services/apiService";
import RatingModal from "./RatingModal";
import { useAuth } from "../contexts/AuthContext";

const { Title, Paragraph } = Typography;

// CSS cho animation
const popupStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;

// Thêm CSS vào head
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = popupStyles;
  document.head.appendChild(style);
}

// Fix cho default markers trong React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Tạo icon tùy chỉnh cho trạm đổi pin
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

// Tạo icon cho vị trí người dùng
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

// Tạo icon cho trạm gần nhất (nổi bật hơn)
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

// Tạo icon cho trạm được chọn (màu xanh dương)
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

// Component để cập nhật vị trí người dùng
function UserLocationMarker({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 12);
    }
  }, [userLocation, map]);

  if (!userLocation) return null;

  return (
    <Marker position={userLocation} icon={createUserIcon()}>
      <Popup>
        <div style={{ padding: "16px", minWidth: "300px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#00083B",
                  margin: 0,
                  lineHeight: "1.3",
                }}
              >
                Vị trí của bạn
              </h3>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#1e40af",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: "700",
                  border: "1px solid #3b82f6",
                  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)",
                }}
              >
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
                <span style={{ fontSize: "12px", color: "white" }}>🎯</span>
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
                <span style={{ fontSize: "12px", color: "white" }}>🔍</span>
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

          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
              border: "1px solid rgba(0, 8, 59, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
            }}
          >
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
              <span
                style={{
                  fontSize: "12px",
                  color: "#00083B",
                  fontWeight: "600",
                }}
              >
                VoltSwap Location Service
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Component để tối ưu hóa bản đồ
function MapOptimizer() {
  const map = useMap();

  useEffect(() => {
    // Force redraw để đảm bảo bản đồ hiển thị đầy đủ
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

// Hàm tính khoảng cách giữa 2 điểm (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Khoảng cách tính bằng km
};

// Component bản đồ chính
function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [nearestStation, setNearestStation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationPopup, setShowStationPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [mapCenter, setMapCenter] = useState([16.0, 108.0]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);

  // States cho API data
  const [apiStations, setApiStations] = useState([]);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [stationsError, setStationsError] = useState(null);

  // States cho rating data
  const [ratingData, setRatingData] = useState({});
  const [isLoadingRating, setIsLoadingRating] = useState(false);
  const [ratingError, setRatingError] = useState(null);

  // States cho RatingModal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStationForRating, setSelectedStationForRating] =
    useState(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Hàm transform dữ liệu từ API sang format cần thiết
  const transformApiStationData = useCallback((apiData) => {
    return apiData.map((station) => {
      // Kiểm tra an toàn cho location
      const location = station.location || "";
      const address = location || "Địa chỉ chưa xác định";

      // Detect city từ address với kiểm tra an toàn
      let city = "TP.HCM"; // Default city
      if (location && typeof location === "string") {
        if (location.includes("Hà Nội")) {
          city = "Hà Nội";
        } else if (location.includes("TPHCM") || location.includes("TP.HCM")) {
          city = "TP.HCM";
        }
      }

      return {
        id: station.stationID,
        name: station.stationName || "Trạm sạc",
        address: address,
        position: [station.x || 0, station.y || 0], // API trả về x, y thay vì lat, lng
        city: city,
        district: "Chưa xác định", // API chưa có district info
        rating: 4.0, // Default rating cho UI
        totalRatings: 0, // Default cho UI
        status: station.status === 1 ? "active" : "inactive",
        createAt: station.createAt,
        userID: station.userID, // Thêm userID từ API mới
      };
    });
  }, []);

  // Hàm fetch dữ liệu trạm từ API
  const fetchStationsFromAPI = useCallback(async () => {
    setIsLoadingStations(true);
    setStationsError(null);

    try {
      const response = await apiService.getPinStations();

      if (response && response.status === "success") {
        const transformedStations = transformApiStationData(response.data);
        setApiStations(transformedStations);
      } else {
        setStationsError("Không thể tải danh sách trạm sạc");
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      setStationsError(`Lỗi khi tải danh sách trạm sạc: ${error.message}`);
    } finally {
      setIsLoadingStations(false);
    }
  }, [transformApiStationData]);

  // Hàm fetch rating statistics cho một trạm
  const fetchRatingStatistics = useCallback(async (stationId) => {
    setIsLoadingRating(true);
    setRatingError(null);

    try {
      const response = await apiService.getRatingStatistics(stationId);

      if (response && response.status === "success") {
        setRatingData((prev) => ({
          ...prev,
          [stationId]: response.data,
        }));
      } else {
        setRatingError("Không thể tải thông tin đánh giá");
      }
    } catch (error) {
      console.error("Error fetching rating statistics:", error);
      setRatingError(`Lỗi khi tải thông tin đánh giá: ${error.message}`);
    } finally {
      setIsLoadingRating(false);
    }
  }, []);

  // Hàm xử lý rating
  const handleRatingSubmit = useCallback(
    async (rating) => {
      if (selectedStationForRating) {
        // Refresh rating data sau khi submit thành công
        await fetchRatingStatistics(selectedStationForRating.id);
      }
    },
    [selectedStationForRating, fetchRatingStatistics]
  );

  // Hàm mở rating modal
  const handleOpenRatingModal = useCallback(
    (station) => {
      if (!isAuthenticated) {
        // Redirect to login nếu chưa đăng nhập
        window.location.href = "/login";
        return;
      }
      setSelectedStationForRating(station);
      setShowRatingModal(true);
    },
    [isAuthenticated]
  );

  // Hàm mở booking modal
  const handleOpenBookingModal = useCallback(
    (station) => {
      if (!isAuthenticated) {
        // Redirect to login nếu chưa đăng nhập
        window.location.href = "/login";
        return;
      }
      // Chuyển hướng đến trang booking với StationID
      navigate(`/booking?stationID=${station.id}`);
    },
    [isAuthenticated, navigate]
  );

  // Hàm xử lý booking submit
  const handleBookingSubmit = useCallback((bookingData) => {
    console.log("Booking data:", bookingData);
    // TODO: Implement booking logic here
  }, []);

  // Load stations khi component mount
  useEffect(() => {
    fetchStationsFromAPI();
  }, [fetchStationsFromAPI]);

  // Hàm lấy vị trí hiện tại của người dùng
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);
        setIsLoadingLocation(false);

        // Tìm trạm gần nhất
        let minDistance = Infinity;
        let nearest = null;

        apiStations.forEach((station) => {
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

        // Hiển thị popup thành công
        setShowSuccessPopup(true);

        // Tự động ẩn popup sau 5 giây (tăng thời gian để đọc thông tin)
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Bạn đã từ chối quyền truy cập vị trí");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Vị trí hiện tại không khả dụng");
            break;
          case error.TIMEOUT:
            setLocationError("Hết thời gian chờ định vị");
            break;
          default:
            setLocationError("Lỗi không xác định khi định vị");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [apiStations]);

  // Hàm chọn thành phố
  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);

    if (city === "Tất cả") {
      setMapCenter([16.0, 108.0]); // Trung tâm Việt Nam
      setMapZoom(6);
    } else if (city === "Hà Nội") {
      setMapCenter([21.0285, 105.8542]);
      setMapZoom(6);
    } else if (city === "TP.HCM") {
      setMapCenter([10.7769, 106.7009]);
      setMapZoom(6);
    }
  }, []);

  // Lọc trạm theo thành phố được chọn
  const filteredStations = apiStations.filter((station) => {
    if (
      selectedCity &&
      selectedCity !== "Tất cả" &&
      station.city !== selectedCity
    )
      return false;
    return true;
  });

  return (
    <div className="w-full relative z-0">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Bộ lọc bên trái */}
        <div className="w-full lg:w-[320px] xl:w-[380px] 2xl:w-[440px] pl-0 ml-0">
          <div
            className="rounded-2xl lg:rounded-l-none shadow-lg p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.10) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              marginLeft: 0,
            }}
          >
            {/* Header accent */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                Bộ lọc trạm sạc
              </h3>
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  background:
                    "linear-gradient(135deg, rgba(125,211,252,0.25) 0%, rgba(147,197,253,0.25) 100%)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#e5f2ff",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                UI Glass
              </div>
            </div>

            <div className="space-y-4">
              {/* Chọn thành phố */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Thành phố
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    color: "#ffffff",
                    fontWeight: "600",
                  }}
                >
                  <option
                    value="Tất cả"
                    style={{
                      background: "#1a1a1a",
                      color: "#ffffff",
                      fontWeight: "600",
                    }}
                  >
                    Tất cả thành phố
                  </option>
                  <option
                    value="Hà Nội"
                    style={{
                      background: "#1a1a1a",
                      color: "#ffffff",
                      fontWeight: "600",
                    }}
                  >
                    Hà Nội
                  </option>
                  <option
                    value="TP.HCM"
                    style={{
                      background: "#1a1a1a",
                      color: "#ffffff",
                      fontWeight: "600",
                    }}
                  >
                    TP.HCM
                  </option>
                </select>
              </div>

              {/* Thống kê */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.10) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <h4 className="text-sm font-semibold text-white/90 mb-3">
                  📊 Thống kê
                </h4>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center justify-between group">
                    <span className="group-hover:text-white transition-colors">
                      Tổng trạm
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        background:
                          "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(34,197,94,0.25) 100%)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#eafff5",
                      }}
                    >
                      {filteredStations.length}
                    </span>
                  </div>
                  <div
                    className="h-px w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                  {selectedCity !== "Tất cả" && (
                    <div className="flex items-center justify-between group">
                      <span className="group-hover:text-white transition-colors">
                        Tại {selectedCity}
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          background:
                            "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.25) 100%)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          color: "#e8f0ff",
                        }}
                      >
                        {
                          apiStations.filter((s) => s.city === selectedCity)
                            .length
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Nút reset */}
              <button
                onClick={() => {
                  setSelectedCity("Tất cả");
                  setMapCenter([16.0, 108.0]);
                  setMapZoom(6);
                }}
                className="w-full px-4 py-2 text-white rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <ReloadOutlined style={{ marginRight: "8px" }} />
                Reset bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Bản đồ bên phải */}
        {/* Divider giữa filter và map */}
        <div className="hidden lg:block w-px bg-white/10" />

        <div className="flex-1 min-w-0">
          {/* Nút điều khiển */}
          <div className="mb-4 flex justify-between items-center relative z-10">
            <div className="flex gap-2">
              <button
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all bg-white/15 hover:bg-white/25 disabled:bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-lg"
              >
                {isLoadingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang định vị...</span>
                  </>
                ) : (
                  <>
                    <EnvironmentOutlined />
                    <span>Định vị vị trí</span>
                  </>
                )}
              </button>

              {nearestStation && (
                <button
                  onClick={() => {
                    // Sử dụng địa chỉ văn bản thay vì tọa độ
                    const stationAddress = nearestStation.address
                      .replace(/ /g, "+")
                      .replace(/,/g, "%2C");
                    const userLat = userLocation[0];
                    const userLng = userLocation[1];
                    const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${stationAddress}`;
                    window.open(googleMapsUrl, "_blank");
                  }}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-lg"
                >
                  <EnvironmentOutlined />
                  <span>Chỉ đường gần nhất</span>
                </button>
              )}
            </div>

            <div className="text-sm text-white/70">
              {filteredStations.length} trạm sạc
            </div>
          </div>

          {/* Thông báo lỗi */}
          {locationError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg shadow-lg">
              <p className="text-sm">{locationError}</p>
            </div>
          )}

          {/* Thông báo loading stations */}
          {isLoadingStations && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 text-blue-200 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                <p className="text-sm">Đang tải danh sách trạm sạc...</p>
              </div>
            </div>
          )}

          {/* Thông báo lỗi stations */}
          {stationsError && (
            <div className="mb-4 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-sm">{stationsError}</p>
                <button
                  onClick={fetchStationsFromAPI}
                  className="text-white hover:text-white/80 text-sm underline"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Thông báo thành công - Popup góc phải trên */}
          {showSuccessPopup && nearestStation && (
            <div
              className="fixed top-20 right-4 z-[10000] text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm animate-slide-in"
              style={{
                background: "rgba(0, 8, 59, 0.88)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold">
                  <CheckCircleOutlined style={{ marginRight: "8px" }} />
                  Đã định vị thành công!
                </p>
              </div>

              <div
                className="rounded-lg p-3 mt-2"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <p className="text-xs font-semibold text-white mb-1">
                  <PoweroffOutlined style={{ marginRight: "4px" }} />
                  Trạm gần nhất:
                </p>
                <p className="text-sm font-bold text-white">
                  {nearestStation.name}
                </p>
                <p className="text-xs text-white mt-1">
                  <EnvironmentOutlined style={{ marginRight: "4px" }} />
                  {nearestStation.address}
                </p>
                <p className="text-xs text-cyan-200 mt-1 font-semibold">
                  🚗 Cách bạn: {nearestStation.distance.toFixed(1)} km
                </p>
                <div className="mt-2">
                  <button
                    className="px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40"
                    onClick={() => {
                      // Sử dụng địa chỉ văn bản thay vì tọa độ
                      const stationAddress = nearestStation.address
                        .replace(/ /g, "+")
                        .replace(/,/g, "%2C");
                      const userLat = userLocation[0];
                      const userLng = userLocation[1];
                      const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${stationAddress}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                  >
                    <EnvironmentOutlined />
                    <span>Chỉ đường đến trạm gần nhất</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Popup trạm được chọn - góc phải trên */}
          {showStationPopup && selectedStation && (
            <div
              className="fixed top-20 right-4 z-[10000] text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm animate-slide-in"
              style={{
                background: "rgba(0, 8, 59, 0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold">
                  <AimOutlined style={{ marginRight: "8px" }} />
                  Trạm đã chọn!
                </p>
              </div>

              <div
                className="rounded-lg p-3 mt-2"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <p className="text-xs font-semibold text-white mb-1">
                  <PoweroffOutlined style={{ marginRight: "4px" }} />
                  {selectedStation.name}
                </p>
                <p className="text-sm font-bold text-white">
                  {selectedStation.city}
                </p>
                <p className="text-xs text-white mt-1">
                  <EnvironmentOutlined style={{ marginRight: "4px" }} />
                  {selectedStation.address}
                </p>
                {selectedStation.distance && (
                  <p className="text-xs text-cyan-200 mt-1 font-semibold">
                    🚗 Cách bạn: {selectedStation.distance.toFixed(1)} km
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 rounded text-xs font-semibold transition-all bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40"
                    onClick={() => setShowStationPopup(false)}
                  >
                    Đóng
                  </button>
                  <button
                    className="px-3 py-1 rounded text-xs font-semibold transition-all bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40"
                    onClick={() => {
                      // Sử dụng địa chỉ văn bản thay vì tọa độ
                      const stationAddress = selectedStation.address
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
                  >
                    <EnvironmentOutlined />
                    Chỉ đường
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bản đồ */}
          <div className="w-full h-[700px] overflow-hidden relative z-0 bg-[#0b1448]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
              scrollWheelZoom={true}
              doubleClickZoom={true}
              dragging={true}
              key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // Force re-render when center/zoom changes
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={18}
                minZoom={3}
                updateWhenZooming={false}
                keepBuffer={2}
                maxNativeZoom={18}
              />

              {/* Markers cho các trạm đổi pin */}
              {filteredStations.map((station) => {
                // Kiểm tra xem đây có phải trạm gần nhất không
                const isNearest =
                  nearestStation && nearestStation.id === station.id;

                // Kiểm tra xem đây có phải trạm được chọn không
                const isSelected =
                  selectedStation && selectedStation.id === station.id;

                return (
                  <Marker
                    key={station.id}
                    position={station.position}
                    icon={
                      isSelected
                        ? createSelectedStationIcon(
                            station.city === "Hà Nội" ? "#00ff00" : "#ff6b35"
                          )
                        : isNearest
                        ? createNearestStationIcon(
                            station.city === "Hà Nội" ? "#00ff00" : "#ff6b35"
                          )
                        : createBatteryIcon(
                            station.city === "Hà Nội" ? "#00ff00" : "#ff6b35"
                          )
                    }
                    eventHandlers={{
                      popupopen: () => {
                        // Fetch rating data khi popup được mở
                        if (!ratingData[station.id]) {
                          fetchRatingStatistics(station.id);
                        }
                      },
                      click: () => {
                        // Set selected station và hiển thị popup
                        setSelectedStation(station);
                        setShowStationPopup(true);

                        // Fetch rating data nếu chưa có
                        if (!ratingData[station.id]) {
                          fetchRatingStatistics(station.id);
                        }
                      },
                    }}
                  >
                    <Popup>
                      <div style={{ padding: "16px", minWidth: "300px" }}>
                        <div style={{ marginBottom: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#00083B",
                                margin: 0,
                                lineHeight: "1.3",
                              }}
                            >
                              {station.name}
                            </h3>
                            <div style={{ display: "flex", gap: "4px" }}>
                              {isNearest && (
                                <div
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                                    color: "#92400e",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    border: "1px solid #f59e0b",
                                    boxShadow:
                                      "0 2px 4px rgba(245, 158, 11, 0.2)",
                                  }}
                                >
                                  ⭐ GẦN NHẤT
                                </div>
                              )}
                              {isSelected && (
                                <div
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    color: "#1e40af",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    border: "1px solid #3b82f6",
                                    boxShadow:
                                      "0 2px 4px rgba(59, 130, 246, 0.2)",
                                  }}
                                >
                                  🎯 ĐÃ CHỌN
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
                                style={{ fontSize: "10px", color: "white" }}
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
                                style={{ fontSize: "10px", color: "white" }}
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
                                {station.city}
                              </div>
                            </div>
                          </div>
                        </div>

                        {isNearest && (
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)",
                              border: "1px solid rgba(220, 38, 38, 0.1)",
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
                                  style={{ fontSize: "12px", color: "white" }}
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
                                  {nearestStation.distance.toFixed(1)} km
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rating Statistics Section - Enhanced Design */}
                        {ratingData[station.id] && (
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 152, 0, 0.05) 100%)",
                              border: "1px solid rgba(255, 193, 7, 0.3)",
                              borderRadius: "16px",
                              padding: "16px",
                              marginBottom: "16px",
                              boxShadow: "0 4px 12px rgba(255, 193, 7, 0.15)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            {/* Decorative background pattern */}
                            <div
                              style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-10px",
                                width: "40px",
                                height: "40px",
                                background:
                                  "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)",
                                borderRadius: "50%",
                                opacity: 0.6,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                bottom: "-15px",
                                left: "-15px",
                                width: "30px",
                                height: "30px",
                                background:
                                  "linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 152, 0, 0.03) 100%)",
                                borderRadius: "50%",
                                opacity: 0.4,
                              }}
                            />

                            {/* Header */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "12px",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "12px",
                                  boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)",
                                }}
                              >
                                <span
                                  style={{ fontSize: "14px", color: "white" }}
                                >
                                  ⭐
                                </span>
                              </div>
                              <div>
                                <div
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#1a1a1a",
                                    marginBottom: "2px",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  Đánh giá trạm
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    fontWeight: "500",
                                  }}
                                >
                                  {ratingData[station.id].totalRatings} lượt
                                  đánh giá
                                </div>
                              </div>
                            </div>

                            {/* Average Rating - Enhanced */}
                            <div
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)",
                                borderRadius: "12px",
                                padding: "12px",
                                marginBottom: "12px",
                                border: "1px solid rgba(255, 193, 7, 0.2)",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#374151",
                                  }}
                                >
                                  Điểm trung bình
                                </span>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "700",
                                      color: "#ff8f00",
                                    }}
                                  >
                                    {ratingData[
                                      station.id
                                    ].averageRating.toFixed(1)}
                                  </span>
                                  <div style={{ display: "flex", gap: "1px" }}>
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          fontSize: "14px",
                                          color:
                                            i <
                                            Math.floor(
                                              ratingData[station.id]
                                                .averageRating
                                            )
                                              ? "#ffc107"
                                              : "#e5e7eb",
                                          filter:
                                            i <
                                            Math.floor(
                                              ratingData[station.id]
                                                .averageRating
                                            )
                                              ? "drop-shadow(0 1px 2px rgba(255, 193, 7, 0.4))"
                                              : "none",
                                          transition: "all 0.2s ease",
                                        }}
                                      >
                                        ⭐
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Rating Breakdown - Enhanced */}
                            <div
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)",
                                borderRadius: "10px",
                                padding: "10px",
                                border: "1px solid rgba(255, 193, 7, 0.15)",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  color: "#6b7280",
                                  marginBottom: "8px",
                                  textAlign: "center",
                                }}
                              >
                                Phân bố đánh giá
                              </div>

                              {/* Rating bars */}
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                {[
                                  {
                                    stars: 5,
                                    count: ratingData[station.id].fiveStar,
                                    color: "#10b981",
                                  },
                                  {
                                    stars: 4,
                                    count: ratingData[station.id].fourStar,
                                    color: "#3b82f6",
                                  },
                                  {
                                    stars: 3,
                                    count: ratingData[station.id].threeStar,
                                    color: "#f59e0b",
                                  },
                                  {
                                    stars: 2,
                                    count: ratingData[station.id].twoStar,
                                    color: "#ef4444",
                                  },
                                  {
                                    stars: 1,
                                    count: ratingData[station.id].oneStar,
                                    color: "#8b5cf6",
                                  },
                                ].map((rating) => {
                                  const percentage =
                                    ratingData[station.id].totalRatings > 0
                                      ? (rating.count /
                                          ratingData[station.id].totalRatings) *
                                        100
                                      : 0;

                                  return (
                                    <div
                                      key={rating.stars}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          fontWeight: "600",
                                          color: "#374151",
                                          minWidth: "20px",
                                        }}
                                      >
                                        {rating.stars}⭐
                                      </span>
                                      <div
                                        style={{
                                          flex: 1,
                                          height: "6px",
                                          background: "#e5e7eb",
                                          borderRadius: "3px",
                                          overflow: "hidden",
                                          position: "relative",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: `${percentage}%`,
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${rating.color} 0%, ${rating.color}dd 100%)`,
                                            borderRadius: "3px",
                                            transition: "width 0.3s ease",
                                          }}
                                        />
                                      </div>
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          fontWeight: "600",
                                          color: "#6b7280",
                                          minWidth: "20px",
                                          textAlign: "right",
                                        }}
                                      >
                                        {rating.count}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Loading Rating */}
                        {isLoadingRating && !ratingData[station.id] && (
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)",
                              border: "1px solid rgba(59, 130, 246, 0.1)",
                              borderRadius: "12px",
                              padding: "12px",
                              marginBottom: "16px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              <span
                                style={{ fontSize: "12px", color: "#3b82f6" }}
                              >
                                Đang tải thông tin đánh giá...
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Rating Error */}
                        {ratingError && !ratingData[station.id] && (
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)",
                              border: "1px solid rgba(239, 68, 68, 0.1)",
                              borderRadius: "12px",
                              padding: "12px",
                              marginBottom: "16px",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{ fontSize: "12px", color: "#ef4444" }}
                            >
                              {ratingError}
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
                            border: "1px solid rgba(0, 8, 59, 0.1)",
                            borderRadius: "12px",
                            padding: "12px",
                            marginBottom: "16px",
                            textAlign: "center",
                          }}
                        >
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
                                style={{ fontSize: "10px", color: "white" }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#00083B",
                                fontWeight: "600",
                              }}
                            >
                              Trạm đổi pin VoltSwap
                            </span>
                          </div>
                        </div>

                        {/* Nút chỉ đường, đánh giá và đặt lịch */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
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
                            style={{
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "white",
                              padding: "12px 20px",
                              borderRadius: "12px",
                              fontSize: "13px",
                              fontWeight: "600",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              boxShadow: "0 4px 8px rgba(16, 185, 129, 0.2)",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 6px 12px rgba(16, 185, 129, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 4px 8px rgba(16, 185, 129, 0.2)";
                            }}
                          >
                            <EnvironmentOutlined style={{ fontSize: "12px" }} />
                            <span>Chỉ đường</span>
                          </button>

                          <button
                            onClick={() => handleOpenRatingModal(station)}
                            style={{
                              background:
                                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                              color: "white",
                              padding: "12px 20px",
                              borderRadius: "12px",
                              fontSize: "13px",
                              fontWeight: "600",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              boxShadow: "0 4px 8px rgba(245, 158, 11, 0.2)",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 6px 12px rgba(245, 158, 11, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 4px 8px rgba(245, 158, 11, 0.2)";
                            }}
                          >
                            <StarOutlined style={{ fontSize: "12px" }} />
                            <span>Đánh giá</span>
                          </button>

                          <button
                            onClick={() => handleOpenBookingModal(station)}
                            style={{
                              background:
                                "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                              color: "white",
                              padding: "12px 16px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              boxShadow: "0 4px 8px rgba(24, 144, 255, 0.2)",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 6px 12px rgba(24, 144, 255, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 4px 8px rgba(24, 144, 255, 0.2)";
                            }}
                          >
                            <ClockCircleOutlined style={{ fontSize: "12px" }} />
                            <span>Đặt lịch</span>
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Marker vị trí người dùng */}
              <UserLocationMarker userLocation={userLocation} />

              {/* Component tối ưu hóa */}
              <MapOptimizer />
            </MapContainer>
          </div>
        </div>
      </div>

      {/* RatingModal */}
      <RatingModal
        visible={showRatingModal}
        onCancel={() => {
          setShowRatingModal(false);
          setSelectedStationForRating(null);
        }}
        station={selectedStationForRating}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}

export default Map;
