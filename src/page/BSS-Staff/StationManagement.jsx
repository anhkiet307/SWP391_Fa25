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
  const [vehiclesById, setVehiclesById] = useState({});
  const [isSwappingId, setIsSwappingId] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBatteryForm, setShowBatteryForm] = useState(false);
  const [showBatteryStatusForm, setShowBatteryStatusForm] = useState(false);
  const [showSlotStatusForm, setShowSlotStatusForm] = useState(false);

  // State cho modal confirm đổi pin
  const [confirmSwapModal, setConfirmSwapModal] = useState({
    isOpen: false,
    slot: null,
  });

  // State cho toast notification
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success", // success, error, info
  });
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

  // Hàm quản lý modal confirm đổi pin
  const showConfirmSwapModal = (slot) => {
    setConfirmSwapModal({
      isOpen: true,
      slot: slot,
    });
  };

  const hideConfirmSwapModal = () => {
    setConfirmSwapModal({
      isOpen: false,
      slot: null,
    });
  };

  // Hàm quản lý toast notification
  const showToast = (message, type = "success") => {
    setToast({
      isVisible: true,
      message: message,
      type: type,
    });

    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setToast({
        isVisible: false,
        message: "",
        type: "success",
      });
    }, 3000);
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
            vehicleId: item.vehicleID ?? null,
            batteryStatus,
            slotStatus,
            pinStatusRaw: item.pinStatus,
            lastCharged: "",
          };
        });
        setSlots(mapped);

        // Tải danh sách vehicle để map theo vehicleID
        try {
          const vehRes = await apiService.getVehicles();
          const vehList = Array.isArray(vehRes?.data) ? vehRes.data : [];
          const vehById = {};
          vehList.forEach((v) => {
            if (v.vehicleID != null) vehById[v.vehicleID] = v;
          });
          setVehiclesById(vehById);
        } catch (e) {
          console.warn("Load vehicles failed", e);
        }

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

  // Khi mở modal xác nhận, làm mới danh sách vehicle để lấy trạng thái pin mới nhất
  useEffect(() => {
    const refreshVehicles = async () => {
      if (!confirmSwapModal.isOpen) return;
      try {
        const vehRes = await apiService.getVehicles();
        const vehList = Array.isArray(vehRes?.data) ? vehRes.data : [];
        const vehById = {};
        vehList.forEach((v) => {
          if (v.vehicleID != null) vehById[v.vehicleID] = v;
        });
        setVehiclesById(vehById);
      } catch (e) {
        console.warn("Refresh vehicles in modal failed", e);
      }
    };
    refreshVehicles();
  }, [confirmSwapModal.isOpen]);

  const handleSwapPin = async (slot) => {
    try {
      const pinId = Number(slot.batteryId);
      // Ưu tiên dùng vehicleID có ngay trên slot (API mới)
      let vehicleId = slot?.vehicleId;
      // Fallback: nếu không có, dùng logic cũ qua transaction -> vehiclesByUserId
      if (!vehicleId) {
        const tx = transactionsByPinId[pinId];
        if (!tx || tx.status !== 1) return;
        let vehicles = vehiclesByUserId[tx.userID];
        if (!vehicles) {
          const res = await apiService.getVehiclesByUser(tx.userID);
          vehicles = Array.isArray(res?.data) ? res.data : [];
          setVehiclesByUserId({ ...vehiclesByUserId, [tx.userID]: vehicles });
        }
        vehicleId = vehicles?.[0]?.vehicleID;
      }
      if (!vehicleId) {
        showToast(
          "Không tìm thấy phương tiện của khách hàng để đổi pin.",
          "error"
        );
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

      // Đóng modal và hiển thị toast thành công
      hideConfirmSwapModal();
      showToast("Đổi pin thành công!", "success");
    } catch (e) {
      console.error(e);
      hideConfirmSwapModal();
      showToast("Đổi pin thất bại. Vui lòng thử lại.", "error");
    } finally {
      setIsSwappingId(null);
    }
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold m-0 flex items-center">
                <svg
                  className="w-8 h-8 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Quản lý Trạm Đổi Pin
              </h1>
              <p className="text-green-100 mt-2">
                {currentStation?.name || "Chưa gán trạm"}
                {currentStation?.address ? ` - ${currentStation.address}` : ""}
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm">Đang tải...</span>
              </div>
            )}
          </div>
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
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-blue-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4z" />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Tổng slot
              </h3>
              <div className="text-3xl font-bold m-0 text-blue-600">
                {totalStats.totalSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-green-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Pin đầy
              </h3>
              <div className="text-3xl font-bold m-0 text-green-600">
                {totalStats.fullPins}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-yellow-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-yellow-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Pin chưa đầy
              </h3>
              <div className="text-3xl font-bold m-0 text-yellow-600">
                {totalStats.notFullPins}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-emerald-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-emerald-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Cho phép đặt
              </h3>
              <div className="text-3xl font-bold m-0 text-emerald-600">
                {totalStats.availableSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-gray-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Không cho phép đặt
              </h3>
              <div className="text-3xl font-bold m-0 text-gray-600">
                {totalStats.unavailableSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-l-4 border-indigo-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-indigo-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="m-0 mb-3 text-gray-600 text-sm font-medium">
                Đang thuê
              </h3>
              <div className="text-3xl font-bold m-0 text-indigo-600">
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
                className={`p-4 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
                  slot.slotStatus === "Cho phép đặt"
                    ? "border-emerald-400 bg-emerald-50 hover:bg-emerald-100"
                    : slot.slotStatus === "Không cho phép đặt"
                    ? "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    : "border-purple-400 bg-purple-50 hover:bg-purple-100"
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
                      {/* Biển số xe: chỉ hiện khi slot đang thuê */}
                      {slot.slotStatus === "Đang thuê" &&
                        slot.vehicleId &&
                        vehiclesById[slot.vehicleId] && (
                          <div className="text-sm">
                            <span className="font-medium">Biển số:</span>
                            <span className="ml-1">
                              {vehiclesById[slot.vehicleId].licensePlate}
                            </span>
                          </div>
                        )}
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
                              onClick={() => showConfirmSwapModal(slot)}
                              disabled={isSwappingId === Number(slot.batteryId)}
                              className="text-xs px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center w-full"
                            >
                              {isSwappingId === Number(slot.batteryId) ? (
                                <>
                                  <svg
                                    className="animate-spin h-3 w-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Đang đổi…
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  Đổi pin
                                </>
                              )}
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

      {/* Modal xác nhận đổi pin */}
      {confirmSwapModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-4xl w-full mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận đổi pin
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn thực hiện đổi pin này?
                </p>
              </div>
            </div>

            {/* Thông tin đổi pin: Pin Xe -> Pin Slot */}
            {confirmSwapModal.slot && (
              <div className="bg-gray-50 rounded-2xl p-6 md:p-7 mb-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
                  {/* Khối Pin Xe */}
                  <div className="rounded-xl border border-blue-100 bg-white shadow-sm overflow-hidden md:col-span-2">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-white border-b">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-semibold mr-2">
                          PIN XE
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          Thông tin pin của xe
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Biển số</span>
                          <span className="font-semibold text-gray-900">
                            {confirmSwapModal.slot.vehicleId &&
                            vehiclesById[confirmSwapModal.slot.vehicleId]
                              ? vehiclesById[confirmSwapModal.slot.vehicleId]
                                  .licensePlate
                              : "-"}
                          </span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Pin xe</span>
                          <span className="font-semibold text-gray-900">
                            {confirmSwapModal.slot.vehicleId &&
                            vehiclesById[confirmSwapModal.slot.vehicleId]
                              ? `${
                                  vehiclesById[confirmSwapModal.slot.vehicleId]
                                    .pinPercent
                                }%`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Sức khỏe pin xe</span>
                          <span className="font-semibold text-gray-900">
                            {confirmSwapModal.slot.vehicleId &&
                            vehiclesById[confirmSwapModal.slot.vehicleId]
                              ? `${
                                  vehiclesById[confirmSwapModal.slot.vehicleId]
                                    .pinHealth
                                }%`
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mũi tên chiều đổi */}
                  <div className="hidden md:flex items-center justify-center md:col-span-1">
                    <div className="flex flex-col items-center text-gray-600">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
                        <svg
                          className="w-6 h-6 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0l-4-4m4 4l-4 4M11 17H3m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-xs font-medium text-emerald-700">
                        Sẽ đổi pin từ xe sang slot
                      </div>
                    </div>
                  </div>

                  {/* Khối Pin Slot */}
                  <div className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden md:col-span-2">
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-white border-b">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-semibold mr-2">
                          PIN SLOT
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          Trạng thái pin tại slot
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Pin ID</span>
                          <span className="font-semibold text-gray-900">
                            #{confirmSwapModal.slot.batteryId}
                          </span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Dung lượng</span>
                          <span className="font-semibold text-gray-900">
                            {confirmSwapModal.slot.batteryCapacity}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Sức khỏe</span>
                          <span className="font-semibold text-gray-900">
                            {confirmSwapModal.slot.batteryHealth}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Trạng thái</span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                              confirmSwapModal.slot.batteryStatus === "Đầy"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {confirmSwapModal.slot.batteryStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mũi tên chiều đổi (mobile) */}
                  <div className="md:hidden flex items-center justify-center">
                    <div className="flex items-center text-gray-600">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0l-4-4m4 4l-4 4M11 17H3m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </div>
                      <div className="ml-2 text-xs font-medium text-emerald-700">
                        Sẽ đổi pin từ xe sang slot
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={hideConfirmSwapModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleSwapPin(confirmSwapModal.slot)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Đổi pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === "error" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {toast.type === "info" && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() =>
                setToast({
                  isVisible: false,
                  message: "",
                  type: "success",
                })
              }
              className="flex-shrink-0 ml-4 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </StaffLayout>
  );
};

export default StationManagement;
