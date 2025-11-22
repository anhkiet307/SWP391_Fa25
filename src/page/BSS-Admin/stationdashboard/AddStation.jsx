import React, { useState, useEffect } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminAddStation = () => {
  const [formData, setFormData] = useState({
    stationName: "",
    location: "",
    status: 0, // 0=inactive, 1=active, 2=maintenance
    x: "",
    y: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);


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
      // Validate required fields
      if (!formData.stationName || !formData.location || !formData.x || !formData.y) {
        showError("Vui lòng điền đầy đủ thông tin bắt buộc!");
        setIsSubmitting(false);
        return;
      }

      // Validate numeric fields - x and y should be float, not integer
      const x = parseFloat(formData.x);
      const y = parseFloat(formData.y);

      if (isNaN(x) || isNaN(y)) {
        showError("Vui lòng nhập đúng định dạng số cho tọa độ!");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API - format according to backend requirements
      // API uses query parameters, not JSON body
      const stationData = {
        stationName: formData.stationName.trim(),
        location: formData.location.trim(),
        status: parseInt(formData.status),
        x: x, // float
        y: y, // float
      };

      // Call API to create station
      const response = await apiService.createStation(stationData);
      
      showSuccess("Thêm trạm mới thành công!");
      
      // Reset form
      setFormData({
        stationName: "",
        location: "",
        status: 1,
        x: "",
        y: "",
      });
      setShowPreview(false);
    } catch (error) {
      console.error("Error creating station:", error);
      
      // Handle different types of errors
      if (error.message && error.message.includes("HTTP error")) {
        showError("Lỗi kết nối server. Vui lòng thử lại sau!");
      } else if (error.message && error.message.includes("Failed to fetch")) {
        showError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
      } else {
        showError("Có lỗi xảy ra khi thêm trạm mới!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Thêm Trạm Đổi Pin Mới"
          subtitle="Tạo trạm đổi pin mới trong hệ thống"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
          stats={[
            { label: "Thêm trạm mới", value: "", color: "bg-blue-400" }
          ]}
        />

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vui lòng nhập thông tin</h3>
                <p className="text-sm text-gray-600">Điền đầy đủ các thông tin bắt buộc để tạo trạm mới</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePreview} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Tên trạm */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stationName"
                  value={formData.stationName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Trạm Sạc An Liễn"
                  required
                />
              </div>

              {/* Địa chỉ */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="120 Phổ Yên Lãng, Hà Nội"
                  required
                />
              </div>

              {/* Tọa độ X */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tọa độ X <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="x"
                  value={formData.x}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="21.005057"
                  step="any"
                  required
                />
              </div>

              {/* Tọa độ Y */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tọa độ Y <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="y"
                  value={formData.y}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="105.869329"
                  step="any"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    stationName: "",
                    location: "",
                    status: 1,
                    x: "",
                    y: "",
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
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
                    Xác nhận thông tin trạm
                  </h2>
                  <button
                    onClick={handleEditForm}
                    className="absolute right-0 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Station Icon & Status */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                    <svg
                      className="w-8 h-8 text-indigo-600"
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
                  <div className="text-2xl font-bold text-gray-900">
                    {formData.stationName || "Chưa có tên trạm"}
                  </div>
                </div>

                {/* Station Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Tên trạm */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-green-600 mr-1"
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
                      <span className="text-base font-medium text-green-600">
                        Tên trạm
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.stationName || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-blue-600 mr-1"
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
                      <span className="text-base font-medium text-blue-600">
                        Địa chỉ
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.location || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Tọa độ X */}
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-orange-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span className="text-base font-medium text-orange-600">
                        Tọa độ X
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.x || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Tọa độ Y */}
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-cyan-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span className="text-base font-medium text-cyan-600">
                        Tọa độ Y
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.y || "Chưa nhập"}
                    </div>
                  </div>


                </div>
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
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? "Đang tạo..." : "Tạo trạm"}
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

export default AdminAddStation;
