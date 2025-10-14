import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import apiService from "../../../services/apiService";

const PackManagement = () => {
  const [servicePacks, setServicePacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    packName: "",
    description: "",
    price: "",
    status: 1,
  });

  // Load service packs on component mount
  useEffect(() => {
    loadServicePacks();
  }, []);

  const loadServicePacks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getServicePacks();
      
      if (response.status === "success") {
        setServicePacks(response.data || []);
      } else {
        toast.error("Không thể tải danh sách gói dịch vụ");
      }
    } catch (error) {
      console.error("Error loading service packs:", error);
      toast.error("Lỗi khi tải danh sách gói dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const packData = {
        packName: formData.packName,
        description: formData.description,
        price: parseInt(formData.price),
        status: parseInt(formData.status),
      };

      if (editingPack) {
        // Update existing pack
        await apiService.updateServicePack(editingPack.packID, packData);
        toast.success("Cập nhật gói dịch vụ thành công");
      } else {
        // Create new pack
        await apiService.createServicePack(packData);
        toast.success("Tạo gói dịch vụ thành công");
      }

      // Reset form and close modal
      setFormData({
        packName: "",
        description: "",
        price: "",
        status: 1,
      });
      setEditingPack(null);
      setShowModal(false);
      
      // Reload data
      loadServicePacks();
    } catch (error) {
      console.error("Error saving service pack:", error);
      toast.error("Lỗi khi lưu gói dịch vụ");
    }
  };

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setFormData({
      packName: pack.packName,
      description: pack.description || "",
      price: pack.price.toString(),
      status: pack.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (packId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) {
      try {
        await apiService.deleteServicePack(packId);
        toast.success("Xóa gói dịch vụ thành công");
        loadServicePacks();
      } catch (error) {
        console.error("Error deleting service pack:", error);
        toast.error("Lỗi khi xóa gói dịch vụ");
      }
    }
  };

  const handleStatusToggle = async (pack) => {
    try {
      const newStatus = pack.status === 1 ? 0 : 1;
      
      // Sử dụng API service có sẵn với tất cả thông tin cần thiết
      const updateData = {
        packName: pack.packName,
        description: pack.description || "",
        price: pack.price,
        status: newStatus,
        total: pack.total || 0
      };
      
      // Sử dụng apiService.updateServicePack thay vì gọi trực tiếp
      await apiService.updateServicePack(pack.packID, updateData);
      
      toast.success(`Đã ${newStatus === 1 ? "kích hoạt" : "vô hiệu hóa"} gói dịch vụ`);
      loadServicePacks();
    } catch (error) {
      console.error("Error updating pack status:", error);
      toast.error("Lỗi khi cập nhật trạng thái gói dịch vụ");
    }
  };

  const handleAddNew = () => {
    setEditingPack(null);
    setFormData({
      packName: "",
      description: "",
      price: "",
      status: 1,
    });
    setShowModal(true);
  };

  // Filter and search logic
  const filteredPacks = servicePacks.filter((pack) => {
    const matchesStatus = filterStatus === "all" || pack.status.toString() === filterStatus;
    const matchesSearch = pack.packName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (pack.description && pack.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Tính tổng thống kê
  const totalStats = {
    totalPacks: servicePacks.length,
    activePacks: servicePacks.filter((p) => p.status === 1).length,
    inactivePacks: servicePacks.filter((p) => p.status === 0).length,
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Quản lý Gói Dịch vụ"
          subtitle="Quản lý các gói dịch vụ thuê pin cho hệ thống"
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
          stats={[
            { label: "Tổng gói", value: totalStats.totalPacks, color: "bg-blue-400" },
            { label: "Đang hoạt động", value: totalStats.activePacks, color: "bg-green-400" },
            { label: "Tạm dừng", value: totalStats.inactivePacks, color: "bg-red-400" }
          ]}
        />

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng gói
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {totalStats.totalPacks}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang hoạt động
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.activePacks}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tạm dừng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.inactivePacks}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Danh sách gói dịch vụ
          </h2>
          <div className="flex gap-3">
            <button
              onClick={loadServicePacks}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Tải lại</span>
            </button>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm gói mới
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-lg font-medium text-gray-600">Đang tải danh sách gói dịch vụ...</span>
            </div>
          </div>
        )}

        {/* Danh sách gói dịch vụ */}
        {!loading && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-center font-semibold text-base">
                      Mã gói
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Tên gói
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Mô tả
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Giá
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Trạng thái
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Ngày tạo
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPacks.map((pack, index) => (
                    <tr 
                      key={pack.packID} 
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="font-bold text-base text-indigo-600">
                            {pack.packID}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="font-semibold text-base text-gray-800">
                          {pack.packName}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {pack.description || "Không có mô tả"}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="text-sm font-medium text-gray-800">
                            {formatPrice(pack.price)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                              pack.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pack.status === 1 ? "Hoạt động" : "Tạm dừng"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="text-sm text-gray-700 text-center">
                            <div className="font-medium text-gray-800">
                              {formatDate(pack.createDate)}
                            </div>
                            {pack.createDate && (
                              <div className="text-xs text-gray-500">
                                {new Date(pack.createDate).toLocaleTimeString("vi-VN")}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                          {/* Chi tiết */}
                          <button
                            className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => setEditingPack(pack)}
                            title="Chi tiết"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Chi tiết
                            </div>
                          </button>

                          {/* Sửa */}
                          <button
                            className="group relative bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => handleEdit(pack)}
                            title="Sửa"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Chỉnh sửa
                            </div>
                          </button>

                          {/* Toggle Status */}
                          <button
                            className={`group relative p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-white ${
                              pack.status === 1
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => handleStatusToggle(pack)}
                            title={
                              pack.status === 1
                                ? "Tạm ngưng hoạt động"
                                : "Kích hoạt gói"
                            }
                          >
                            {pack.status === 1 ? (
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
                                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : (
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            )}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {pack.status === 1 ? "Tạm ngưng" : "Kích hoạt"}
                            </div>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingPack ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên gói dịch vụ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.packName}
                      onChange={(e) => setFormData({ ...formData, packName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nhập tên gói dịch vụ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder="Nhập mô tả gói dịch vụ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nhập giá gói dịch vụ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Tạm dừng</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      {editingPack ? "Cập nhật" : "Tạo mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PackManagement;
