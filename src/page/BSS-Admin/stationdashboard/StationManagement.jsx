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
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
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
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
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
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-01-25",
      batteryHealth: 75,
      location: { lat: 10.7829, lng: 106.7001 },
    },
  ]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);

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

  // Hàm thay đổi trạng thái trạm
  const toggleStationStatus = (id) => {
    setStations(
      stations.map((station) =>
        station.id === id
          ? {
              ...station,
              status: station.status === "active" ? "maintenance" : "active",
            }
          : station
      )
    );
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
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Quản lý Trạm Đổi Pin</h1>
            <p className="text-indigo-100 mt-2">
              Quản lý và theo dõi tất cả các trạm đổi pin trong hệ thống
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Tổng số trạm: {totalStats.totalStations}
            </span>
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
                      <span
                        className={`px-3 py-2 rounded-full text-sm font-semibold ${
                          station.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {station.status === "active"
                          ? "Hoạt động"
                          : "Bảo dưỡng"}
                      </span>
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
                          onClick={() => toggleStationStatus(station.id)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Chi tiết trạm {selectedStation.stationId}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thông tin cơ bản
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      {selectedStation.name}
                    </div>
                    <div>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {selectedStation.address}
                    </div>
                    <div>
                      <span className="font-medium">Quản lý:</span>{" "}
                      {selectedStation.manager}
                    </div>
                    <div>
                      <span className="font-medium">SĐT:</span>{" "}
                      {selectedStation.phone}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          selectedStation.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedStation.status === "active"
                          ? "Hoạt động"
                          : "Bảo dưỡng"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Thống kê pin</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Tổng pin:</span>{" "}
                      {selectedStation.batteryCapacity}
                    </div>
                    <div>
                      <span className="font-medium">Pin đầy:</span>{" "}
                      {selectedStation.batteryFull}
                    </div>
                    <div>
                      <span className="font-medium">Đang sạc:</span>{" "}
                      {selectedStation.batteryCharging}
                    </div>
                    <div>
                      <span className="font-medium">Bảo dưỡng:</span>{" "}
                      {selectedStation.batteryMaintenance}
                    </div>
                    <div>
                      <span className="font-medium">Sức khỏe pin:</span>{" "}
                      {selectedStation.batteryHealth}%
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thống kê kinh doanh
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Tổng giao dịch:</span>{" "}
                      {selectedStation.totalTransactions.toLocaleString(
                        "vi-VN"
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Doanh thu tháng:</span>{" "}
                      {(selectedStation.monthlyRevenue / 1000000).toFixed(1)}M
                      VNĐ
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Bảo dưỡng</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Lần cuối:</span>{" "}
                      {selectedStation.lastMaintenance}
                    </div>
                    <div>
                      <span className="font-medium">Lần tiếp theo:</span>{" "}
                      {selectedStation.nextMaintenance}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedStation(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && stationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                  Xác nhận xóa trạm
                </h3>
                <p className="text-gray-600 text-center">
                  Bạn có chắc chắn muốn xóa trạm này không?
                </p>
              </div>

              {/* Content */}
              <div className="p-6 bg-gray-50">
                <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-indigo-600"
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
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Cột trái - Thông tin trạm */}
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-blue-600 mb-2">
                            Thông tin trạm
                          </p>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {stationToDelete.name}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {stationToDelete.stationId}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Địa chỉ
                            </p>
                            <p className="text-xs text-gray-600">
                              📍 {stationToDelete.address}
                            </p>
                          </div>
                        </div>

                        {/* Cột phải - Thông tin staff */}
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-green-600 mb-2">
                            Quản lý trạm
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {stationToDelete.manager}
                          </p>
                          <p className="text-xs text-gray-600 mb-3">
                            📞 {stationToDelete.phone}
                          </p>
                          <div className="border-t border-green-200 pt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Sức khỏe pin
                            </p>
                            <p className="text-sm font-bold text-yellow-600">
                              {stationToDelete.batteryHealth}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 mb-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Tình trạng pin
                          </p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-green-600 font-semibold">
                              🔋 {stationToDelete.batteryFull}
                            </span>
                            <span className="text-yellow-600 font-semibold">
                              ⚡ {stationToDelete.batteryCharging}
                            </span>
                            <span className="text-red-600 font-semibold">
                              🔧 {stationToDelete.batteryMaintenance}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Tổng: {stationToDelete.batteryCapacity} pin
                          </p>
                        </div>
                        <div className="text-center bg-blue-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-blue-600">
                            {stationToDelete.totalTransactions.toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                          <p className="text-xs font-medium text-blue-800">
                            Tổng giao dịch
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="text-center bg-green-50 rounded-lg p-3">
                          <p className="text-lg font-bold text-green-600">
                            {(stationToDelete.monthlyRevenue / 1000000).toFixed(
                              1
                            )}
                            M VNĐ
                          </p>
                          <p className="text-xs font-medium text-green-800">
                            Doanh thu tháng
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0"
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
                      <p className="text-base font-bold text-red-800 mb-2">
                        ⚠️ Cảnh báo quan trọng!
                      </p>
                      <p className="text-sm font-semibold text-red-700 leading-relaxed">
                        <strong>Hành động này không thể hoàn tác.</strong> Tất
                        cả dữ liệu liên quan đến trạm sẽ bị{" "}
                        <strong>xóa vĩnh viễn</strong>, bao gồm:
                      </p>
                      <ul className="mt-2 text-sm font-medium text-red-700 list-disc list-inside space-y-1">
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
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <div className="flex space-x-3">
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
      </div>
    </AdminLayout>
  );
};

export default AdminStationManagement;
