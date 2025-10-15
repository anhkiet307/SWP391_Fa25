import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import apiService from "../../../services/apiService";

const StaffHeader = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [station, setStation] = useState(null);

  // Fetch station info by current staff user
  useEffect(() => {
    const fetchStation = async () => {
      if (!user?.userID) return;
      try {
        const res = await apiService.getStationsByUser(user.userID);
        // API trả về { status, message, data: [ ... ] }
        const stations = Array.isArray(res?.data) ? res.data : [];
        setStation(stations[0] || null);
      } catch (e) {
        console.error("Failed to fetch station by user:", e);
        setStation(null);
      }
    };
    fetchStation();
  }, [user?.userID]);

  const handleLogout = () => {
    logout();
  };

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          {/* <h1 className="text-2xl font-semibold text-gray-800">
            Quản lý Trạm Đổi Pin
          </h1> */}
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "S"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "Staff"}
                </p>
                <p className="text-xs text-gray-500">
                  Staff • {station?.stationName || "Chưa gán trạm"}
                </p>
                {station?.location && (
                  <p className="text-[10px] text-gray-400 truncate max-w-[220px]">
                    {station.location}
                  </p>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
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
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.name || "Staff"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "staff@example.com"}
                    </p>
                    <div className="mt-2 text-xs text-gray-600">
                      <p className="font-medium">
                        Trạm: {station?.stationName || "Chưa gán trạm"}
                      </p>
                      {station?.location && (
                        <p className="text-gray-500">
                          Vị trí: {station.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
