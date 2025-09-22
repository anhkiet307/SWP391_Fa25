import React, { useState } from "react";
import AdminLayout from "./component/AdminLayout";
import { showSuccess, showError, showInfo } from "../../utils/toast";

const AdminTransactionManagement = () => {
  // State cho quản lý giao dịch
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      transactionId: "TXN001",
      customerId: "USER001",
      customerName: "Nguyễn Văn A",
      stationId: "BSS-001",
      stationName: "Trạm Quận 1",
      batteryIn: "Battery A - 5000mAh",
      batteryOut: "Battery B - 3000mAh",
      status: "completed",
      payment: 50000,
      timestamp: "2024-01-15 14:30:00",
      batteryHealthIn: 85,
      batteryHealthOut: 92,
      staffId: "STAFF001",
      staffName: "Nguyễn Văn Staff",
    },
    {
      id: 2,
      transactionId: "TXN002",
      customerId: "USER002",
      customerName: "Trần Thị B",
      stationId: "BSS-002",
      stationName: "Trạm Quận 2",
      batteryIn: "Battery C - 7000mAh",
      batteryOut: "Battery A - 5000mAh",
      status: "completed",
      payment: 75000,
      timestamp: "2024-01-15 15:15:00",
      batteryHealthIn: 78,
      batteryHealthOut: 88,
      staffId: "STAFF002",
      staffName: "Trần Thị Manager",
    },
    {
      id: 3,
      transactionId: "TXN003",
      customerId: "USER003",
      customerName: "Lê Văn C",
      stationId: "BSS-001",
      stationName: "Trạm Quận 1",
      batteryIn: "Battery B - 3000mAh",
      batteryOut: "Battery C - 7000mAh",
      status: "pending",
      payment: 100000,
      timestamp: "2024-01-15 16:00:00",
      batteryHealthIn: 90,
      batteryHealthOut: 85,
      staffId: "STAFF001",
      staffName: "Nguyễn Văn Staff",
    },
    {
      id: 4,
      transactionId: "TXN004",
      customerId: "USER001",
      customerName: "Nguyễn Văn A",
      stationId: "BSS-003",
      stationName: "Trạm Quận 3",
      batteryIn: "Battery A - 5000mAh",
      batteryOut: "Battery B - 3000mAh",
      status: "failed",
      payment: 0,
      timestamp: "2024-01-15 17:30:00",
      batteryHealthIn: 45,
      batteryHealthOut: 0,
      staffId: "STAFF003",
      staffName: "Lê Văn Tech",
      failureReason: "Pin trả về có sức khỏe quá thấp",
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    station: "all",
    dateFrom: "",
    dateTo: "",
    customer: "",
  });

  // Tính tổng thống kê
  const totalStats = {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter((t) => t.status === "completed").length,
    pendingTransactions: transactions.filter((t) => t.status === "pending").length,
    failedTransactions: transactions.filter((t) => t.status === "failed").length,
    totalRevenue: transactions.reduce((sum, t) => sum + t.payment, 0),
    averageTransactionValue: Math.round(
      transactions.reduce((sum, t) => sum + t.payment, 0) / transactions.length
    ),
  };

  // Lọc giao dịch theo filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.status !== "all" && transaction.status !== filters.status) {
      return false;
    }
    if (filters.station !== "all" && transaction.stationId !== filters.station) {
      return false;
    }
    if (filters.customer && !transaction.customerName.toLowerCase().includes(filters.customer.toLowerCase())) {
      return false;
    }
    if (filters.dateFrom && transaction.timestamp < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && transaction.timestamp > filters.dateTo) {
      return false;
    }
    return true;
  });

  // Hàm xác nhận giao dịch
  const confirmTransaction = (id) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, status: "completed", payment: t.payment || 50000 }
          : t
      )
    );
    showSuccess("Đã xác nhận giao dịch thành công!");
  };

  // Hàm hủy giao dịch
  const cancelTransaction = (id) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, status: "failed", payment: 0 } : t
      )
    );
    showError("Đã hủy giao dịch!");
  };

  // Hàm xử lý khiếu nại
  const handleComplaint = (id, complaint) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? { ...t, status: "complaint", complaint: complaint }
          : t
      )
    );
    showInfo("Đã ghi nhận khiếu nại và chuyển xử lý!");
  };

  // Lấy danh sách trạm unique
  const stations = [...new Set(transactions.map(t => t.stationId))];

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">
              Quản lý Giao dịch Hệ thống
            </h1>
            <p className="text-indigo-100 mt-2">
              Theo dõi và quản lý tất cả giao dịch đổi pin trong hệ thống
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Tổng giao dịch: {totalStats.totalTransactions}
            </span>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan giao dịch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng giao dịch
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {totalStats.totalTransactions}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Hoàn thành
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.completedTransactions}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Chờ xử lý
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {totalStats.pendingTransactions}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Thất bại
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.failedTransactions}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng doanh thu
              </h3>
              <div className="text-4xl font-bold m-0 text-purple-500">
                {(totalStats.totalRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Giá trị TB
              </h3>
              <div className="text-4xl font-bold m-0 text-orange-500">
                {totalStats.averageTransactionValue.toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
        </div>

        {/* Filters và Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Danh sách giao dịch
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              🔍 Bộ lọc
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg">
              📊 Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Bộ lọc giao dịch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái:
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Tất cả</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạm:
                </label>
                <select
                  value={filters.station}
                  onChange={(e) => setFilters({ ...filters, station: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Tất cả trạm</option>
                  {stations.map((station) => (
                    <option key={station} value={station}>
                      {station}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày:
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày:
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng:
                </label>
                <input
                  type="text"
                  value={filters.customer}
                  onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                  placeholder="Nhập tên khách hàng"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setFilters({
                  status: "all",
                  station: "all",
                  dateFrom: "",
                  dateTo: "",
                  customer: "",
                })}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {/* Danh sách giao dịch */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Mã GD
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Khách hàng
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạm
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Pin trao đổi
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Sức khỏe
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thanh toán
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Nhân viên
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="p-3 text-left border-b border-gray-200 text-sm font-medium">
                      {transaction.transactionId}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{transaction.customerName}</div>
                        <div className="text-gray-500 text-xs">{transaction.customerId}</div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{transaction.stationId}</div>
                        <div className="text-gray-500 text-xs">{transaction.stationName}</div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="text-sm">
                          <span className="text-red-600">↓</span> {transaction.batteryIn}
                        </div>
                        <div className="text-sm">
                          <span className="text-green-600">↑</span> {transaction.batteryOut}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="text-xs text-red-600">{transaction.batteryHealthIn}%</div>
                          <div className="text-xs text-gray-500">Trả về</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-green-600">{transaction.batteryHealthOut}%</div>
                          <div className="text-xs text-gray-500">Nhận về</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : transaction.status === "pending"
                          ? "Chờ xử lý"
                          : transaction.status === "failed"
                          ? "Thất bại"
                          : "Khiếu nại"}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="font-bold text-green-600">
                        {transaction.payment.toLocaleString("vi-VN")} VNĐ
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div>
                        <div className="font-medium">{transaction.staffName}</div>
                        <div className="text-gray-500 text-xs">{transaction.staffId}</div>
                      </div>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {transaction.timestamp}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <div className="flex gap-1">
                        <button
                          className="bg-blue-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-blue-600"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          Chi tiết
                        </button>
                        {transaction.status === "pending" && (
                          <>
                            <button
                              className="bg-green-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-green-600"
                              onClick={() => confirmTransaction(transaction.id)}
                            >
                              Xác nhận
                            </button>
                            <button
                              className="bg-red-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-red-600"
                              onClick={() => cancelTransaction(transaction.id)}
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {transaction.status === "failed" && (
                          <button
                            className="bg-yellow-500 text-white border-0 py-1.5 px-2 rounded cursor-pointer text-xs transition-colors hover:bg-yellow-600"
                            onClick={() => handleComplaint(transaction.id, "Xử lý khiếu nại")}
                          >
                            Khiếu nại
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal chi tiết giao dịch */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-xl font-semibold mb-4">
                Chi tiết giao dịch {selectedTransaction.transactionId}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      {selectedTransaction.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Mã KH:</span>{" "}
                      {selectedTransaction.customerId}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Thông tin trạm</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Mã trạm:</span>{" "}
                      {selectedTransaction.stationId}
                    </div>
                    <div>
                      <span className="font-medium">Tên trạm:</span>{" "}
                      {selectedTransaction.stationName}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Chi tiết pin</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Pin trả về:</span>{" "}
                      {selectedTransaction.batteryIn} ({selectedTransaction.batteryHealthIn}%)
                    </div>
                    <div>
                      <span className="font-medium">Pin nhận về:</span>{" "}
                      {selectedTransaction.batteryOut} ({selectedTransaction.batteryHealthOut}%)
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Thông tin giao dịch</h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          selectedTransaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : selectedTransaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedTransaction.status === "completed"
                          ? "Hoàn thành"
                          : selectedTransaction.status === "pending"
                          ? "Chờ xử lý"
                          : "Thất bại"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Thanh toán:</span>{" "}
                      {selectedTransaction.payment.toLocaleString("vi-VN")} VNĐ
                    </div>
                    <div>
                      <span className="font-medium">Thời gian:</span>{" "}
                      {selectedTransaction.timestamp}
                    </div>
                    <div>
                      <span className="font-medium">Nhân viên:</span>{" "}
                      {selectedTransaction.staffName} ({selectedTransaction.staffId})
                    </div>
                  </div>
                </div>
                {selectedTransaction.failureReason && (
                  <div className="col-span-2">
                    <h4 className="font-medium text-gray-700">Lý do thất bại</h4>
                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                      <p className="text-red-800">{selectedTransaction.failureReason}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionManagement;
