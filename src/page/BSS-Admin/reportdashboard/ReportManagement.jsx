import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError } from "../../../utils/toast";

const AdminReportManagement = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      customerName: "Lê Văn C",
      customerEmail: "levanc@email.com",
      customerPhone: "0901234567",
      stationId: "BSS-001",
      stationName: "Trạm Quận 1",
      reportType: "Lỗi kỹ thuật",
      title: "Pin không sạc được",
      description: "Pin không sạc được, màn hình hiển thị lỗi E001. Đã thử nhiều lần nhưng vẫn không được.",
      priority: "high",
      status: "pending",
      createdAt: "15/01/2024 16:00",
      updatedAt: "15/01/2024 16:00",
      assignedTo: null,
      resolution: null,
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      customerEmail: "tranthib@email.com",
      customerPhone: "0902345678",
      stationId: "BSS-002",
      stationName: "Trạm Quận 2",
      reportType: "Góp ý dịch vụ",
      title: "Thời gian chờ quá lâu",
      description: "Thời gian chờ quá lâu, cần cải thiện tốc độ xử lý. Khách hàng phải chờ hơn 30 phút.",
      priority: "normal",
      status: "in_progress",
      createdAt: "15/01/2024 15:15",
      updatedAt: "15/01/2024 15:30",
      assignedTo: "Nguyễn Văn A",
      resolution: null,
    },
    {
      id: 3,
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@email.com",
      customerPhone: "0903456789",
      stationId: "BSS-001",
      stationName: "Trạm Quận 1",
      reportType: "Lỗi kỹ thuật",
      title: "Máy đổi pin bị kẹt",
      description: "Máy đổi pin bị kẹt, không thể lấy pin ra. Pin bị mắc kẹt trong slot 3.",
      priority: "urgent",
      status: "resolved",
      createdAt: "15/01/2024 14:30",
      updatedAt: "15/01/2024 16:45",
      assignedTo: "Lê Văn Tech",
      resolution: "Đã khắc phục bằng cách reset hệ thống. Pin đã được lấy ra thành công.",
    },
    {
      id: 4,
      customerName: "Phạm Thị D",
      customerEmail: "phamthid@email.com",
      customerPhone: "0904567890",
      stationId: "BSS-003",
      stationName: "Trạm Quận 3",
      reportType: "Khiếu nại",
      title: "Phí dịch vụ không đúng",
      description: "Bị tính phí 150k thay vì 100k như thông báo. Cần kiểm tra lại hệ thống tính phí.",
      priority: "high",
      status: "pending",
      createdAt: "15/01/2024 13:20",
      updatedAt: "15/01/2024 13:20",
      assignedTo: null,
      resolution: null,
    },
    {
      id: 5,
      customerName: "Hoàng Văn E",
      customerEmail: "hoangvane@email.com",
      customerPhone: "0905678901",
      stationId: "BSS-002",
      stationName: "Trạm Quận 2",
      reportType: "Góp ý dịch vụ",
      title: "Cần thêm trạm ở khu vực",
      description: "Khu vực này cần thêm trạm đổi pin. Hiện tại chỉ có 1 trạm, không đủ phục vụ.",
      priority: "low",
      status: "in_progress",
      createdAt: "15/01/2024 12:10",
      updatedAt: "15/01/2024 14:00",
      assignedTo: "Trần Văn Manager",
      resolution: null,
    },
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [reportToAssign, setReportToAssign] = useState(null);
  const [reportToResolve, setReportToResolve] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [resolution, setResolution] = useState("");

  const staffMembers = [
    "Nguyễn Văn A",
    "Lê Văn Tech",
    "Trần Văn Manager",
    "Phạm Văn Support",
    "Hoàng Văn Engineer",
  ];

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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Quản lý Report</h1>
                      <p className="text-white text-opacity-90 text-sm">
                        Quản lý các báo cáo và phản hồi từ khách hàng
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
                        <span className="text-xs font-medium">Tổng report: {reports.length}</span>
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

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan report
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng report
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {reports.length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Chờ xử lý
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {reports.filter(r => r.status === "pending").length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang xử lý
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {reports.filter(r => r.status === "in_progress").length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đã giải quyết
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {reports.filter(r => r.status === "resolved").length}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách Report</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ ưu tiên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <tr key={report.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.stationId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.stationName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {report.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {getPriorityLabel(report.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Xem
                        </button>
                        {report.status === "pending" && (
                          <button
                            onClick={() => handleAssignReport(report)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Phân công
                          </button>
                        )}
                        {report.status === "in_progress" && (
                          <button
                            onClick={() => handleResolveReport(report)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Giải quyết
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
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin khách hàng</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div><span className="font-medium">Tên:</span> {selectedReport.customerName}</div>
                        <div><span className="font-medium">Email:</span> {selectedReport.customerEmail}</div>
                        <div><span className="font-medium">SĐT:</span> {selectedReport.customerPhone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin trạm</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div><span className="font-medium">Mã trạm:</span> {selectedReport.stationId}</div>
                        <div><span className="font-medium">Tên trạm:</span> {selectedReport.stationName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Chi tiết báo cáo</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Loại:</span>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(selectedReport.reportType)}`}>
                            {selectedReport.reportType}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Tiêu đề:</span> {selectedReport.title}
                        </div>
                        <div>
                          <span className="font-medium">Mô tả:</span>
                          <p className="mt-1 text-gray-700">{selectedReport.description}</p>
                        </div>
                        <div className="flex space-x-4">
                          <div>
                            <span className="font-medium">Độ ưu tiên:</span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                              {getPriorityLabel(selectedReport.priority)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Trạng thái:</span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                              {getStatusLabel(selectedReport.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment & Resolution */}
                  {(selectedReport.assignedTo || selectedReport.resolution) && (
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Xử lý</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          {selectedReport.assignedTo && (
                            <div><span className="font-medium">Được phân công cho:</span> {selectedReport.assignedTo}</div>
                          )}
                          {selectedReport.resolution && (
                            <div>
                              <span className="font-medium">Giải pháp:</span>
                              <p className="mt-1 text-gray-700">{selectedReport.resolution}</p>
                            </div>
                          )}
                          <div><span className="font-medium">Cập nhật lần cuối:</span> {selectedReport.updatedAt}</div>
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
