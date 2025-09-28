import React, { useState } from "react";
import StaffLayout from "./component/StaffLayout";

const TransactionManagement = () => {
  // State cho quản lý giao dịch
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      customerId: "CUST001",
      customerName: "Nguyễn Văn A",
      batteryIn: "Battery A",
      batteryOut: "Chưa có",
      slot: 5,
      status: "completed",
      payment: 50000,
      timestamp: "2024-01-15 14:30:00",
    },
    {
      id: 2,
      customerId: "CUST002",
      customerName: "Trần Thị B",
      batteryIn: "Battery C",
      batteryOut: "Chưa có",
      slot: 8,
      status: "pending",
      payment: 0,
      timestamp: "2024-01-15 15:15:00",
    },
  ]);

  // Hàm xác nhận giao dịch
  const confirmTransaction = (id) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, status: "completed", payment: t.payment || 50000 }
          : t
      )
    );
  };

  // Hàm cập nhật pin nhận về
  const updateBatteryOut = (id, batteryOut) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, batteryOut: batteryOut } : t
      )
    );
  };

  // Hàm hủy giao dịch
  const cancelTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Quản lý Giao dịch</h1>
            <p className="text-indigo-100 mt-2">
              Xem và quản lý các giao dịch đổi pin tại trạm
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

        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
          {/* Thống kê nhanh */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Thống kê giao dịch
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter((t) => t.status === "completed").length}
                </div>
                <div className="text-sm text-green-700">Hoàn thành</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {transactions.filter((t) => t.status === "pending").length}
                </div>
                <div className="text-sm text-yellow-700">Chờ xử lý</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg col-span-2">
                <div className="text-2xl font-bold text-blue-600">
                  {transactions
                    .reduce((sum, t) => sum + t.payment, 0)
                    .toLocaleString("vi-VN")}{" "}
                  VNĐ
                </div>
                <div className="text-sm text-blue-700">Tổng doanh thu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách giao dịch */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-800 mb-5 text-xl font-semibold">
            Danh sách giao dịch
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Mã KH
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Tên KH
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Pin trả về
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Slot
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Pin nhận về
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thanh toán
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thời gian
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.customerId}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.customerName}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.batteryIn}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Slot {transaction.slot}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <select
                        value={transaction.batteryOut}
                        onChange={(e) =>
                          updateBatteryOut(transaction.id, e.target.value)
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Chưa có">Chưa có</option>
                        <option value="Battery A">Battery A</option>
                        <option value="Battery B">Battery B</option>
                        <option value="Battery C">Battery C</option>
                      </select>
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
                          : "Chờ xử lý"}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.payment.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.timestamp}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 text-white border-0 py-1.5 px-3 rounded cursor-pointer text-xs transition-colors hover:bg-green-600"
                            onClick={() => confirmTransaction(transaction.id)}
                          >
                            Xác nhận
                          </button>
                          <button
                            className="bg-red-500 text-white border-0 py-1.5 px-3 rounded cursor-pointer text-xs transition-colors hover:bg-red-600"
                            onClick={() => cancelTransaction(transaction.id)}
                          >
                            Hủy
                          </button>
                        </div>
                      )}
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

export default TransactionManagement;
