import React, { useState, useEffect } from "react";
import AdminLayout from "./component/AdminLayout";

const AdminDashboard = () => {
  // State cho thống kê tổng quan hệ thống
  const [systemStats, setSystemStats] = useState({
    totalStations: 15,
    activeStations: 12,
    maintenanceStations: 3,
    totalBatteries: 1200,
    totalUsers: 2500,
    totalTransactions: 15680,
    monthlyRevenue: 784000000,
    batteryHealth: 85,
  });

  const [stationStats, setStationStats] = useState([
    {
      id: 1,
      stationId: "BSS-001",
      name: "Trạm Quận 1",
      status: "active",
      batteryCapacity: 80,
      batteryFull: 60,
      batteryCharging: 15,
      batteryMaintenance: 5,
      totalTransactions: 1250,
      monthlyRevenue: 62500000,
      batteryHealth: 92,
    },
    {
      id: 2,
      stationId: "BSS-002", 
      name: "Trạm Quận 2",
      status: "active",
      batteryCapacity: 100,
      batteryFull: 75,
      batteryCharging: 20,
      batteryMaintenance: 5,
      totalTransactions: 1890,
      monthlyRevenue: 94500000,
      batteryHealth: 88,
    },
    {
      id: 3,
      stationId: "BSS-003",
      name: "Trạm Quận 3", 
      status: "maintenance",
      batteryCapacity: 60,
      batteryFull: 30,
      batteryCharging: 8,
      batteryMaintenance: 22,
      totalTransactions: 980,
      monthlyRevenue: 49000000,
      batteryHealth: 75,
    },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      stationId: "BSS-001",
      batteryIn: "Battery A - 5000mAh",
      batteryOut: "Battery B - 3000mAh",
      amount: 50000,
      timestamp: "2024-01-15 14:30:00",
      status: "completed",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      stationId: "BSS-002",
      batteryIn: "Battery C - 7000mAh",
      batteryOut: "Battery A - 5000mAh",
      amount: 75000,
      timestamp: "2024-01-15 15:15:00",
      status: "completed",
    },
    {
      id: 3,
      customerName: "Lê Văn C",
      stationId: "BSS-001",
      batteryIn: "Battery B - 3000mAh",
      batteryOut: "Battery C - 7000mAh",
      amount: 100000,
      timestamp: "2024-01-15 16:00:00",
      status: "pending",
    },
  ]);

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">
              Dashboard Quản trị Hệ thống
            </h1>
            <p className="text-red-100 mt-2">
              Tổng quan và quản lý toàn bộ hệ thống trạm đổi pin
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Tổng trạm: {systemStats.totalStations}
            </span>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng trạm
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {systemStats.totalStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang hoạt động
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {systemStats.activeStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng pin
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {systemStats.totalBatteries}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng người dùng
              </h3>
              <div className="text-4xl font-bold m-0 text-orange-500">
                {systemStats.totalUsers.toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Giao dịch
              </h3>
              <div className="text-4xl font-bold m-0 text-indigo-500">
                {systemStats.totalTransactions.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Doanh thu tháng
              </h3>
              <div className="text-4xl font-bold m-0 text-green-600">
                {(systemStats.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Sức khỏe pin
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {systemStats.batteryHealth}%
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {systemStats.maintenanceStations}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Thống kê trạm */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Thống kê trạm
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Trạm
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Trạng thái
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Pin/Tổng
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Sức khỏe
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stationStats.map((station) => (
                    <tr key={station.id}>
                      <td className="p-3 text-left border-b border-gray-200">
                        <div>
                          <div className="font-medium">{station.stationId}</div>
                          <div className="text-sm text-gray-500">{station.name}</div>
                        </div>
                      </td>
                      <td className="p-3 text-left border-b border-gray-200">
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
                      <td className="p-3 text-left border-b border-gray-200">
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
                      <td className="p-3 text-left border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
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
                          <span className="text-sm font-medium">
                            {station.batteryHealth}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-left border-b border-gray-200">
                        {(station.monthlyRevenue / 1000000).toFixed(1)}M VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Giao dịch gần đây */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Giao dịch gần đây
            </h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {transaction.customerName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.stationId} • {transaction.batteryIn} → {transaction.batteryOut}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {transaction.amount.toLocaleString("vi-VN")} VNĐ
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status === "completed"
                        ? "Hoàn thành"
                        : "Chờ xử lý"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
