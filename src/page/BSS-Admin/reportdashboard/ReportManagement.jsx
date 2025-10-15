import React, { useState, useEffect } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [reportToAssign, setReportToAssign] = useState(null);
  const [reportToResolve, setReportToResolve] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [resolution, setResolution] = useState("");

  const [staffMembers, setStaffMembers] = useState([]);

  // Load reports from API
  useEffect(() => {
    loadReports();
    loadStaff();
  }, []);

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
          reporterID: report.reporterID,
          handlerID: report.handlerID,
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
          assignedTo: report.handlerID ? `Handler #${report.handlerID}` : null,
          displayStatus: getDisplayStatus(report.status, report.statusName, report.validStatus)
        }));
        
        setReports(mappedReports);
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

  // Helper functions
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
    // Use statusName if available, otherwise use status
    if (statusName) {
      switch (statusName.toLowerCase()) {
        case "pending": return "pending";
        case "reading": return "in_progress";
        case "resolved": return "resolved";
        default: return status || "pending";
      }
    }
    return status || "pending";
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
      case "resolved": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-yellow-100 text-yellow-800";
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

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
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
          stats={[
            { label: "Tổng báo cáo", value: reports.length, color: "bg-blue-400" },
            { label: "Chờ xử lý", value: reports.filter(r => r.displayStatus === "pending").length, color: "bg-yellow-400" },
            { label: "Đang xử lý", value: reports.filter(r => r.displayStatus === "in_progress").length, color: "bg-blue-400" },
            { label: "Đã giải quyết", value: reports.filter(r => r.displayStatus === "resolved").length, color: "bg-green-400" }
          ]}
        />


        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách Report</h2>
                <p className="text-gray-600">Quản lý và xử lý các báo cáo từ khách hàng</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Tổng: {reports.length} báo cáo
                    </span>
                  </div>
                </div>
                <button
                  onClick={loadReports}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      ID
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
                      Người xử lý
                  </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Xác thực
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
                {reports.map((report, index) => (
                    <tr 
                      key={report.id} 
                      className={`hover:bg-indigo-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {report.id}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              #{report.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.type || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Loại báo cáo */}
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.reportType)}`}>
                            {report.typeName || report.type || 'Khác'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Type: {report.type}
                          </div>
                        </div>
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
                      <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Reporter #{report.reporterID || 'N/A'}
                          </div>
                        </div>
                      </td>
                      
                      {/* Người xử lý */}
                      <td className="px-6 py-4">
                        <div>
                          {report.handlerID ? (
                            <div className="text-sm font-semibold text-gray-900">
                              Handler #{report.handlerID}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              Chưa phân công
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Xác thực */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">Reporter:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.validReporter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {report.validReporter ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">Type:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.validType ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {report.validType ? '✓' : '✗'}
                      </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">Desc:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.validDescription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {report.validDescription ? '✓' : '✗'}
                      </span>
                          </div>
                        </div>
                    </td>
                      
                      {/* Trạng thái */}
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.displayStatus)}`}>
                            {report.statusName || getStatusLabel(report.displayStatus)}
                      </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Status: {report.status}
                          </div>
                        </div>
                    </td>
                      
                      {/* Ngày tạo */}
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {report.createdAt}
                    </td>
                      
                      {/* Hành động */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetail(report)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="Xem chi tiết"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          {report.displayStatus === "pending" && (
                            <button
                              onClick={() => handleAssignReport(report)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Phân công"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                          </button>
                        )}
                          {report.displayStatus === "in_progress" && (
                          <button
                            onClick={() => handleResolveReport(report)}
                              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200"
                              title="Giải quyết"
                          >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                          </button>
                        )}
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
          {!loading && !error && reports.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có báo cáo</h3>
              <p className="mt-1 text-sm text-gray-500">Chưa có báo cáo nào từ khách hàng.</p>
            </div>
          )}
            </div>

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
                          <span className="text-gray-900 font-semibold">#{selectedReport.id}</span>
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
                          <span className="font-medium">Reporter ID:</span>
                          <span className="text-gray-700">#{selectedReport.reporterID || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Handler ID:</span>
                          <span className="text-gray-700">
                            {selectedReport.handlerID ? `#${selectedReport.handlerID}` : 'Chưa phân công'}
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
                          <span className="font-medium">Status:</span>
                          <span className="text-gray-700">{selectedReport.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Status Name:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedReport.displayStatus)}`}>
                            {selectedReport.statusName || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Valid Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedReport.validStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validStatus ? 'Có' : 'Không'}
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
                          <div className="text-sm font-medium text-gray-600 mb-2">Valid Reporter</div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedReport.validReporter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validReporter ? '✓ Hợp lệ' : '✗ Không hợp lệ'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm font-medium text-gray-600 mb-2">Valid Type</div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${selectedReport.validType ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedReport.validType ? '✓ Hợp lệ' : '✗ Không hợp lệ'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border">
                          <div className="text-sm font-medium text-gray-600 mb-2">Valid Description</div>
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
      </div>
    </AdminLayout>
  );
};

export default AdminReportManagement;
