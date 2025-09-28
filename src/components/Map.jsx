import React, { useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Typography, Space, Button, Tag } from "antd";
import {
  PoweroffOutlined,
  EnvironmentOutlined,
  AimOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  RightOutlined,
} from "@ant-design/icons";

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

// Dữ liệu các quận/huyện
const districts = {
  "Hà Nội": [
    { name: "Ba Đình", center: [21.0333, 105.8333], zoom: 13 },
    { name: "Hoàn Kiếm", center: [21.0333, 105.8333], zoom: 13 },
    { name: "Tây Hồ", center: [21.0667, 105.8167], zoom: 13 },
    { name: "Long Biên", center: [21.0333, 105.8833], zoom: 13 },
    { name: "Cầu Giấy", center: [21.0333, 105.8], zoom: 13 },
    { name: "Đống Đa", center: [21.0167, 105.8333], zoom: 13 },
    { name: "Hai Bà Trưng", center: [21.0167, 105.85], zoom: 13 },
    { name: "Hoàng Mai", center: [20.9833, 105.85], zoom: 13 },
    { name: "Thanh Xuân", center: [21.0, 105.8], zoom: 13 },
    { name: "Hà Đông", center: [20.9667, 105.7667], zoom: 13 },
  ],
  "TP.HCM": [
    { name: "Quận 1", center: [10.7769, 106.7009], zoom: 13 },
    { name: "Quận 2", center: [10.7833, 106.75], zoom: 13 },
    { name: "Quận 3", center: [10.7831, 106.6967], zoom: 13 },
    { name: "Quận 4", center: [10.75, 106.7], zoom: 13 },
    { name: "Quận 5", center: [10.75, 106.6667], zoom: 13 },
    { name: "Quận 6", center: [10.75, 106.6333], zoom: 13 },
    { name: "Quận 7", center: [10.7374, 106.7226], zoom: 13 },
    { name: "Quận 8", center: [10.75, 106.6], zoom: 13 },
    { name: "Quận 9", center: [10.8333, 106.7667], zoom: 13 },
    { name: "Quận 10", center: [10.7678, 106.6663], zoom: 13 },
    { name: "Quận 11", center: [10.7667, 106.6333], zoom: 13 },
    { name: "Quận 12", center: [10.8667, 106.65], zoom: 13 },
    { name: "Bình Thạnh", center: [10.8106, 106.7091], zoom: 13 },
    { name: "Tân Bình", center: [10.8, 106.65], zoom: 13 },
    { name: "Tân Phú", center: [10.7667, 106.6], zoom: 13 },
    { name: "Phú Nhuận", center: [10.8, 106.6833], zoom: 13 },
    { name: "Gò Vấp", center: [10.8333, 106.6833], zoom: 13 },
    { name: "Bình Tân", center: [10.75, 106.5667], zoom: 13 },
    { name: "Thủ Đức", center: [10.8667, 106.7667], zoom: 13 },
  ],
};

