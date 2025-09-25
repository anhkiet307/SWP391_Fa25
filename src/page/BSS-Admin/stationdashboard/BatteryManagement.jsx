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
    const matchesStatus =
      filterStatus === "all" || battery.status === filterStatus;
    const matchesStation =
      filterStation === "all" || battery.stationId === filterStation;
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
    active: batteries.filter((b) => b.status === "active").length,
    charging: batteries.filter((b) => b.status === "charging").length,
    maintenance: batteries.filter((b) => b.status === "maintenance").length,
    averageHealth: Math.round(
      batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length
    ),
    totalCycles: batteries.reduce((sum, b) => sum + b.cycleCount, 0),
  };

  const handleStatusChange = (id, newStatus) => {
    setBatteries(
      batteries.map((battery) =>
        battery.id === id ? { ...battery, status: newStatus } : battery
      )
    );
    showSuccess(
      `Đã cập nhật trạng thái pin thành ${
        newStatus === "active"
          ? "hoạt động"
          : newStatus === "charging"
          ? "đang sạc"
          : "bảo dưỡng"
      }`
    );
  };

  const handleDeleteBattery = (id) => {
    showConfirm("Bạn có chắc chắn muốn xóa pin này?", () => {
      setBatteries(batteries.filter((battery) => battery.id !== id));
      showSuccess("Đã xóa pin thành công!");
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "charging":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "charging":
        return "Đang sạc";
      case "maintenance":
        return "Bảo dưỡng";
      default:
        return "Không xác định";
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
              onClick={() => navigate("/admin-add-battery")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
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
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                        className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          battery.status
                        )}`}
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
                        <span
                          className={`text-sm font-bold ${getHealthColor(
                            battery.health
                          )}`}
                        >
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
                          <span className="font-medium">Cuối:</span>{" "}
                          {battery.lastMaintenance}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Tiếp:</span>{" "}
                          {battery.nextMaintenance}
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chỉnh sửa
                          </div>
                        </button>

                        {/* Đổi trạng thái */}
                        <div className="group relative">
                          <select
                            value={battery.status}
                            onChange={(e) =>
                              handleStatusChange(battery.id, e.target.value)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm font-medium border-0 appearance-none pr-8"
                            title="Đổi trạng thái"
                          >
                            <option value="active">🟢</option>
                            <option value="charging">🔵</option>
                            <option value="maintenance">🔴</option>
                          </select>
                          <svg
                            className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Chi tiết pin {selectedBattery.batteryId}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Mã pin:</span>{" "}
                      {selectedBattery.batteryId}
                    </div>
                    <div>
                      <span className="font-medium">Trạm:</span>{" "}
                      {selectedBattery.stationName}
                    </div>
                    <div>
                      <span className="font-medium">Nhà SX:</span>{" "}
                      {selectedBattery.manufacturer}
                    </div>
                    <div>
                      <span className="font-medium">Model:</span>{" "}
                      {selectedBattery.model}
                    </div>
                    <div>
                      <span className="font-medium">Số serial:</span>{" "}
                      {selectedBattery.serialNumber}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thông số kỹ thuật
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Dung lượng:</span>{" "}
                      {selectedBattery.capacity} mAh
                    </div>
                    <div>
                      <span className="font-medium">Điện áp:</span>{" "}
                      {selectedBattery.voltage} V
                    </div>
                    <div>
                      <span className="font-medium">Loại pin:</span>{" "}
                      {selectedBattery.batteryType}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(
                          selectedBattery.status
                        )}`}
                      >
                        {getStatusText(selectedBattery.status)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Sức khỏe:</span>{" "}
                      {selectedBattery.health}%
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Sử dụng</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Chu kỳ sạc:</span>{" "}
                      {selectedBattery.cycleCount.toLocaleString("vi-VN")}
                    </div>
                    <div>
                      <span className="font-medium">Ngày mua:</span>{" "}
                      {selectedBattery.purchaseDate}
                    </div>
                    <div>
                      <span className="font-medium">Hết bảo hành:</span>{" "}
                      {selectedBattery.warrantyExpiry}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Bảo dưỡng</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Lần cuối:</span>{" "}
                      {selectedBattery.lastMaintenance}
                    </div>
                    <div>
                      <span className="font-medium">Lần tiếp theo:</span>{" "}
                      {selectedBattery.nextMaintenance}
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

export default AdminBatteryManagement;
