import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
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
            { label: "Tổng báo cáo", value: reports.length, color: "bg-blue-400" }
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
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Trạm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Độ ưu tiên
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
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {report.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {report.customerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.customerEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {report.stationId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.stationName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        <div className="truncate" title={report.title}>
                          {report.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(report.priority)}`}>
                        {getPriorityLabel(report.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {report.createdAt}
                    </td>
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
                        {report.status === "pending" && (
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
                        {report.status === "in_progress" && (
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

          {/* Empty State */}
          {reports.length === 0 && (
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
