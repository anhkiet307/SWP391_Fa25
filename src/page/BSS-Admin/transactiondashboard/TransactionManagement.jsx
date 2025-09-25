import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError, showInfo } from "../../../utils/toast";

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
      timestamp: "15/01/2024 14:30:00",
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
      timestamp: "15/01/2024 15:15:00",
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
      timestamp: "15/01/2024 16:00:00",
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
      timestamp: "15/01/2024 17:30:00",
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
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-4 text-left font-semibold text-base">
                    Mã GD
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Khách hàng
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Pin trao đổi
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Sức khỏe
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Trạng thái
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Thanh toán
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Nhân viên
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Thời gian
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className={`hover:bg-indigo-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-bold text-base text-indigo-600">
                        {transaction.transactionId}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">{transaction.customerName}</div>
                        <div className="text-gray-600 text-sm mt-1">{transaction.customerId}</div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">{transaction.stationId}</div>
                        <div className="text-gray-600 text-sm mt-1">{transaction.stationName}</div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="text-sm mb-1 flex items-center">
                          <span className="text-red-600 font-bold mr-1">↓</span> 
                          <span className="text-gray-800">{transaction.batteryIn}</span>
                        </div>
                        <div className="text-sm flex items-center">
                          <span className="text-green-600 font-bold mr-1">↑</span> 
                          <span className="text-gray-800">{transaction.batteryOut}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-sm font-bold text-red-600">{transaction.batteryHealthIn}%</div>
                          <div className="text-xs text-gray-500 mt-1">Trả về</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold text-green-600">{transaction.batteryHealthOut}%</div>
                          <div className="text-xs text-gray-500 mt-1">Nhận về</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
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
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-bold text-base text-green-600">
                        {transaction.payment.toLocaleString("vi-VN")} VNĐ
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div>
                        <div className="font-semibold text-base text-gray-800">{transaction.staffName}</div>
                        <div className="text-gray-600 text-sm mt-1">{transaction.staffId}</div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="text-sm text-gray-800">
                        {transaction.timestamp}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center items-center gap-2">
                        {/* Chi tiết */}
                        <button
                          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => setSelectedTransaction(transaction)}
                          title="Chi tiết"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chi tiết
                          </div>
                        </button>

                        {transaction.status === "pending" && (
                          <>
                            {/* Xác nhận */}
                            <button
                              className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                              onClick={() => confirmTransaction(transaction.id)}
                              title="Xác nhận"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Xác nhận
                              </div>
                            </button>

                            {/* Hủy */}
                            <button
                              className="group relative bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                              onClick={() => cancelTransaction(transaction.id)}
                              title="Hủy"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Hủy giao dịch
                              </div>
                            </button>
                          </>
                        )}

                        {transaction.status === "failed" && (
                          <button
                            className="group relative bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => handleComplaint(transaction.id, "Xử lý khiếu nại")}
                            title="Khiếu nại"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Xử lý khiếu nại
                            </div>
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
