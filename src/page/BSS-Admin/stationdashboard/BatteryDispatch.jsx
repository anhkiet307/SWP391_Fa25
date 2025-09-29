import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError } from "../../../utils/toast";

const AdminBatteryDispatch = () => {
  const [formData, setFormData] = useState({
    fromStation: "",
    toStation: "",
    batteryType: "",
    quantity: "",
    reason: "",
    priority: "normal",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for stations
  const stations = [
    { id: "BSS-001", name: "Trạm Đổi Pin Quận 1", availableBatteries: 15, capacity: 20 },
    { id: "BSS-002", name: "Trạm Đổi Pin Quận 2", availableBatteries: 8, capacity: 20 },
    { id: "BSS-003", name: "Trạm Đổi Pin Quận 3", availableBatteries: 12, capacity: 20 },
    { id: "BSS-004", name: "Trạm Đổi Pin Quận 7", availableBatteries: 20, capacity: 20 },
  ];

  const batteryTypes = [
    { value: "lithium-ion", label: "Lithium-ion" },
    { value: "lithium-polymer", label: "Lithium-polymer" },
    { value: "lead-acid", label: "Lead-acid" },
  ];

  const dispatchReasons = [
    { value: "demand_balance", label: "Cân bằng nhu cầu" },
    { value: "maintenance", label: "Bảo dưỡng" },
    { value: "emergency", label: "Khẩn cấp" },
    { value: "inventory_optimization", label: "Tối ưu tồn kho" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      showSuccess("Điều phối pin thành công!");
      
      // Reset form
      setFormData({
        fromStation: "",
        toStation: "",
        batteryType: "",
        quantity: "",
        reason: "",
        priority: "normal",
        notes: "",
      });
      setShowPreview(false);
    } catch (error) {
      showError("Có lỗi xảy ra khi điều phối pin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditForm = () => {
    setShowPreview(false);
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

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="mb-8">
          {/* Main Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl">
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
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Điều Phối Pin</h1>
                      <p className="text-white text-opacity-90 text-sm">
                        Quản lý và điều phối pin giữa các trạm đổi pin
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
                        <span className="text-xs font-medium">Điều phối pin</span>
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

        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin điều phối</h2>
          <form onSubmit={handlePreview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trạm nguồn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạm nguồn <span className="text-red-500">*</span>
                </label>
                <select
                  name="fromStation"
                  value={formData.fromStation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn trạm nguồn</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.availableBatteries}/{station.capacity} pin)
                    </option>
                  ))}
                </select>
              </div>

              {/* Trạm đích */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạm đích <span className="text-red-500">*</span>
                </label>
                <select
                  name="toStation"
                  value={formData.toStation}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn trạm đích</option>
                  {stations
                    .filter(station => station.id !== formData.fromStation)
                    .map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name} ({station.availableBatteries}/{station.capacity} pin)
                      </option>
                    ))}
                </select>
              </div>

              {/* Loại pin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại pin <span className="text-red-500">*</span>
                </label>
                <select
                  name="batteryType"
                  value={formData.batteryType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn loại pin</option>
                  {batteryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Số lượng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng pin <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1-10"
                  min="1"
                  max="10"
                  required
                />
              </div>

              {/* Lý do điều phối */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do điều phối <span className="text-red-500">*</span>
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn lý do</option>
                  {dispatchReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Độ ưu tiên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ ưu tiên <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Thêm ghi chú về việc điều phối pin..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Xem trước
              </button>
            </div>
          </form>
        </div>

        {/* Preview Modal - Only show when showPreview is true */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-center relative">
                  <h2 className="text-xl font-bold text-gray-900 text-center">
                    Xác nhận điều phối pin
                  </h2>
                  <button
                    onClick={handleEditForm}
                    className="absolute right-0 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Dispatch Icon & Status */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    Điều phối {formData.quantity || "0"} pin
                  </div>
                  <div className="text-lg text-gray-600">
                    {stations.find(s => s.id === formData.fromStation)?.name || "Chưa chọn"} → {stations.find(s => s.id === formData.toStation)?.name || "Chưa chọn"}
                  </div>
                </div>

                {/* Dispatch Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Trạm nguồn */}
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-base font-medium text-red-600">Trạm nguồn</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {stations.find(s => s.id === formData.fromStation)?.name || "Chưa chọn"}
                    </div>
                  </div>

                  {/* Trạm đích */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-base font-medium text-green-600">Trạm đích</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {stations.find(s => s.id === formData.toStation)?.name || "Chưa chọn"}
                    </div>
                  </div>

                  {/* Loại pin */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      <span className="text-base font-medium text-blue-600">Loại pin</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {batteryTypes.find(t => t.value === formData.batteryType)?.label || "Chưa chọn"}
                    </div>
                  </div>

                  {/* Số lượng */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-purple-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-base font-medium text-purple-600">Số lượng</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.quantity || "0"} pin
                    </div>
                  </div>

                  {/* Lý do */}
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-orange-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-base font-medium text-orange-600">Lý do</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {dispatchReasons.find(r => r.value === formData.reason)?.label || "Chưa chọn"}
                    </div>
                  </div>

                  {/* Độ ưu tiên */}
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-cyan-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-base font-medium text-cyan-600">Độ ưu tiên</span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                        {getPriorityLabel(formData.priority)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                {formData.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center mb-1">
                      <svg className="w-3 h-3 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-base font-medium text-gray-600">Ghi chú</span>
                    </div>
                    <div className="text-base text-gray-900">
                      {formData.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleEditForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? "Đang điều phối..." : "Xác nhận điều phối"}
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

export default AdminBatteryDispatch;
