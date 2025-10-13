import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const AdminHeader = ({ 
  title, 
  subtitle, 
  icon, 
  stats = [], 
  showUserInfo = true 
}) => {
  const { user, logout } = useAuth();

  return (
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
                  {icon || (
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
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {title || "Dashboard Quản trị Hệ thống"}
                  </h1>
                  <p className="text-white text-opacity-90 text-sm">
                    {subtitle || "Tổng quan và quản lý toàn bộ hệ thống trạm đổi pin"}
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="flex space-x-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium">
                      {user?.role === "admin"
                        ? "Admin"
                        : user?.role === "staff"
                        ? "Staff"
                        : user?.role === "evdriver"
                        ? "EVDriver"
                        : "User"}
                      : {user?.name || "Hệ thống"}
                    </span>
                  </div>
                </div>
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 ${stat.color || 'bg-blue-400'} rounded-full`}></div>
                      <span className="text-xs font-medium">
                        {stat.label}: {stat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Admin Profile */}
            {showUserInfo && (
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
                      <p className="text-white font-semibold text-sm">
                        {user?.name || "Admin System"}
                      </p>
                      <p className="text-white text-opacity-80 text-xs">
                        {user?.role === "admin"
                          ? "Quản trị viên"
                          : user?.role === "staff"
                          ? "Nhân viên"
                          : user?.role === "evdriver"
                          ? "Tài xế EV"
                          : "Người dùng"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      localStorage.removeItem('stationMenuOpen');
                      localStorage.removeItem('userMenuOpen');
                      logout();
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
