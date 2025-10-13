import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import apiService from "../../../services/apiService";

const PinslotManagement = () => {
  const navigate = useNavigate();
  const [pinslots, setPinslots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStationId, setFilterStationId] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // Load pinslots from API
  useEffect(() => {
    loadPinslots();
  }, []);

  const loadPinslots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPinslots();
      
      // Transform API data to include station names
      const transformedPinslots = response.data.map((pinslot) => ({
        id: pinslot.pinID,
        pinId: pinslot.pinID,
        pinPercent: pinslot.pinPercent,
        pinHealth: pinslot.pinHealth,
        pinStatus: pinslot.pinStatus,
        status: pinslot.status,
        userId: pinslot.userID,
        stationId: pinslot.stationID,
        stationName: `Trạm ${pinslot.stationID}` // We'll get actual station name later
      }));
      
      setPinslots(transformedPinslots);
    } catch (err) {
      console.error("Error loading pinslots:", err);
      setError("Không thể tải danh sách pin slot. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPinslots = () => {
    if (isFiltered && filterStationId) {
      loadPinslotsByStation(filterStationId);
    } else {
      loadPinslots();
    }
  };

  const loadPinslotsByStation = async (stationId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPinslotsByStation(stationId);
      
      // Transform API data to include station names
      const transformedPinslots = response.data.map((pinslot) => ({
        id: pinslot.pinID,
        pinId: pinslot.pinID,
        pinPercent: pinslot.pinPercent,
        pinHealth: pinslot.pinHealth,
        pinStatus: pinslot.pinStatus,
        status: pinslot.status,
        userId: pinslot.userID,
        stationId: pinslot.stationID,
        stationName: `Trạm ${pinslot.stationID}`
      }));
      
      setPinslots(transformedPinslots);
      setIsFiltered(true);
    } catch (err) {
      console.error("Error loading pinslots by station:", err);
      setError("Không thể tải danh sách pin slot theo trạm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (filterStationId.trim()) {
      loadPinslotsByStation(filterStationId);
    } else {
      setError("Vui lòng nhập Station ID để tìm kiếm.");
    }
  };

  const clearFilter = () => {
    setFilterStationId("");
    setIsFiltered(false);
    loadPinslots();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Tạm ngưng";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPinStatusText = (pinStatus) => {
    switch (pinStatus) {
      case 1:
        return "Sẵn sàng";
      case 0:
        return "Đang sạc";
      default:
        return "Không xác định";
    }
  };

  const getPinStatusColor = (pinStatus) => {
    switch (pinStatus) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPercentColor = (percent) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        <AdminHeader
          title="Quản lý Pin Slot"
          subtitle="Quản lý và theo dõi tất cả các pin slot trong hệ thống"
          icon={
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          stats={[
            { label: "Tổng pin slot", value: pinslots.length, color: "bg-blue-400" }
          ]}
        />

        {/* Main Content */}
        <div className="mt-8">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm theo Station ID
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={filterStationId}
                    onChange={(e) => setFilterStationId(e.target.value)}
                    placeholder="Nhập Station ID (ví dụ: 3)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleFilter}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span>Tìm kiếm</span>
                  </button>
                  {isFiltered && (
                    <button
                      onClick={clearFilter}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>Xóa bộ lọc</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isFiltered ? `Pin Slot - Trạm ${filterStationId}` : "Danh sách Pin Slot"}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {pinslots.length} pin slot
              </span>
            </div>
            <button
              onClick={refreshPinslots}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Tải lại</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Pinslots Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinslots.map((pinslot) => (
                <div
                  key={pinslot.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Pin ID: {pinslot.pinId}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {pinslot.stationName}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          pinslot.status
                        )}`}
                      >
                        {getStatusText(pinslot.status)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Pin Percent */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Pin Percent
                      </span>
                      <span
                        className={`text-lg font-bold ${getPercentColor(
                          pinslot.pinPercent
                        )}`}
                      >
                        {pinslot.pinPercent}%
                      </span>
                    </div>

                    {/* Pin Health */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Pin Health
                      </span>
                      <span
                        className={`text-lg font-bold ${getHealthColor(
                          pinslot.pinHealth
                        )}`}
                      >
                        {pinslot.pinHealth}%
                      </span>
                    </div>

                    {/* Pin Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Trạng thái Pin
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPinStatusColor(
                          pinslot.pinStatus
                        )}`}
                      >
                        {getPinStatusText(pinslot.pinStatus)}
                      </span>
                    </div>

                    {/* Station ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Station ID
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {pinslot.stationId}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && pinslots.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có pin slot nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có pin slot nào trong hệ thống.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PinslotManagement;
