import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError } from "../../../utils/toast";

const AdminAddBattery = () => {
  const [formData, setFormData] = useState({
    batteryId: "",
    stationId: "",
    batteryType: "",
    capacity: "",
    voltage: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    status: "new",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for stations
  const stations = [
    { id: "BSS-001", name: "Trạm Đổi Pin Quận 1" },
    { id: "BSS-002", name: "Trạm Đổi Pin Quận 2" },
    { id: "BSS-003", name: "Trạm Đổi Pin Quận 3" },
  ];

  const batteryTypes = [
    { value: "lithium-ion", label: "Lithium-ion" },
    { value: "lithium-polymer", label: "Lithium-polymer" },
    { value: "lead-acid", label: "Lead-acid" },
    { value: "nickel-cadmium", label: "Nickel-cadmium" },
  ];

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
      
      showSuccess("Thêm pin mới thành công!");
      
      // Reset form
      setFormData({
        batteryId: "",
        stationId: "",
        batteryType: "",
        capacity: "",
        voltage: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        warrantyExpiry: "",
        status: "new",
        notes: "",
      });
    } catch (error) {
      showError("Có lỗi xảy ra khi thêm pin mới!");
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
            <h1 className="text-3xl font-semibold m-0">Thêm Pin Mới</h1>
            <p className="text-indigo-100 mt-2">
              Thêm pin mới vào hệ thống trạm đổi pin
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Thêm pin mới
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mã pin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã pin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="batteryId"
                  value={formData.batteryId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="BAT-001"
                  required
                />
              </div>

              {/* Trạm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạm <span className="text-red-500">*</span>
                </label>
                <select
                  name="stationId"
                  value={formData.stationId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn trạm</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.id})
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

              {/* Dung lượng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dung lượng (mAh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="5000"
                  min="1"
                  required
                />
              </div>

              {/* Điện áp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điện áp (V) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="3.7"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              {/* Nhà sản xuất */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhà sản xuất <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Samsung, LG, Panasonic..."
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="INR18650-25R"
                  required
                />
              </div>

              {/* Số serial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số serial <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="SN123456789"
                  required
                />
              </div>

              {/* Ngày mua */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày mua <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Bảo hành */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hết bảo hành
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="new">Mới</option>
                  <option value="used">Đã sử dụng</option>
                  <option value="refurbished">Tân trang</option>
                </select>
              </div>

              {/* Ghi chú */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ghi chú về pin..."
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
                {isSubmitting ? "Đang thêm..." : "Thêm pin"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Xem trước thông tin pin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Mã pin:</div>
              <div className="font-medium">{formData.batteryId || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Trạm:</div>
              <div className="font-medium">
                {stations.find(s => s.id === formData.stationId)?.name || "Chưa chọn"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Loại pin:</div>
              <div className="font-medium">
                {batteryTypes.find(t => t.value === formData.batteryType)?.label || "Chưa chọn"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Dung lượng:</div>
              <div className="font-medium">{formData.capacity || "Chưa nhập"} mAh</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Điện áp:</div>
              <div className="font-medium">{formData.voltage || "Chưa nhập"} V</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Nhà sản xuất:</div>
              <div className="font-medium">{formData.manufacturer || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Model:</div>
              <div className="font-medium">{formData.model || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Số serial:</div>
              <div className="font-medium">{formData.serialNumber || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ngày mua:</div>
              <div className="font-medium">{formData.purchaseDate || "Chưa nhập"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Trạng thái:</div>
              <div className="font-medium">
                {formData.status === "new" ? "Mới" : 
                 formData.status === "used" ? "Đã sử dụng" : "Tân trang"}
              </div>
            </div>
            {formData.notes && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600">Ghi chú:</div>
                <div className="font-medium">{formData.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddBattery;
