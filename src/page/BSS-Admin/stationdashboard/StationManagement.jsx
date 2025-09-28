import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import { showConfirm, showSuccess, showError } from "../../../utils/toast";

const AdminStationManagement = () => {
  const navigate = useNavigate();

  // State cho quản lý trạm
  const [stations, setStations] = useState([
    {
      id: 1,
      stationId: "BSS-001",
      name: "Trạm Đổi Pin Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      status: "active",
      manager: "Nguyễn Văn Staff",
      phone: "0901234567",
      batteryCapacity: 60,
      batteryFull: 45,
      batteryCharging: 12,
      batteryMaintenance: 3,
      totalTransactions: 1250,
      monthlyRevenue: 62500000,
      lastMaintenance: "10/01/2024",
      nextMaintenance: "10/02/2024",
      batteryHealth: 92,
      location: { lat: 10.7769, lng: 106.7009 },
    },
    {
      id: 2,
      stationId: "BSS-002",
      name: "Trạm Đổi Pin Quận 2",
      address: "456 Nguyễn Thị Minh Khai, Quận 2, TP.HCM",
      status: "active",
      manager: "Trần Thị Manager",
      phone: "0907654321",
      batteryCapacity: 80,
      batteryFull: 60,
      batteryCharging: 15,
      batteryMaintenance: 5,
      totalTransactions: 1890,
      monthlyRevenue: 94500000,
      lastMaintenance: "05/01/2024",
      nextMaintenance: "05/02/2024",
      batteryHealth: 88,
      location: { lat: 10.7879, lng: 106.7003 },
    },
    {
      id: 3,
      stationId: "BSS-003",
      name: "Trạm Đổi Pin Quận 3",
      address: "789 Lê Văn Sỹ, Quận 3, TP.HCM",
      status: "maintenance",
      manager: "Lê Văn Tech",
      phone: "0909876543",
      batteryCapacity: 50,
      batteryFull: 30,
      batteryCharging: 8,
      batteryMaintenance: 12,
      totalTransactions: 980,
      monthlyRevenue: 49000000,
      lastMaintenance: "15/01/2024",
      nextMaintenance: "25/01/2024",
      batteryHealth: 75,
      location: { lat: 10.7829, lng: 106.7001 },
    },
  ]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [stationToChangeStatus, setStationToChangeStatus] = useState(null);

  // Tính tổng thống kê
  const totalStats = {
    totalStations: stations.length,
    activeStations: stations.filter((s) => s.status === "active").length,
    maintenanceStations: stations.filter((s) => s.status === "maintenance")
      .length,
    totalBatteries: stations.reduce((sum, s) => sum + s.batteryCapacity, 0),
    totalTransactions: stations.reduce(
      (sum, s) => sum + s.totalTransactions,
      0
    ),
    totalRevenue: stations.reduce((sum, s) => sum + s.monthlyRevenue, 0),
    averageBatteryHealth: Math.round(
      stations.reduce((sum, s) => sum + s.batteryHealth, 0) / stations.length
    ),
  };

  // Hàm chuyển đến trang thêm trạm mới
  const handleAddStation = () => {
    navigate("/admin-add-station");
  };

  // Hàm cập nhật trạm
  const handleUpdateStation = (id, updates) => {
    setStations(
      stations.map((station) =>
        station.id === id ? { ...station, ...updates } : station
      )
    );
    setShowEditForm(false);
    setSelectedStation(null);
  };

  // Hàm mở modal xác nhận xóa
  const openDeleteModal = (station) => {
    setStationToDelete(station);
    setShowDeleteModal(true);
  };

  // Hàm xóa trạm
  const handleDeleteStation = () => {
    if (stationToDelete) {
      setStations(
        stations.filter((station) => station.id !== stationToDelete.id)
      );
      showSuccess("Đã xóa trạm thành công!");
      setShowDeleteModal(false);
      setStationToDelete(null);
    }
  };

  // Hàm hủy xóa
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStationToDelete(null);
  };

  // Hàm mở modal xác nhận thay đổi trạng thái
  const openStatusModal = (station) => {
    setStationToChangeStatus(station);
    setShowStatusModal(true);
  };

  // Hàm thay đổi trạng thái trạm
  const toggleStationStatus = () => {
    if (stationToChangeStatus) {
      setStations(
        stations.map((station) =>
          station.id === stationToChangeStatus.id
            ? {
                ...station,
                status: station.status === "active" ? "maintenance" : "active",
              }
            : station
        )
      );
      showSuccess(
        stationToChangeStatus.status === "active"
          ? "Đã chuyển trạm sang chế độ bảo dưỡng!"
          : "Đã kích hoạt trạm thành công!"
      );
      setShowStatusModal(false);
      setStationToChangeStatus(null);
    }
  };

  // Hàm hủy thay đổi trạng thái
  const cancelStatusChange = () => {
    setShowStatusModal(false);
    setStationToChangeStatus(null);
  };

  // Hàm điều phối pin
  const redistributeBatteries = (fromStationId, toStationId, batteryCount) => {
    setStations(
      stations.map((station) => {
        if (station.stationId === fromStationId) {
          return {
            ...station,
            batteryFull: Math.max(0, station.batteryFull - batteryCount),
            batteryCharging: station.batteryCharging + batteryCount,
          };
        }
        if (station.stationId === toStationId) {
          return {
            ...station,
            batteryFull: station.batteryFull + batteryCount,
            batteryCharging: Math.max(
              0,
              station.batteryCharging - batteryCount
            ),
          };
        }
        return station;
      })
    );
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="mb-8">
          {/* Main Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 p-5">
              <div className="flex justify-between items-center">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Quản lý Trạm Đổi Pin</h1>
                      <p className="text-white text-opacity-90 text-sm">
                        Quản lý và theo dõi tất cả các trạm đổi pin trong hệ thống
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="flex space-x-3">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-medium">Admin: Quản trị hệ thống</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-xs font-medium">Tổng số trạm: {totalStats.totalStations}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Admin Profile */}
                <div className="ml-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Admin System</p>
                        <p className="text-white text-opacity-80 text-xs">Quản trị viên</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        localStorage.removeItem('stationMenuOpen');
                        localStorage.removeItem('userMenuOpen');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                    >
                      <svg
                        className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng trạm
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {totalStats.totalStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang hoạt động
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.activeStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.maintenanceStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng pin
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {totalStats.totalBatteries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Giao dịch
              </h3>
              <div className="text-4xl font-bold m-0 text-orange-500">
                {totalStats.totalTransactions.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Doanh thu
              </h3>
              <div className="text-4xl font-bold m-0 text-green-600">
                {(totalStats.totalRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Sức khỏe TB
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {totalStats.averageBatteryHealth}%
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Danh sách trạm đổi pin
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleAddStation}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm trạm mới
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg">
              Điều phối pin
            </button>
          </div>
        </div>

        {/* Danh sách trạm */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold text-base">
                    Mã trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Tên trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Địa chỉ
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Trạng thái
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Quản lý
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Pin/Tổng
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Sức khỏe
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Giao dịch
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Doanh thu
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, index) => (
                  <tr
                    key={station.id}
                    className={`hover:bg-indigo-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-bold text-base text-indigo-600">
                        {station.stationId}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-base text-gray-800">
                        {station.name}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {station.address}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            station.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {station.status === "active"
                            ? "Hoạt động"
                            : "Bảo dưỡng"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">
                          {station.manager}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {station.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-green-600 font-bold text-base">
                            {station.batteryFull}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Đầy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-bold text-base">
                            {station.batteryCharging}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Sạc</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold text-base">
                            {station.batteryMaintenance}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Bảo dưỡng
                          </div>
                        </div>
                        <div className="text-center ml-3 pl-3 border-l border-gray-300">
                          <div className="font-bold text-base text-gray-800">
                            {station.batteryCapacity}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Tổng</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-3 mr-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              station.batteryHealth >= 80
                                ? "bg-green-500"
                                : station.batteryHealth >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${station.batteryHealth}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {station.batteryHealth}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-base text-gray-800">
                        {station.totalTransactions.toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-bold text-base text-green-600">
                        {(station.monthlyRevenue / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center items-center gap-2">
                        {/* Chi tiết */}
                        <button
                          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => setSelectedStation(station)}
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
                            setSelectedStation(station);
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

                        {/* Toggle Status */}
                        <button
                          className={`group relative p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-white ${
                            station.status === "active"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() => openStatusModal(station)}
                          title={
                            station.status === "active"
                              ? "Chuyển sang bảo dưỡng"
                              : "Kích hoạt trạm"
                          }
                        >
                          {station.status === "active" ? (
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          ) : (
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
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          )}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {station.status === "active"
                              ? "Bảo dưỡng"
                              : "Kích hoạt"}
                          </div>
                        </button>

                        {/* Xóa */}
                        <button
                          className="group relative bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => openDeleteModal(station)}
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
                            Xóa trạm
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

        {/* Modal chi tiết trạm */}
        {selectedStation && !showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedStation.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {selectedStation.stationId}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            selectedStation.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedStation.status === "active"
                            ? "🟢 Hoạt động"
                            : "🔴 Bảo dưỡng"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Thông tin cơ bản */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                    <h4 className="text-base font-bold text-blue-800 mb-3 flex items-center">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Địa chỉ
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {selectedStation.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Quản lý
                          </div>
                          <div className="text-sm text-gray-700">
                            {selectedStation.manager}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Số điện thoại
                          </div>
                          <div className="text-sm text-gray-700">
                            {selectedStation.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thống kê pin */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                    <h4 className="text-base font-bold text-green-800 mb-3 flex items-center">
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
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      Thống kê pin
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-lg font-bold text-green-600">
                          {selectedStation.batteryFull}
                        </div>
                        <div className="text-sm text-gray-600">Pin đầy</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-lg font-bold text-yellow-600">
                          {selectedStation.batteryCharging}
                        </div>
                        <div className="text-sm text-gray-600">Đang sạc</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-lg font-bold text-red-600">
                          {selectedStation.batteryMaintenance}
                        </div>
                        <div className="text-sm text-gray-600">Bảo dưỡng</div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-lg font-bold text-indigo-600">
                          {selectedStation.batteryCapacity}
                        </div>
                        <div className="text-sm text-gray-600">Tổng pin</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          Sức khỏe pin
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {selectedStation.batteryHealth}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            selectedStation.batteryHealth >= 80
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : selectedStation.batteryHealth >= 60
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                          }`}
                          style={{ width: `${selectedStation.batteryHealth}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Thống kê kinh doanh */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                    <h4 className="text-base font-bold text-purple-800 mb-3 flex items-center">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Thống kê kinh doanh
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-purple-600 mb-1">
                          {selectedStation.totalTransactions.toLocaleString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          Tổng giao dịch
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-green-600 mb-1">
                          {(selectedStation.monthlyRevenue / 1000000).toFixed(
                            1
                          )}
                          M VNĐ
                        </div>
                        <div className="text-xs text-gray-600">
                          Doanh thu tháng
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bảo dưỡng */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                    <h4 className="text-base font-bold text-orange-800 mb-3 flex items-center">
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                      </svg>
                      Bảo dưỡng
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Lần cuối
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {selectedStation.lastMaintenance}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Lần tiếp theo
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {selectedStation.nextMaintenance}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && stationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                  Xác nhận xóa trạm
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Bạn có chắc chắn muốn xóa trạm này không?
                </p>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 bg-gray-50 flex-1 overflow-y-auto">
                {/* Cảnh báo quan trọng - Hiển thị đầu tiên */}
                <div className="mb-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-red-800 mb-2">
                        ⚠️ Cảnh báo quan trọng!
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-red-700 leading-relaxed">
                        <strong>Hành động này không thể hoàn tác.</strong> Tất
                        cả dữ liệu liên quan đến trạm sẽ bị{" "}
                        <strong>xóa vĩnh viễn</strong>, bao gồm:
                      </p>
                      <ul className="mt-2 text-xs sm:text-sm font-medium text-red-700 list-disc list-inside space-y-1">
                        <li>
                          <strong>Lịch sử giao dịch</strong> và dữ liệu khách
                          hàng
                        </li>
                        <li>
                          <strong>Thông tin pin</strong> và trạng thái thiết bị
                        </li>
                        <li>
                          <strong>Báo cáo doanh thu</strong> và thống kê
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Thông tin trạm - Tinh gọn */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {stationToDelete.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {stationToDelete.stationId}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              stationToDelete.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stationToDelete.status === "active"
                              ? "🟢 Hoạt động"
                              : "🔴 Bảo dưỡng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin tóm tắt */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-blue-600 mb-1">
                        Quản lý
                      </p>
                      <p className="text-xs font-semibold text-gray-900">
                        {stationToDelete.manager}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-green-600 mb-1">
                        Sức khỏe pin
                      </p>
                      <p className="text-xs font-bold text-yellow-600">
                        {stationToDelete.batteryHealth}%
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        Giao dịch
                      </p>
                      <p className="text-xs font-bold text-purple-600">
                        {stationToDelete.totalTransactions.toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-orange-600 mb-1">
                        Doanh thu
                      </p>
                      <p className="text-xs font-bold text-orange-600">
                        {(stationToDelete.monthlyRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex-shrink-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleDeleteStation}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Xóa trạm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận thay đổi trạng thái */}
        {showStatusModal && stationToChangeStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {stationToChangeStatus.status === "active"
                    ? "Chuyển sang bảo dưỡng"
                    : "Kích hoạt trạm"}
                </h3>
                <p className="text-gray-600 text-center">
                  Bạn có chắc chắn muốn{" "}
                  {stationToChangeStatus.status === "active"
                    ? "chuyển trạm sang chế độ bảo dưỡng"
                    : "kích hoạt trạm"}{" "}
                  không?
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {stationToChangeStatus.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {stationToChangeStatus.stationId}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            stationToChangeStatus.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stationToChangeStatus.status === "active"
                            ? "🟢 Hoạt động"
                            : "🔴 Bảo dưỡng"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông báo */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        {stationToChangeStatus.status === "active"
                          ? "Trạm sẽ được chuyển sang chế độ bảo dưỡng và tạm ngừng hoạt động."
                          : "Trạm sẽ được kích hoạt và bắt đầu hoạt động bình thường."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={cancelStatusChange}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={toggleStationStatus}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl ${
                      stationToChangeStatus.status === "active"
                        ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                        : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    }`}
                  >
                    {stationToChangeStatus.status === "active"
                      ? "Bảo dưỡng"
                      : "Kích hoạt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStationManagement;
