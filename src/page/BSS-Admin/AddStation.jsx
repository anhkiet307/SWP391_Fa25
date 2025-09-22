import React, { useState } from "react";
import AdminLayout from "./component/AdminLayout";
import { showSuccess, showError } from "../../utils/toast";

const AdminAddStation = () => {
  const [formData, setFormData] = useState({
    stationId: "",
    name: "",
    address: "",
    manager: "",
    phone: "",
    batteryCapacity: 0,
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      showSuccess("Thêm trạm mới thành công!");
      
      // Reset form
      setFormData({
        stationId: "",
        name: "",
        address: "",
        manager: "",
        phone: "",
        batteryCapacity: 0,
        description: "",
      });
    } catch (error) {
      showError("Có lỗi xảy ra khi thêm trạm mới!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Thêm Trạm Đổi Pin Mới</h1>
            <p className="text-indigo-100 mt-2">
              Tạo trạm đổi pin mới trong hệ thống
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Thêm trạm mới
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mã trạm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stationId"
                  value={formData.stationId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="BSS-001"
                  required
                />
              </div>

              {/* Tên trạm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Trạm Đổi Pin Quận 1"
                  required
                />
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                  required
                />
              </div>

              {/* Quản lý */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quản lý trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nguyễn Văn Manager"
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0901234567"
                  required
                />
              </div>

              {/* Sức chứa pin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sức chứa pin <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="batteryCapacity"
                  value={formData.batteryCapacity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="60"
                  min="1"
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả về trạm đổi pin..."
                />
              </div>
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
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang thêm..." : "Thêm trạm"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Xem trước thông tin trạm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Mã trạm:</div>
              <div className="font-medium">{formData.stationId || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tên trạm:</div>
              <div className="font-medium">{formData.name || "Chưa nhập"}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">Địa chỉ:</div>
              <div className="font-medium">{formData.address || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Quản lý:</div>
              <div className="font-medium">{formData.manager || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">SĐT:</div>
              <div className="font-medium">{formData.phone || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Sức chứa pin:</div>
              <div className="font-medium">{formData.batteryCapacity || 0} pin</div>
            </div>
            {formData.description && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600">Mô tả:</div>
                <div className="font-medium">{formData.description}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddStation;
