import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../contexts/AuthContext";

const PackManagement = () => {
  const { user } = useAuth();
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
    total: "",
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
      // Logic: Nếu packID = 1 (gói cơ bản), total luôn là 0
      // Chỉ áp dụng logic này khi đang chỉnh sửa gói có packID = 1
      const isBasicPack = editingPack && editingPack.packID === 1;
      const totalValue = isBasicPack ? 0 : (parseInt(formData.total) || 0);
      
      const packData = {
        packName: formData.packName,
        description: formData.description,
        total: totalValue,
        price: parseInt(formData.price.replace(/[^0-9]/g, '')), // Loại bỏ dấu phẩy khi submit
        status: parseInt(formData.status),
        adminUserID: user?.userID || 1, // Thêm adminUserID từ AuthContext
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
        total: "",
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
    
    // Logic: Nếu packID = 1 (gói cơ bản), total luôn là 0 và không thể chỉnh sửa
    const isBasicPack = pack.packID === 1;
    const totalValue = isBasicPack ? "0" : (pack.total ? pack.total.toString() : "0");
    
    setFormData({
      packName: pack.packName,
      description: pack.description || "",
      total: totalValue,
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
      
      // Sử dụng API updateStatus mới với packID, adminUserID, và status
      await apiService.updateServicePackStatus(
        pack.packID, 
        user?.userID || 1, // Sử dụng userID từ AuthContext, fallback là 1
        newStatus
      );
      
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
      total: "",
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

  // Sắp xếp gói: gói cơ bản (packID = 1) luôn đầu tiên, các gói khác theo thời gian tạo
  const sortedPacks = [...filteredPacks].sort((a, b) => {
    // Gói cơ bản (packID = 1) luôn đầu tiên
    if (a.packID === 1) return -1;
    if (b.packID === 1) return 1;
    
    // Các gói khác sắp xếp theo thời gian tạo (cũ nhất trước)
    const dateA = new Date(a.createDate || 0);
    const dateB = new Date(b.createDate || 0);
    return dateA - dateB;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatPriceInput = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
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
            { label: "Tổng gói", value: totalStats.totalPacks, color: "bg-green-400" },
            { label: "Đang hoạt động", value: totalStats.activePacks, color: "bg-emerald-400" },
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
              <div className="text-4xl font-bold m-0 text-green-500">
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm gói mới
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
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
                      Tổng lượt
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
                  {sortedPacks.map((pack, index) => (
                    <tr 
                      key={pack.packID} 
                      className={`hover:bg-green-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="font-bold text-base text-green-600">
                            {index + 1}
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
                            {pack.total || 0} lượt
                            {pack.packID === 1 && (
                              <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                Gói cơ bản
                              </span>
                            )}
                          </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header với gradient đẹp hơn */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                    {editingPack ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
                  </h3>
                      <p className="text-green-100 text-base mt-1">
                        {editingPack ? "Cập nhật thông tin gói dịch vụ" : "Tạo gói dịch vụ mới cho hệ thống"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-green-200 transition-all duration-200 p-3 hover:bg-white hover:bg-opacity-20 rounded-xl"
                  >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Body với layout 2 cột */}
              <div className="p-8">

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Row 1: Tên gói và Tổng lượt */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Tên gói dịch vụ *</span>
                        </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.packName}
                      onChange={(e) => setFormData({ ...formData, packName: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Nhập tên gói dịch vụ"
                    />
                  </div>

                    {/* Ẩn field Tổng lượt cho gói cơ bản (packID = 1) */}
                    {!(editingPack && editingPack.packID === 1) && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>Tổng lượt *</span>
                  </div>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                          value={formData.total}
                          onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Nhập tổng số lượt sử dụng"
                        />
                      </div>
                    )}
                  </div>

                  {/* Row 2: Giá */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>Giá (VND) *</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price ? formatPriceInput(parseInt(formData.price)) : ''}
                        onChange={(e) => {
                          // Chỉ cho phép nhập số
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({ ...formData, price: value });
                        }}
                        onFocus={(e) => {
                          // Hiển thị số thuần khi focus
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({ ...formData, price: value });
                        }}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập giá gói dịch vụ (VD: 1,200,000)"
                      />
                    </div>
                  </div>

                  {/* Row 3: Mô tả - Di chuyển xuống dưới cùng */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span>Mô tả gói dịch vụ</span>
                      </div>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      rows="3"
                      placeholder="Nhập mô tả chi tiết về gói dịch vụ..."
                    />
                  </div>

                  {/* Footer với buttons đẹp hơn */}
                  <div className="flex items-center justify-between pt-8 border-t-2 border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Các trường có dấu * là bắt buộc</span>
                  </div>

                    <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                        className="px-8 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-gray-300"
                    >
                        Hủy bỏ
                    </button>
                    <button
                      type="submit"
                        className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{editingPack ? "Cập nhật gói" : "Tạo gói mới"}</span>
                        </div>
                    </button>
                    </div>
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
