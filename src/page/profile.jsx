import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";

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

  // States cho thông tin xe
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehiclesError, setVehiclesError] = useState(null);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch thông tin xe khi component mount
  useEffect(() => {
    if (isAuthenticated && user?.userID) {
      fetchUserVehicles();
    }
  }, [isAuthenticated, user?.userID]);

  // Hàm fetch thông tin xe từ API
  const fetchUserVehicles = async () => {
    setIsLoadingVehicles(true);
    setVehiclesError(null);

    try {
      console.log("Fetching vehicles for user:", user);
      console.log("User ID:", user?.userID);

      if (!user?.userID) {
        throw new Error("User ID không tồn tại");
      }

      const response = await apiService.getVehiclesByUser(user.userID);

      if (response && response.status === "success") {
        setVehicles(response.data || []);
      } else {
        setVehiclesError("Không thể tải thông tin xe");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehiclesError(`Lỗi khi tải thông tin xe: ${error.message}`);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

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
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Phương tiện của tôi
                </h3>
                <button
                  onClick={fetchUserVehicles}
                  disabled={isLoadingVehicles}
                  className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors text-sm font-medium border border-blue-400/30"
                >
                  {isLoadingVehicles ? "Đang tải..." : "Làm mới"}
                </button>
              </div>

              {/* Loading state */}
              {isLoadingVehicles && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-3 text-white/70">
                    Đang tải thông tin xe...
                  </span>
                </div>
              )}

              {/* Error state */}
              {vehiclesError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
                  <p className="text-sm">{vehiclesError}</p>
                </div>
              )}

              {/* Vehicles list */}
              {!isLoadingVehicles && !vehiclesError && (
                <>
                  {vehicles.length > 0 ? (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.vehicleID}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-white font-semibold text-lg">
                                {vehicle.vehicleType}
                              </h4>
                              <p className="text-white/70 text-sm">
                                Biển số: {vehicle.licensePlate}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                                ID: {vehicle.vehicleID}
                              </div>
                            </div>
                          </div>

                          {/* Pin Status */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Pin Percent */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/80 text-sm font-medium">
                                  Pin hiện tại
                                </span>
                                <span className="text-white font-semibold">
                                  {vehicle.pinPercent}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    vehicle.pinPercent >= 80
                                      ? "bg-green-500"
                                      : vehicle.pinPercent >= 50
                                      ? "bg-yellow-500"
                                      : vehicle.pinPercent >= 20
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${vehicle.pinPercent}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Pin Health */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white/80 text-sm font-medium">
                                  Sức khỏe pin
                                </span>
                                <span className="text-white font-semibold">
                                  {vehicle.pinHealth}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    vehicle.pinHealth >= 90
                                      ? "bg-green-500"
                                      : vehicle.pinHealth >= 70
                                      ? "bg-yellow-500"
                                      : vehicle.pinHealth >= 50
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${vehicle.pinHealth}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Status indicators */}
                          <div className="mt-3 flex gap-2">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.pinPercent >= 50
                                  ? "bg-green-500/20 text-green-300 border border-green-400/30"
                                  : "bg-red-500/20 text-red-300 border border-red-400/30"
                              }`}
                            >
                              {vehicle.pinPercent >= 50
                                ? "🔋 Pin đủ"
                                : "🔋 Pin yếu"}
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                vehicle.pinHealth >= 70
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                  : "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                              }`}
                            >
                              {vehicle.pinHealth >= 70
                                ? "💚 Pin khỏe"
                                : "⚠️ Pin cần kiểm tra"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-white/50 text-lg mb-2">🚗</div>
                      <p className="text-white/70">Chưa có phương tiện nào</p>
                      <p className="text-white/50 text-sm">
                        Liên hệ admin để thêm phương tiện
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
