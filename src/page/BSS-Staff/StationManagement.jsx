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
      status: "Đầy",
      lastCharged: "2024-01-20",
    },
    {
      id: 2,
      slotNumber: 2,
      batteryType: "Battery A",
      batteryCapacity: 85,
      batteryHealth: 88,
      batteryId: "BAT-A-002",
      status: "Đang sạc",
      lastCharged: "2024-01-19",
    },
    {
      id: 3,
      slotNumber: 3,
      batteryType: "Battery A",
      batteryCapacity: 92,
      batteryHealth: 90,
      batteryId: "BAT-A-003",
      status: "Đầy",
      lastCharged: "2024-01-18",
    },
    {
      id: 4,
      slotNumber: 4,
      batteryType: "Battery A",
      batteryCapacity: 78,
      batteryHealth: 82,
      batteryId: "BAT-A-004",
      status: "Đang sạc",
      lastCharged: "2024-01-17",
    },
    {
      id: 5,
      slotNumber: 5,
      batteryType: "Battery A",
      batteryCapacity: 95,
      batteryHealth: 92,
      batteryId: "BAT-A-005",
      status: "Đầy",
      lastCharged: "2024-01-16",
    },
    {
      id: 6,
      slotNumber: 6,
      batteryType: "Battery B",
      batteryCapacity: 88,
      batteryHealth: 85,
      batteryId: "BAT-B-001",
      status: "Đang bảo dưỡng",
      lastCharged: "2024-01-15",
    },
    {
      id: 7,
      slotNumber: 7,
      batteryType: "Battery B",
      batteryCapacity: 100,
      batteryHealth: 98,
      batteryId: "BAT-B-002",
      status: "Đầy",
      lastCharged: "2024-01-14",
    },
    {
      id: 8,
      slotNumber: 8,
      batteryType: "Battery B",
      batteryCapacity: 75,
      batteryHealth: 80,
      batteryId: "BAT-B-003",
      status: "Đang sạc",
      lastCharged: "2024-01-13",
    },
    {
      id: 9,
      slotNumber: 9,
      batteryType: "Battery B",
      batteryCapacity: 90,
      batteryHealth: 87,
      batteryId: "BAT-B-004",
      status: "Đầy",
      lastCharged: "2024-01-12",
    },
    {
      id: 10,
      slotNumber: 10,
      batteryType: "Battery B",
      batteryCapacity: 96,
      batteryHealth: 94,
      batteryId: "BAT-B-005",
      status: "Đầy",
      lastCharged: "2024-01-11",
    },
    {
      id: 11,
      slotNumber: 11,
      batteryType: "Battery C",
      batteryCapacity: 82,
      batteryHealth: 79,
      batteryId: "BAT-C-001",
      status: "Đang sạc",
      lastCharged: "2024-01-10",
    },
    {
      id: 12,
      slotNumber: 12,
      batteryType: "Battery C",
      batteryCapacity: 87,
      batteryHealth: 84,
      batteryId: "BAT-C-002",
      status: "Đầy",
      lastCharged: "2024-01-09",
    },
    {
      id: 13,
      slotNumber: 13,
      batteryType: "Battery C",
      batteryCapacity: 93,
      batteryHealth: 91,
      batteryId: "BAT-C-003",
      status: "Đầy",
      lastCharged: "2024-01-08",
    },
    {
      id: 14,
      slotNumber: 14,
      batteryType: "Battery C",
      batteryCapacity: 89,
      batteryHealth: 86,
      batteryId: "BAT-C-004",
      status: "Đang bảo dưỡng",
      lastCharged: "2024-01-07",
    },
    {
      id: 15,
      slotNumber: 15,
      batteryType: "Battery C",
      batteryCapacity: 91,
      batteryHealth: 88,
      batteryId: "BAT-C-005",
      status: "Đầy",
      lastCharged: "2024-01-06",
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBatteryForm, setShowBatteryForm] = useState(false);
  const [newBattery, setNewBattery] = useState({
    batteryCapacity: 0,
    batteryHealth: 0,
    batteryId: "",
    status: "Đầy",
  });

  // Tính tổng thống kê
  const totalStats = {
    totalSlots: slots.length,
    batteryA: slots.filter((s) => s.batteryType === "Battery A").length,
    batteryB: slots.filter((s) => s.batteryType === "Battery B").length,
    batteryC: slots.filter((s) => s.batteryType === "Battery C").length,
    fullSlots: slots.filter((s) => s.status === "Đầy").length,
    chargingSlots: slots.filter((s) => s.status === "Đang sạc").length,
    maintenanceSlots: slots.filter((s) => s.status === "Đang bảo dưỡng").length,
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
                status: newBattery.status,
                lastCharged: new Date().toISOString().split("T")[0],
              }
            : slot
        )
      );
      setNewBattery({
        batteryCapacity: 0,
        batteryHealth: 0,
        batteryId: "",
        status: "Đầy",
      });
      setShowBatteryForm(false);
      setSelectedSlot(null);
    }
  };

  // Hàm cập nhật trạng thái slot
  const handleStatusChange = (slotId, newStatus) => {
    setSlots(
      slots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              status: newStatus,
              lastCharged: new Date().toISOString().split("T")[0],
            }
          : slot
      )
    );
  };

  // Hàm mở form cập nhật pin
  const openBatteryForm = (slot) => {
    setSelectedSlot(slot);
    setNewBattery({
      batteryCapacity: slot.batteryCapacity,
      batteryHealth: slot.batteryHealth,
      batteryId: slot.batteryId,
      status: slot.status,
    });
    setShowBatteryForm(true);
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Quản lý Trạm Đổi Pin</h1>
            <p className="text-indigo-100 mt-2">
              {currentStation.name} - {currentStation.address}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Quản lý: {currentStation.manager}
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Mã trạm: {currentStation.stationId}
            </span>
          </div>
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
                Đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.fullSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang sạc
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {totalStats.chargingSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.maintenanceSlots}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Sức khỏe TB
              </h3>
              <div className="text-4xl font-bold m-0 text-indigo-500">
                {totalStats.averageBatteryHealth.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Doanh thu
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {(totalStats.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Quản lý Slot Pin
          </h2>
          <div className="text-sm text-gray-600">
            Nhấp vào slot để xem chi tiết hoặc sử dụng dropdown để cập nhật
            trạng thái nhanh
          </div>
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
                    <div className="text-sm">
                      <span className="font-medium">Trạng thái:</span>
                      <select
                        value={slot.status}
                        onChange={(e) =>
                          handleStatusChange(slot.id, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`ml-1 px-2 py-1 rounded text-xs font-medium border-0 ${
                          slot.status === "Đầy"
                            ? "bg-green-100 text-green-800"
                            : slot.status === "Đang sạc"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <option value="Đầy">Đầy</option>
                        <option value="Đang sạc">Đang sạc</option>
                        <option value="Đang bảo dưỡng">Đang bảo dưỡng</option>
                      </select>
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
                    value={newBattery.status}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        status: e.target.value,
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
      </div>
    </StaffLayout>
  );
};

export default StationManagement;
