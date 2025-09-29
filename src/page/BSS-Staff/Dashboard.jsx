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

        {/* Phân Bố Kho Pin */}
        <div className="mb-8">
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
