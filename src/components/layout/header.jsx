import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

const logo = "/assets/images/voltswap_logo.png";

const navItems = [
  { label: "Trang chủ", to: "/", active: true, icon: "⚡" },
  { label: "Bản đồ", href: "/#map-section", icon: "🗺️" },
  { label: "Đặt lịch", href: "/#booking-section", icon: "🗓️" },
];

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [packName, setPackName] = useState(null);
  const [subscriptionTotal, setSubscriptionTotal] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadSubscription = async () => {
      try {
        if (!isAuthenticated) return;
        const uid = user?.userID || user?.id;
        if (!uid) return;
        const res = await apiService.getUserSubscription(uid);
        // API trả về { data: { userID, total } } nếu là thành viên
        const total = res?.data?.total;
        if (typeof total === "number") {
          if (mounted) {
            setPackName("Thành viên");
            setSubscriptionTotal(total);
          }
        } else {
          // Fallback: lấy packName của gói có packID = 1
          try {
            const packsRes = await apiService.getServicePacks();
            const list = Array.isArray(packsRes?.data)
              ? packsRes.data
              : Array.isArray(packsRes)
              ? packsRes
              : [];
            const basic = list.find((p) => p.packID === 1);
            if (mounted && basic?.packName) setPackName(basic.packName);
          } catch (_) {
            // ignore
          }
        }
      } catch (e) {
        // ignore and fallback to default label
      }
    };
    loadSubscription();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout(); // logout() sẽ tự động chuyển hướng về /login
  };

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-white/10 bg-[#00083B]">
      <div className="mx-auto relative flex h-16 max-w-screen-2xl items-center px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="shrink-0">
          <Link
            className="flex items-center gap-3"
            to="/"
            aria-label="VoltSwap"
          >
            <img src={logo} alt="VoltSwap" className="h-10 w-auto sm:h-12" />
          </Link>
        </div>

        {/* Center nav (fixed center, unaffected by left/right width) */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center space-x-6">
          {navItems.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-colors border ${
                  item.active
                    ? "bg-cyan-700/60 text-white border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "bg-transparent text-white/80 border-transparent hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-colors border ${
                  item.active
                    ? "bg-cyan-700/60 text-white border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "bg-transparent text-white/80 border-transparent hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="shrink-0 ml-auto flex items-center gap-4">
          {isAuthenticated && (
            <Link
              to="/upgrade"
              className="hidden lg:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 transition-colors"
              title="Nâng cấp gói"
            >
              <span>⬆</span>
              <span>Nâng cấp</span>
            </Link>
          )}
          {isAuthenticated ? (
            /* User Profile Menu */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm">{user?.name || "User"}</span>
                  <span className="text-xs text-white/60">
                    Gói: {packName || "Cơ bản"}
                    {packName === "Thành viên" &&
                      typeof subscriptionTotal === "number" &&
                      ` [${subscriptionTotal} lượt đổi]`}
                  </span>
                </div>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#0b1448] py-2 z-50 shadow-xl shadow-black/30">
                  <div className="px-4 pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-white/60">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user?.role === "admin"
                                ? "bg-red-500/20 text-red-300"
                                : user?.role === "staff"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {user?.role === "admin"
                              ? "Admin"
                              : user?.role === "staff"
                              ? "Staff"
                              : "EV Driver"}
                          </span>
                          {user?.phone && (
                            <span className="text-xs text-white/50">
                              {user.phone}
                            </span>
                          )}
                        </div>
                        {
                          <p className="text-xs text-white/60 mt-1">
                            Gói hiện tại: {packName || "Cơ bản"}
                            {packName === "Thành viên" &&
                              typeof subscriptionTotal === "number" &&
                              ` [${subscriptionTotal}]`}
                          </p>
                        }
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Thông tin tài khoản
                  </Link>

                  {/* Role-based navigation */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === "staff" && (
                    <Link
                      to="/staff-dashboard"
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Staff Dashboard
                    </Link>
                  )}

                  {user?.role === "evdriver" && (
                    <Link
                      to="/booking-history"
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                    >
                      Lịch sử giao dịch
                    </Link>
                  )}

                  <Link
                    to="/reports"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Báo cáo của tôi
                  </Link>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Cài đặt
                  </a>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Button */
            <Link
              to="/login"
              className="hidden rounded-xl border border-cyan-500/40 bg-transparent px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10 lg:inline transition-colors"
            >
              TÀI KHOẢN
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden hover:bg-white/10"
            aria-label="Menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
