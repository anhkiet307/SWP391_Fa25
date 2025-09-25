import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showInfo, showWarning } from "../../../utils/toast";

const AdminReportManagement = () => {
  // State cho báo cáo
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    from: "01/01/2024",
    to: "31/01/2024",
  });

  // Dữ liệu báo cáo doanh thu
  const revenueData = {
    totalRevenue: 2500000000,
    monthlyGrowth: 15.5,
    dailyAverage: 8064516,
    topStations: [
      {
        stationId: "BSS-001",
        name: "Trạm Quận 1",
        revenue: 62500000,
        transactions: 1250,
      },
      {
        stationId: "BSS-002",
        name: "Trạm Quận 2",
        revenue: 94500000,
        transactions: 1890,
      },
      {
        stationId: "BSS-003",
        name: "Trạm Quận 3",
        revenue: 49000000,
        transactions: 980,
      },
    ],
    dailyRevenue: [
      { date: "01/01/2024", revenue: 7500000, transactions: 150 },
      { date: "02/01/2024", revenue: 8200000, transactions: 164 },
      { date: "03/01/2024", revenue: 9100000, transactions: 182 },
      { date: "04/01/2024", revenue: 8800000, transactions: 176 },
      { date: "05/01/2024", revenue: 9500000, transactions: 190 },
    ],
  };

  // Dữ liệu báo cáo tần suất đổi pin
  const frequencyData = {
    totalSwaps: 15680,
    averageSwapsPerUser: 6.3,
    peakHours: [
      { hour: "07:00-09:00", swaps: 1250, percentage: 8.0 },
      { hour: "12:00-14:00", swaps: 1890, percentage: 12.1 },
      { hour: "17:00-19:00", swaps: 2340, percentage: 14.9 },
      { hour: "19:00-21:00", swaps: 2100, percentage: 13.4 },
    ],
    batteryTypes: [
      { type: "Battery A - 5000mAh", swaps: 6280, percentage: 40.1 },
      { type: "Battery B - 3000mAh", swaps: 4704, percentage: 30.0 },
      { type: "Battery C - 7000mAh", swaps: 4696, percentage: 29.9 },
    ],
  };

  // Dữ liệu báo cáo sức khỏe pin
  const batteryHealthData = {
    averageHealth: 85.2,
    healthDistribution: [
      { range: "90-100%", count: 1200, percentage: 40.0 },
      { range: "80-89%", count: 900, percentage: 30.0 },
      { range: "70-79%", count: 600, percentage: 20.0 },
      { range: "60-69%", count: 240, percentage: 8.0 },
      { range: "<60%", count: 60, percentage: 2.0 },
    ],
    maintenanceNeeded: 45,
    replacementNeeded: 12,
  };

  // Dữ liệu báo cáo khách hàng
  const customerData = {
    totalCustomers: 2500,
    activeCustomers: 2100,
    newCustomers: 150,
    customerRetention: 84.0,
    averageSpending: 1000000,
    topCustomers: [
      { name: "Nguyễn Văn A", transactions: 45, spending: 2250000 },
      { name: "Trần Thị B", transactions: 38, spending: 1900000 },
      { name: "Lê Văn C", transactions: 32, spending: 1600000 },
    ],
  };

  // Hàm xuất báo cáo
  const exportReport = (format) => {
    showSuccess(`Đang xuất báo cáo ${selectedReport} định dạng ${format}...`);
    // Simulate export process
    setTimeout(() => {
      showSuccess(`Đã xuất báo cáo ${selectedReport} thành công!`);
    }, 2000);
  };

  // Hàm tạo báo cáo tùy chỉnh
  const generateCustomReport = () => {
    showInfo("Đang tạo báo cáo tùy chỉnh...");
    // Simulate custom report generation
    setTimeout(() => {
      showSuccess("Báo cáo tùy chỉnh đã được tạo thành công!");
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">Báo cáo & Thống kê</h1>
            <p className="text-indigo-100 mt-2">
              Phân tích và báo cáo hiệu suất hệ thống trạm đổi pin
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Admin: Quản trị hệ thống
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Kỳ báo cáo: {dateRange.from} - {dateRange.to}
            </span>
          </div>
        </div>

        {/* Date Range và Report Type */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày:
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày:
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportReport("PDF")}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                📄 Xuất PDF
              </button>
              <button
                onClick={() => exportReport("Excel")}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                📊 Xuất Excel
              </button>
              <button
                onClick={generateCustomReport}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                ⚙️ Báo cáo tùy chỉnh
              </button>
            </div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setSelectedReport("revenue")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedReport === "revenue"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              💰 Doanh thu
            </button>
            <button
              onClick={() => setSelectedReport("frequency")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedReport === "frequency"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📈 Tần suất đổi pin
            </button>
            <button
              onClick={() => setSelectedReport("battery")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedReport === "battery"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🔋 Sức khỏe pin
            </button>
            <button
              onClick={() => setSelectedReport("customer")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedReport === "customer"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              👥 Khách hàng
            </button>
          </div>
        </div>

        {/* Báo cáo Doanh thu */}
        {selectedReport === "revenue" && (
          <div className="space-y-8">
            {/* Tổng quan doanh thu */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Tổng quan doanh thu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {(revenueData.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-green-700">Tổng doanh thu</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    +{revenueData.monthlyGrowth}%
                  </div>
                  <div className="text-sm text-blue-700">Tăng trưởng tháng</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {(revenueData.dailyAverage / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-purple-700">Trung bình/ngày</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {revenueData.topStations.length}
                  </div>
                  <div className="text-sm text-orange-700">Trạm hoạt động</div>
                </div>
              </div>
            </div>

            {/* Top trạm doanh thu */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Top trạm doanh thu</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <th className="p-4 text-left font-semibold text-base">
                        Trạm
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Doanh thu
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Giao dịch
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Trung bình/GD
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.topStations.map((station, index) => (
                      <tr
                        key={station.stationId}
                        className={`hover:bg-indigo-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-4 border-b border-gray-200">
                          <div>
                            <div className="font-bold text-base text-indigo-600">
                              {station.stationId}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {station.name}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-bold text-base text-green-600">
                            {(station.revenue / 1000000).toFixed(1)}M VNĐ
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-semibold text-base text-gray-800">
                            {station.transactions.toLocaleString("vi-VN")}
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-semibold text-base text-gray-800">
                            {(
                              station.revenue / station.transactions
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Biểu đồ doanh thu theo ngày */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Doanh thu theo ngày
              </h2>
              <div className="space-y-3">
                {revenueData.dailyRevenue.map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium">{day.date}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {day.transactions} giao dịch
                      </div>
                      <div className="font-bold text-green-600">
                        {(day.revenue / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Báo cáo Tần suất đổi pin */}
        {selectedReport === "frequency" && (
          <div className="space-y-8">
            {/* Tổng quan tần suất */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Tổng quan tần suất đổi pin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {frequencyData.totalSwaps.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-sm text-blue-700">Tổng lượt đổi pin</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {frequencyData.averageSwapsPerUser}
                  </div>
                  <div className="text-sm text-green-700">TB/khách hàng</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {frequencyData.peakHours.length}
                  </div>
                  <div className="text-sm text-purple-700">Giờ cao điểm</div>
                </div>
              </div>
            </div>

            {/* Giờ cao điểm */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Giờ cao điểm</h2>
              <div className="space-y-3">
                {frequencyData.peakHours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium">{hour.hour}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {hour.percentage}%
                      </div>
                      <div className="font-bold text-blue-600">
                        {hour.swaps.toLocaleString("vi-VN")} lượt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loại pin phổ biến */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Loại pin phổ biến</h2>
              <div className="space-y-3">
                {frequencyData.batteryTypes.map((battery, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium">{battery.type}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {battery.percentage}%
                      </div>
                      <div className="font-bold text-green-600">
                        {battery.swaps.toLocaleString("vi-VN")} lượt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Báo cáo Sức khỏe pin */}
        {selectedReport === "battery" && (
          <div className="space-y-8">
            {/* Tổng quan sức khỏe pin */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Tổng quan sức khỏe pin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {batteryHealthData.averageHealth}%
                  </div>
                  <div className="text-sm text-green-700">Sức khỏe TB</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {batteryHealthData.maintenanceNeeded}
                  </div>
                  <div className="text-sm text-yellow-700">Cần bảo dưỡng</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {batteryHealthData.replacementNeeded}
                  </div>
                  <div className="text-sm text-red-700">Cần thay thế</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {batteryHealthData.healthDistribution.reduce(
                      (sum, item) => sum + item.count,
                      0
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Tổng pin</div>
                </div>
              </div>
            </div>

            {/* Phân bố sức khỏe pin */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Phân bố sức khỏe pin
              </h2>
              <div className="space-y-3">
                {batteryHealthData.healthDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="font-medium">{item.range}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {item.percentage}%
                      </div>
                      <div className="font-bold text-blue-600">
                        {item.count.toLocaleString("vi-VN")} pin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Báo cáo Khách hàng */}
        {selectedReport === "customer" && (
          <div className="space-y-8">
            {/* Tổng quan khách hàng */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Tổng quan khách hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {customerData.totalCustomers.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-sm text-blue-700">Tổng khách hàng</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {customerData.activeCustomers.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-sm text-green-700">Đang hoạt động</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {customerData.customerRetention}%
                  </div>
                  <div className="text-sm text-purple-700">Tỷ lệ giữ chân</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {(customerData.averageSpending / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-orange-700">Chi tiêu TB</div>
                </div>
              </div>
            </div>

            {/* Top khách hàng */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Top khách hàng</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <th className="p-4 text-left font-semibold text-base">
                        Khách hàng
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Giao dịch
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Tổng chi tiêu
                      </th>
                      <th className="p-4 text-left font-semibold text-base">
                        Chi tiêu TB
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerData.topCustomers.map((customer, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-indigo-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-bold text-base text-gray-800">
                            {customer.name}
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-semibold text-base text-gray-800">
                            {customer.transactions}
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-bold text-base text-green-600">
                            {(customer.spending / 1000000).toFixed(1)}M VNĐ
                          </div>
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <div className="font-semibold text-base text-gray-800">
                            {(
                              customer.spending / customer.transactions
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReportManagement;
