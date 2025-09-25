import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showInfo } from "../../../utils/toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
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
      id: 2,
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
      customerName: "Lê Văn C",
      stationId: "BSS-001",
      batteryIn: "Battery B - 3000mAh",
      batteryOut: "Battery C - 7000mAh",
      amount: 100000,
      timestamp: "15/01/2024 16:00",
      status: "pending",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      stationId: "BSS-002",
      batteryIn: "Battery C - 7000mAh",
      batteryOut: "Battery A - 5000mAh",
      amount: 75000,
      timestamp: "15/01/2024 15:15",
      status: "completed",
    },
    {
      id: 3,
      customerName: "Nguyễn Văn A",
      stationId: "BSS-001",
      batteryIn: "Battery A - 5000mAh",
      batteryOut: "Battery B - 3000mAh",
      amount: 50000,
      timestamp: "15/01/2024 14:30",
      status: "completed",
    },
  ]);

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">
              Dashboard Quản trị Hệ thống
            </h1>
            <p className="text-indigo-100 mt-2">
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
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Thống kê trạm
            </h2>
            <div className="overflow-x-auto flex-1">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden mt-4">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-left font-semibold text-base">
                      Trạm
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Trạng thái
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Pin/Tổng
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Sức khỏe
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stationStats.map((station, index) => (
                    <tr 
                      key={station.id}
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-bold text-base text-indigo-600">{station.stationId}</div>
                          <div className="text-sm text-gray-600 mt-1">{station.name}</div>
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
                            <div className="text-xs text-gray-500 mt-1">Bảo dưỡng</div>
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
                          <div className="w-20 bg-gray-200 rounded-full h-3 mr-3">
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
                        <div className="font-bold text-base text-green-600">
                          {(station.monthlyRevenue / 1000000).toFixed(1)}M VNĐ
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/admin-station-management')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả trạm
              </button>
            </div>
          </div>

          {/* Giao dịch gần đây */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Giao dịch gần đây
            </h2>
            <div className="space-y-3 flex-1 mt-8">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-5 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                    transaction.status === "completed" 
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-white hover:from-green-100" 
                      : "border-yellow-400 bg-gradient-to-r from-yellow-50 to-white hover:from-yellow-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {transaction.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-base text-gray-800">
                          {transaction.customerName}
                        </div>
                        <div className="text-sm text-indigo-600 font-medium">
                          {transaction.stationId}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-2 pl-13">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          Vào: {transaction.batteryIn}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Ra: {transaction.batteryOut}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 pl-13">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {transaction.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-lg text-green-600 mb-2">
                      {transaction.amount.toLocaleString("vi-VN")} VNĐ
                    </div>
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status === "completed" ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Hoàn thành
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Chờ xử lý
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/admin-transaction-management')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả giao dịch
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
