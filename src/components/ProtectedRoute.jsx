import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu role cụ thể
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect về dashboard phù hợp với role
    if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user?.role === "staff") {
      return <Navigate to="/staff-dashboard" replace />;
    } else if (user?.role === "evdriver") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
