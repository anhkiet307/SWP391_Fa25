import React, { useEffect, useState } from "react";
import StaffLayout from "./component/StaffLayout";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

const StationManagement = () => {
  const { user } = useAuth();
  // Thông tin trạm hiện tại (lấy từ API theo user)
  const [currentStation, setCurrentStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // State cho quản lý slot pin (sẽ được tải từ API)
  const [slots, setSlots] = useState([]);
  const [transactionsByPinId, setTransactionsByPinId] = useState({});
  const [vehiclesByUserId, setVehiclesByUserId] = useState({});
  const [isSwappingId, setIsSwappingId] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBatteryForm, setShowBatteryForm] = useState(false);
  const [showBatteryStatusForm, setShowBatteryStatusForm] = useState(false);
  const [showSlotStatusForm, setShowSlotStatusForm] = useState(false);
  const [newBattery, setNewBattery] = useState({
    batteryCapacity: 0,
    batteryHealth: 0,
    batteryId: "",
    batteryStatus: "Đầy",
  });
  const [newBatteryStatus, setNewBatteryStatus] = useState("Đầy");
  const [newSlotStatus, setNewSlotStatus] = useState("Cho phép đặt");

  // Tính tổng thống kê (mapping theo API mới)
  const totalStats = {
    totalSlots: slots.length,
    fullPins: slots.filter((s) => s.batteryStatus === "Đầy").length,
    notFullPins: slots.filter((s) => s.batteryStatus === "Chưa Đầy").length,
    availableSlots: slots.filter((s) => s.slotStatus === "Cho phép đặt").length,
    unavailableSlots: slots.filter((s) => s.slotStatus === "Không cho phép đặt")
      .length,
    rentedSlots: slots.filter((s) => s.slotStatus === "Đang thuê").length,
    averageBatteryHealth:
      slots.reduce((sum, s) => sum + (s.batteryHealth || 0), 0) /
      (slots.length || 1),
  };

  // Hàm cập nhật thông tin pin
  const handleUpdateBattery = () => {
    if (newBattery.batteryCapacity > 0 && newBattery.batteryHealth > 0) {
      setSlots(
        slots.map((slot) =>
          slot.id === selectedSlot.id
            ? {
                ...slot,
                batteryCapacity: newBattery.batteryCapacity,
                batteryHealth: newBattery.batteryHealth,
                batteryStatus: newBattery.batteryStatus,
                lastCharged: new Date().toISOString().split("T")[0],
              }
            : slot
        )
      );
      setNewBattery({
        batteryCapacity: 0,
        batteryHealth: 0,
        batteryId: "",
        batteryStatus: "Đầy",
      });
      setShowBatteryForm(false);
      setSelectedSlot(null);
    }
  };

  // Hàm cập nhật trạng thái pin
  const handleUpdateBatteryStatus = () => {
    if (newBatteryStatus) {
      setSlots(
        slots.map((slot) =>
          slot.id === selectedSlot.id
            ? {
                ...slot,
                batteryStatus: newBatteryStatus,
                lastCharged: new Date().toISOString().split("T")[0],
              }
            : slot
        )
      );
      setShowBatteryStatusForm(false);
      setSelectedSlot(null);
    }
  };

  // Hàm cập nhật trạng thái slot
  const handleUpdateSlotStatus = () => {
    if (newSlotStatus) {
      setSlots(
        slots.map((slot) =>
          slot.id === selectedSlot.id
            ? {
                ...slot,
                slotStatus: newSlotStatus,
              }
            : slot
        )
      );
      setShowSlotStatusForm(false);
      setSelectedSlot(null);
    }
  };

  // Hàm mở form cập nhật pin
  const openBatteryForm = (slot) => {
    setSelectedSlot(slot);
    setNewBattery({
      batteryCapacity: slot.batteryCapacity,
      batteryHealth: slot.batteryHealth,
      batteryId: slot.batteryId,
      batteryStatus: slot.batteryStatus,
    });
    setShowBatteryForm(true);
  };

  // Hàm mở form chỉnh sửa trạng thái pin
  const openBatteryStatusForm = (slot) => {
    setSelectedSlot(slot);
    setNewBatteryStatus(slot.batteryStatus);
    setShowBatteryStatusForm(true);
  };

  // Hàm mở form chỉnh sửa trạng thái slot
  const openSlotStatusForm = (slot) => {
    setSelectedSlot(slot);
    setNewSlotStatus(slot.slotStatus);
    setShowSlotStatusForm(true);
  };

  // Load dữ liệu từ API: lấy station theo user, sau đó lấy pinSlot theo stationID
  useEffect(() => {
    const loadData = async () => {
      if (!user?.userID) return;
      setIsLoading(true);
      setLoadError("");
      try {
        // Lấy trạm theo user
        const stRes = await apiService.getStationsByUser(user.userID);
        const stList = Array.isArray(stRes?.data) ? stRes.data : [];
        const st = stList[0] || null;
        if (!st) {
          setCurrentStation(null);
          setSlots([]);
          setIsLoading(false);
          return;
        }
        setCurrentStation({
          id: st.stationID,
          stationId: String(st.stationID),
          name: st.stationName,
          address: st.location,
        });

        // Lấy danh sách pinSlot theo stationID
        const psRes = await apiService.getPinslotsByStation(st.stationID);
        const psList = Array.isArray(psRes?.data) ? psRes.data : [];

        const mapped = psList.map((item, idx) => {
          const batteryStatus = item.pinStatus === 1 ? "Đầy" : "Chưa Đầy";
          const slotStatus =
            item.status === 1
              ? "Cho phép đặt"
              : item.status === 0
              ? "Không cho phép đặt"
              : "Đang thuê"; // 2
          return {
            id: item.pinID,
            slotNumber: idx + 1,
            batteryType: "Pin",
            batteryCapacity: item.pinPercent,
            batteryHealth: item.pinHealth,
            batteryId: String(item.pinID),
            batteryStatus,
            slotStatus,
            pinStatusRaw: item.pinStatus,
            lastCharged: "",
          };
        });
        setSlots(mapped);

        // Transactions theo station
        const txRes = await apiService.getTransactionsByStation(st.stationID);
        const txList = Array.isArray(txRes?.data) ? txRes.data : [];
        const txMap = {};
        const userIds = new Set();
        txList.forEach((t) => {
          const key = Number(t.pinID);
          const prev = txMap[key];
          const isNewer =
            !prev || new Date(t.createAt) > new Date(prev.createAt);
          if (isNewer) txMap[key] = t;
          if (t.userID != null) userIds.add(t.userID);
        });
        setTransactionsByPinId(txMap);

        // Vehicles theo user
        const vehPairs = await Promise.all(
          [...userIds].map(async (uid) => {
            try {
              const r = await apiService.getVehiclesByUser(uid);
              return [uid, Array.isArray(r?.data) ? r.data : []];
            } catch {
              return [uid, []];
            }
          })
        );
        const vehMap = {};
        vehPairs.forEach(([uid, arr]) => (vehMap[uid] = arr));
        setVehiclesByUserId(vehMap);
      } catch (e) {
        console.error("Load station/pinSlot failed:", e);
        setLoadError("Không thể tải dữ liệu trạm hoặc pinSlot");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.userID]);

  const handleSwapPin = async (slot) => {
    try {
      const pinId = Number(slot.batteryId);
      const tx = transactionsByPinId[pinId];
      if (!tx || tx.status !== 1) return;

      let vehicles = vehiclesByUserId[tx.userID];
      if (!vehicles) {
        const res = await apiService.getVehiclesByUser(tx.userID);
        vehicles = Array.isArray(res?.data) ? res.data : [];
        setVehiclesByUserId({ ...vehiclesByUserId, [tx.userID]: vehicles });
      }
      const vehicleId = vehicles?.[0]?.vehicleID;
      if (!vehicleId) {
        alert("Không tìm thấy phương tiện của khách hàng để đổi pin.");
        return;
      }

      setIsSwappingId(pinId);
      await apiService.vehiclePinSwap(vehicleId, pinId);
      await apiService.unreservePin(pinId);

      // refresh slots
      const stId = currentStation?.id;
      if (stId) {
        const psRes = await apiService.getPinslotsByStation(stId);
        const psList = Array.isArray(psRes?.data) ? psRes.data : [];
        const mapped = psList.map((item, idx) => {
          const batteryStatus = item.pinStatus === 1 ? "Đầy" : "Chưa Đầy";
          const slotStatus =
            item.status === 1
              ? "Cho phép đặt"
              : item.status === 0
              ? "Không cho phép đặt"
              : "Đang thuê";
          return {
            id: item.pinID,
            slotNumber: idx + 1,
            batteryType: "Pin",
            batteryCapacity: item.pinPercent,
            batteryHealth: item.pinHealth,
            batteryId: String(item.pinID),
            batteryStatus,
            slotStatus,
            pinStatusRaw: item.pinStatus,
            lastCharged: "",
          };
        });
        setSlots(mapped);
      }
      // Ẩn nút Đổi pin ngay lập tức: xóa transaction mapping của pinID
      setTransactionsByPinId((prev) => {
        const next = { ...prev };
        delete next[pinId];
        return next;
      });
      alert("Đổi pin thành công.");
    } catch (e) {
      console.error(e);
      alert("Đổi pin thất bại.");
    } finally {
      setIsSwappingId(null);
    }
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-semibold m-0">Quản lý Trạm Đổi Pin</h1>
          <p className="text-purple-100 mt-2">
            {currentStation?.name || "Chưa gán trạm"}
            {currentStation?.address ? ` - ${currentStation.address}` : ""}
          </p>
          {isLoading && <p className="text-xs mt-1">Đang tải dữ liệu…</p>}
          {loadError && (
            <p className="text-xs mt-1 text-red-200">{loadError}</p>
          )}
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan trạm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng slot
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {totalStats.totalSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.fullPins}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin chưa đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {totalStats.notFullPins}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Cho phép đặt
              </h3>
              <div className="text-4xl font-bold m-0 text-emerald-500">
                {totalStats.availableSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Không cho phép đặt
              </h3>
              <div className="text-4xl font-bold m-0 text-gray-500">
                {totalStats.unavailableSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang thuê
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {totalStats.rentedSlots}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Quản lý Slot Pin
          </h2>
        </div>

        {/* Danh sách slot pin */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  slot.batteryHealth >= 90
                    ? "border-green-300 bg-green-50 hover:bg-green-100"
                    : slot.batteryHealth >= 75
                    ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                    : "border-orange-300 bg-orange-50 hover:bg-orange-100"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-2">
                    {/* {slot.slotNumber} */}
                  </div>
                  <div className="text-xs font-medium mb-2 px-2 py-1 rounded-full bg-white bg-opacity-70">
                    Pin #{slot.batteryId}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Dung lượng:</span>{" "}
                      {slot.batteryCapacity}%
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Sức khỏe:</span>
                      <span
                        className={`ml-1 ${
                          slot.batteryHealth >= 90
                            ? "text-green-600"
                            : slot.batteryHealth >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {slot.batteryHealth}%
                      </span>
                    </div>
                    <div className="text-sm space-y-2">
                      {/* Trạng thái (gộp) */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">Trạng thái:</span>
                      </div>
                      <div>
                        {slot.pinStatusRaw === 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            🟡{" "}
                            <span className="ml-1">{slot.batteryStatus}</span>
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              slot.slotStatus === "Cho phép đặt"
                                ? "bg-emerald-100 text-emerald-800"
                                : slot.slotStatus === "Không cho phép đặt"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {slot.slotStatus === "Cho phép đặt" && "✅"}
                            {slot.slotStatus === "Không cho phép đặt" && "❌"}
                            {slot.slotStatus === "Đang thuê" && "🟣"}
                            <span className="ml-1">{slot.slotStatus}</span>
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        {transactionsByPinId[Number(slot.batteryId)]?.status ===
                          1 &&
                          slot.batteryStatus === "Đầy" &&
                          slot.slotStatus === "Đang thuê" && (
                            <button
                              onClick={() => handleSwapPin(slot)}
                              disabled={isSwappingId === Number(slot.batteryId)}
                              className="text-xs px-3 py-1.5 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white transition-colors"
                            >
                              {isSwappingId === Number(slot.batteryId)
                                ? "Đang đổi…"
                                : "Đổi pin"}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Các modal chỉnh sửa tạm ẩn khi dữ liệu đến từ API */}
      </div>
    </StaffLayout>
  );
};

export default StationManagement;
