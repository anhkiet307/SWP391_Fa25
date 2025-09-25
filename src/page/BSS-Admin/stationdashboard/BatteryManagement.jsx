import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError, showConfirm } from "../../../utils/toast";

const AdminBatteryManagement = () => {
  const navigate = useNavigate();
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
      lastMaintenance: "15/01/2024",
      nextMaintenance: "15/02/2024",
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
      lastMaintenance: "10/01/2024",
      nextMaintenance: "10/02/2024",
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
      lastMaintenance: "20/01/2024",
      nextMaintenance: "25/01/2024",
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

        {/* Filters and Actions */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 text-2xl font-semibold">
              Bộ lọc và tìm kiếm
            </h2>
            <button
              onClick={() => navigate('/admin-add-battery')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm Pin mới
            </button>
          </div>
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
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold text-base">
                    Mã pin
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Thông tin pin
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Trạng thái
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Sức khỏe
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Chu kỳ
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Bảo dưỡng
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatteries.map((battery, index) => (
                  <tr 
                    key={battery.id} 
                    className={`hover:bg-indigo-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-bold text-base text-indigo-600">
                        {battery.batteryId}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">
                          {battery.stationName}
                        </div>
                        <div className="text-gray-500 text-sm mt-1">
                          {battery.stationId}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">
                          {battery.manufacturer} {battery.model}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {battery.capacity}mAh, {battery.voltage}V
                        </div>
                        <div className="text-gray-500 text-sm">
                          SN: {battery.serialNumber}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <span
                        className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(battery.status)}`}
                      >
                        {getStatusText(battery.status)}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-3 mr-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              battery.health >= 80
                                ? "bg-green-500"
                                : battery.health >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${battery.health}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${getHealthColor(battery.health)}`}>
                          {battery.health}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-base text-gray-800">
                        {battery.cycleCount.toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Cuối:</span> {battery.lastMaintenance}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Tiếp:</span> {battery.nextMaintenance}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center items-center gap-2">
                        {/* Chi tiết */}
                        <button
                          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => setSelectedBattery(battery)}
                          title="Chi tiết"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chi tiết
                          </div>
                        </button>

                        {/* Sửa */}
                        <button
                          className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => {
                            setSelectedBattery(battery);
                            setShowEditForm(true);
                          }}
                          title="Sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chỉnh sửa
                          </div>
                        </button>

                        {/* Đổi trạng thái */}
                        <div className="group relative">
                          <select
                            value={battery.status}
                            onChange={(e) => handleStatusChange(battery.id, e.target.value)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm font-medium border-0 appearance-none pr-8"
                            title="Đổi trạng thái"
                          >
                            <option value="active">🟢</option>
                            <option value="charging">🔵</option>
                            <option value="maintenance">🔴</option>
                          </select>
                          <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Đổi trạng thái
                          </div>
                        </div>

                        {/* Xóa */}
                        <button
                          className="group relative bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => handleDeleteBattery(battery.id)}
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Xóa pin
                          </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedBattery.batteryId}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {selectedBattery.manufacturer} {selectedBattery.model}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          selectedBattery.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : selectedBattery.status === "charging"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {selectedBattery.status === "active" ? "🟢 Hoạt động" : 
                           selectedBattery.status === "charging" ? "🔵 Đang sạc" : "🔴 Bảo dưỡng"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBattery(null)}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Thông tin cơ bản */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                    <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Mã pin</div>
                          <div className="text-base text-gray-700">{selectedBattery.batteryId}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Trạm</div>
                          <div className="text-base text-gray-700">{selectedBattery.stationName}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Nhà SX</div>
                          <div className="text-base text-gray-700">{selectedBattery.manufacturer}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Model</div>
                          <div className="text-base text-gray-700">{selectedBattery.model}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Số serial</div>
                          <div className="text-base text-gray-700">{selectedBattery.serialNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium text-blue-600">Chu kỳ sạc</div>
                          <div className="text-base text-gray-700">{selectedBattery.cycleCount.toLocaleString("vi-VN")}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông số kỹ thuật */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      Thông số kỹ thuật
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-green-600 mb-1">
                          {selectedBattery.capacity} mAh
                        </div>
                        <div className="text-xs text-gray-600">Dung lượng</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-blue-600 mb-1">
                          {selectedBattery.voltage} V
                        </div>
                        <div className="text-xs text-gray-600">Điện áp</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">Sức khỏe</span>
                          <span className="text-sm font-bold text-gray-900">{selectedBattery.health}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              selectedBattery.health >= 80
                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                : selectedBattery.health >= 60
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : "bg-gradient-to-r from-red-400 to-red-500"
                            }`}
                            style={{ width: `${selectedBattery.health}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                        <div className="text-sm font-semibold text-gray-600 mb-1">Loại pin</div>
                        <div className="text-sm font-bold text-gray-900">{selectedBattery.batteryType}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sử dụng */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                    <h4 className="text-base font-bold text-purple-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Sử dụng
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-sm font-semibold text-gray-600 mb-1">Ngày mua</div>
                        <div className="text-sm font-bold text-gray-900">{selectedBattery.purchaseDate}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-sm font-semibold text-gray-600 mb-1">Hết bảo hành</div>
                        <div className="text-sm font-bold text-gray-900">{selectedBattery.warrantyExpiry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bảo dưỡng */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                    <h4 className="text-base font-bold text-orange-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      Bảo dưỡng
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xs font-semibold text-gray-600 mb-1">Lần cuối</div>
                        <div className="text-sm font-bold text-gray-900">{selectedBattery.lastMaintenance}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xs font-semibold text-gray-600 mb-1">Lần tiếp theo</div>
                        <div className="text-sm font-bold text-gray-900">{selectedBattery.nextMaintenance}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBatteryManagement;
