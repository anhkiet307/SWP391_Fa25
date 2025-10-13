import React, { useState } from "react";
import StaffLayout from "./component/StaffLayout";

const StationManagement = () => {
  // Thông tin trạm hiện tại
  const [currentStation] = useState({
    id: 1,
    stationId: "BSS-001",
    name: "Trạm Đổi Pin Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    status: "active",
    manager: "Nguyễn Văn Staff",
    phone: "0901234567",
    totalSlots: 15,
    totalTransactions: 1250,
    monthlyRevenue: 62500000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
  });

  // State cho quản lý slot pin
  const [slots, setSlots] = useState([
    {
      id: 1,
      slotNumber: 1,
      batteryType: "Battery A",
      batteryCapacity: 100,
      batteryHealth: 95,
      batteryId: "BAT-A-001",
      batteryStatus: "Đầy",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-20",
    },
    {
      id: 2,
      slotNumber: 2,
      batteryType: "Battery A",
      batteryCapacity: 85,
      batteryHealth: 88,
      batteryId: "BAT-A-002",
      batteryStatus: "Đang sạc",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-19",
    },
    {
      id: 3,
      slotNumber: 3,
      batteryType: "Battery A",
      batteryCapacity: 92,
      batteryHealth: 90,
      batteryId: "BAT-A-003",
      batteryStatus: "Đầy",
      slotStatus: "Không cho phép đặt",
      lastCharged: "2024-01-18",
    },
    {
      id: 4,
      slotNumber: 4,
      batteryType: "Battery A",
      batteryCapacity: 78,
      batteryHealth: 82,
      batteryId: "BAT-A-004",
      batteryStatus: "Đang sạc",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-17",
    },
    {
      id: 5,
      slotNumber: 5,
      batteryType: "Battery A",
      batteryCapacity: 95,
      batteryHealth: 92,
      batteryId: "BAT-A-005",
      batteryStatus: "Đầy",
      slotStatus: "Đã đặt",
      lastCharged: "2024-01-16",
    },
    {
      id: 6,
      slotNumber: 6,
      batteryType: "Battery B",
      batteryCapacity: 88,
      batteryHealth: 85,
      batteryId: "BAT-B-001",
      batteryStatus: "Đang bảo dưỡng",
      slotStatus: "Không cho phép đặt",
      lastCharged: "2024-01-15",
    },
    {
      id: 7,
      slotNumber: 7,
      batteryType: "Battery B",
      batteryCapacity: 100,
      batteryHealth: 98,
      batteryId: "BAT-B-002",
      batteryStatus: "Đầy",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-14",
    },
    {
      id: 8,
      slotNumber: 8,
      batteryType: "Battery B",
      batteryCapacity: 75,
      batteryHealth: 80,
      batteryId: "BAT-B-003",
      batteryStatus: "Đang sạc",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-13",
    },
    {
      id: 9,
      slotNumber: 9,
      batteryType: "Battery B",
      batteryCapacity: 90,
      batteryHealth: 87,
      batteryId: "BAT-B-004",
      batteryStatus: "Đầy",
      slotStatus: "Đã đặt",
      lastCharged: "2024-01-12",
    },
    {
      id: 10,
      slotNumber: 10,
      batteryType: "Battery B",
      batteryCapacity: 96,
      batteryHealth: 94,
      batteryId: "BAT-B-005",
      batteryStatus: "Đầy",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-11",
    },
    {
      id: 11,
      slotNumber: 11,
      batteryType: "Battery C",
      batteryCapacity: 82,
      batteryHealth: 79,
      batteryId: "BAT-C-001",
      batteryStatus: "Đang sạc",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-10",
    },
    {
      id: 12,
      slotNumber: 12,
      batteryType: "Battery C",
      batteryCapacity: 87,
      batteryHealth: 84,
      batteryId: "BAT-C-002",
      batteryStatus: "Đầy",
      slotStatus: "Đã đặt",
      lastCharged: "2024-01-09",
    },
    {
      id: 13,
      slotNumber: 13,
      batteryType: "Battery C",
      batteryCapacity: 93,
      batteryHealth: 91,
      batteryId: "BAT-C-003",
      batteryStatus: "Đầy",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-08",
    },
    {
      id: 14,
      slotNumber: 14,
      batteryType: "Battery C",
      batteryCapacity: 89,
      batteryHealth: 86,
      batteryId: "BAT-C-004",
      batteryStatus: "Đang bảo dưỡng",
      slotStatus: "Không cho phép đặt",
      lastCharged: "2024-01-07",
    },
    {
      id: 15,
      slotNumber: 15,
      batteryType: "Battery C",
      batteryCapacity: 91,
      batteryHealth: 88,
      batteryId: "BAT-C-005",
      batteryStatus: "Đầy",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-06",
    },
    {
      id: 16,
      slotNumber: 16,
      batteryType: "Battery A",
      batteryCapacity: 95,
      batteryHealth: 92,
      batteryId: "BAT-A-006",
      batteryStatus: "Đầy",
      slotStatus: "Không cho phép đặt",
      lastCharged: "2024-01-05",
    },
    {
      id: 17,
      slotNumber: 17,
      batteryType: "Battery B",
      batteryCapacity: 88,
      batteryHealth: 85,
      batteryId: "BAT-B-006",
      batteryStatus: "Đang sạc",
      slotStatus: "Cho phép đặt",
      lastCharged: "2024-01-04",
    },
    {
      id: 18,
      slotNumber: 18,
      batteryType: "Battery C",
      batteryCapacity: 92,
      batteryHealth: 89,
      batteryId: "BAT-C-006",
      batteryStatus: "Đầy",
      slotStatus: "Không cho phép đặt",
      lastCharged: "2024-01-03",
    },
  ]);

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

  // Tính tổng thống kê
  const totalStats = {
    totalSlots: slots.length,
    // Thống kê trạng thái pin
    fullBatteries: slots.filter((s) => s.batteryStatus === "Đầy").length,
    chargingBatteries: slots.filter((s) => s.batteryStatus === "Đang sạc")
      .length,
    maintenanceBatteries: slots.filter(
      (s) => s.batteryStatus === "Đang bảo dưỡng"
    ).length,
    // Thống kê trạng thái slot
    allowBookingSlots: slots.filter((s) => s.slotStatus === "Cho phép đặt")
      .length,
    disallowBookingSlots: slots.filter(
      (s) => s.slotStatus === "Không cho phép đặt"
    ).length,
    reservedSlots: slots.filter((s) => s.slotStatus === "Đã đặt").length,
    averageBatteryHealth:
      slots.reduce((sum, s) => sum + s.batteryHealth, 0) / slots.length || 0,
    totalTransactions: currentStation.totalTransactions,
    monthlyRevenue: currentStation.monthlyRevenue,
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

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-semibold m-0">Quản lý Trạm Đổi Pin</h1>
          <p className="text-purple-100 mt-2">
            {currentStation.name} - {currentStation.address}
          </p>
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
                {totalStats.fullBatteries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đang sạc
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {totalStats.chargingBatteries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.maintenanceBatteries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Cho phép đặt
              </h3>
              <div className="text-4xl font-bold m-0 text-emerald-500">
                {totalStats.allowBookingSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Không cho phép đặt
              </h3>
              <div className="text-4xl font-bold m-0 text-gray-500">
                {totalStats.disallowBookingSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đã đặt
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {totalStats.reservedSlots}
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
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  slot.batteryType === "Battery A"
                    ? "border-green-300 bg-green-50 hover:bg-green-100"
                    : slot.batteryType === "Battery B"
                    ? "border-purple-300 bg-purple-50 hover:bg-purple-100"
                    : "border-orange-300 bg-orange-50 hover:bg-orange-100"
                }`}
                onClick={() => openBatteryForm(slot)}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-2">
                    Slot {slot.slotNumber}
                  </div>
                  <div className="text-xs font-medium mb-2 px-2 py-1 rounded-full bg-white bg-opacity-70">
                    {slot.batteryType}
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
                      {/* Trạng thái pin */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Trạng thái pin:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBatteryStatusForm(slot);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                          title="Chỉnh sửa trạng thái pin"
                        >
                          ✏️
                        </button>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            slot.batteryStatus === "Đầy"
                              ? "bg-green-100 text-green-800"
                              : slot.batteryStatus === "Đang sạc"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slot.batteryStatus === "Đầy" && "🟢"}
                          {slot.batteryStatus === "Đang sạc" && "🟡"}
                          {slot.batteryStatus === "Đang bảo dưỡng" && "🔴"}
                          <span className="ml-1">{slot.batteryStatus}</span>
                        </span>
                      </div>

                      {/* Trạng thái slot */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Trạng thái slot:</span>
                        {slot.slotStatus !== "Đã đặt" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openSlotStatusForm(slot);
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                            title="Chỉnh sửa trạng thái slot"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                      <div>
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
                          {slot.slotStatus === "Đã đặt" && "🟣"}
                          <span className="ml-1">{slot.slotStatus}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openBatteryForm(slot);
                      }}
                      className="w-full bg-indigo-500 text-white py-1 px-2 rounded text-xs hover:bg-indigo-600 transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal cập nhật thông tin pin */}
        {showBatteryForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Cập nhật thông tin pin - Slot {selectedSlot.slotNumber}
              </h3>
              <div className="mb-4 p-3 bg-gray-100 rounded-md">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Loại pin:</span>{" "}
                  {selectedSlot.batteryType}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dung lượng pin (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newBattery.batteryCapacity}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        batteryCapacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tình trạng sức khỏe pin (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newBattery.batteryHealth}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        batteryHealth: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái slot:
                  </label>
                  <select
                    value={newBattery.batteryStatus}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        batteryStatus: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Đầy">Đầy</option>
                    <option value="Đang sạc">Đang sạc</option>
                    <option value="Đang bảo dưỡng">Đang bảo dưỡng</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateBattery}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setShowBatteryForm(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa trạng thái pin */}
        {showBatteryStatusForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-xl font-semibold mb-4">
                Chỉnh sửa trạng thái pin - Slot {selectedSlot.slotNumber}
              </h3>
              <div className="mb-4 p-3 bg-gray-100 rounded-md">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Loại pin:</span>{" "}
                  {selectedSlot.batteryType}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Trạng thái pin hiện tại:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedSlot.batteryStatus === "Đầy"
                        ? "bg-green-100 text-green-800"
                        : selectedSlot.batteryStatus === "Đang sạc"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedSlot.batteryStatus}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái pin mới:
                  </label>
                  <select
                    value={newBatteryStatus}
                    onChange={(e) => setNewBatteryStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Đầy">Đầy</option>
                    <option value="Đang sạc">Đang sạc</option>
                    <option value="Đang bảo dưỡng">Đang bảo dưỡng</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateBatteryStatus}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setShowBatteryStatusForm(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa trạng thái slot */}
        {showSlotStatusForm && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-xl font-semibold mb-4">
                Chỉnh sửa trạng thái slot - Slot {selectedSlot.slotNumber}
              </h3>
              <div className="mb-4 p-3 bg-gray-100 rounded-md">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Loại pin:</span>{" "}
                  {selectedSlot.batteryType}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Trạng thái slot hiện tại:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedSlot.slotStatus === "Cho phép đặt"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedSlot.slotStatus === "Không cho phép đặt"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {selectedSlot.slotStatus}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái slot mới:
                  </label>
                  <select
                    value={newSlotStatus}
                    onChange={(e) => setNewSlotStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Cho phép đặt">Cho phép đặt</option>
                    <option value="Không cho phép đặt">
                      Không cho phép đặt
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateSlotStatus}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setShowSlotStatusForm(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default StationManagement;
