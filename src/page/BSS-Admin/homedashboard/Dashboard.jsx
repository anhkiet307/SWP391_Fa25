import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showInfo, showError } from "../../../utils/toast";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/apiService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State cho thống kê tổng quan hệ thống
  const [systemStats, setSystemStats] = useState({
    totalStations: 0,
    activeStations: 0,
    maintenanceStations: 0,
    totalBatteries: 1200,
    totalUsers: 2500,
    totalTransactions: 15680,
    monthlyRevenue: 784000000,
    stationHealth: 85,
  });

  // State cho danh sách trạm từ API
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Load stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getStations();
        
        // Transform API data to match UI format
        const transformedStations = response.data.map((station) => ({
          id: station.stationID,
          stationId: station.stationID.toString(),
          name: station.stationName,
          address: station.location,
          status: station.status === 1 ? "active" : "maintenance",
          createdAt: station.createAt,
          // Mock data for dashboard display
          batteryCapacity: 100,
          batteryFull: Math.floor(Math.random() * 50) + 30,
          batteryCharging: Math.floor(Math.random() * 20) + 5,
          batteryMaintenance: Math.floor(Math.random() * 10) + 2,
          totalTransactions: Math.floor(Math.random() * 2000) + 500,
          monthlyRevenue: Math.floor(Math.random() * 100000000) + 20000000,
          stationHealth: Math.floor(Math.random() * 30) + 70,
        }));
        
        // Sort by creation date and take only the 3 newest
        const sortedStations = transformedStations
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        
        setStations(sortedStations);
        
        // Update system stats
        setSystemStats(prev => ({
          ...prev,
          totalStations: response.data.length,
          activeStations: response.data.filter(s => s.status === 1).length,
          maintenanceStations: response.data.filter(s => s.status === 0).length,
        }));
        
      } catch (err) {
        console.error("Error loading stations:", err);
        setError("Không thể tải danh sách trạm. Vui lòng thử lại sau.");
        showError("Lỗi khi tải danh sách trạm!");
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Dashboard Quản trị Hệ thống"
          subtitle="Tổng quan và quản lý toàn bộ hệ thống trạm đổi pin"
          stats={[
            { label: "Tổng trạm", value: systemStats.totalStations, color: "bg-blue-400" }
          ]}
        />

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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">⚠️ {error}</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Thử lại
                  </button>
                </div>
              ) : stations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Chưa có trạm nào trong hệ thống</div>
                </div>
              ) : (
                stations.map((station, index) => (
                <div
                  key={station.id}
                  className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    station.status === "active"
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-white hover:from-green-100"
                      : "border-red-400 bg-gradient-to-r from-red-50 to-white hover:from-red-100"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Station Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
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
                    </div>

                    {/* Station Info */}
                    <div className="flex-1 min-w-0">
                      {/* Station Name */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {station.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
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
                          <span className="truncate">{station.address}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                            station.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              station.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          {station.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                        </span>
                        
                        {/* Station ID */}
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          ID: {station.stationId}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
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
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            report.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : report.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {report.reportType}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-600 text-xs">
                          {report.description.length > 50
                            ? report.description.substring(0, 50) + "..."
                            : report.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 pl-13">
                      <div className="flex items-center gap-2">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Đã giải quyết
                        </>
                      ) : report.status === "in_progress" ? (
                        <>
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Đang xử lý
                        </>
                      ) : (
                        <>
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
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
