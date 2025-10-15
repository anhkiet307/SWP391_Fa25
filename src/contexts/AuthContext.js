import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Không khôi phục user nếu đang logout
    if (isLoggingOut) {
      setIsLoading(false);
      return;
    }

    // Kiểm tra localStorage khi component mount
    const savedUser = localStorage.getItem("voltswap_user");
    const apiUserInfo = localStorage.getItem("userInfo");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("voltswap_user");
      }
    } else if (apiUserInfo) {
      // Nếu không có voltswap_user nhưng có userInfo từ API, khôi phục từ đó
      try {
        const userData = JSON.parse(apiUserInfo);
        const restoredUser = {
          userID: userData.userID,
          username: userData.email, // API trả về email
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          roleID: userData.roleID,
          role:
            userData.roleID === 1
              ? "evdriver"
              : userData.roleID === 2
              ? "staff"
              : "admin",
          ...userData,
        };
        localStorage.setItem("voltswap_user", JSON.stringify(restoredUser));
        setUser(restoredUser);
      } catch (error) {
        console.error("Error parsing API user info:", error);
        localStorage.removeItem("userInfo");
      }
    }
    setIsLoading(false);
  }, [isLoggingOut]);

  const login = async (userData) => {
    try {
      // Lưu thông tin user vào localStorage
      localStorage.setItem("voltswap_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Set flag để ngăn useEffect khôi phục user
    setIsLoggingOut(true);

    // Xóa tất cả dữ liệu liên quan đến authentication
    localStorage.removeItem("voltswap_user");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    localStorage.removeItem("stationMenuOpen");
    localStorage.removeItem("userMenuOpen");

    // Reset user state
    setUser(null);

    // Reset logout flag sau khi hoàn thành
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 100);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
