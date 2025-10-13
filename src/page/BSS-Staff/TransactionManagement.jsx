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
    {
      id: 3,
      customerId: "CUST003",
      customerName: "Lê Văn C",
      batteryIn: "Battery B",
      batteryOut: "Chưa có",
      slot: 12,
      status: "cancelled",
      payment: 0,
      timestamp: "2024-01-15 16:00:00",
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

  // Hàm hủy giao dịch
  const cancelTransaction = (id) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
    );
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-semibold m-0">Quản lý Giao dịch</h1>
          <p className="text-purple-100 mt-2">
            Xem và quản lý các giao dịch đổi pin tại trạm
          </p>
        </div>

        {/* Thống kê giao dịch */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê giao dịch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {transactions.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Hoàn thành</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {transactions.filter((t) => t.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Chờ xử lý</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-red-500 mb-2">
                {transactions.filter((t) => t.status === "cancelled").length}
              </div>
              <div className="text-sm text-gray-600">Đã hủy</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {transactions
                .filter((t) => t.status === "completed")
                .reduce((sum, t) => sum + t.payment, 0)
                .toLocaleString("vi-VN")}{" "}
              VNĐ
            </div>
            <div className="text-sm text-gray-600">Tổng doanh thu</div>
          </div>
        </div>

        {/* Danh sách giao dịch */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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
                    Slot
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        Slot {transaction.slot}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : transaction.status === "pending"
                          ? "Chờ xử lý"
                          : "Đã hủy"}
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
                      {transaction.status === "cancelled" && (
                        <span className="text-xs text-gray-500 italic">
                          Đã hủy
                        </span>
                      )}
                      {transaction.status === "completed" && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Hoàn thành
                        </span>
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
