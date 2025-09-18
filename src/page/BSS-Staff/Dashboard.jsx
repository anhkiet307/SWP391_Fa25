import React, { useState, useEffect } from "react";
import StaffLayout from "./component/StaffLayout";

const StaffDashboard = () => {
  // State cho quản lý tồn kho pin
  const [batteryInventory, setBatteryInventory] = useState({
    full: 45,
    charging: 12,
    maintenance: 3,
    total: 60,
  });

  const [batteryCategories, setBatteryCategories] = useState([
    {
      id: 1,
      model: "Battery A",
      capacity: "5000mAh",
      full: 20,
      charging: 5,
      maintenance: 1,
    },
    {
      id: 2,
      model: "Battery B",
      capacity: "3000mAh",
      full: 15,
      charging: 4,
      maintenance: 1,
    },
    {
      id: 3,
      model: "Battery C",
      capacity: "7000mAh",
      full: 10,
      charging: 3,
      maintenance: 1,
    },
  ]);

  return (
    <StaffLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg mb-8 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-3xl font-semibold m-0">
              Dashboard Nhân viên Trạm Đổi Pin
            </h1>
            <p className="text-indigo-100 mt-2">
              Quản lý tồn kho và theo dõi hệ thống trạm đổi pin
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Nhân viên: Nguyễn Văn Staff
            </span>
            <span className="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm">
              Trạm: BSS-001
            </span>
          </div>
        </div>

        {/* Tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng số pin
              </h3>
              <div className="text-4xl font-bold m-0">
                {batteryInventory.total}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {batteryInventory.full}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang sạc
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-500">
                {batteryInventory.charging}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {batteryInventory.maintenance}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Quản lý tồn kho pin */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Quản lý tồn kho pin
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Model
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Dung lượng
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Pin đầy
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Đang sạc
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Bảo dưỡng
                    </th>
                    <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {batteryCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="p-3 text-left border-b border-gray-200">
                        {category.model}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200">
                        {category.capacity}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-green-500 font-bold">
                        {category.full}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-yellow-500 font-bold">
                        {category.charging}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-red-500 font-bold">
                        {category.maintenance}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 font-bold bg-gray-50">
                        {category.full +
                          category.charging +
                          category.maintenance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;
