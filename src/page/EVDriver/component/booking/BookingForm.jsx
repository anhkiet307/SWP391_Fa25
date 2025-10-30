import React from "react";
import {
  Card,
  Form,
  Select,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Spin,
  Alert,
} from "antd";
import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  AimOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { calculateDistance } from "../../../../utils/locationUtils";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BookingForm = ({
  form,
  stationsList,
  loadingStationsList,
  selectedCity,
  setSelectedCity,
  nearestStation,
  userLocation,
  isLoadingLocation,
  locationError,
  handleGetUserLocation,
  handleFormChange,
  fetchStationData,
  onStationChange,
  userVehicles,
  selectedVehicle,
  setSelectedVehicle,
  loadingVehicles,
  reservedVehicleIds = [],
}) => {
  return (
    <Card
      className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] relative overflow-hidden"
      style={{ height: 800, maxHeight: 800 }}
    >
      {/* Simple Decorative Elements */}
      <div className="absolute -top-[30px] -right-[30px] w-[60px] h-[60px] bg-[rgba(0,8,59,0.05)] rounded-full z-0" />
      <div className="absolute -bottom-[20px] -left-[20px] w-[40px] h-[40px] bg-[rgba(16,185,129,0.05)] rounded-full z-0" />

      <div
        className="text-center mb-2"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Title
          level={4}
          className="mb-0 text-[#00083B] text-[18px] font-semibold"
        >
          Chọn Thông Tin Đặt Lịch
        </Title>
        <Paragraph className="text-slate-500 text-[12px]">
          Điền đầy đủ thông tin để đặt lịch đổi pin
        </Paragraph>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Alert
          message={
            <Space>
              <ThunderboltOutlined style={{ color: "#00083B" }} />
              <span style={{ fontWeight: "600" }}>Đổi pin trong ngày</span>
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
          onValuesChange={handleFormChange}
          layout="vertical"
          size="large"
        >
          <Row gutter={[24, 24]}>
            {/* Location và Nearest Station */}
            <Col xs={24}>
              <Card
                size="small"
                style={{
                  marginBottom: 16,
                  background: nearestStation
                    ? "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)"
                    : "transparent",
                  border: nearestStation
                    ? "1px solid rgba(34, 197, 94, 0.2)"
                    : "1px solid #f0f0f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#00083B",
                      }}
                    >
                      📍 Vị trí và trạm gần nhất
                    </h4>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      {userLocation
                        ? "Đã định vị thành công - Tự động chọn trạm gần nhất"
                        : "Đang tự động định vị vị trí..."}
                    </p>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    loading={isLoadingLocation}
                    onClick={handleGetUserLocation}
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      border: "none",
                      borderRadius: 8,
                    }}
                  >
                    {isLoadingLocation
                      ? "Đang định vị..."
                      : userLocation
                      ? "Cập nhật vị trí"
                      : "Định vị vị trí"}
                  </Button>
                </div>

                {!userLocation && !locationError && (
                  <div
                    style={{
                      background: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#0369a1",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Spin size="small" />
                      Đang tự động định vị vị trí của bạn...
                    </p>
                  </div>
                )}

                {locationError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: "#dc2626",
                      }}
                    >
                      ⚠️ {locationError}
                    </p>
                  </div>
                )}

                {nearestStation && (
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#00083B",
                          }}
                        >
                          ⭐ Trạm gần nhất
                        </span>
                        <span
                          style={{
                            marginLeft: 8,
                            background: "#22c55e",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {nearestStation.distance?.toFixed(1)} km
                        </span>
                      </div>
                      <h5
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#00083B",
                        }}
                      >
                        {nearestStation.stationName}
                      </h5>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#64748b",
                          lineHeight: 1.4,
                        }}
                      >
                        📍 {nearestStation.location}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            {/* Station Selection */}
            <Col xs={24}>
              <Form.Item
                name="station"
                label={
                  <Space size="small">
                    <EnvironmentOutlined
                      style={{ color: "#00083B", fontSize: "14px" }}
                    />
                    <span
                      style={{
                        color: "#00083B",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Chọn trạm đổi pin
                    </span>
                  </Space>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạm!",
                  },
                ]}
              >
                <div>
                  {nearestStation && (
                    <button
                      type="button"
                      onClick={() => {
                        form.setFieldsValue({
                          station: nearestStation.stationName,
                        });
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
                              {nearestStation.stationName}
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
                    placeholder={
                      loadingStationsList
                        ? "Đang tải danh sách trạm..."
                        : "-- Chọn trạm --"
                    }
                    size="large"
                    style={{ borderRadius: "12px" }}
                    loading={loadingStationsList}
                    disabled={loadingStationsList}
                    dropdownStyle={{
                      borderRadius: 12,
                      padding: 8,
                      background: "linear-gradient(135deg,#ffffff,#f8fbff)",
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

                      // Tìm station từ availableStations để lấy stationID
                      const availableStations = stationsList.map((station) => ({
                        id: station.stationID,
                        name: station.stationName,
                        address: station.location,
                        city: station.location?.includes("Hà Nội")
                          ? "Hà Nội"
                          : "TP.HCM",
                        position: [station.x || 0, station.y || 0],
                        status: station.status === 1 ? "active" : "inactive",
                      }));
                      const selectedStation = availableStations.find(
                        (s) => s.name === value
                      );
                      if (selectedStation) {
                        // Fetch station detail và pinSlots khi chọn trạm
                        fetchStationData(selectedStation.id);
                        // Reset lựa chọn ổ pin nếu có
                        form.setFieldsValue({ selectedSlot: null });
                        if (typeof onStationChange === "function") {
                          onStationChange();
                        }
                      }
                    }}
                  >
                    {(() => {
                      // Sử dụng stationsList từ API
                      const availableStations = stationsList.map((station) => ({
                        id: station.stationID,
                        name: station.stationName,
                        address: station.location,
                        city: station.location?.includes("Hà Nội")
                          ? "Hà Nội"
                          : "TP.HCM",
                        position: [station.x || 0, station.y || 0],
                        status: station.status === 1 ? "active" : "inactive",
                      }));

                      const items = availableStations
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
                        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

                      const nearestId =
                        nearestStation?.stationID || items[0]?.id;
                      const renderOption = (station, highlight) => (
                        <Option
                          key={station.id}
                          value={station.name}
                          label={station.name}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 0",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: "14px",
                              }}
                            >
                              {station.name}
                            </span>
                            {userLocation && station.distance && (
                              <span
                                style={{
                                  padding: "2px 6px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(34,197,94,0.3)",
                                  background: "rgba(34,197,94,0.08)",
                                  color: "#15803d",
                                  fontSize: 10,
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
                      const nearest = items.find((i) => i.id === nearestId);
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
                        .forEach((i) => elements.push(renderOption(i, false)));
                      return elements;
                    })()}
                  </Select>
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Vehicle Selection */}
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="vehicle"
                label={
                  <Space size="small">
                    <CarOutlined
                      style={{ color: "#00083B", fontSize: "14px" }}
                    />
                    <span
                      style={{
                        color: "#00083B",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      Chọn xe
                    </span>
                  </Space>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn xe!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn xe của bạn"
                  size="large"
                  value={
                    selectedVehicle ? selectedVehicle.vehicleID : undefined
                  }
                  optionLabelProp="label"
                  onChange={(vehicleID) => {
                    const vehicle = userVehicles.find(
                      (v) => v.vehicleID === vehicleID
                    );
                    setSelectedVehicle(vehicle);
                  }}
                  loading={loadingVehicles}
                  style={{ width: "100%" }}
                  className="rounded-lg"
                >
                  {userVehicles.map((vehicle) => {
                    const isReserved = reservedVehicleIds.includes(
                      vehicle.vehicleID
                    );
                    const optionLabel = `${vehicle.licensePlate} — ${vehicle.vehicleType}  SoC: ${vehicle.pinPercent}%  SoH: ${vehicle.pinHealth}%`;
                    return (
                      <Option
                        key={vehicle.vehicleID}
                        value={vehicle.vehicleID}
                        label={optionLabel}
                        disabled={isReserved}
                      >
                        <div style={{ opacity: isReserved ? 0.5 : 1 }}>
                          <div style={{ fontWeight: "600" }}>
                            {vehicle.licensePlate}
                            {isReserved && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 12,
                                  color: "#dc2626",
                                  fontWeight: 600,
                                }}
                              >
                                (Đã có lịch)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {vehicle.vehicleType} — SoC: {vehicle.pinPercent}% •
                            SoH: {vehicle.pinHealth}%
                          </div>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Hidden field for selectedSlot */}
          <Form.Item name="selectedSlot" style={{ display: "none" }}>
            <input type="hidden" />
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default BookingForm;
