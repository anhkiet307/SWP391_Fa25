import React, { useCallback, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
        🔋
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
        🔋
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

// Dữ liệu trạm đổi pin
const batteryStations = [
  // Hà Nội
  {
    id: 1,
    name: "Trạm đổi pin Ba Đình",
    address: "Số 1, Phố Điện Biên Phủ, Quận Ba Đình, Hà Nội",
    position: [21.0285, 105.8542],
    city: "Hà Nội",
    icon: createBatteryIcon("#00ff00"),
  },
  {
    id: 2,
    name: "Trạm đổi pin Hoàn Kiếm",
    address: "Số 15, Phố Lê Thái Tổ, Quận Hoàn Kiếm, Hà Nội",
    position: [21.0333, 105.85],
    city: "Hà Nội",
    icon: createBatteryIcon("#00ff00"),
  },
  {
    id: 3,
    name: "Trạm đổi pin Cầu Giấy",
    address: "Số 123, Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội",
    position: [21.03, 105.8],
    city: "Hà Nội",
    icon: createBatteryIcon("#00ff00"),
  },
  {
    id: 4,
    name: "Trạm đổi pin Hai Bà Trưng",
    address: "Số 45, Phố Bạch Mai, Quận Hai Bà Trưng, Hà Nội",
    position: [21.01, 105.85],
    city: "Hà Nội",
    icon: createBatteryIcon("#00ff00"),
  },
  {
    id: 5,
    name: "Trạm đổi pin Đống Đa",
    address: "Số 78, Phố Tôn Đức Thắng, Quận Đống Đa, Hà Nội",
    position: [21.02, 105.84],
    city: "Hà Nội",
    icon: createBatteryIcon("#00ff00"),
  },
  // TP.HCM
  {
    id: 6,
    name: "Trạm đổi pin Quận 1",
    address: "Số 12, Đường Nguyễn Huệ, Quận 1, TP.HCM",
    position: [10.7769, 106.7009],
    city: "TP.HCM",
    icon: createBatteryIcon("#ff6b35"),
  },
  {
    id: 7,
    name: "Trạm đổi pin Quận 3",
    address: "Số 34, Đường Võ Văn Tần, Quận 3, TP.HCM",
    position: [10.7831, 106.6967],
    city: "TP.HCM",
    icon: createBatteryIcon("#ff6b35"),
  },
  {
    id: 8,
    name: "Trạm đổi pin Quận 7",
    address: "Số 56, Đường Nguyễn Thị Thập, Quận 7, TP.HCM",
    position: [10.7374, 106.7226],
    city: "TP.HCM",
    icon: createBatteryIcon("#ff6b35"),
  },
  {
    id: 9,
    name: "Trạm đổi pin Quận 10",
    address: "Số 89, Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    position: [10.7678, 106.6663],
    city: "TP.HCM",
    icon: createBatteryIcon("#ff6b35"),
  },
  {
    id: 10,
    name: "Trạm đổi pin Quận Bình Thạnh",
    address: "Số 23, Đường Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM",
    position: [10.8106, 106.7091],
    city: "TP.HCM",
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
        <div className="p-2">
          <h3 className="font-bold text-lg text-gray-800 mb-2">
            📍 Vị trí của bạn
          </h3>
          <p className="text-sm text-gray-600">Bạn đang ở đây trên bản đồ</p>
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

  return (
    <div className="w-full relative z-0">
      {/* Nút điều khiển - nằm ngoài bản đồ */}
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
                <span>📍</span>
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
              <span>🗺️</span>
              <span>Chỉ đường gần nhất</span>
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {batteryStations.length} trạm sạc
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
            <p className="text-sm font-semibold">✅ Đã định vị thành công!</p>
          </div>

          <div className="bg-green-600 rounded-lg p-2 mt-2">
            <p className="text-xs font-semibold text-green-100 mb-1">
              🔋 Trạm gần nhất:
            </p>
            <p className="text-sm font-bold text-white">
              {nearestStation.name}
            </p>
            <p className="text-xs text-green-100 mt-1">
              📍 {nearestStation.address}
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
                <span>🗺️</span>
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
            <p className="text-sm font-semibold">🎯 Trạm đã chọn!</p>
          </div>

          <div className="bg-blue-600 rounded-lg p-2 mt-2">
            <p className="text-xs font-semibold text-blue-100 mb-1">
              🔋 {selectedStation.name}
            </p>
            <p className="text-sm font-bold text-white">
              {selectedStation.city}
            </p>
            <p className="text-xs text-blue-100 mt-1">
              📍 {selectedStation.address}
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
                🗺️ Chỉ đường
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bản đồ */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg relative z-0">
        <MapContainer
          center={[16.0, 108.0]} // Trung tâm Việt Nam chính xác hơn
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
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
          {batteryStations.map((station) => {
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
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {station.name}
                      {isNearest && (
                        <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ GẦN NHẤT
                        </span>
                      )}
                      {isSelected && (
                        <span className="ml-2 bg-blue-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold">
                          🎯 ĐÃ CHỌN
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Địa chỉ:</strong> {station.address}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Thành phố:</strong> {station.city}
                    </p>
                    {isNearest && (
                      <p className="text-sm text-red-600 font-semibold">
                        <strong>🚗 Cách bạn:</strong>{" "}
                        {nearestStation.distance.toFixed(1)} km
                      </p>
                    )}
                    <div className="mt-2 text-xs text-blue-600 mb-3">
                      🔋 Trạm đổi pin VoltSwap
                    </div>

                    {/* Nút chọn trạm và chỉ đường */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => selectStation(station)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🎯</span>
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
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🗺️</span>
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
  );
}

export default Map;
