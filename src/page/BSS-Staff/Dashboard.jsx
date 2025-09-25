import React, { useState, useEffect } from "react";
import StaffLayout from "./component/StaffLayout";

const StaffDashboard = () => {
  // State cho quản lý tồn kho pin
  const [batteryInventory, setBatteryInventory] = useState({
    full: 45,
    charging: 23,
    maintenance: 8,
    total: 76,
  });

  const [batteryCategories, setBatteryCategories] = useState([
    {
      id: 1,
      model: "LFP-60Ah",
      capacity: "60Ah",
      full: 32,
      total: 50,
    },
    {
      id: 2,
      model: "LFP-80Ah",
      capacity: "80Ah",
      full: 28,
      total: 40,
    },
    {
      id: 3,
      model: "LFP-100Ah",
      capacity: "100Ah",
      full: 16,
      total: 30,
    },
  ]);

  // State cho giao dịch gần đây
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      transactionId: "TX001",
      time: "10:30",
      batteryType: "LFP-60Ah → LFP-60Ah",
      status: "completed",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      transactionId: "TX002",
      time: "10:25",
      batteryType: "LFP-80Ah → LFP-80Ah",
      status: "completed",
    },
    {
      id: 3,
      customerName: "Lê Minh C",
      transactionId: "TX003",
      time: "10:20",
      batteryType: "LFP-60Ah → LFP-60Ah",
      status: "processing",
    },
    {
      id: 4,
      customerName: "Phạm Văn D",
      transactionId: "TX004",
      time: "10:15",
      batteryType: "LFP-100Ah → LFP-100Ah",
      status: "completed",
    },
  ]);

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Tổng quan hoạt động trạm đổi pin
              </p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors">
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pin Đầy Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {batteryInventory.full}
                </div>
                <div className="text-green-100 text-sm">Pin đầy</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16v2H4zm0 5h16v6H4z" />
                  <path
                    d="M2 4h20v16H2z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                12%
              </div>
            </div>
          </div>

          {/* Pin Đang Sạc Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {batteryInventory.charging}
                </div>
                <div className="text-blue-100 text-sm">Pin đang sạc</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                5%
              </div>
            </div>
          </div>

          {/* Pin Bảo Dưỡng Card */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {batteryInventory.maintenance}
                </div>
                <div className="text-orange-100 text-sm">Cần kiểm tra</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                2%
              </div>
            </div>
          </div>

          {/* Giao Dịch Hôm Nay Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Giao dịch hôm nay</div>
              <svg
                className="w-5 h-5 text-gray-400"
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
            </div>
            <div className="text-3xl font-bold text-gray-800">127</div>
            <div className="text-gray-600 text-sm">Đổi pin thành công</div>
            <div className="mt-4 flex items-center justify-end">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                18%
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phân Bố Kho Pin */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Phân Bố Kho Pin
              </h2>
            </div>

            <div className="space-y-4">
              {batteryCategories.map((category) => {
                const percentage = (category.full / category.total) * 100;
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {category.model}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.full}/{category.total} pin
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thao Tác Nhanh */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Thao Tác Nhanh
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-500 text-white p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-green-600 transition-colors">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm font-medium">Đổi Pin Mới</span>
              </button>

              <button className="bg-white border border-gray-300 text-gray-700 p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors">
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
                    d="M4 6h16v2H4zm0 5h16v6H4z"
                  />
                </svg>
                <span className="text-sm font-medium">Kiểm Tra Kho</span>
              </button>

              <button className="bg-white border border-gray-300 text-gray-700 p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
                <span className="text-sm font-medium">Bảo Dưỡng Pin</span>
              </button>

              <button className="bg-white border border-gray-300 text-gray-700 p-4 rounded-lg flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm font-medium">Xem Báo Cáo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Giao Dịch Gần Đây */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Giao Dịch Gần Đây
              </h2>
            </div>
            <button className="text-green-600 text-sm font-medium hover:text-green-700">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {transaction.customerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transaction.transactionId} - {transaction.time}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.batteryType}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.status === "completed"
                      ? "Hoàn thành"
                      : "Đang xử lý"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
