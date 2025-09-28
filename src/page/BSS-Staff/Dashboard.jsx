import React, { useState, useEffect } from "react";
import StaffLayout from "./component/StaffLayout";

const StaffDashboard = () => {
  // State cho quản lý tồn kho pin
  const [batteryInventory, setBatteryInventory] = useState({
    full: 9,
    charging: 4,
    maintenance: 2,
    total: 15,
  });

  const [batteryCategories, setBatteryCategories] = useState([
    {
      id: 1,
      model: "Battery A",
      capacity: "60Ah",
      full: 5,
      total: 5,
    },
    {
      id: 2,
      model: "Battery B",
      capacity: "80Ah",
      full: 4,
      total: 5,
    },
    {
      id: 3,
      model: "Battery C",
      capacity: "100Ah",
      full: 3,
      total: 5,
    },
  ]);

  // State cho giao dịch gần đây
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      transactionId: "TX001",
      time: "10:30",
      batteryType: "Battery A → Battery A",
      slot: 5,
      status: "completed",
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      transactionId: "TX002",
      time: "10:25",
      batteryType: "Battery B → Battery B",
      slot: 8,
      status: "completed",
    },
    {
      id: 3,
      customerName: "Lê Minh C",
      transactionId: "TX003",
      time: "10:20",
      batteryType: "Battery A → Battery A",
      slot: 3,
      status: "processing",
    },
    {
      id: 4,
      customerName: "Phạm Văn D",
      transactionId: "TX004",
      time: "10:15",
      batteryType: "Battery C → Battery C",
      slot: 12,
      status: "completed",
    },
  ]);

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Dashboard</h1>
            <p className="text-indigo-100 mt-2">
              Tổng quan hoạt động trạm đổi pin BSS-001
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Quản lý: Nguyễn Văn Staff
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Mã trạm: BSS-001
            </span>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê tổng quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pin Đầy Card */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {batteryInventory.full}
              </div>
            </div>

            {/* Pin Đang Sạc Card */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đang sạc
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {batteryInventory.charging}
              </div>
            </div>

            {/* Pin Bảo Dưỡng Card */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {batteryInventory.maintenance}
              </div>
            </div>

            {/* Giao Dịch Hôm Nay Card */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Giao dịch hôm nay
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">24</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phân Bố Kho Pin */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Phân Bố Kho Pin
            </h2>

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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Thao Tác Nhanh
            </h2>

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
                <span className="text-sm font-medium">Xem Giao dịch</span>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm font-medium">Quản lý Trạm</span>
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
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 mb-5 text-xl font-semibold">
            Giao Dịch Gần Đây
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Khách hàng
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Giao dịch
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Pin & Slot
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="font-medium text-gray-800">
                        {transaction.customerName}
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="text-gray-600">
                        {transaction.transactionId}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {transaction.time}
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="text-gray-600">
                        {transaction.batteryType}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Slot {transaction.slot}
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : "Đang xử lý"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
