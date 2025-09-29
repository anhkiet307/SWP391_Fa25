import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const logo = "/assets/images/voltswap_logo.png";

const navItems = [
  { label: "Trang chủ", to: "/", active: true, icon: "⚡" },
  { label: "Trạm", href: "/#map-section", icon: "◦" },
  { label: "Phân tích", href: "#", icon: "📊" },
];

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-white/10 bg-[#00083B]">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link className="flex items-center gap-3" to="/" aria-label="VoltSwap">
          <img src={logo} alt="VoltSwap" className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center space-x-6 lg:flex">
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
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            /* User Profile Menu */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="hidden lg:inline">{user?.name || "User"}</span>
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
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0b1448] py-2 z-50 shadow-xl shadow-black/30">
                  <div className="px-4 pb-2 mb-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Thông tin tài khoản
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Lịch sử giao dịch
                  </a>
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
