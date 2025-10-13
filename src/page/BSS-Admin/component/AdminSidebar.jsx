import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Khởi tạo state từ localStorage, luôn đóng khi mới login
  const [isStationMenuOpen, setIsStationMenuOpen] = useState(() => {
    const savedState = localStorage.getItem("stationMenuOpen");
    if (savedState !== null) {
      return JSON.parse(savedState);
    }

    // Luôn đóng khi mới login vào admin
    return false;
  });

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(() => {
    const savedState = localStorage.getItem("userMenuOpen");
    if (savedState !== null) {
      return JSON.parse(savedState);
    }

    // Luôn đóng khi mới login vào admin
    return false;
  });

  const [isReportMenuOpen, setIsReportMenuOpen] = useState(() => {
    const savedState = localStorage.getItem("reportMenuOpen");
    if (savedState !== null) {
      return JSON.parse(savedState);
    }

    // Luôn đóng khi mới login vào admin
    return false;
  });

  // Lưu trạng thái menu vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("stationMenuOpen", JSON.stringify(isStationMenuOpen));
  }, [isStationMenuOpen]);

  useEffect(() => {
    localStorage.setItem("userMenuOpen", JSON.stringify(isUserMenuOpen));
  }, [isUserMenuOpen]);

  useEffect(() => {
    localStorage.setItem("reportMenuOpen", JSON.stringify(isReportMenuOpen));
  }, [isReportMenuOpen]);

  const menuItems = [
    {
      path: "/admin-dashboard",
      label: "Dashboard",
      icon: (
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
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
    },
    {
      path: "/admin-station-management",
      label: "Quản lý Trạm",
      hasSubmenu: true,
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      submenu: [
        {
          path: "/admin-station-management",
          label: "Danh sách trạm",
        },
        {
          path: "/admin-pinslot-management",
          label: "Quản lý Pin Slot",
        },
        {
          path: "/admin-add-station",
          label: "Thêm trạm mới",
        },
        {
          path: "/admin-battery-dispatch",
          label: "Điều phối pin",
        },
      ],
    },
    {
      path: "/admin-user-management",
      label: "Quản lý Người dùng",
      hasSubmenu: true,
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      submenu: [
        {
          path: "/admin-user-management",
          label: "Danh sách người dùng",
        },
        {
          path: "/admin-add-customer",
          label: "Thêm khách hàng",
        },
        {
          path: "/admin-add-staff",
          label: "Thêm nhân viên",
        },
        {
          path: "/admin-battery-packages",
          label: "Danh sách gói thuê",
        },
      ],
    },
    {
      path: "/admin-statistic-management",
      label: "Báo cáo & Thống kê",
      hasSubmenu: true,
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      submenu: [
        {
          path: "/admin-statistic-management",
          label: "Tổng quan thống kê",
        },
        {
          path: "/admin-report-management",
          label: "Quản lý báo cáo",
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white shadow-xl h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-gray-100 overflow-hidden">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">VoltSwap</h2>
            <p className="text-sm text-indigo-600 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        className="mt-6 flex-1 px-3 pb-6 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5b4fc #f1f5f9",
        }}
      >
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 px-3">
            Quản trị hệ thống
          </p>
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const hasActiveSubmenu = item.submenu?.some(
              (subItem) => location.pathname === subItem.path
            );

            return (
              <div key={item.path}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => {
                        if (item.path === "/admin-station-management") {
                          setIsStationMenuOpen(!isStationMenuOpen);
                          // Navigate to first submenu item (Danh sách trạm)
                          navigate("/admin-station-management");
                        } else if (item.path === "/admin-user-management") {
                          setIsUserMenuOpen(!isUserMenuOpen);
                          // Navigate to first submenu item (Danh sách khách hàng)
                          navigate("/admin-user-management");
                        } else if (item.path === "/admin-statistic-management") {
                          setIsReportMenuOpen(!isReportMenuOpen);
                          // Navigate to first submenu item (Tổng quan thống kê)
                          navigate("/admin-statistic-management");
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                        isActive || hasActiveSubmenu
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-3 ${
                            isActive || hasActiveSubmenu
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          (item.path === "/admin-station-management" &&
                            isStationMenuOpen) ||
                          (item.path === "/admin-user-management" &&
                            isUserMenuOpen) ||
                          (item.path === "/admin-statistic-management" &&
                            isReportMenuOpen)
                            ? "rotate-180"
                            : ""
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

                    {((item.path === "/admin-station-management" &&
                      isStationMenuOpen) ||
                      (item.path === "/admin-user-management" &&
                        isUserMenuOpen) ||
                      (item.path === "/admin-statistic-management" &&
                        isReportMenuOpen)) && (
                      <div className="ml-4 mt-2 space-y-1 border-l-2 border-indigo-200 pl-4">
                        {item.submenu.map((subItem) => {
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-4 py-2.5 text-sm transition-all duration-200 rounded-lg ${
                                isSubActive
                                  ? "bg-indigo-100 text-indigo-700 font-medium shadow-sm border-l-2 border-indigo-500"
                                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:font-medium"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                    }`}
                  >
                    <span
                      className={`mr-3 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default AdminSidebar;
