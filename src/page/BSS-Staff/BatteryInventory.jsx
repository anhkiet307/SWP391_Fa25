import React, { useState } from "react";
import StaffLayout from "./component/StaffLayout";

const BatteryInventory = () => {
  // State cho quản lý pin
  const [batteries, setBatteries] = useState([
    {
      id: "BAT001",
      type: "LFP-60Ah",
      status: "full",
      condition: "good",
      location: "Slot A1",
      cycle: 245,
      voltage: 48.2,
      capacity: 95,
    },
    {
      id: "BAT002",
      type: "LFP-60Ah",
      status: "charging",
      condition: "good",
      location: "Slot A2",
      cycle: 198,
      voltage: 45.8,
      capacity: 78,
    },
    {
      id: "BAT003",
      type: "LFP-80Ah",
      status: "maintenance",
      condition: "average",
      location: "Slot B1",
      cycle: 412,
      voltage: 47.1,
      capacity: 65,
    },
    {
      id: "BAT004",
      type: "LFP-100Ah",
      status: "full",
      condition: "excellent",
      location: "Slot C1",
      cycle: 89,
      voltage: 48.5,
      capacity: 98,
    },
    {
      id: "BAT005",
      type: "LFP-80Ah",
      status: "charging",
      condition: "good",
      location: "Slot B2",
      cycle: 334,
      voltage: 46.3,
      capacity: 82,
    },
    {
      id: "BAT006",
      type: "LFP-60Ah",
      status: "full",
      condition: "good",
      location: "Slot A3",
      cycle: 156,
      voltage: 48.0,
      capacity: 92,
    },
  ]);

  const [viewMode, setViewMode] = useState("grid"); // "grid" hoặc "table"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [newBattery, setNewBattery] = useState({
    id: "",
    type: "",
    status: "full",
    condition: "good",
    location: "",
    cycle: 0,
    voltage: 0,
    capacity: 0,
  });

  // Tính toán thống kê
  const stats = {
    total: batteries.length,
    ready: batteries.filter((b) => b.status === "full").length,
    charging: batteries.filter((b) => b.status === "charging").length,
    maintenance: batteries.filter((b) => b.status === "maintenance").length,
  };

  // Lọc pin theo tìm kiếm và trạng thái
  const filteredBatteries = batteries.filter((battery) => {
    const matchesSearch =
      battery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      battery.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || battery.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Hàm thêm pin mới
  const handleAddBattery = () => {
    if (newBattery.id && newBattery.type && newBattery.location) {
      setBatteries([...batteries, newBattery]);
      setNewBattery({
        id: "",
        type: "",
        status: "full",
        condition: "good",
        location: "",
        cycle: 0,
        voltage: 0,
        capacity: 0,
      });
      setShowAddModal(false);
    }
  };

  // Hàm chỉnh sửa pin
  const handleEditBattery = (battery) => {
    setSelectedBattery(battery);
    setShowEditModal(true);
  };

  // Hàm cập nhật pin
  const handleUpdateBattery = () => {
    if (selectedBattery) {
      setBatteries(
        batteries.map((b) =>
          b.id === selectedBattery.id ? selectedBattery : b
        )
      );
      setShowEditModal(false);
      setSelectedBattery(null);
    }
  };

  // Hàm xóa pin
  const handleDeleteBattery = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa pin này?")) {
      setBatteries(batteries.filter((b) => b.id !== id));
    }
  };

  // Hàm lấy màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "full":
        return "bg-green-100 text-green-800";
      case "charging":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Hàm lấy màu sắc cho tình trạng
  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Hàm lấy text cho trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case "full":
        return "Đầy pin";
      case "charging":
        return "Đang sạc";
      case "maintenance":
        return "Bảo dưỡng";
      default:
        return "Không xác định";
    }
  };

  // Hàm lấy text cho tình trạng
  const getConditionText = (condition) => {
    switch (condition) {
      case "excellent":
        return "Tuyệt vời";
      case "good":
        return "Tốt";
      case "average":
        return "Trung bình";
      case "poor":
        return "Kém";
      default:
        return "Không xác định";
    }
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý Kho Pin
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý tồn kho pin điện
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors"
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
              <span>+ Thêm Pin Mới</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tổng Pin */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </div>
                <div className="text-gray-600 text-sm">
                  Tất cả pin trong kho
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16v2H4zm0 5h16v6H4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pin Sẵn Sàng */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.ready}</div>
                <div className="text-green-100 text-sm">
                  Pin đầy, có thể đổi
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Đang Sạc */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.charging}</div>
                <div className="text-blue-100 text-sm">Pin đang nạp điện</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cần Bảo Dưỡng */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.maintenance}</div>
                <div className="text-orange-100 text-sm">Pin cần kiểm tra</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Battery List Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16v2H4zm0 5h16v6H4z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Danh Sách Pin
              </h2>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo ID hoặc model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="full">Đầy pin</option>
              <option value="charging">Đang sạc</option>
              <option value="maintenance">Bảo dưỡng</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Dạng lưới
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Dạng bảng
            </button>
          </div>

          {/* Battery Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBatteries.map((battery) => (
                <div
                  key={battery.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {battery.id}
                      </h3>
                      <p className="text-sm text-gray-600">{battery.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBattery(battery)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          className="w-4 h-4"
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
                      </button>
                      <button
                        onClick={() => handleDeleteBattery(battery.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-4 h-4"
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
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trạng thái:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          battery.status
                        )}`}
                      >
                        {getStatusText(battery.status)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tình trạng:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                          battery.condition
                        )}`}
                      >
                        {getConditionText(battery.condition)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vị trí:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {battery.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Chu kỳ:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {battery.cycle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Loại
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Trạng thái
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Tình trạng
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Vị trí
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Chu kỳ
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatteries.map((battery) => (
                    <tr
                      key={battery.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {battery.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {battery.type}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            battery.status
                          )}`}
                        >
                          {getStatusText(battery.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                            battery.condition
                          )}`}
                        >
                          {getConditionText(battery.condition)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {battery.location}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {battery.cycle}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBattery(battery)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                          <button
                            onClick={() => handleDeleteBattery(battery.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Battery Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Thêm Pin Mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Pin:
                  </label>
                  <input
                    type="text"
                    value={newBattery.id}
                    onChange={(e) =>
                      setNewBattery({ ...newBattery, id: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="BAT007"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Pin:
                  </label>
                  <select
                    value={newBattery.type}
                    onChange={(e) =>
                      setNewBattery({ ...newBattery, type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn loại pin</option>
                    <option value="LFP-60Ah">LFP-60Ah</option>
                    <option value="LFP-80Ah">LFP-80Ah</option>
                    <option value="LFP-100Ah">LFP-100Ah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái:
                  </label>
                  <select
                    value={newBattery.status}
                    onChange={(e) =>
                      setNewBattery({ ...newBattery, status: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="full">Đầy pin</option>
                    <option value="charging">Đang sạc</option>
                    <option value="maintenance">Bảo dưỡng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tình trạng:
                  </label>
                  <select
                    value={newBattery.condition}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        condition: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="excellent">Tuyệt vời</option>
                    <option value="good">Tốt</option>
                    <option value="average">Trung bình</option>
                    <option value="poor">Kém</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí:
                  </label>
                  <input
                    type="text"
                    value={newBattery.location}
                    onChange={(e) =>
                      setNewBattery({ ...newBattery, location: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Slot A4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chu kỳ:
                  </label>
                  <input
                    type="number"
                    value={newBattery.cycle}
                    onChange={(e) =>
                      setNewBattery({
                        ...newBattery,
                        cycle: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddBattery}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Battery Modal */}
        {showEditModal && selectedBattery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Chỉnh sửa Pin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Pin:
                  </label>
                  <input
                    type="text"
                    value={selectedBattery.id}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        id: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Pin:
                  </label>
                  <select
                    value={selectedBattery.type}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        type: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="LFP-60Ah">LFP-60Ah</option>
                    <option value="LFP-80Ah">LFP-80Ah</option>
                    <option value="LFP-100Ah">LFP-100Ah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái:
                  </label>
                  <select
                    value={selectedBattery.status}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="full">Đầy pin</option>
                    <option value="charging">Đang sạc</option>
                    <option value="maintenance">Bảo dưỡng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tình trạng:
                  </label>
                  <select
                    value={selectedBattery.condition}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        condition: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="excellent">Tuyệt vời</option>
                    <option value="good">Tốt</option>
                    <option value="average">Trung bình</option>
                    <option value="poor">Kém</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí:
                  </label>
                  <input
                    type="text"
                    value={selectedBattery.location}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        location: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chu kỳ:
                  </label>
                  <input
                    type="number"
                    value={selectedBattery.cycle}
                    onChange={(e) =>
                      setSelectedBattery({
                        ...selectedBattery,
                        cycle: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateBattery}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
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

export default BatteryInventory;
