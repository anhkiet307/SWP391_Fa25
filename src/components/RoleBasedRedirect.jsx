import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect về dashboard phù hợp với role
  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (user?.role === "staff") {
    return <Navigate to="/staff-dashboard" replace />;
  } else if (user?.role === "evdriver") {
    return <Navigate to="/" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
