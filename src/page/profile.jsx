import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Hiển thị loading nếu chưa xác thực
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white">Đang chuyển hướng...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update profile logic
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Thông tin tài khoản
          </h1>
          <p className="text-white/70">Quản lý thông tin cá nhân của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user?.name || "Người dùng"}
                </h2>
                <p className="text-white/60 text-sm mb-4">{user?.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {user?.role === "admin"
                    ? "Quản trị viên"
                    : user?.role === "staff"
                    ? "Nhân viên"
                    : user?.role === "evdriver"
                    ? "Tài xế EV"
                    : "Người dùng"}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Thông tin cá nhân
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Lưu
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-white/5 text-white rounded-lg">
                        {user?.name || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập email"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-white/5 text-white rounded-lg">
                        {user?.email || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-white/5 text-white rounded-lg">
                        {user?.phone || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-white/5 text-white rounded-lg">
                        {user?.address || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Vehicles Section */}
            {user?.vehicles && user.vehicles.length > 0 && (
              <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Phương tiện
                </h3>
                <div className="space-y-4">
                  {user.vehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">
                            {vehicle.name}
                          </h4>
                          <p className="text-white/70 text-sm">
                            {vehicle.type}
                          </p>
                          <p className="text-white/60 text-xs">
                            Biển số: {vehicle.plate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
