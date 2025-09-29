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
    stationHealth: 85,
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
      stationHealth: 88,
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
      stationHealth: 92,
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
      stationHealth: 75,
    },
  ]);

  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      customerName: "Lê Văn C",
      stationId: "BSS-001",
      reportType: "Lỗi kỹ thuật",
      description: "Pin không sạc được, màn hình hiển thị lỗi",
      timestamp: "15/01/2024 16:00",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      stationId: "BSS-002",
      reportType: "Góp ý dịch vụ",
      description: "Thời gian chờ quá lâu, cần cải thiện",
      timestamp: "15/01/2024 15:15",
      status: "in_progress",
      priority: "normal",
    },
    {
      id: 3,
      customerName: "Nguyễn Văn A",
      stationId: "BSS-001",
      reportType: "Lỗi kỹ thuật",
      description: "Máy đổi pin bị kẹt, không thể lấy pin ra",
      timestamp: "15/01/2024 14:30",
      status: "resolved",
      priority: "urgent",
    },
  ]);

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
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        />
                      </svg>
                    </div>
          <div>
                      <h1 className="text-2xl font-bold mb-1">Dashboard Quản trị Hệ thống</h1>
                      <p className="text-white text-opacity-90 text-sm">
              Tổng quan và quản lý toàn bộ hệ thống trạm đổi pin
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
                        <span className="text-xs font-medium">Tổng trạm: {systemStats.totalStations}</span>
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
                Sức khỏe trạm
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {systemStats.stationHealth}%
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
            <div className="space-y-3 flex-1 mt-8">
                  {stationStats.map((station, index) => (
                <div
                      key={station.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                    station.status === "active"
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-white hover:from-green-100"
                      : "border-red-400 bg-gradient-to-r from-red-50 to-white hover:from-red-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {station.stationId.charAt(station.stationId.length - 1)}
                      </div>
                        <div>
                        <div className="font-bold text-base text-gray-800">
                          {station.stationId}
                        </div>
                        <div className="text-sm text-indigo-600 font-medium">
                          {station.name}
                            </div>
                          </div>
                            </div>
                    <div className="text-sm text-gray-700 mb-2 pl-13">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          station.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {station.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600 text-xs">
                          Sức khỏe: {station.stationHealth}%
                        </span>
                          </div>
                            </div>
                    <div className="text-sm text-gray-500 pl-13">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Doanh thu: {(station.monthlyRevenue / 1000000).toFixed(1)}M VNĐ
                            </div>
                          </div>
                        </div>
                  <div className="text-right ml-4">
                        <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-3 mr-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                            station.stationHealth >= 80
                                  ? "bg-green-500"
                              : station.stationHealth >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                          style={{ width: `${station.stationHealth}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-800">
                        {station.stationHealth}%
                          </span>
                        </div>
                  </div>
                        </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/admin-station-management")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả trạm
              </button>
            </div>
          </div>

          {/* Report gần đây */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Report gần đây
            </h2>
            <div className="space-y-3 flex-1 mt-8">
              {recentReports.map((report, index) => (
                <div
                  key={report.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                    report.status === "resolved"
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-white hover:from-green-100" 
                      : report.status === "in_progress"
                      ? "border-blue-400 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100"
                      : "border-yellow-400 bg-gradient-to-r from-yellow-50 to-white hover:from-yellow-100"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {report.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-base text-gray-800">
                          {report.customerName}
                        </div>
                        <div className="text-sm text-indigo-600 font-medium">
                          {report.stationId}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 mb-2 pl-13">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.priority === "urgent" ? "bg-red-100 text-red-800" :
                          report.priority === "high" ? "bg-orange-100 text-orange-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {report.reportType}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600 text-xs">
                          {report.description.length > 50 ? report.description.substring(0, 50) + "..." : report.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 pl-13">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {report.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                        report.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : report.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status === "resolved" ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Đã giải quyết
                        </>
                      ) : report.status === "in_progress" ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Đang xử lý
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
                onClick={() => navigate("/admin-report-management")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả report
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
