import React, { useState, useEffect } from "react";
import StaffLayout from "./component/StaffLayout";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

const StaffDashboard = () => {
  const { user } = useAuth();

  const [station, setStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Tổng quan pin và slot
  const [inventory, setInventory] = useState({
    fullPins: 0,
    notFullPins: 0,
    availableSlots: 0,
    unavailableSlots: 0,
    rentingSlots: 0,
    totalPins: 0,
  });

  // Giao dịch gần đây
  const [recentTransactions, setRecentTransactions] = useState([]);

  const formatLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.userID) return;
      setIsLoading(true);
      setError("");
      try {
        // Lấy trạm theo user
        const stRes = await apiService.getStationsByUser(user.userID);
        const st = Array.isArray(stRes?.data) ? stRes.data[0] : null;
        setStation(st || null);

        if (st?.stationID) {
          // Lấy pinSlots
          const psRes = await apiService.getPinslotsByStation(st.stationID);
          const list = Array.isArray(psRes?.data) ? psRes.data : [];

          const fullPins = list.filter((x) => x.pinStatus === 1).length;
          const notFullPins = list.filter((x) => x.pinStatus === 0).length;
          const availableSlots = list.filter((x) => x.status === 1).length;
          const unavailableSlots = list.filter((x) => x.status === 0).length;
          const rentingSlots = list.filter((x) => x.status === 2).length;

          setInventory({
            fullPins,
            notFullPins,
            availableSlots,
            unavailableSlots,
            rentingSlots,
            totalPins: list.length,
          });

          // Lấy giao dịch theo station
          const txRes = await apiService.getTransactionsByStation(st.stationID);
          const txList = Array.isArray(txRes?.data) ? txRes.data : [];
          const mapped = txList.slice(0, 10).map((t) => ({
            id: t.transactionID,
            userId: t.userID,
            slot: t.pinID,
            amount: t.amount || 0,
            status:
              t.status === 0
                ? "pending"
                : t.status === 1
                ? "completed"
                : t.status === 2
                ? "expired"
                : "cancelled",
            createdAt: formatLocal(t.createAt),
          }));
          setRecentTransactions(mapped);
        } else {
          setInventory({
            fullPins: 0,
            notFullPins: 0,
            availableSlots: 0,
            unavailableSlots: 0,
            rentingSlots: 0,
            totalPins: 0,
          });
          setRecentTransactions([]);
        }
      } catch (e) {
        console.error(e);
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.userID]);

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-semibold m-0">Dashboard</h1>
          <p className="text-green-100 mt-2">
            Tổng quan hoạt động{" "}
            {station?.stationName ? `- ${station.stationName}` : "trạm"}
          </p>
          {isLoading && <p className="text-xs mt-1">Đang tải dữ liệu…</p>}
          {error && <p className="text-xs mt-1 text-red-200">{error}</p>}
        </div>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê tổng quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pin đầy */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-t-4 border-green-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-green-600">
                {inventory.fullPins}
              </div>
            </div>
            {/* Pin chưa đầy */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-t-4 border-yellow-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-yellow-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Pin chưa đầy
              </h3>
              <div className="text-4xl font-bold m-0 text-yellow-600">
                {inventory.notFullPins}
              </div>
            </div>
            {/* Slot đang thuê */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-t-4 border-blue-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Slot đang thuê
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-600">
                {inventory.rentingSlots}
              </div>
            </div>
            {/* Slot khả dụng */}
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform border-t-4 border-emerald-500">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-emerald-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Slot khả dụng
              </h3>
              <div className="text-4xl font-bold m-0 text-emerald-600">
                {inventory.availableSlots}
              </div>
            </div>
          </div>
        </div>
        {/* Thống kê slot */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-800 mb-5 text-xl font-semibold">
              Trạng thái slot
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-5 text-center transform transition-all hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-emerald-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-emerald-700">
                  {inventory.availableSlots}
                </div>
                <div className="text-sm text-emerald-700 font-medium mt-2">
                  Cho phép đặt
                </div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5 text-center transform transition-all hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-gray-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-700">
                  {inventory.unavailableSlots}
                </div>
                <div className="text-sm text-gray-700 font-medium mt-2">
                  Không cho phép đặt
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 text-center transform transition-all hover:shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-blue-700">
                  {inventory.rentingSlots}
                </div>
                <div className="text-sm text-blue-700 font-medium mt-2">
                  Đang thuê
                </div>
              </div>
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
                    Mã KH
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Slot
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {tx.userId}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      Slot {tx.slot}
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : tx.status === "expired"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status === "completed"
                          ? "Hoàn thành"
                          : tx.status === "pending"
                          ? "Chờ xử lý"
                          : tx.status === "expired"
                          ? "Đã hết hạn"
                          : "Đã hủy"}
                      </span>
                    </td>
                    <td className="p-3 text-left border-b border-gray-200 text-sm">
                      {tx.createdAt}
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
