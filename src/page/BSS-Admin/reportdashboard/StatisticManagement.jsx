import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
// TODO: Import apiService khi có API endpoints
// import apiService from "../../../services/apiService";

const StatisticManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for statistics - sẽ được thay thế bằng API
  const [overviewStats, setOverviewStats] = useState({
    totalRevenue: 125000000,
    totalSwaps: 2450,
    activeStations: 12,
    activeUsers: 850
  });

  // Mock data - sẽ được thay thế bằng API data
  const [revenueData, setRevenueData] = useState([
    { month: "Tháng 1", revenue: 15000000, swaps: 280, date: "2024-01" },
    { month: "Tháng 2", revenue: 18000000, swaps: 320, date: "2024-02" },
    { month: "Tháng 3", revenue: 22000000, swaps: 380, date: "2024-03" },
    { month: "Tháng 4", revenue: 19000000, swaps: 340, date: "2024-04" },
    { month: "Tháng 5", revenue: 25000000, swaps: 420, date: "2024-05" },
    { month: "Tháng 6", revenue: 26000000, swaps: 450, date: "2024-06" }
  ]);

  // State cho date range picker (sẽ dùng khi có API)
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01",
    endDate: "2024-06"
  });

  const [peakHoursData, setPeakHoursData] = useState([
    { hour: "06:00-08:00", frequency: 85, percentage: 15.2 },
    { hour: "08:00-10:00", frequency: 120, percentage: 21.4 },
    { hour: "12:00-14:00", frequency: 95, percentage: 17.0 },
    { hour: "17:00-19:00", frequency: 140, percentage: 25.0 },
    { hour: "19:00-21:00", frequency: 110, percentage: 19.6 },
    { hour: "21:00-23:00", frequency: 10, percentage: 1.8 }
  ]);

  const [aiPredictionData, setAiPredictionData] = useState([
    { station: "Trạm sạc quận 1", currentUsage: 85, predictedUsage: 92, trend: "increase" },
    { station: "Trạm sạc quận 2", currentUsage: 78, predictedUsage: 75, trend: "decrease" },
    { station: "Trạm sạc bến tre", currentUsage: 65, predictedUsage: 70, trend: "increase" },
    { station: "Trạm Sạc An Liên", currentUsage: 90, predictedUsage: 88, trend: "decrease" },
    { station: "Trạm Sạc quần 6", currentUsage: 72, predictedUsage: 80, trend: "increase" }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // ===== API INTEGRATION FUNCTIONS =====
  // Sẽ được kích hoạt khi có API endpoint

  // Function để fetch revenue data từ API
  const fetchRevenueData = async (startDate, endDate) => {
    try {
      setRevenueLoading(true);
      setError(null);
      
      // TODO: Thay thế bằng actual API call
      // const response = await apiService.getRevenueStatistics({
      //   startDate: startDate,
      //   endDate: endDate
      // });
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Transform API response to match chart format
      // const transformedData = response.data.map(item => ({
      //   month: item.monthName || `Tháng ${item.month}`,
      //   revenue: item.totalRevenue || 0,
      //   swaps: item.totalSwaps || 0,
      //   date: item.date || item.yearMonth
      // }));
      
      // setRevenueData(transformedData);
      
      console.log("📊 Revenue API call would be made here:", { startDate, endDate });
      
    } catch (err) {
      console.error("❌ Error fetching revenue data:", err);
      setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.");
    } finally {
      setRevenueLoading(false);
    }
  };

  // Function để fetch overview statistics
  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      
      // TODO: Thay thế bằng actual API call
      // const response = await apiService.getOverviewStatistics();
      // setOverviewStats({
      //   totalRevenue: response.data.totalRevenue || 0,
      //   totalSwaps: response.data.totalSwaps || 0,
      //   activeStations: response.data.activeStations || 0,
      //   activeUsers: response.data.activeUsers || 0
      // });
      
      console.log("📈 Overview stats API call would be made here");
      
    } catch (err) {
      console.error("❌ Error fetching overview stats:", err);
      setError("Không thể tải dữ liệu tổng quan.");
    } finally {
      setLoading(false);
    }
  };

  // Function để refresh data
  const refreshData = async () => {
    await Promise.all([
      fetchOverviewStats(),
      fetchRevenueData(dateRange.startDate, dateRange.endDate)
    ]);
  };

  // Function để handle date range change
  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate
    });
    fetchRevenueData(newStartDate, newEndDate);
  };

  // useEffect để load data khi component mount
  useEffect(() => {
    // Uncomment khi có API
    // fetchOverviewStats();
    // fetchRevenueData(dateRange.startDate, dateRange.endDate);
  }, []);

  // ===== END API INTEGRATION FUNCTIONS =====

  /*
  ========================================
  📋 HƯỚNG DẪN TÍCH HỢP API REVENUE
  ========================================
  
  🔧 BƯỚC 1: Thêm endpoints vào apiConfig.js
  ----------------------------------------
  STATISTICS: {
    REVENUE: "/statistics/revenue",           // GET với query params: startDate, endDate
    OVERVIEW: "/statistics/overview",         // GET tổng quan
    PEAK_HOURS: "/statistics/peak-hours",     // GET giờ cao điểm
    AI_PREDICTION: "/statistics/ai-forecast"  // GET dự báo AI
  }

  🔧 BƯỚC 2: Thêm methods vào apiService.js
  ----------------------------------------
  // Revenue statistics
  async getRevenueStatistics(params) {
    const url = getApiUrl("STATISTICS", "REVENUE");
    const queryString = new URLSearchParams(params).toString();
    return this.get(`${url}?${queryString}`);
  }

  // Overview statistics  
  async getOverviewStatistics() {
    const url = getApiUrl("STATISTICS", "OVERVIEW");
    return this.get(url);
  }

  🔧 BƯỚC 3: Kích hoạt API calls
  ----------------------------------------
  1. Uncomment import apiService ở đầu file
  2. Uncomment các API calls trong useEffect
  3. Uncomment code trong fetchRevenueData và fetchOverviewStats
  4. Remove class "hidden" từ date range picker
  5. Test với actual API endpoints

  📊 EXPECTED API RESPONSE FORMAT:
  ----------------------------------------
  Revenue API Response:
  {
    "success": true,
    "data": [
      {
        "month": 1,
        "monthName": "Tháng 1", 
        "year": 2024,
        "yearMonth": "2024-01",
        "totalRevenue": 15000000,
        "totalSwaps": 280,
        "averageRevenuePerSwap": 53571
      }
    ]
  }

  Overview API Response:
  {
    "success": true,
    "data": {
      "totalRevenue": 125000000,
      "totalSwaps": 2450,
      "activeStations": 12,
      "activeUsers": 850
    }
  }

  🎯 FEATURES READY FOR API:
  ----------------------------------------
  ✅ Loading states với spinner
  ✅ Error handling với user-friendly messages  
  ✅ Refresh functionality
  ✅ Date range filtering (hidden, ready to activate)
  ✅ Responsive charts với tooltips
  ✅ Auto-calculated summary cards
  ✅ Real-time data updates

  🚀 TO ACTIVATE:
  ----------------------------------------
  1. Provide API endpoints
  2. Uncomment marked code sections
  3. Test with real data
  4. Adjust data transformation if needed
  */

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        <AdminHeader
          title="Tổng quan Thống kê"
          subtitle="Phân tích dữ liệu và xu hướng sử dụng hệ thống"
          icon={
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          stats={[
            { label: "Tổng doanh thu", value: formatCurrency(overviewStats.totalRevenue), color: "bg-green-400" },
            { label: "Lượt đổi pin", value: overviewStats.totalSwaps, color: "bg-emerald-400" }
          ]}
        />

        {/* Tổng quan thống kê */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan thống kê</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(overviewStats.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng lượt đổi pin</p>
                  <p className="text-2xl font-bold text-green-600">{overviewStats.totalSwaps.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trạm hoạt động</p>
                  <p className="text-2xl font-bold text-emerald-600">{overviewStats.activeStations}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
                  <p className="text-2xl font-bold text-teal-600">{overviewStats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doanh thu và số lượt đổi pin */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Doanh thu và số lượt đổi pin</h2>
            <div className="flex items-center space-x-4">
              {/* Date Range Picker - sẽ được kích hoạt khi có API */}
              <div className="hidden">
                <input
                  type="month"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange(e.target.value, dateRange.endDate)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="mx-2 text-gray-500">đến</span>
                <input
                  type="month"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange(dateRange.startDate, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={refreshData}
                disabled={revenueLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg 
                  className={`w-4 h-4 ${revenueLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{revenueLoading ? 'Đang tải...' : 'Tải lại'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ Doanh thu */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative">
              {/* Loading Overlay */}
              {revenueLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Doanh thu theo tháng</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">VNĐ (triệu)</span>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-end justify-between h-64 px-2">
                  {revenueData.map((item, index) => {
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                    const height = (item.revenue / maxRevenue) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="relative group">
                          <div 
                            className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg hover:from-green-500 hover:to-green-600 transition-all duration-300 cursor-pointer shadow-lg"
                            style={{ height: `${height * 2.4}px`, minHeight: '20px' }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            <div className="font-semibold">{item.month}</div>
                            <div>{formatCurrency(item.revenue)}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600 text-center">
                          {item.month.replace('Tháng ', 'T')}
                        </div>
                        <div className="text-xs text-green-600 font-semibold mt-1">
                          {Math.round(item.revenue / 1000000)}M
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Biểu đồ Số lượt đổi pin */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative">
              {/* Loading Overlay */}
              {revenueLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Số lượt đổi pin theo tháng</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Lượt</span>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-end justify-between h-64 px-2">
                  {revenueData.map((item, index) => {
                    const maxSwaps = Math.max(...revenueData.map(d => d.swaps));
                    const height = (item.swaps / maxSwaps) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="relative group">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 cursor-pointer shadow-lg"
                            style={{ height: `${height * 2.4}px`, minHeight: '20px' }}
                          ></div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            <div className="font-semibold">{item.month}</div>
                            <div>{item.swaps.toLocaleString()} lượt</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600 text-center">
                          {item.month.replace('Tháng ', 'T')}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold mt-1">
                          {item.swaps}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ kết hợp - Line Chart */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Xu hướng doanh thu và lượt đổi pin</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Doanh thu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Lượt đổi pin</span>
                </div>
              </div>
            </div>
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 600 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="100" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="600" height="200" fill="url(#grid)" />
                
                {/* Revenue line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={revenueData.map((item, index) => {
                    const x = (index * 100) + 50;
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                    const y = 180 - ((item.revenue / maxRevenue) * 160);
                    return `${x},${y}`;
                  }).join(' ')}
                />
                
                {/* Swaps line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={revenueData.map((item, index) => {
                    const x = (index * 100) + 50;
                    const maxSwaps = Math.max(...revenueData.map(d => d.swaps));
                    const y = 180 - ((item.swaps / maxSwaps) * 160);
                    return `${x},${y}`;
                  }).join(' ')}
                />
                
                {/* Revenue points */}
                {revenueData.map((item, index) => {
                  const x = (index * 100) + 50;
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                  const y = 180 - ((item.revenue / maxRevenue) * 160);
                  return (
                    <circle
                      key={`revenue-${index}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-6 transition-all duration-200"
                    />
                  );
                })}
                
                {/* Swaps points */}
                {revenueData.map((item, index) => {
                  const x = (index * 100) + 50;
                  const maxSwaps = Math.max(...revenueData.map(d => d.swaps));
                  const y = 180 - ((item.swaps / maxSwaps) * 160);
                  return (
                    <circle
                      key={`swaps-${index}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-6 transition-all duration-200"
                    />
                  );
                })}
                
                {/* X-axis labels */}
                {revenueData.map((item, index) => {
                  const x = (index * 100) + 50;
                  return (
                    <text
                      key={`label-${index}`}
                      x={x}
                      y="195"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {item.month.replace('Tháng ', 'T')}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Tổng doanh thu 6 tháng</p>
                  <p className="text-xl font-bold text-green-800">
                    {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Tổng lượt đổi pin</p>
                  <p className="text-xl font-bold text-blue-800">
                    {revenueData.reduce((sum, item) => sum + item.swaps, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Doanh thu trung bình/lượt</p>
                  <p className="text-xl font-bold text-purple-800">
                    {formatCurrency(
                      revenueData.reduce((sum, item) => sum + item.revenue, 0) / 
                      revenueData.reduce((sum, item) => sum + item.swaps, 0)
                    )}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tần suất đổi pin và giờ cao điểm */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tần suất đổi pin và giờ cao điểm</h2>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <th className="p-4 text-left font-semibold">Khung giờ</th>
                    <th className="p-4 text-right font-semibold">Tần suất</th>
                    <th className="p-4 text-right font-semibold">Tỷ lệ (%)</th>
                    <th className="p-4 text-center font-semibold">Mức độ</th>
                  </tr>
                </thead>
                <tbody>
                  {peakHoursData.map((item, index) => (
                    <tr key={index} className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="p-4 font-medium text-gray-800">{item.hour}</td>
                      <td className="p-4 text-right font-semibold text-green-600">{item.frequency}</td>
                      <td className="p-4 text-right font-semibold text-emerald-600">{item.percentage}%</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.percentage >= 20 
                            ? "bg-red-100 text-red-800" 
                            : item.percentage >= 15 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.percentage >= 20 ? "Cao điểm" : item.percentage >= 15 ? "Trung bình" : "Thấp"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI dự báo nhu cầu sử dụng trạm đổi pin */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI dự báo nhu cầu sử dụng trạm đổi pin</h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Dự báo dựa trên dữ liệu lịch sử và xu hướng sử dụng</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="p-4 text-left font-semibold">Tên trạm</th>
                      <th className="p-4 text-right font-semibold">Sử dụng hiện tại (%)</th>
                      <th className="p-4 text-right font-semibold">Dự báo (%)</th>
                      <th className="p-4 text-center font-semibold">Xu hướng</th>
                      <th className="p-4 text-center font-semibold">Khuyến nghị</th>
                    </tr>
                  </thead>
                <tbody>
                  {aiPredictionData.map((item, index) => (
                    <tr key={index} className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="p-4 font-medium text-gray-800">{item.station}</td>
                      <td className="p-4 text-right font-semibold text-green-600">{item.currentUsage}%</td>
                      <td className="p-4 text-right font-semibold text-emerald-600">{item.predictedUsage}%</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          item.trend === "increase" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {item.trend === "increase" ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              Tăng
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                              Giảm
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.predictedUsage >= 90 
                            ? "bg-red-100 text-red-800" 
                            : item.predictedUsage >= 75 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.predictedUsage >= 90 
                            ? "Cần mở rộng" 
                            : item.predictedUsage >= 75 
                            ? "Theo dõi" 
                            : "Ổn định"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticManagement;
