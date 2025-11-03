import React, { useState, useEffect } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminReportManagement = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("reports");
  
  // Reports state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stations, setStations] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sort state
  const [sortOrder, setSortOrder] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Filter state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showReportFilterDropdown, setShowReportFilterDropdown] = useState(false);
  const [reportStatusFilter, setReportStatusFilter] = useState("all");

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [reportToAssign, setReportToAssign] = useState(null);
  const [reportToResolve, setReportToResolve] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [resolution, setResolution] = useState("");

  const [staffMembers, setStaffMembers] = useState([]);
  const [users, setUsers] = useState([]);

  // Load data from API
  useEffect(() => {
    loadUsers();
    loadReports();
    loadStaff();
    loadStations();
    loadTransactions();
  }, []);

  // Load transactions when tab changes to transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      loadTransactions();
    }
  }, [activeTab]);

  // Reset pagination when status filter or sort order changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortOrder, reportStatusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortDropdown && !event.target.closest('.sort-dropdown')) {
        setShowSortDropdown(false);
      }
      if (showFilterDropdown && !event.target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
      if (showReportFilterDropdown && !event.target.closest('.report-filter-dropdown')) {
        setShowReportFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown, showFilterDropdown, showReportFilterDropdown]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllReports(1); // adminID = 1
      
      if (response.status === "success" && response.data) {
        // Map API data to component format
        const mappedReports = response.data.map(report => ({
          id: report.id,
          type: report.type,
          description: report.description,
          reporterID: report.reporterId || report.reporterID, // API trả về reporterId (chữ thường)
          handlerID: report.handlerId || report.handlerID, // API trả về handlerId (chữ thường)
          createdAt: formatDateTime(report.createdAt),
          status: report.status,
          // Validation fields
          validReporter: report.validReporter,
          validType: report.validType,
          validDescription: report.validDescription,
          // Type and Status names
          typeName: report.typeName,
          validStatus: report.validStatus,
          statusName: report.statusName,
          // Derived fields for UI
          reportType: report.typeName || report.type || "Khác",
          assignedTo: report.handlerId || report.handlerID ? `Handler #${report.handlerId || report.handlerID}` : null,
          displayStatus: getDisplayStatus(report.status, report.statusName, report.validStatus)
        }));
        
        // Sắp xếp từ cũ nhất đến mới nhất (dựa vào createdAt)
        const sortedReports = mappedReports.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB; // Cũ nhất trước
        });
        
        console.log("📋 Sorted reports:", sortedReports);
        console.log("📋 First report status:", sortedReports[0]?.status, "displayStatus:", sortedReports[0]?.displayStatus);
        setReports(sortedReports);
      } else {
        setError("Không thể tải danh sách báo cáo");
      }
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Lỗi khi tải danh sách báo cáo");
      showError("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.listDrivers();
      console.log("📋 Users API response:", response);
      if (response.status === "success" && response.data) {
        console.log("📋 Users data:", response.data);
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await apiService.listStaff();
      if (response.status === "success" && response.data) {
        const staffList = response.data.map(staff => staff.name).filter(Boolean);
        setStaffMembers(staffList);
      }
    } catch (err) {
      console.error("Error loading staff:", err);
    }
  };

  const loadStations = async () => {
    try {
      const response = await apiService.getStations();
      if (response.status === "success" && response.data) {
        setStations(response.data);
      }
    } catch (err) {
      console.error("Error loading stations:", err);
    }
  };

  const loadTransactions = async () => {
    try {
      setTransactionLoading(true);
      setTransactionError(null);
      const response = await apiService.getTransactions();
      
      if (response.status === "success" && response.data) {
        setTransactions(response.data);
      } else {
        setTransactionError("Không thể tải danh sách giao dịch");
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactionError("Lỗi khi tải danh sách giao dịch");
    } finally {
      setTransactionLoading(false);
    }
  };

  // Helper functions
  const getUserName = (userID) => {
    console.log("🔍 Looking for userID:", userID);
    console.log("🔍 Available users:", users);
    const user = users.find(u => u.userID === userID);
    console.log("🔍 Found user:", user);
    return user ? user.name : `User #${userID}`;
  };
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getDisplayStatus = (status, statusName, validStatus) => {
    // Map status number to display status string
    // Status: 0 = Pending, 1 = InProgress, 2 = Resolved
    if (typeof status === 'number') {
      switch (status) {
        case 0: return "pending";
        case 1: return "in_progress";
        case 2: return "resolved";
        default: return "pending";
      }
    }
    
    // Fallback: Use statusName if available
    if (statusName) {
      switch (statusName.toLowerCase()) {
        case "pending": return "pending";
        case "reading": return "in_progress";
        case "inprogress": return "in_progress";
        case "resolved": return "resolved";
        default: return "pending";
      }
    }
    
    return "pending";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "urgent": return "Khẩn cấp";
      case "high": return "Cao";
      case "normal": return "Bình thường";
      case "low": return "Thấp";
      default: return "Bình thường";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "bg-blue-100 text-blue-800"; // Status 2 - Đã giải quyết (xanh dương)
      case "in_progress": return "bg-yellow-100 text-yellow-800"; // Status 1 - Đang xử lý (vàng)
      case "pending": return "bg-red-100 text-red-800"; // Status 0 - Chờ xử lý (đỏ)
      default: return "bg-red-100 text-red-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "resolved": return "Đã giải quyết";
      case "in_progress": return "Đang xử lý";
      case "pending": return "Chờ xử lý";
      default: return "Chờ xử lý";
    }
  };

  const getReportTypeColor = (type) => {
    switch (type) {
      case "Lỗi kỹ thuật": return "bg-red-100 text-red-800";
      case "Góp ý dịch vụ": return "bg-blue-100 text-blue-800";
      case "Khiếu nại": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Transaction helper functions
  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 0: return "bg-yellow-100 text-yellow-800"; // Pending
      case 1: return "bg-green-100 text-green-800"; // Completed
      case 2: return "bg-red-100 text-red-800"; // Expired
      case 3: return "bg-gray-100 text-gray-800"; // Canceled
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionStatusLabel = (status) => {
    switch (status) {
      case 0: return "Chờ xử lý";
      case 1: return "Hoàn thành";
      case 2: return "Hết hạn";
      case 3: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  const getStationName = (stationID) => {
    const station = stations.find(s => s.stationID === stationID);
    return station ? station.stationName : `Trạm ${stationID}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Filter transactions based on status
  const getFilteredTransactions = () => {
    if (statusFilter === "all") {
      return transactions;
    }
    return transactions.filter(t => t.status === parseInt(statusFilter));
  };

  // Filter reports based on status
  const getFilteredReports = () => {
    if (reportStatusFilter === "all") {
      return reports;
    }
    return reports.filter(r => r.displayStatus === reportStatusFilter);
  };

  // Get sorted and paginated transactions
  const getPaginatedTransactions = () => {
    const filtered = getFilteredTransactions();
    
    // Sort transactions based on sortOrder
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createAt);
      const dateB = new Date(b.createAt);
      
      if (sortOrder === "newest") {
        return dateB - dateA; // Mới nhất trước
      } else {
        return dateA - dateB; // Cũ nhất trước
      }
    });
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = getFilteredTransactions();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pages = [];
    
    // Hiển thị tất cả các trang
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };
  
  // AnhKietdeptrai nhat the gioi 
  // 24h1234567890
  
  // Show confirmation modal before updating status
  const handleUpdateStatusClick = (report, newStatus) => {
    setConfirmAction({ report, newStatus });
    setShowConfirmModal(true);
  };

  // Update report status: 0 (Pending) -> 1 (InProgress) -> 2 (Resolved)
  const handleUpdateStatus = async () => {
    if (!confirmAction) return;
    
    const { report, newStatus } = confirmAction;
    const statusText = newStatus === 1 ? "xác nhận" : "xử lý";
    
    try {
      // Call API to update status
      const response = await apiService.updateReportStatus(report.id, newStatus, 1); // adminID = 1
      
      if (response.status === "success") {
        showSuccess(`Đã ${statusText} báo cáo thành công!`);
        // Reload reports to get updated data
        await loadReports();
        setShowConfirmModal(false);
        setConfirmAction(null);
      } else {
        showError(`Không thể ${statusText} báo cáo`);
      }
    } catch (err) {
      console.error("Error updating report status:", err);
      showError(`Lỗi khi ${statusText} báo cáo`);
    }
  };

  const cancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleAssignReport = (report) => {
    setReportToAssign(report);
    setAssignedTo(report.assignedTo || "");
    setShowAssignModal(true);
  };

  const handleResolveReport = (report) => {
    setReportToResolve(report);
    setResolution(report.resolution || "");
    setShowResolveModal(true);
  };

  const confirmAssign = () => {
    if (reportToAssign && assignedTo) {
      setReports(reports.map(report => 
        report.id === reportToAssign.id 
          ? { ...report, assignedTo, status: "in_progress", updatedAt: new Date().toLocaleString("vi-VN") }
          : report
      ));
      showSuccess("Đã phân công report thành công!");
      setShowAssignModal(false);
      setReportToAssign(null);
      setAssignedTo("");
    }
  };

  const confirmResolve = () => {
    if (reportToResolve && resolution) {
      setReports(reports.map(report => 
        report.id === reportToResolve.id 
          ? { ...report, status: "resolved", resolution, updatedAt: new Date().toLocaleString("vi-VN") }
          : report
      ));
      showSuccess("Đã giải quyết report thành công!");
      setShowResolveModal(false);
      setReportToResolve(null);
      setResolution("");
    }
  };

  const cancelAssign = () => {
    setShowAssignModal(false);
    setReportToAssign(null);
    setAssignedTo("");
  };

  const cancelResolve = () => {
    setShowResolveModal(false);
    setReportToResolve(null);
    setResolution("");
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Quản lý Báo cáo"
          subtitle="Quản lý và xử lý các báo cáo từ khách hàng"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          stats={activeTab === "reports" ? [
            { label: "Tổng báo cáo", value: reports.length, color: "bg-green-400" },
            { label: "Chờ xử lý", value: reports.filter(r => r.displayStatus === "pending").length, color: "bg-yellow-400" },
            { label: "Đang xử lý", value: reports.filter(r => r.displayStatus === "in_progress").length, color: "bg-emerald-400" },
            { label: "Đã giải quyết", value: reports.filter(r => r.displayStatus === "resolved").length, color: "bg-teal-400" }
          ] : [
            { label: "Tổng giao dịch", value: transactions.length, color: "bg-green-400" },
            { label: "Hoàn thành", value: transactions.filter(t => t.status === 1).length, color: "bg-emerald-400" },
            { label: "Chờ xử lý", value: transactions.filter(t => t.status === 0).length, color: "bg-yellow-400" },
            { label: "Hết hạn", value: transactions.filter(t => t.status === 2).length, color: "bg-red-400" }
          ]}
        />

        {/* Tab Navigation with Action Buttons */}
        <div className="flex items-center justify-between mb-6">
        {/* Tab Navigation */}
          <div className="bg-gray-100 rounded-lg p-1 inline-block">
            <div className="flex">
            <button
              onClick={() => setActiveTab("reports")}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "reports"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Báo cáo ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
                className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "transactions"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Giao dịch ({transactions.length})
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Report Status Filter Dropdown - Only show for reports tab */}
            {activeTab === "reports" && (
              <div className="relative report-filter-dropdown">
                <button
                  onClick={() => setShowReportFilterDropdown(!showReportFilterDropdown)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {reportStatusFilter === "all" ? "Tất cả trạng thái" : 
                     reportStatusFilter === "pending" ? "Chờ xử lý" :
                     reportStatusFilter === "in_progress" ? "Đang xử lý" : "Đã giải quyết"}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showReportFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Report Filter Dropdown Menu */}
                {showReportFilterDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setReportStatusFilter("all");
                          setShowReportFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          reportStatusFilter === "all" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Tất cả trạng thái</span>
                        </div>
                        {reportStatusFilter === "all" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setReportStatusFilter("pending");
                          setShowReportFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          reportStatusFilter === "pending" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <span>Chờ xử lý</span>
                        </div>
                        {reportStatusFilter === "pending" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setReportStatusFilter("in_progress");
                          setShowReportFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          reportStatusFilter === "in_progress" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <span>Đang xử lý</span>
                        </div>
                        {reportStatusFilter === "in_progress" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setReportStatusFilter("resolved");
                          setShowReportFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          reportStatusFilter === "resolved" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span>Đã giải quyết</span>
                        </div>
                        {reportStatusFilter === "resolved" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Filter Dropdown - Only show for transactions tab */}
            {activeTab === "transactions" && (
              <div className="relative filter-dropdown">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                  <span className="text-sm font-medium">
                    {statusFilter === "all" ? "Tất cả trạng thái" : 
                     statusFilter === "0" ? "Chờ xử lý" :
                     statusFilter === "1" ? "Hoàn thành" :
                     statusFilter === "2" ? "Hết hạn" : "Đã hủy"}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Filter Dropdown Menu */}
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          statusFilter === "all" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Tất cả trạng thái</span>
              </div>
                        {statusFilter === "all" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
            </button>
                      <button
                        onClick={() => {
                          setStatusFilter("0");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          statusFilter === "0" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <span>Chờ xử lý</span>
          </div>
                        {statusFilter === "0" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("1");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          statusFilter === "1" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span>Hoàn thành</span>
        </div>
                        {statusFilter === "1" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("2");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          statusFilter === "2" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <span>Hết hạn</span>
                        </div>
                        {statusFilter === "2" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("3");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          statusFilter === "3" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          <span>Đã hủy</span>
                        </div>
                        {statusFilter === "3" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sort Dropdown - Only show for transactions tab */}
            {activeTab === "transactions" && (
              <div className="relative sort-dropdown">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span className="text-sm font-medium">
                    {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortOrder("newest");
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          sortOrder === "newest" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>Mới nhất</span>
              </div>
                        {sortOrder === "newest" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("oldest");
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-green-50 transition-colors ${
                          sortOrder === "oldest" ? "bg-green-50 text-green-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>Cũ nhất</span>
                        </div>
                        {sortOrder === "oldest" && (
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Total Count */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Tổng: {activeTab === "reports" ? getFilteredReports().length : transactions.length} {activeTab === "reports" ? "báo cáo" : "giao dịch"}
                </span>
                  </div>
                </div>
            
            {/* Refresh Button */}
                <button
              onClick={activeTab === "reports" ? loadReports : loadTransactions}
              disabled={activeTab === "reports" ? loading : transactionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
              <svg className={`w-4 h-4 ${(activeTab === "reports" ? loading : transactionLoading) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
              <span>{(activeTab === "reports" ? loading : transactionLoading) ? 'Đang tải...' : 'Làm mới'}</span>
                </button>
            </div>
          </div>

        {/* Content based on active tab */}
        {activeTab === "reports" ? (
          /* Reports Table */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="text-gray-600">Đang tải danh sách báo cáo...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <button
                  onClick={loadReports}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Loại báo cáo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Người báo cáo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                  </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {getFilteredReports().map((report, index) => (
                    <tr 
                      key={report.id} 
                      className={`hover:bg-green-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* STT */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 text-center">
                          {index + 1}
                        </div>
                      </td>
                      
                      {/* Loại báo cáo */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.reportType)}`}>
                          {report.typeName || report.type || 'Khác'}
                        </span>
                      </td>
                      
                      {/* Mô tả */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          <div className="truncate" title={report.description}>
                            {report.description || 'Không có mô tả'}
                          </div>
                        </div>
                      </td>
                      
                      {/* Người báo cáo */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {report.reporterID ? getUserName(report.reporterID) : 'N/A'}
                        </div>
                      </td>
                      
                      {/* Trạng thái */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.displayStatus)}`}>
                          {getStatusLabel(report.displayStatus)}
                        </span>
                      </td>
                      
                      {/* Ngày tạo */}
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {report.createdAt}
                    </td>
                      
                      {/* Hành động */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Nút xem chi tiết - hiển thị với mọi trạng thái */}
                          <button
                            onClick={() => handleViewDetail(report)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-sm"
                            title="Xem chi tiết"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          {/* Status 0 (Pending) - Nút Xác nhận (chuyển sang status 1) */}
                          {report.displayStatus === "pending" && (
                            <button
                              onClick={() => handleUpdateStatusClick(report, 1)}
                              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 shadow-sm"
                              title="Xác nhận báo cáo"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Status 1 (InProgress) - Nút Đã xử lý (chuyển sang status 2) */}
                          {report.displayStatus === "in_progress" && (
                            <button
                              onClick={() => handleUpdateStatusClick(report, 2)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm"
                              title="Đánh dấu đã xử lý"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Status 2 (Resolved) - Không có nút thêm, chỉ xem chi tiết */}
                        </div>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && getFilteredReports().length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có báo cáo</h3>
              <p className="mt-1 text-sm text-gray-500">Chưa có báo cáo nào từ khách hàng.</p>
            </div>
          )}
            </div>
        ) : (
          /* Transactions Table */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Loading State */}
            {transactionLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="text-gray-600">Đang tải danh sách giao dịch...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {transactionError && !transactionLoading && (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500">{transactionError}</p>
                <div className="mt-6">
                  <button
                    onClick={loadTransactions}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            {!transactionLoading && !transactionError && (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                          STT
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Tên trạm
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          Mã Pin
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                          Ngày tạo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {getPaginatedTransactions().map((transaction, index) => (
                        <tr 
                          key={transaction.transactionID} 
                          className={`hover:bg-green-50 transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          {/* STT */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900 text-center">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                          </td>
                          
                          {/* Khách hàng */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {getUserName(transaction.userID)}
                            </div>
                          </td>
                          
                          {/* Tên trạm */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {getStationName(transaction.stationID)}
                            </div>
                          </td>
                          
                          {/* Mã Pin */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-mono text-gray-900">
                              {transaction.pinID}
                            </div>
                          </td>
                          
                          {/* Số tiền */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900 text-right">
                              {formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          
                          {/* Loại */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.pack === 0 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {transaction.pack === 0 ? 'Tại quầy' : 'Gói dịch vụ'}
                            </span>
                          </td>
                          
                          {/* Trạng thái */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTransactionStatusColor(transaction.status)}`}>
                              {getTransactionStatusLabel(transaction.status)}
                            </span>
                          </td>
                          
                          {/* Ngày tạo */}
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium text-center">
                            {formatDateTime(transaction.createAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!transactionLoading && !transactionError && getFilteredTransactions().length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có giao dịch</h3>
                <p className="mt-1 text-sm text-gray-500">Chưa có giao dịch nào trong hệ thống.</p>
              </div>
            )}

            {/* Pagination */}
            {!transactionLoading && !transactionError && getFilteredTransactions().length > 0 && (
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  {/* Pagination Info */}
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, getFilteredTransactions().length)} - {Math.min(currentPage * itemsPerPage, getFilteredTransactions().length)} trong tổng số {getFilteredTransactions().length} giao dịch
                    </span>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-green-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === getTotalPages()}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Chi tiết Report #{selectedReport.id}
                  </h2>
                  <button
                    onClick={closeDetailModal}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                      </div>
                    </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Report ID:</span>
                          <span className="text-gray-900 font-semibold">{selectedReport.id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Type:</span>
                          <span className="text-gray-700">{selectedReport.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Type Name:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getReportTypeColor(selectedReport.typeName)}`}>
                            {selectedReport.typeName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Người báo cáo:</span>
                          <span className="text-gray-700">
                            {selectedReport.reporterID ? getUserName(selectedReport.reporterID) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Trạng thái</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Handler:</span>
                          <span className="text-gray-700">
                            {selectedReport.handlerID ? 'Admin' : 'Chưa phân công'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Valid Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedReport.validStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validStatus ? 'Có' : 'Không'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Trạng thái:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedReport.displayStatus)}`}>
                            {getStatusLabel(selectedReport.displayStatus)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Ngày tạo:</span>
                          <span className="text-gray-700">{selectedReport.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation Details */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết xác thực</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm font-medium text-gray-600 mb-2">Người báo cáo hợp lệ</div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedReport.validReporter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validReporter ? '✓ Hợp lệ' : '✗ Không hợp lệ'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm font-medium text-gray-600 mb-2">Loại báo cáo hợp lệ</div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedReport.validType ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validType ? '✓ Hợp lệ' : '✗ Không hợp lệ'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm font-medium text-gray-600 mb-2">Mô tả hợp lệ</div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedReport.validDescription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validDescription ? '✓ Hợp lệ' : '✗ Không hợp lệ'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Nội dung báo cáo</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Mô tả chi tiết:</span>
                          <div className="mt-2 p-3 bg-white rounded border">
                            <p className="text-gray-800 leading-relaxed">
                              {selectedReport.description || 'Không có mô tả'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handler Info */}
                  {selectedReport.handlerID && (
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Thông tin xử lý</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <div><span className="font-medium">Được phân công cho:</span> Handler #{selectedReport.handlerID}</div>
                          <div><span className="font-medium">Trạng thái xử lý:</span> {selectedReport.statusName}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && reportToAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Phân công Report #{reportToAssign.id}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phân công cho
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Chọn nhân viên</option>
                    {staffMembers.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                  </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelAssign}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmAssign}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Phân công
                  </button>
                      </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {showResolveModal && reportToResolve && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Giải quyết Report #{reportToResolve.id}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giải pháp
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập giải pháp đã thực hiện..."
                  />
                  </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelResolve}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmResolve}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Giải quyết
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Status Update Modal */}
        {showConfirmModal && confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.268 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {confirmAction.newStatus === 1 ? 'Xác nhận báo cáo' : 'Đánh dấu đã xử lý'}
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center mb-6">
                  Bạn có chắc chắn muốn {confirmAction.newStatus === 1 ? 'xác nhận' : 'đánh dấu đã xử lý'} báo cáo này không?
                </p>

                {/* Report Info Card */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        Report #{confirmAction.report.id}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {confirmAction.report.typeName || confirmAction.report.type}
                      </p>
                      {confirmAction.newStatus === 2 && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center text-xs text-blue-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Báo cáo sẽ được đánh dấu là đã giải quyết và bất đầu hoạt động bình thường.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={cancelConfirm}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors ${
                      confirmAction.newStatus === 1 
                        ? 'bg-yellow-500 hover:bg-yellow-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {confirmAction.newStatus === 1 ? 'Xác nhận' : 'Đã xử lý'}
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

export default AdminReportManagement;
