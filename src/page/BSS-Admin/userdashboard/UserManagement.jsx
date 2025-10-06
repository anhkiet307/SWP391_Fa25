import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import { showConfirm, showSuccess, showError } from "../../../utils/toast";

const UserManagement = () => {
  const navigate = useNavigate();
  
  // State cho quản lý người dùng
  const [users, setUsers] = useState([
    {
      id: 1,
      userId: "USER001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      role: "driver",
      status: "active",
      registrationDate: "01/01/2024",
      totalTransactions: 25,
      totalSpent: 1250000,
      vehicleInfo: {
        vin: "VIN123456789",
        batteryType: "Battery A - 5000mAh",
        lastSwap: "15/01/2024 14:30:00",
      },
      subscription: {
        type: "monthly",
        plan: "Premium",
        expiryDate: "01/02/2024",
        remainingSwaps: 15,
      },
    },
    {
      id: 2,
      userId: "USER002",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0907654321",
      role: "driver",
      status: "active",
      registrationDate: "05/01/2024",
      totalTransactions: 18,
      totalSpent: 900000,
      vehicleInfo: {
        vin: "VIN987654321",
        batteryType: "Battery B - 3000mAh",
        lastSwap: "14/01/2024 16:20:00",
      },
      subscription: {
        type: "pay-per-use",
        plan: "Basic",
        expiryDate: null,
        remainingSwaps: 0,
      },
    },
    {
      id: 3,
      userId: "USER003",
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0909876543",
      role: "driver",
      status: "suspended",
      registrationDate: "15/12/2023",
      totalTransactions: 45,
      totalSpent: 2250000,
      vehicleInfo: {
        vin: "VIN456789123",
        batteryType: "Battery C - 7000mAh",
        lastSwap: "10/01/2024 10:15:00",
      },
      subscription: {
        type: "yearly",
        plan: "Enterprise",
        expiryDate: "15/12/2024",
        remainingSwaps: 120,
      },
    },
  ]);

  const [staff, setStaff] = useState([
    {
      id: 1,
      staffId: "STAFF001",
      name: "Nguyễn Văn Staff",
      email: "staff1@voltswap.com",
      phone: "0901234567",
      role: "station_manager",
      status: "active",
      stationId: "BSS-001",
      stationName: "Trạm Quận 1",
      hireDate: "01/06/2023",
      permissions: ["station_management", "transaction_processing"],
    },
    {
      id: 2,
      staffId: "STAFF002",
      name: "Trần Thị Manager",
      email: "staff2@voltswap.com",
      phone: "0907654321",
      role: "station_manager",
      status: "active",
      stationId: "BSS-002",
      stationName: "Trạm Quận 2",
      hireDate: "15/08/2023",
      permissions: [
        "station_management",
        "transaction_processing",
        "inventory_management",
      ],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    role: "driver",
  });

  // Tính tổng thống kê
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    suspendedUsers: users.filter((u) => u.status === "suspended").length,
    totalTransactions: users.reduce((sum, u) => sum + u.totalTransactions, 0),
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  const staffStats = {
    totalStaff: staff.length,
    activeStaff: staff.filter((s) => s.status === "active").length,
    stationManagers: staff.filter((s) => s.role === "station_manager").length,
  };

  // Hàm thêm người dùng mới
  const handleAddUser = () => {
    if (newUser.userId && newUser.name && newUser.email) {
      const user = {
        ...newUser,
        id: users.length + 1,
        status: "active",
        registrationDate: new Date().toISOString().split("T")[0],
        totalTransactions: 0,
        totalSpent: 0,
        vehicleInfo: {
          vin: "",
          batteryType: "",
          lastSwap: null,
        },
        subscription: {
          type: "pay-per-use",
          plan: "Basic",
          expiryDate: null,
          remainingSwaps: 0,
        },
      };
      setUsers([...users, user]);
      setNewUser({
        userId: "",
        name: "",
        email: "",
        phone: "",
        role: "driver",
      });
      setShowAddForm(false);
    }
  };

  // Hàm cập nhật người dùng
  const handleUpdateUser = (id, updates) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    );
    setShowEditForm(false);
    setSelectedUser(null);
  };

  // Hàm xóa người dùng
  const handleDeleteUser = (id) => {
    showConfirm("Bạn có chắc chắn muốn xóa người dùng này?", () => {
        setUsers(users.filter((user) => user.id !== id));
        showSuccess("Đã xóa người dùng thành công!");
    });
  };

  // Hàm thay đổi trạng thái người dùng
  const toggleUserStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
            }
          : user
      )
    );
  };

  // Hàm tạo gói thuê pin
  const createSubscriptionPlan = (userId, planType, planName, duration) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              subscription: {
                type: planType,
                plan: planName,
                expiryDate: new Date(
                  Date.now() + duration * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[0],
                remainingSwaps:
                  planType === "monthly" ? 30 : planType === "yearly" ? 365 : 0,
              },
            }
          : user
      )
    );
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
          <div>
                      <h1 className="text-2xl font-bold mb-1">Quản lý Người dùng</h1>
                      <p className="text-white text-opacity-90 text-sm">
              Quản lý khách hàng, nhân viên và phân quyền hệ thống
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
                        <span className="text-xs font-medium">Tổng người dùng: {userStats.totalUsers}</span>
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Khách hàng ({userStats.totalUsers})
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "staff"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nhân viên ({staffStats.totalStaff})
            </button>
          </div>
        </div>

        {/* Thống kê */}
        {activeTab === "users" && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
              Thống kê khách hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng khách hàng
                </h3>
                <div className="text-4xl font-bold m-0 text-blue-500">
                  {userStats.totalUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Đang hoạt động
                </h3>
                <div className="text-4xl font-bold m-0 text-green-500">
                  {userStats.activeUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tạm khóa
                </h3>
                <div className="text-4xl font-bold m-0 text-red-500">
                  {userStats.suspendedUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng giao dịch
                </h3>
                <div className="text-4xl font-bold m-0 text-purple-500">
                  {userStats.totalTransactions}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng doanh thu
                </h3>
                <div className="text-4xl font-bold m-0 text-orange-500">
                  {(userStats.totalRevenue / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            {activeTab === "users"
              ? "Danh sách khách hàng"
              : "Danh sách nhân viên"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (activeTab === "users") {
                  navigate('/admin-add-customer');
                } else {
                  navigate('/admin-add-staff');
                }
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm {activeTab === "users" ? "khách hàng" : "nhân viên"}
            </button>
            {activeTab === "users" && (
              <button 
                onClick={() => navigate('/admin-battery-packages')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Tạo gói thuê pin
              </button>
            )}
          </div>
        </div>

        {/* Danh sách người dùng */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-left font-semibold text-base">
                      Mã KH
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Tên
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Liên hệ
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Trạng thái
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Phương tiện
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Gói thuê
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Thống kê
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="font-bold text-base text-indigo-600">
                          {user.userId}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            Đăng ký: {user.registrationDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="text-sm text-gray-800 mb-1">
                            {user.email}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                            {user.status === "active"
                              ? "Hoạt động"
                              : "Tạm khóa"}
                        </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="text-sm font-semibold text-gray-800 mb-1">
                            VIN: {user.vehicleInfo.vin}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {user.vehicleInfo.batteryType}
                          </div>
                          <div className="text-sm text-gray-500">
                            Lần cuối: {user.vehicleInfo.lastSwap}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {user.subscription.plan}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {user.subscription.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            Còn lại: {user.subscription.remainingSwaps} lần
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {user.totalTransactions} giao dịch
                          </div>
                          <div className="text-sm text-green-600 font-medium mt-1">
                            {user.totalSpent.toLocaleString("vi-VN")} VNĐ
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                          {/* Chi tiết */}
                          <button
                            className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => setSelectedUser(user)}
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
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditForm(true);
                            }}
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
                              user.status === "active"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => toggleUserStatus(user.id)}
                            title={
                              user.status === "active"
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
                          >
                            {user.status === "active" ? (
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
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {user.status === "active" ? "Khóa" : "Mở khóa"}
                            </div>
                          </button>

                          {/* Xóa */}
                          <button
                            className="group relative bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Xóa"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Xóa người dùng
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

        {/* Danh sách nhân viên */}
        {activeTab === "staff" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-left font-semibold text-base">
                      Mã NV
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Tên
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Liên hệ
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Vai trò
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Trạm
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Quyền hạn
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((staffMember, index) => (
                    <tr 
                      key={staffMember.id} 
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="font-bold text-base text-indigo-600">
                          {staffMember.staffId}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {staffMember.name}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            Tuyển: {staffMember.hireDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="text-sm text-gray-800 mb-1">
                            {staffMember.email}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {staffMember.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <span className="px-3 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {staffMember.role === "station_manager"
                            ? "Quản lý trạm"
                            : "Nhân viên"}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {staffMember.stationId}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {staffMember.stationName}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {staffMember.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                            >
                              {permission.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                          {/* Chi tiết */}
                          <button
                            className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => setSelectedUser(staffMember)}
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
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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

                          {/* Phân quyền */}
                          <button
                            className="group relative bg-purple-500 hover:bg-purple-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            title="Phân quyền"
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
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Phân quyền
                            </div>
                          </button>

                          {/* Xóa */}
                          <button
                            className="group relative bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            title="Xóa"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Xóa nhân viên
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

        {/* Modal thêm người dùng mới */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Thêm{" "}
                {activeTab === "users" ? "khách hàng mới" : "nhân viên mới"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã {activeTab === "users" ? "khách hàng" : "nhân viên"}:
                  </label>
                  <input
                    type="text"
                    value={newUser.userId}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        userId: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={activeTab === "users" ? "USER004" : "STAFF003"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên:
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="user@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò:
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="driver">Khách hàng</option>
                    <option value="station_manager">Quản lý trạm</option>
                    <option value="staff">Nhân viên</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chi tiết người dùng */}
        {selectedUser && !showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedUser.name}
                      </h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {selectedUser.userId}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            selectedUser.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedUser.status === "active"
                            ? "🟢 Hoạt động"
                            : "🔴 Tạm khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200"
                  >
                    <svg
                      className="w-6 h-6"
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

              {/* Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Thông tin cơ bản */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                    <h4 className="text-base font-bold text-blue-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
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
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Họ tên
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {selectedUser.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Email
                          </div>
                          <div className="text-sm text-gray-700">
                            {selectedUser.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-600">
                            Số điện thoại
                          </div>
                          <div className="text-sm text-gray-700">
                            {selectedUser.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin phương tiện (chỉ cho khách hàng) */}
                  {activeTab === "users" && selectedUser.vehicleInfo && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                      <h4 className="text-base font-bold text-green-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                        Thông tin phương tiện
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            VIN
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.vehicleInfo.vin}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Loại pin
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.vehicleInfo.batteryType}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Lần đổi cuối
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.vehicleInfo.lastSwap || "Chưa có"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gói thuê pin (chỉ cho khách hàng) */}
                  {activeTab === "users" && selectedUser.subscription && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                      <h4 className="text-base font-bold text-purple-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Gói thuê pin
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-purple-600 mb-1">
                            {selectedUser.subscription.plan}
                          </div>
                          <div className="text-xs text-gray-600">
                            {selectedUser.subscription.type}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-green-600 mb-1">
                            {selectedUser.subscription.remainingSwaps}
                          </div>
                          <div className="text-xs text-gray-600">
                            Lần đổi còn lại
                          </div>
                        </div>
                        {selectedUser.subscription.expiryDate && (
                          <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                            <div className="text-sm font-bold text-orange-600 mb-1">
                              {selectedUser.subscription.expiryDate}
                            </div>
                            <div className="text-xs text-gray-600">
                              Hết hạn
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Thống kê (chỉ cho khách hàng) */}
                  {activeTab === "users" && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                      <h4 className="text-base font-bold text-orange-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        Thống kê
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-orange-600 mb-1">
                            {selectedUser.totalTransactions}
                          </div>
                          <div className="text-xs text-gray-600">
                            Tổng giao dịch
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-green-600 mb-1">
                            {selectedUser.totalSpent.toLocaleString("vi-VN")} VNĐ
                          </div>
                          <div className="text-xs text-gray-600">
                            Tổng chi tiêu
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thông tin trạm (chỉ cho nhân viên) */}
                  {activeTab === "staff" && selectedUser.stationId && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-3 border border-indigo-100">
                      <h4 className="text-base font-bold text-indigo-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Thông tin trạm
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Mã trạm
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.stationId}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Tên trạm
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.stationName}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="text-xs font-semibold text-gray-600 mb-1">
                            Ngày tuyển
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedUser.hireDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quyền hạn (chỉ cho nhân viên) */}
                  {activeTab === "staff" && selectedUser.permissions && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
                      <h4 className="text-base font-bold text-purple-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Quyền hạn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.permissions.map((permission, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm"
                          >
                            {permission.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
