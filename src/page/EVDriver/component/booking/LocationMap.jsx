import React from "react";
import { Card, Typography, Button, Spin, Row, Col } from "antd";
import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { Title } = Typography;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Tạo icon tùy chỉnh
const createBatteryIcon = (color) => {
  return L.divIcon({
    className: "custom-slottery-icon",
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

const LocationMap = ({
  userLocation,
  stationsList,
  nearestStation,
  isLoadingLocation,
  handleGetUserLocation,
}) => {
  return (
    <Card
      className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] relative"
      style={{ height: 800, overflow: "hidden" }}
    >
      {/* Simple Decorative Elements */}
      <div className="absolute -top-[30px] -left-[30px] w-[60px] h-[60px] bg-[rgba(0,8,59,0.05)] rounded-full z-0" />
      <div className="absolute -bottom-[20px] -right-[20px] w-[40px] h-[40px] bg-[rgba(16,185,129,0.05)] rounded-full z-0" />

      <div
        className="text-center mb-2"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
            marginBottom: "8px",
            boxShadow: "0 8px 20px rgba(0, 8, 59, 0.15)",
          }}
        >
          <EnvironmentOutlined style={{ fontSize: "16px", color: "white" }} />
        </div>
        <Title
          level={4}
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
      </div>

      {/* Map */}
      <div
        style={{
          height: "500px",
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
                        <span style={{ fontSize: "12px", color: "white" }}>
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
                        <span style={{ fontSize: "12px", color: "white" }}>
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
            {stationsList.map((station) => {
              // Kiểm tra xem đây có phải trạm gần nhất không
              const isNearest =
                nearestStation &&
                nearestStation.stationID === station.stationID;

              return (
                <Marker
                  key={station.stationID}
                  position={[station.x || 0, station.y || 0]}
                  icon={
                    isNearest
                      ? createNearestStationIcon(
                          station.location?.includes("Hà Nội")
                            ? "#00ff00"
                            : "#ff6b35"
                        )
                      : createBatteryIcon(
                          station.location?.includes("Hà Nội")
                            ? "#00ff00"
                            : "#ff6b35"
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
                            {station.stationName}
                          </h3>
                          <div style={{ display: "flex", gap: "4px" }}>
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
                              {station.location}
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
                              {station.location?.split(",")[1]?.trim() ||
                                "Hà Nội"}
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
                              {station.location?.split(",")[2]?.trim() ||
                                "Ba Đình"}
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
                                {nearestStation.distance.toFixed(1)} km
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
                            <ThunderboltOutlined
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
                            const stationAddress = station.location
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
                          <EnvironmentOutlined style={{ fontSize: "12px" }} />
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
                onClick={handleGetUserLocation}
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
                <SafetyOutlined style={{ fontSize: "16px", color: "white" }} />
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
                <DollarOutlined style={{ fontSize: "16px", color: "white" }} />
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
    </Card>
  );
};

export default LocationMap;
