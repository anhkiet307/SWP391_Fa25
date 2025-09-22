import React, { useState } from "react";
import AdminLayout from "./component/AdminLayout";
import { showSuccess, showError, showConfirm } from "../../utils/toast";

const AdminManageBattery = () => {
  const [batteries, setBatteries] = useState([
    {
      id: 1,
      batteryId: "BAT-001",
      stationId: "BSS-001",
      stationName: "Trạm Đổi Pin Quận 1",
      batteryType: "lithium-ion",
      capacity: 5000,
      voltage: 3.7,
      manufacturer: "Samsung",
      model: "INR18650-25R",
      serialNumber: "SN123456789",
      status: "active",
      health: 95,
      cycleCount: 150,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      purchaseDate: "2023-06-01",
      warrantyExpiry: "2025-06-01",
    },
    {
      id: 2,
      batteryId: "BAT-002",
      stationId: "BSS-001",
      stationName: "Trạm Đổi Pin Quận 1",
      batteryType: "lithium-ion",
      capacity: 5000,
      voltage: 3.7,
      manufacturer: "LG",
      model: "INR18650-MJ1",
      serialNumber: "SN987654321",
      status: "charging",
      health: 88,
      cycleCount: 200,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      purchaseDate: "2023-05-15",
      warrantyExpiry: "2025-05-15",
    },
    {
      id: 3,
      batteryId: "BAT-003",
      stationId: "BSS-002",
      stationName: "Trạm Đổi Pin Quận 2",
      batteryType: "lithium-polymer",
      capacity: 6000,
      voltage: 3.8,
      manufacturer: "Panasonic",
      model: "NCR18650B",
      serialNumber: "SN456789123",
      status: "maintenance",
      health: 75,
      cycleCount: 300,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-01-25",
      purchaseDate: "2023-04-01",
      warrantyExpiry: "2025-04-01",
    },
  ]);

  const [selectedBattery, setSelectedBattery] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStation, setFilterStation] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for stations
  const stations = [
    { id: "BSS-001", name: "Trạm Đổi Pin Quận 1" },
    { id: "BSS-002", name: "Trạm Đổi Pin Quận 2" },
    { id: "BSS-003", name: "Trạm Đổi Pin Quận 3" },
  ];

  // Filter batteries
  const filteredBatteries = batteries.filter((battery) => {
    const matchesStatus = filterStatus === "all" || battery.status === filterStatus;
    const matchesStation = filterStation === "all" || battery.stationId === filterStation;
    const matchesSearch = 
      battery.batteryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesStation && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: batteries.length,
    active: batteries.filter(b => b.status === "active").length,
    charging: batteries.filter(b => b.status === "charging").length,
    maintenance: batteries.filter(b => b.status === "maintenance").length,
    averageHealth: Math.round(batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length),
    totalCycles: batteries.reduce((sum, b) => sum + b.cycleCount, 0),
  };

  const handleStatusChange = (id, newStatus) => {
    setBatteries(batteries.map(battery => 
      battery.id === id ? { ...battery, status: newStatus } : battery
    ));
    showSuccess(`Đã cập nhật trạng thái pin thành ${newStatus === "active" ? "hoạt động" : 
      newStatus === "charging" ? "đang sạc" : "bảo dưỡng"}`);
  };

  const handleDeleteBattery = (id) => {
    showConfirm(
      "Bạn có chắc chắn muốn xóa pin này?",
      () => {
        setBatteries(batteries.filter(battery => battery.id !== id));
        showSuccess("Đã xóa pin thành công!");
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "charging": return "bg-blue-100 text-blue-800";
      case "maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Hoạt động";
      case "charging": return "Đang sạc";
      case "maintenance": return "Bảo dưỡng";
      default: return "Không xác định";
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Quản lý Pin</h1>
            <p className="text-indigo-100 mt-2">
              Quản lý và theo dõi tất cả pin trong hệ thống
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Tổng số pin: {stats.total}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê tổng quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng pin
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {stats.total}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Hoạt động
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {stats.active}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang sạc
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {stats.charging}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {stats.maintenance}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Sức khỏe TB
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {stats.averageHealth}%
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng chu kỳ
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {stats.totalCycles}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 text-2xl font-semibold mb-4">
            Bộ lọc và tìm kiếm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mã pin, nhà SX, model..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="charging">Đang sạc</option>
                <option value="maintenance">Bảo dưỡng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạm
              </label>
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả trạm</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterStation("all");
                }}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Battery List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 text-2xl font-semibold mb-4">
            Danh sách pin ({filteredBatteries.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Mã pin
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạm
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thông tin pin
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Sức khỏe
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Chu kỳ
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Bảo dưỡng
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatteries.map((battery) => (
                  <tr key={battery.id} className="hover:bg-gray-50">
                    <td className="p-3 text-left border-b border-gray-200 text-sm font-medium">
                      {battery.batteryId}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{battery.stationName}</div>
                        <div className="text-gray-500 text-xs">
                          {battery.stationId}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{battery.manufacturer} {battery.model}</div>
                        <div className="text-gray-500 text-xs">
                          {battery.capacity}mAh, {battery.voltage}V
                        </div>
                        <div className="text-gray-500 text-xs">
                          SN: {battery.serialNumber}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(battery.status)}`}
                      >
                        {getStatusText(battery.status)}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              battery.health >= 80
                                ? "bg-green-500"
                                : battery.health >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${battery.health}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${getHealthColor(battery.health)}`}>
                          {battery.health}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {battery.cycleCount.toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">
                          Cuối: {battery.lastMaintenance}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tiếp: {battery.nextMaintenance}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex gap-1">
                        <button
                          className="bg-blue-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-blue-600"
                          onClick={() => setSelectedBattery(battery)}
                        >
                          Chi tiết
                        </button>
                        <button
                          className="bg-green-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-green-600"
                          onClick={() => {
                            setSelectedBattery(battery);
                            setShowEditForm(true);
                          }}
                        >
                          Sửa
                        </button>
                        <select
                          value={battery.status}
                          onChange={(e) => handleStatusChange(battery.id, e.target.value)}
                          className="bg-yellow-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-yellow-600"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="charging">Đang sạc</option>
                          <option value="maintenance">Bảo dưỡng</option>
                        </select>
                        <button
                          className="bg-red-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-red-600"
                          onClick={() => handleDeleteBattery(battery.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal chi tiết pin */}
        {selectedBattery && !showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Chi tiết pin {selectedBattery.batteryId}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Thông tin cơ bản</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Mã pin:</span> {selectedBattery.batteryId}
                    </div>
                    <div>
                      <span className="font-medium">Trạm:</span> {selectedBattery.stationName}
                    </div>
                    <div>
                      <span className="font-medium">Nhà SX:</span> {selectedBattery.manufacturer}
                    </div>
                    <div>
                      <span className="font-medium">Model:</span> {selectedBattery.model}
                    </div>
                    <div>
                      <span className="font-medium">Số serial:</span> {selectedBattery.serialNumber}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Thông số kỹ thuật</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Dung lượng:</span> {selectedBattery.capacity} mAh
                    </div>
                    <div>
                      <span className="font-medium">Điện áp:</span> {selectedBattery.voltage} V
                    </div>
                    <div>
                      <span className="font-medium">Loại pin:</span> {selectedBattery.batteryType}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedBattery.status)}`}>
                        {getStatusText(selectedBattery.status)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Sức khỏe:</span> {selectedBattery.health}%
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Sử dụng</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Chu kỳ sạc:</span> {selectedBattery.cycleCount.toLocaleString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Ngày mua:</span> {selectedBattery.purchaseDate}
                    </div>
                    <div>
                      <span className="font-medium">Hết bảo hành:</span> {selectedBattery.warrantyExpiry}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Bảo dưỡng</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Lần cuối:</span> {selectedBattery.lastMaintenance}
                    </div>
                    <div>
                      <span className="font-medium">Lần tiếp theo:</span> {selectedBattery.nextMaintenance}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedBattery(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManageBattery;
