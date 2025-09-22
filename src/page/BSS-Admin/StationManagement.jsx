import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./component/AdminLayout";
import { showConfirm, showSuccess, showError } from "../../utils/toast";

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
    navigate('/admin-add-station');
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

  // Hàm xóa trạm
  const handleDeleteStation = (id) => {
    showConfirm(
      "Bạn có chắc chắn muốn xóa trạm này?",
      () => {
        setStations(stations.filter((station) => station.id !== id));
        showSuccess("Đã xóa trạm thành công!");
      }
    );
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
            batteryCharging: Math.max(0, station.batteryCharging - batteryCount),
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
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Điều phối pin
            </button>
          </div>
        </div>

        {/* Danh sách trạm */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Mã trạm
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Tên trạm
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Địa chỉ
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Quản lý
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Pin/Tổng
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Sức khỏe
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Giao dịch
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Doanh thu
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="p-3 text-left border-b border-gray-200 text-sm font-medium">
                      {station.stationId}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {station.name}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {station.address}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
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
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{station.manager}</div>
                        <div className="text-gray-500 text-xs">
                          {station.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="text-green-600 font-bold">
                            {station.batteryFull}
                          </div>
                          <div className="text-xs text-gray-500">Đầy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-bold">
                            {station.batteryCharging}
                          </div>
                          <div className="text-xs text-gray-500">Sạc</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold">
                            {station.batteryMaintenance}
                          </div>
                          <div className="text-xs text-gray-500">Bảo dưỡng</div>
                        </div>
                        <div className="text-center ml-2">
                          <div className="font-bold">
                            {station.batteryCapacity}
                          </div>
                          <div className="text-xs text-gray-500">Tổng</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              station.batteryHealth >= 80
                                ? "bg-green-500"
                                : station.batteryHealth >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${station.batteryHealth}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {station.batteryHealth}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {station.totalTransactions.toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {(station.monthlyRevenue / 1000000).toFixed(1)}M VNĐ
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex gap-1">
                        <button
                          className="bg-blue-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-blue-600"
                          onClick={() => setSelectedStation(station)}
                        >
                          Chi tiết
                        </button>
                        <button
                          className="bg-green-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-green-600"
                          onClick={() => {
                            setSelectedStation(station);
                            setShowEditForm(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className={`border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors ${
                            station.status === "active"
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          onClick={() => toggleStationStatus(station.id)}
                        >
                          {station.status === "active"
                            ? "Bảo dưỡng"
                            : "Kích hoạt"}
                        </button>
                        <button
                          className="bg-red-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-red-600"
                          onClick={() => handleDeleteStation(station.id)}
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
      </div>
    </AdminLayout>
  );
};

export default AdminStationManagement;