// Dữ liệu trạm đổi pin với vị trí chính xác hơn
const batteryStations = [
  // Hà Nội - Ba Đình
  {
    id: 1,
    name: "Trạm đổi pin Ba Đình",
    address: "Số 1, Phố Điện Biên Phủ, Quận Ba Đình, Hà Nội",
    position: [21.0333, 105.8333],
    city: "Hà Nội",
    district: "Ba Đình",
    icon: createBatteryIcon("#00ff00"),
  },
  // Hà Nội - Hoàn Kiếm
  {
    id: 2,
    name: "Trạm đổi pin Hoàn Kiếm",
    address: "Số 15, Phố Lê Thái Tổ, Quận Hoàn Kiếm, Hà Nội",
    position: [21.0333, 105.8333],
    city: "Hà Nội",
    district: "Hoàn Kiếm",
    icon: createBatteryIcon("#00ff00"),
  },
  // Hà Nội - Cầu Giấy
  {
    id: 3,
    name: "Trạm đổi pin Cầu Giấy",
    address: "Số 123, Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
    position: [21.0333, 105.8],
    city: "Hà Nội",
    district: "Cầu Giấy",
    icon: createBatteryIcon("#00ff00"),
  },
  // Hà Nội - Hai Bà Trưng
  {
    id: 4,
    name: "Trạm đổi pin Hai Bà Trưng",
    address: "Số 45, Phố Bạch Mai, Quận Hai Bà Trưng, Hà Nội",
    position: [21.0167, 105.85],
    city: "Hà Nội",
    district: "Hai Bà Trưng",
    icon: createBatteryIcon("#00ff00"),
  },
  // Hà Nội - Đống Đa
  {
    id: 5,
    name: "Trạm đổi pin Đống Đa",
    address: "Số 78, Phố Tôn Đức Thắng, Quận Đống Đa, Hà Nội",
    position: [21.0167, 105.8333],
    city: "Hà Nội",
    district: "Đống Đa",
    icon: createBatteryIcon("#00ff00"),
  },
  // TP.HCM - Quận 1
  {
    id: 6,
    name: "Trạm đổi pin Quận 1",
    address: "Số 12, Đường Nguyễn Huệ, Quận 1, TP.HCM",
    position: [10.7769, 106.7009],
    city: "TP.HCM",
    district: "Quận 1",
    icon: createBatteryIcon("#ff6b35"),
  },
  // TP.HCM - Quận 3
  {
    id: 7,
    name: "Trạm đổi pin Quận 3",
    address: "Số 34, Đường Võ Văn Tần, Quận 3, TP.HCM",
    position: [10.7831, 106.6967],
    city: "TP.HCM",
    district: "Quận 3",
    icon: createBatteryIcon("#ff6b35"),
  },
  // TP.HCM - Quận 7
  {
    id: 8,
    name: "Trạm đổi pin Quận 7",
    address: "Số 56, Đường Nguyễn Thị Thập, Quận 7, TP.HCM",
    position: [10.7374, 106.7226],
    city: "TP.HCM",
    district: "Quận 7",
    icon: createBatteryIcon("#ff6b35"),
  },
  // TP.HCM - Quận 10
  {
    id: 9,
    name: "Trạm đổi pin Quận 10",
    address: "Số 89, Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    position: [10.7678, 106.6663],
    city: "TP.HCM",
    district: "Quận 10",
    icon: createBatteryIcon("#ff6b35"),
  },
  // TP.HCM - Bình Thạnh
  {
    id: 10,
    name: "Trạm đổi pin Bình Thạnh",
    address: "Số 23, Đường Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM",
    position: [10.8106, 106.7091],
    city: "TP.HCM",
    district: "Bình Thạnh",
    icon: createBatteryIcon("#ff6b35"),
  },
];

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
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mapCenter, setMapCenter] = useState([16.0, 108.0]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);

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

        batteryStations.forEach((station) => {
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
  }, []);

  // Hàm chọn trạm sạc
  const selectStation = useCallback(
    (station) => {
      if (userLocation) {
        const distance = calculateDistance(
          userLocation[0],
          userLocation[1],
          station.position[0],
          station.position[1]
        );
        setSelectedStation({ ...station, distance });
        setShowStationPopup(true);

        // Tự động ẩn popup sau 5 giây
        setTimeout(() => {
          setShowStationPopup(false);
        }, 5000);
      } else {
        // Nếu chưa định vị, vẫn cho phép chọn nhưng không có khoảng cách
        setSelectedStation(station);
        setShowStationPopup(true);

        setTimeout(() => {
          setShowStationPopup(false);
        }, 5000);
      }
    },
    [userLocation]
  );

  // Hàm chọn thành phố
  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);
    setSelectedDistrict("");

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

  // Hàm chọn quận/huyện
  const handleDistrictChange = useCallback(
    (district) => {
      setSelectedDistrict(district);

      const districtData = districts[selectedCity].find(
        (d) => d.name === district
      );
      if (districtData) {
        setMapCenter(districtData.center);
        setMapZoom(districtData.zoom);
      }
    },
    [selectedCity]
  );

  // Lọc trạm theo thành phố và quận được chọn
  const filteredStations = batteryStations.filter((station) => {
    if (
      selectedCity &&
      selectedCity !== "Tất cả" &&
      station.city !== selectedCity
    )
      return false;
    if (selectedDistrict && station.district !== selectedDistrict) return false;
    return true;
  });

  return (
    <div className="w-full relative z-0">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bộ lọc bên trái */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <EnvironmentOutlined style={{ marginRight: "8px" }} />
              Bộ lọc trạm sạc
            </h3>

            <div className="space-y-4">
              {/* Chọn thành phố */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tất cả">Tất cả thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP.HCM">TP.HCM</option>
                </select>
              </div>

              {/* Chọn quận/huyện */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận/Huyện
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={selectedCity === "Tất cả"}
                >
                  <option value="">Tất cả quận/huyện</option>
                  {selectedCity !== "Tất cả" &&
                    districts[selectedCity]?.map((district) => (
                      <option key={district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Thống kê */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  📊 Thống kê
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tổng trạm:</span>
                    <span className="font-semibold">
                      {filteredStations.length}
                    </span>
                  </div>
                  {selectedCity !== "Tất cả" && (
                    <div className="flex justify-between">
                      <span>Tại {selectedCity}:</span>
                      <span className="font-semibold">
                        {
                          batteryStations.filter((s) => s.city === selectedCity)
                            .length
                        }
                      </span>
                    </div>
                  )}
                  {selectedDistrict && (
                    <div className="flex justify-between">
                      <span>Tại {selectedDistrict}:</span>
                      <span className="font-semibold">
                        {
                          batteryStations.filter(
                            (s) => s.district === selectedDistrict
                          ).length
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
                  setSelectedDistrict("");
                  setMapCenter([16.0, 108.0]);
                  setMapZoom(6);
                }}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <ReloadOutlined style={{ marginRight: "8px" }} />
                Reset bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Bản đồ bên phải */}
        <div className="lg:w-2/3">
          {/* Nút điều khiển */}
          <div className="mb-4 flex justify-between items-center relative z-10">
            <div className="flex gap-2">
              <button
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
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
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
                >
                  <EnvironmentOutlined />
                  <span>Chỉ đường gần nhất</span>
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {filteredStations.length} trạm sạc
              {selectedDistrict && ` tại ${selectedDistrict}`}
            </div>
          </div>

          {/* Thông báo lỗi */}
          {locationError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
              <p className="text-sm">{locationError}</p>
            </div>
          )}

          {/* Thông báo thành công - Popup góc phải trên */}
          {showSuccessPopup && nearestStation && (
            <div className="fixed top-20 right-4 z-[10000] bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold">
                  <CheckCircleOutlined style={{ marginRight: "8px" }} />
                  Đã định vị thành công!
                </p>
              </div>

              <div className="bg-green-600 rounded-lg p-2 mt-2">
                <p className="text-xs font-semibold text-green-100 mb-1">
                  <PoweroffOutlined style={{ marginRight: "4px" }} />
                  Trạm gần nhất:
                </p>
                <p className="text-sm font-bold text-white">
                  {nearestStation.name}
                </p>
                <p className="text-xs text-green-100 mt-1">
                  <EnvironmentOutlined style={{ marginRight: "4px" }} />
                  {nearestStation.address}
                </p>
                <p className="text-xs text-green-200 mt-1 font-semibold">
                  🚗 Cách bạn: {nearestStation.distance.toFixed(1)} km
                </p>
                <div className="mt-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1"
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
            <div className="fixed top-20 right-4 z-[10000] bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold">
                  <AimOutlined style={{ marginRight: "8px" }} />
                  Trạm đã chọn!
                </p>
              </div>

              <div className="bg-blue-600 rounded-lg p-2 mt-2">
                <p className="text-xs font-semibold text-blue-100 mb-1">
                  <PoweroffOutlined style={{ marginRight: "4px" }} />
                  {selectedStation.name}
                </p>
                <p className="text-sm font-bold text-white">
                  {selectedStation.city}
                </p>
                <p className="text-xs text-blue-100 mt-1">
                  <EnvironmentOutlined style={{ marginRight: "4px" }} />
                  {selectedStation.address}
                </p>
                {selectedStation.distance && (
                  <p className="text-xs text-blue-200 mt-1 font-semibold">
                    🚗 Cách bạn: {selectedStation.distance.toFixed(1)} km
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                    onClick={() => setShowStationPopup(false)}
                  >
                    Đóng
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-3 py-1 rounded text-xs font-semibold transition-colors"
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
          <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg relative z-0">
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
                        : station.icon
                    }
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
                                style={{ fontSize: "10px", color: "white" }}
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
                                {station.district}
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

                        {/* Nút chọn trạm và chỉ đường */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => selectStation(station)}
                            style={{
                              flex: 1,
                              background:
                                "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                              color: "white",
                              padding: "10px 12px",
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
                              boxShadow: "0 4px 8px rgba(0, 8, 59, 0.2)",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow =
                                "0 6px 12px rgba(0, 8, 59, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 4px 8px rgba(0, 8, 59, 0.2)";
                            }}
                          >
                            <AimOutlined style={{ fontSize: "12px" }} />
                            <span>Chọn</span>
                          </button>
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
                              flex: 1,
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color: "white",
                              padding: "10px 12px",
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
    </div>
  );
}

export default Map;
