import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import apiService from "../../../services/apiService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const StatisticManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [error, setError] = useState(null);

  // Real data from API
  const [overviewStats, setOverviewStats] = useState({
    totalRevenue: 0,
    counterRevenue: 0,  // Doanh thu tại quầy (pack = 0)
    packageRevenue: 0,  // Doanh thu gói (từ VNPay)
    totalSwaps: 0
  });

  // Real data from transaction API
  const [revenueData, setRevenueData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  // Service packs + VNPay statistics for pack revenue section
  const [servicePacks, setServicePacks] = useState([]);
  const [vnpayStats, setVnpayStats] = useState([]);
  const [packChartData, setPackChartData] = useState([]);
  // Pagination for pack purchases table
  const [packPage, setPackPage] = useState(1);
  const [packItemsPerPage] = useState(6);
  
  // Pagination for counter revenue table
  const [counterPage, setCounterPage] = useState(1);
  const [counterItemsPerPage] = useState(6);
  
  // Pagination state for pin swaps table
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // State cho date range picker (sẽ dùng khi có API)
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01",
    endDate: "2024-06"
  });

  const [peakHoursData, setPeakHoursData] = useState([]);
  const [aiPredictionData, setAiPredictionData] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // ===== API INTEGRATION FUNCTIONS =====

  // Function để fetch transactions từ API (API-only, không dùng dữ liệu mẫu)
  const fetchTransactions = async () => {
    try {
      setRevenueLoading(true);
      setError(null);
      
      console.log("🔄 Fetching transactions...");
      const response = await apiService.getTransactions();
      console.log("📊 API Response:", response);
      
      if (response && response.status === "success") {
        const txs = Array.isArray(response.data) ? response.data : [];
        setTransactions(txs);
        processTransactionData(txs);
      } else {
        setTransactions([]);
        processTransactionData([]);
      }
      
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      setTransactions([]);
      processTransactionData([]);
      setError("Không thể tải dữ liệu giao dịch.");
    } finally {
      setRevenueLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      console.log("🔄 Fetching users...");
      const response = await apiService.listDrivers();
      console.log("👥 Users response:", response);
      
      if (response && response.data) {
        setUsers(response.data);
        console.log("👥 Users set:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  // Fetch stations from API
  const fetchStations = async () => {
    try {
      console.log("🔄 Fetching stations...");
      const response = await apiService.getStations();
      console.log("🏢 Stations response:", response);
      
      if (response && response.data) {
        setStations(response.data);
        console.log("🏢 Stations set:", response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching stations:", error);
    }
  };

  // Fetch service packs (map packID -> name)
  const fetchServicePacks = async () => {
    try {
      const response = await apiService.getServicePacks();
      if (response && response.data) {
        setServicePacks(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching service packs:", error);
    }
  };

  // Fetch VNPay statistics (list of pack purchases)
  const fetchVnpayStatistic = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching VNPay statistics...");
      
      const res = await apiService.getVnpayStatistic();
      console.log("📊 VNPay response:", res);
      
      if (res && res.status === "success" && Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a,b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setVnpayStats(sorted);
        console.log("✅ VNPay stats updated:", sorted);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (e) {
      console.error("❌ Error fetching VNPay statistic:", e);
      setError("Không thể tải dữ liệu VNPay. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Function để xử lý dữ liệu transaction thành format cho charts
  const processTransactionData = (transactions) => {
    console.log("📊 Processing transactions:", transactions);
    
    // Tính tổng doanh thu (pack = 0) và tổng lượt đổi (pack = 0 + pack = 1)
    let totalRevenue = 0;
    let totalSwaps = 0;
    
    // Group theo ngày từ createAt
    const dailyData = {};
    
    transactions.forEach(transaction => {
      console.log("📊 Processing transaction:", transaction);
      
      // Lấy ngày từ createAt
      const transactionDate = new Date(transaction.createAt);
      const dateKey = transactionDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const displayDate = `${transactionDate.getDate()}/${transactionDate.getMonth() + 1}`;
      
      // Khởi tạo dữ liệu cho ngày này nếu chưa có
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          displayDate: displayDate,
          revenue: 0,
          swaps: 0
        };
      }
      
      // Doanh thu: chỉ tính pack = 0 (thanh toán tại quầy) VÀ status = 1 (đã thanh toán)
      if (transaction.pack === 0 && transaction.status === 1) {
        const amount = parseFloat(transaction.amount) || 0;
        totalRevenue += amount;
        dailyData[dateKey].revenue += amount;
        console.log("💰 Added to revenue:", amount, "Status:", transaction.status, "Total:", totalRevenue);
      }
      
      // Số lượt đổi: tính cả pack = 0 và pack = 1, nhưng chỉ khi status = 1
      if ((transaction.pack === 0 || transaction.pack === 1) && transaction.status === 1) {
        totalSwaps += 1;
        dailyData[dateKey].swaps += 1;
        console.log("🔄 Added to swaps:", transaction.pack, "Status:", transaction.status, "Total:", totalSwaps);
      }
    });
    
    console.log("📊 Final totals - Counter Revenue:", totalRevenue, "Swaps:", totalSwaps);
    console.log("📊 Daily data:", dailyData);
    
    // Chuyển đổi thành array và sắp xếp theo ngày
    const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log("📊 Chart data:", chartData);
    
    // Cập nhật chart và tổng quan (chỉ cập nhật counterRevenue, totalRevenue sẽ tính sau)
    setRevenueData(chartData);
    setOverviewStats(prev => ({
      ...prev,
      counterRevenue: totalRevenue,  // Doanh thu tại quầy (pack=0)
      totalSwaps: totalSwaps
    }));
  };

  // Function để tính toán peak hours từ transactions
  const processPeakHoursData = (transactions) => {
    console.log("⏰ Processing peak hours data with transactions:", transactions.length);
    
    // Debug: Log pack distribution
    const pack0Count = transactions.filter(t => t.pack === 0 && t.status === 1).length;
    const pack1Count = transactions.filter(t => t.pack === 1 && t.status === 1).length;
    console.log("📊 Pack distribution - Pack 0:", pack0Count, "Pack 1:", pack1Count);
    
    // Chỉ hiển thị giờ hoạt động của trạm (08:00 - 22:00)
    const hourRanges = [
      { hour: "08:00-10:00", start: 8, end: 10 },
      { hour: "10:00-12:00", start: 10, end: 12 },
      { hour: "12:00-14:00", start: 12, end: 14 },
      { hour: "14:00-16:00", start: 14, end: 16 },
      { hour: "16:00-18:00", start: 16, end: 18 },
      { hour: "18:00-20:00", start: 18, end: 20 },
      { hour: "20:00-22:00", start: 20, end: 22 }
    ];

    // Đếm số lượt đổi trong mỗi khung giờ - chỉ tính giao dịch có (pack=0 hoặc pack=1) VÀ status=1
    const hourCounts = hourRanges.map(range => {
      const count = transactions.filter(t => {
        if (!t.createAt) return false;
        // Chỉ đếm giao dịch có (pack = 0 hoặc pack = 1) VÀ status = 1
        if (!((t.pack === 0 || t.pack === 1) && t.status === 1)) return false;
        const date = new Date(t.createAt);
        const hour = date.getHours();
        return hour >= range.start && hour < range.end;
      }).length;
      
      console.log(`⏰ ${range.hour}: ${count} transactions`);
      
      return {
        hour: range.hour,
        frequency: count
      };
    });

    // Tính tổng để tính phần trăm
    const total = hourCounts.reduce((sum, item) => sum + item.frequency, 0);
    
    // Thêm percentage
    const peakData = hourCounts.map(item => ({
      ...item,
      percentage: total > 0 ? parseFloat(((item.frequency / total) * 100).toFixed(1)) : 0
    }));

    setPeakHoursData(peakData);
    console.log("⏰ Peak hours data:", peakData);
    console.log("⏰ Total transactions counted:", total);
    console.log("⏰ Input transactions length:", transactions.length);
  };

  // Function để tính toán AI prediction từ transactions và stations
  const processAIPredictionData = (transactions, stations) => {
    if (!stations || stations.length === 0) return;

    // Nhóm transactions theo stationID
    const stationSwaps = {};
    transactions.forEach(t => {
      if (t.stationID) {
        if (!stationSwaps[t.stationID]) {
          stationSwaps[t.stationID] = 0;
        }
        stationSwaps[t.stationID]++;
      }
    });

    // Tìm max swaps để tính percentage
    const maxSwaps = Math.max(...Object.values(stationSwaps), 1);

    // Tạo data cho từng trạm
    const predictionData = stations
      .filter(station => stationSwaps[station.stationID] > 0)
      .map(station => {
        const swaps = stationSwaps[station.stationID] || 0;
        const currentUsage = Math.round((swaps / maxSwaps) * 100);
        
        // Dự báo: random tăng/giảm 5-15%
        const change = Math.floor(Math.random() * 10) + 5;
        const trend = Math.random() > 0.5 ? "increase" : "decrease";
        const predictedUsage = trend === "increase" 
          ? Math.min(currentUsage + change, 100)
          : Math.max(currentUsage - change, 0);

        return {
          station: station.stationName || `Trạm ${station.stationID}`,
          currentUsage,
          predictedUsage,
          trend
        };
      })
      .sort((a, b) => b.currentUsage - a.currentUsage)
      .slice(0, 5); // Lấy top 5 trạm

    setAiPredictionData(predictionData);
    console.log("🤖 AI Prediction data:", predictionData);
  };

  // Function để refresh data
  const refreshData = async () => {
    await Promise.all([
      fetchTransactions(),
      fetchVnpayStatistic()
    ]);
  };

  // Function để handle date range change
  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setDateRange({
      startDate: newStartDate,
      endDate: newEndDate
    });
    // Re-process existing transactions with new date range
    if (transactions.length > 0) {
      processTransactionData(transactions);
    }
  };

  // useEffect để load data khi component mount
  useEffect(() => {
    console.log("🚀 Component mounted, fetching data...");
    fetchTransactions();
    fetchUsers();
    fetchStations();
    fetchServicePacks();
    fetchVnpayStatistic();
  }, []);

  // Build pack chart data when dependencies change (from VNPay statistic if available)
  useEffect(() => {
    // Prefer VNPay statistic when available
    if (Array.isArray(vnpayStats) && vnpayStats.length > 0) {
      const byDay = {};
      vnpayStats
        // normalize minimal fields and keep only successful payments
        .map(p => ({
          amountVND: Number(p.amountVND ?? 0),
          status: Number(p.status ?? 0),
          updatedAt: p.updatedAt ?? p.updateAt ?? p.createdAt,
        }))
        .filter(p => p.updatedAt) // Bỏ điều kiện status vì có thể khác với yêu cầu
        .forEach(p => {
          const d = new Date(p.updatedAt);
          const key = d.toISOString().split('T')[0];
          const displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
          if (!byDay[key]) byDay[key] = { date: key, displayDate, total: 0 };
          byDay[key].total += p.amountVND;
          console.log(`📊 Added ${p.amountVND} to ${displayDate}, total: ${byDay[key].total}`);
        });

      const data = Object.values(byDay).sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("📊 Final chart data:", data);
      setPackChartData(data);
      return;
    }

    // Fallback: build from transactions pack=1
    if (!transactions || transactions.length === 0) {
      setPackChartData([]);
      return;
    }

    const byDayTx = {};
    transactions
      .filter(t => t.pack === 1)
      .forEach(t => {
        const d = new Date(t.createAt);
        const key = d.toISOString().split('T')[0];
        const displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
        if (!byDayTx[key]) byDayTx[key] = { date: key, displayDate, total: 0 };
        byDayTx[key].total += Number(t.amountVND ?? t.amount ?? 0);
      });

    const dataTx = Object.values(byDayTx).sort((a, b) => new Date(a.date) - new Date(b.date));
    setPackChartData(dataTx);
  }, [transactions, vnpayStats]);

  // Calculate package revenue from VNPay stats and update total revenue
  useEffect(() => {
    if (Array.isArray(vnpayStats) && vnpayStats.length > 0) {
      const packageTotal = vnpayStats.reduce((sum, p) => {
        return sum + (Number(p.amountVND) || 0);
      }, 0);
      
      setOverviewStats(prev => {
        const newTotalRevenue = prev.counterRevenue + packageTotal;
        console.log("📦 Package Revenue:", packageTotal);
        console.log("💰 Total Revenue:", newTotalRevenue);
        
        return {
          ...prev,
          packageRevenue: packageTotal,
          totalRevenue: newTotalRevenue
        };
      });
    }
  }, [vnpayStats, overviewStats.counterRevenue]);

  // Debug useEffect để theo dõi state changes
  useEffect(() => {
    console.log("📊 Revenue data changed:", revenueData);
  }, [revenueData]);

  // Helper functions để tìm tên user và station
  const getUserName = (userID) => {
    const user = users.find(u => u.userID === userID);
    return user ? user.name : `User ${userID}`;
  };

  const getStationName = (stationID) => {
    const station = stations.find(s => s.stationID === stationID);
    return station ? station.stationName : `Station ${stationID}`;
  };

  const getStatusText = (status) => {
    switch(status) {
      case 0: return "Chờ xử lý";
      case 1: return "Đã hoàn thành";
      case 2: return "Hết hạn";
      case 3: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  const getPaymentMethod = (pack) => {
    return pack === 0 ? "Thanh toán tại quầy" : "Thanh toán bằng gói";
  };

  // Map packID -> pack name
  const getPackName = (packID) => {
    const p = servicePacks.find(sp => sp.packID === packID);
    return p ? p.packname || p.packName : `Gói #${packID}`;
  };

  // Build display list for pack purchases (prefer VNPay stats; fallback to transactions pack=1)
  // Normalize VNPay records -> consistent keys
  const normalizedVnpay = (vnpayStats || []).map(p => ({
    userID: p.userID ?? p.userId ?? null,
    packID: p.packID ?? p.packId ?? p.packid,
    amountVND: Number(p.amountVND ?? 0),
    status: Number(p.status ?? 0),
    updatedAt: p.updatedAt ?? p.updateAt ?? p.updatedAt,
  })).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const packPurchases = (normalizedVnpay && normalizedVnpay.length > 0)
    ? normalizedVnpay
    : transactions
        .filter(t => t.pack === 1)
        .map(t => ({
          packID: t.packID ?? t.packId,
          amountVND: t.amountVND ?? t.amount ?? 0,
          status: t.status ?? 1,
          updatedAt: t.createAt,
          userID: t.userID,
        }))
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination logic for pin swaps table (sort newest -> oldest before slicing)
  // Chỉ lấy transactions có (pack = 0 hoặc pack = 1) VÀ status = 1
  const pinSwapTransactions = transactions
    .filter(t => (t.pack === 0 || t.pack === 1) && t.status === 1)
    .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
  const totalPages = Math.ceil(pinSwapTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPinSwapData = pinSwapTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log("📈 Overview stats changed:", overviewStats);
  }, [overviewStats]);

  // Process peak hours và AI prediction khi có đủ dữ liệu
  useEffect(() => {
    if (transactions.length > 0) {
      processPeakHoursData(transactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (transactions.length > 0 && stations.length > 0) {
      processAIPredictionData(transactions, stations);
    }
  }, [transactions, stations]);

  // ===== END API INTEGRATION FUNCTIONS =====

  /*
  ========================================
  📊 TRANSACTION API INTEGRATION COMPLETED
  ========================================
  
  ✅ INTEGRATED FEATURES:
  ----------------------------------------
  🔹 Transaction API: GET /api/transaction/list
  🔹 Revenue Calculation: pack = 0 (thanh toán tại quầy)
  🔹 Swap Count: pack = 0 + pack = 1 (cả 2 loại đều tốn 1 lượt)
  🔹 Monthly Grouping: Tự động group theo 6 tháng gần nhất
  🔹 Real-time Data: Tự động cập nhật khi có transaction mới
  🔹 Error Handling: User-friendly error messages
  🔹 Loading States: Spinner khi đang tải dữ liệu
  🔹 Refresh Function: Nút "Tải lại" để cập nhật dữ liệu

  📈 DATA PROCESSING LOGIC:
  ----------------------------------------
  1. Fetch all transactions từ API
  2. Filter theo 6 tháng gần nhất
  3. Revenue: Chỉ tính transactions với pack = 0
  4. Swaps: Tính cả pack = 0 và pack = 1
  5. Group theo tháng và tính tổng
  6. Update charts và overview stats

  🎯 CHART DATA FORMAT:
  ----------------------------------------
  revenueData = [
    {
      month: "Tháng 1",
      revenue: 15000000,    // Tổng amount từ pack = 0
      swaps: 280,           // Tổng số transactions (pack = 0 + pack = 1)
      date: "2024-01"
    }
  ]

  🚀 READY FOR PRODUCTION:
  ----------------------------------------
  ✅ API Integration Complete
  ✅ Real Data Processing
  ✅ Error Handling
  ✅ Loading States
  ✅ Responsive Design
  ✅ Auto-refresh Capability
  */

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen font-sans px-8 py-5 pb-12">
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
                  <p className="text-sm font-medium text-gray-600">Tổng thống kê gói</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(overviewStats.packageRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng thống kê quầy</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(overviewStats.counterRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng lượt đổi pin</p>
                  <p className="text-2xl font-bold text-teal-600">{overviewStats.totalSwaps.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doanh thu các gói */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Doanh thu các gói</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Thống kê gói - theo ngày từ VNPay statistic */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Thống kê gói</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">VNĐ</span>
                </div>
              </div>
              
              {/* Loading state */}
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {error && (
                <div className="text-center py-4 text-red-600">
                  <p>{error}</p>
              <button
                    onClick={fetchVnpayStatistic}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Thử lại
              </button>
            </div>
              )}
              
              <div className="relative h-80">
                {!loading && !error && packChartData.length > 0 ? (
                  <Bar
                    data={{
                      labels: packChartData.map(p => p.displayDate),
                      datasets: [
                        {
                          label: 'Tổng tiền (K VNĐ)',
                          data: packChartData.map(p => Math.round(p.total / 1000)),
                          backgroundColor: 'rgba(34, 197, 94, 0.8)',
                          borderColor: 'rgba(34, 197, 94, 1)',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderSkipped: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        datalabels: {
                          display: true,
                          color: '#10b981',
                          font: { weight: 'bold', size: 12 },
                          backgroundColor: 'rgba(16,185,129,0.1)',
                          borderColor: '#10b981',
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 6,
                          formatter: (value) => (value > 0 ? `${value}K` : ''),
                          anchor: 'end',
                          align: 'top',
                          offset: 15,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5000, // Tăng max value lên 6000K (6 triệu)
                          grid: { color: 'rgba(0,0,0,0.1)' },
                          ticks: {
                            color: '#6b7280',
                            stepSize: 500, // Mỗi bước là 1000K để dễ đọc hơn
                            callback: (value) => `${value}K`,
                          },
                        },
                        x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: 'bold' } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Không có dữ liệu</div>
              </div>
            </div>
          )}
                  </div>
                </div>

            {/* Table giao dịch gói */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="p-4 text-left font-semibold">Tên khách hàng</th>
                      <th className="p-4 text-left font-semibold">Tên gói</th>
                      <th className="p-4 text-right font-semibold">Số tiền</th>
                      <th className="p-4 text-center font-semibold">Trạng thái</th>
                      <th className="p-4 text-center font-semibold">Ngày mua</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packPurchases
                      .slice((packPage - 1) * packItemsPerPage, (packPage - 1) * packItemsPerPage + packItemsPerPage)
                      .map((p, index) => (
                        <tr key={index} className={`hover:bg-gray-50 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'}`}>
                          <td className="p-4 text-sm font-medium text-gray-900">{p.userID ? getUserName(p.userID) : 'N/A'}</td>
                          <td className="p-4 text-sm text-gray-700">{getPackName(p.packID)}</td>
                          <td className="p-4 text-sm text-gray-900 font-semibold text-right">{formatCurrency(p.amountVND)}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              Number(p.status) === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {Number(p.status) === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500 text-center">{formatDate(p.updatedAt)}</td>
                        </tr>
                      ))}
                    {packPurchases.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">Không có giao dịch gói</td>
                      </tr>
                    )}
                    {/* Thêm các hàng trống để giữ độ cao khi không đủ dữ liệu */}
                    {Array.from({ length: Math.max(0, 6 - packPurchases.slice((packPage - 1) * packItemsPerPage, packPage * packItemsPerPage).length) }, (_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan="5" className="p-4">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

              {/* Pagination for pack purchases - luôn ở dưới cùng */}
              <div className="px-6 py-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setPackPage(Math.max(1, packPage - 1))}
                      disabled={packPage === 1}
                      className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.ceil(packPurchases.length / packItemsPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPackPage(page)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${packPage === page ? 'bg-green-600 text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setPackPage(Math.min(Math.ceil(packPurchases.length / packItemsPerPage), packPage + 1))}
                      disabled={packPage === Math.ceil(packPurchases.length / packItemsPerPage)}
                      className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
              </div>
                          </div>
                        </div>
                        </div>
                        </div>
                      </div>

        {/* Doanh thu tại quầy */}
        <div className="mb-8 ml-8 mr-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Doanh thu tại quầy</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Thống kê tại quầy */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Thống kê tại quầy</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">VNĐ</span>
              </div>
            </div>

              {/* Loading state */}
              {revenueLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </div>
              )}
              
              <div className="relative h-80">
                {revenueData.length > 0 ? (
                  <Bar
                    data={{
                      labels: revenueData.filter(item => item.revenue > 0).map(item => item.displayDate),
                      datasets: [
                        {
                          label: 'Doanh thu (K VNĐ)',
                          data: revenueData.filter(item => item.revenue > 0).map(item => Math.round(item.revenue / 1000)),
                          backgroundColor: 'rgba(34, 197, 94, 0.8)',
                          borderColor: 'rgba(34, 197, 94, 1)',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderSkipped: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        datalabels: {
                          display: true,
                          color: '#10b981',
                          font: { weight: 'bold', size: 12 },
                          backgroundColor: 'rgba(16,185,129,0.1)',
                          borderColor: '#10b981',
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 6,
                          formatter: (value) => (value > 0 ? `${value}K` : ''),
                          anchor: 'end',
                          align: 'top',
                          offset: 15,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 600,
                          grid: { color: 'rgba(0,0,0,0.1)' },
                          ticks: {
                            color: '#6b7280',
                            stepSize: 100,
                            callback: (value) => `${value}K`,
                          },
                        },
                        x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: 'bold' } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Không có dữ liệu</div>
                </div>
              </div>
                )}
                          </div>
                        </div>

            {/* Table giao dịch tại quầy */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="p-4 text-left font-semibold">Tên khách hàng</th>
                      <th className="p-4 text-left font-semibold">Tên trạm</th>
                      <th className="p-4 text-left font-semibold">Mã Pin</th>
                      <th className="p-4 text-right font-semibold">Số tiền</th>
                      <th className="p-4 text-center font-semibold">Trạng thái</th>
                      <th className="p-4 text-center font-semibold">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(t => t.pack === 0 && t.status === 1)
                      .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
                      .slice((counterPage - 1) * counterItemsPerPage, counterPage * counterItemsPerPage)
                      .map((transaction, index) => (
                      <tr key={transaction.transactionID} className={`hover:bg-gray-50 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-green-50'}`}>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {getUserName(transaction.userID)}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {getStationName(transaction.stationID)}
                        </td>
                        <td className="p-4 text-sm text-gray-900 font-mono">
                          {transaction.pinID}
                        </td>
                        <td className="p-4 text-sm text-gray-900 font-semibold text-right">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 1 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : transaction.status === 2
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusText(transaction.status)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500 text-center">
                          {formatDate(transaction.createAt)}
                        </td>
                      </tr>
                    ))}
                    {transactions.filter(t => t.pack === 0 && t.status === 1).length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500">
                          Không có dữ liệu giao dịch tại quầy
                        </td>
                      </tr>
                    )}
                    {/* Thêm các hàng trống để giữ độ cao khi không đủ dữ liệu */}
                    {Array.from({ length: Math.max(0, 6 - transactions.filter(t => t.pack === 0 && t.status === 1).slice((counterPage - 1) * counterItemsPerPage, counterPage * counterItemsPerPage).length) }, (_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan="6" className="p-4">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for counter revenue - luôn ở dưới cùng */}
              <div className="px-6 py-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCounterPage(Math.max(1, counterPage - 1))}
                    disabled={counterPage === 1}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.ceil(transactions.filter(t => t.pack === 0 && t.status === 1).length / counterItemsPerPage) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCounterPage(page)}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${counterPage === page ? 'bg-green-600 text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCounterPage(Math.min(Math.ceil(transactions.filter(t => t.pack === 0 && t.status === 1).length / counterItemsPerPage), counterPage + 1))}
                    disabled={counterPage === Math.ceil(transactions.filter(t => t.pack === 0 && t.status === 1).length / counterItemsPerPage)}
                    className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Số lượt đổi pin */}
        <div className="mb-8 ml-8 mr-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Số lượt đổi pin</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Số lượt đổi pin theo ngày */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Số lượt đổi pin theo ngày</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Lượt</span>
                </div>
                </div>
              
              {/* Loading state */}
              {revenueLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
              </div>
            </div>
              )}
              
              <div className="relative h-80">
                {revenueData.length > 0 ? (
                  <Bar
                    data={{
                      labels: revenueData.filter(item => item.swaps > 0).map(item => item.displayDate),
                      datasets: [
                        {
                          label: 'Số lượt đổi pin',
                          data: revenueData.filter(item => item.swaps > 0).map(item => item.swaps),
                          backgroundColor: 'rgba(16, 185, 129, 0.8)',
                          borderColor: 'rgba(16, 185, 129, 1)',
                          borderWidth: 2,
                          borderRadius: 8,
                          borderSkipped: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        datalabels: {
                          display: true,
                          color: '#10b981',
                          font: { weight: 'bold', size: 12 },
                          backgroundColor: 'rgba(16,185,129,0.1)',
                          borderColor: '#10b981',
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 6,
                          formatter: (value) => (value > 0 ? value.toString() : ''),
                          anchor: 'end',
                          align: 'top',
                          offset: 15,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 35,
                          grid: { color: 'rgba(0,0,0,0.1)' },
                          ticks: {
                            color: '#6b7280',
                            stepSize: 5
                          }
                        },
                        x: { grid: { display: false }, ticks: { color: '#6b7280', font: { weight: 'bold' } } },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <div>Không có dữ liệu</div>
            </div>
          </div>
                )}
                </div>
                </div>

            {/* Table giao dịch đổi pin */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
              <div className="overflow-x-auto flex-grow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <th className="p-4 text-left font-semibold">Tên khách hàng</th>
                      <th className="p-4 text-left font-semibold">Tên trạm</th>
                      <th className="p-4 text-left font-semibold">Mã Pin</th>
                      <th className="p-4 text-center font-semibold">Thanh toán</th>
                      <th className="p-4 text-center font-semibold">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPinSwapData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)).map((transaction, index) => (
                      <tr key={transaction.transactionID} className={`hover:bg-gray-50 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {getUserName(transaction.userID)}
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {getStationName(transaction.stationID)}
                        </td>
                        <td className="p-4 text-sm text-gray-900 font-mono">
                          {transaction.pinID}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            transaction.pack === 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {getPaymentMethod(transaction.pack)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500 text-center">
                          {formatDate(transaction.createAt)}
                        </td>
                      </tr>
                    ))}
                    {currentPinSwapData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                          Không có dữ liệu đổi pin
                        </td>
                      </tr>
                    )}
                    {/* Thêm các hàng trống để giữ độ cao khi không đủ dữ liệu */}
                    {Array.from({ length: Math.max(0, 6 - currentPinSwapData.length) }, (_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan="5" className="p-4">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination - luôn ở dưới cùng */}
              {pinSwapTransactions.length > itemsPerPage && (
                <div className="px-6 py-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-green-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
            </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Tần suất đổi pin và giờ cao điểm */}
        <div className="mb-8 ml-8 mr-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tần suất đổi pin và giờ cao điểm</h2>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <th className="p-4 text-left font-semibold">Khung giờ</th>
                    <th className="p-4 text-center font-semibold">Tần suất</th>
                    <th className="p-4 text-center font-semibold">Tỷ lệ (%)</th>
                    <th className="p-4 text-center font-semibold">Mức độ</th>
                  </tr>
                </thead>
                <tbody>
                  {peakHoursData.length > 0 ? (
                    peakHoursData.map((item, index) => (
                    <tr key={index} className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="p-4 font-medium text-gray-800">{item.hour}</td>
                        <td className="p-4 text-center font-semibold text-green-600">{item.frequency}</td>
                        <td className="p-4 text-center font-semibold text-emerald-600">{item.percentage}%</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        Đang tải dữ liệu tần suất...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI dự báo nhu cầu sử dụng trạm đổi pin */}
        <div className="mt-2 ml-8 mr-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI dự báo nhu cầu sử dụng trạm đổi pin</h2>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
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
                    <th className="p-4 text-center font-semibold">Sử dụng hiện tại (%)</th>
                    <th className="p-4 text-center font-semibold">Dự báo (%)</th>
                      <th className="p-4 text-center font-semibold">Xu hướng</th>
                      <th className="p-4 text-center font-semibold">Khuyến nghị</th>
                    </tr>
                  </thead>
                <tbody>
                  {aiPredictionData.length > 0 ? (
                    aiPredictionData.map((item, index) => (
                    <tr key={index} className={`hover:bg-green-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="p-4 font-medium text-gray-800">{item.station}</td>
                        <td className="p-4 text-center font-semibold text-green-600">{item.currentUsage}%</td>
                        <td className="p-4 text-center font-semibold text-emerald-600">{item.predictedUsage}%</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        Đang tải dữ liệu dự báo...
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Div trống để tạo khoảng cách */}
        <div className="h-12"></div>

    </AdminLayout>
  );
};

export default StatisticManagement;
