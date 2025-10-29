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
    totalReports: 0,
    totalCustomers: 0,
    totalStaff: 0,
  });

  // State cho danh sách trạm từ API
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho danh sách report từ API
  const [recentReports, setRecentReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState(null);
  
  // State cho danh sách users (drivers)
  const [users, setUsers] = useState([]);

  // Load system stats from APIs
  useEffect(() => {
    const loadSystemStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all stats in parallel
        const [stationsResponse, reportsResponse, driversResponse, staffResponse] = await Promise.all([
          apiService.getStations(),
          apiService.getAllReports(user?.userID || 1),
          apiService.listDrivers(),
          apiService.listStaff()
        ]);
        
        // Update system stats
        setSystemStats({
          totalStations: stationsResponse.data?.length || 0,
          totalReports: reportsResponse.data?.length || 0,
          totalCustomers: driversResponse.data?.length || 0,
          totalStaff: staffResponse.data?.length || 0,
        });
        
        // Transform stations data for display
        const transformedStations = stationsResponse.data.map((station) => ({
          id: station.stationID,
          stationId: station.stationID.toString(),
          name: station.stationName,
          address: station.location,
          status: station.status === 1 ? "active" : "maintenance",
          createdAt: station.createAt,
        }));
        
        // Sort by creation date and take only the 3 newest
        const sortedStations = transformedStations
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        
        setStations(sortedStations);
        
      } catch (err) {
        console.error("Error loading system stats:", err);
        setError("Không thể tải thống kê hệ thống. Vui lòng thử lại sau.");
        showError("Lỗi khi tải thống kê hệ thống!");
      } finally {
        setLoading(false);
      }
    };

    loadSystemStats();
  }, [user?.userID]);

  // Load users for mapping reporter names
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await apiService.listDrivers();
        if (response && response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    
    loadUsers();
  }, []);
  
  // Helper function to get user name by ID
  const getUserName = (userId) => {
    if (!userId) return "N/A";
    console.log("Looking for userId:", userId, "in users:", users);
    const foundUser = users.find(u => u.userID === userId);
    console.log("Found user:", foundUser);
    return foundUser ? foundUser.name : `User ${userId}`;
  };

  // Load reports from API
  useEffect(() => {
    const loadReports = async () => {
      try {
        setReportsLoading(true);
        setReportsError(null);
        const response = await apiService.getAllReports(user?.userID || 1);
        
        console.log("Reports API response:", response);
        console.log("Reports data array:", response.data);
        
        // Check if response has data
        if (!response || !response.data || !Array.isArray(response.data)) {
          console.warn("Invalid reports API response:", response);
          setRecentReports([]);
          return;
        }
        
        console.log("Number of reports:", response.data.length);
        console.log("Users loaded:", users.length);
        
        // Transform API data to match UI format
        const transformedReports = response.data.map((report) => {
          console.log("Processing report:", report);
          const reporterId = report.reporterId || report.reporterID;
          return {
            id: report.id || 0,
            reportId: (report.id || 0).toString(),
            reporterId: reporterId,
            customerName: getUserName(reporterId),
            stationId: "N/A", // API không có stationID field
            reportType: report.typeName || "Báo cáo",
            description: report.description || "Không có mô tả",
            timestamp: report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : "Không xác định",
            status: report.status === 0 ? "pending" : report.status === 1 ? "in_progress" : "resolved",
            priority: "normal", // API không có priority field
          };
        });
        
        console.log("Transformed reports:", transformedReports);
        
        // Sort by creation date and take only the 3 newest
        const sortedReports = transformedReports
          .filter(report => report.id) // Chỉ filter theo ID
          .sort((a, b) => {
            try {
              return new Date(b.timestamp) - new Date(a.timestamp);
            } catch (error) {
              console.warn("Error sorting reports by timestamp:", error);
              return 0;
            }
          })
          .slice(0, 3);
        
        console.log("Sorted reports (first 3):", sortedReports);
        setRecentReports(sortedReports);
        
      } catch (err) {
        console.error("Error loading reports:", err);
        setReportsError("Không thể tải danh sách báo cáo. Vui lòng thử lại sau.");
        showError("Lỗi khi tải danh sách báo cáo!");
      } finally {
        setReportsLoading(false);
      }
    };

    if (user?.userID) {
      loadReports();
    }
  }, [user?.userID, users]);

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Dashboard Quản trị Hệ thống"
          subtitle="Tổng quan và quản lý toàn bộ hệ thống trạm đổi pin"
          stats={[
            { label: "Tổng trạm", value: systemStats.totalStations, color: "bg-green-400" }
          ]}
        />

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng Trạm
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {systemStats.totalStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng Báo Cáo
              </h3>
              <div className="text-4xl font-bold m-0 text-orange-500">
                {systemStats.totalReports}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng Khách Hàng
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {systemStats.totalCustomers}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng Nhân Viên
              </h3>
              <div className="text-4xl font-bold m-0 text-green-600">
                {systemStats.totalStaff}
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
                  className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] min-h-[140px] flex ${
                    station.status === "active"
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-white hover:from-green-100"
                      : "border-red-400 bg-gradient-to-r from-red-50 to-white hover:from-red-100"
                  }`}
                >
                  <div className="flex items-start space-x-4 w-full">
                    {/* Station Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
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
                        <div className="flex items-center justify-start">
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
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả trạm
              </button>
            </div>
          </div>

          {/* Report gần đây */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Báo cáo gần đây
            </h2>
            <div className="space-y-3 flex-1 mt-8">
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                </div>
              ) : reportsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">⚠️ {reportsError}</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Thử lại
                  </button>
                </div>
              ) : recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Chưa có báo cáo nào trong hệ thống</div>
                </div>
              ) : (
                recentReports.map((report, index) => (
                <div
                  key={report.id}
                    className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] min-h-[140px] flex ${
                    report.status === "resolved"
                      ? "border-blue-400 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100"
                      : report.status === "in_progress"
                      ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-white hover:from-yellow-100"
                      : "border-red-400 bg-gradient-to-r from-red-50 to-white hover:from-red-100"
                  }`}
                >
                    <div className="flex items-start space-x-4 w-full">
                      {/* Report Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Report Info */}
                      <div className="flex-1 min-w-0">
                        {/* Customer Name as Title */}
                        <div className="mb-2">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {report.customerName}
                          </h3>
                        </div>

                        {/* Description */}
                        <div className="mb-2">
                          <p className="text-sm text-gray-700 line-clamp-1">
                            {report.description}
                          </p>
                        </div>

                        {/* Status and Timestamp in same row */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                              report.status === "resolved"
                                ? "bg-blue-100 text-blue-800"
                                : report.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                report.status === "resolved"
                                  ? "bg-blue-500"
                                  : report.status === "in_progress"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            {report.status === "resolved" ? "Đã giải quyết" : 
                             report.status === "in_progress" ? "Đang xử lý" : "Chờ xử lý"}
                          </span>
                          
                          <div className="text-xs text-gray-500 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
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
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/admin-report-management")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Xem tất cả báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
