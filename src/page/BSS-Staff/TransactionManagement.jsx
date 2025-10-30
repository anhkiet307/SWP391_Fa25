import React, { useEffect, useState } from "react";
import StaffLayout from "./component/StaffLayout";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";

const TransactionManagement = () => {
  const { user } = useAuth();
  const [station, setStation] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfoById, setUserInfoById] = useState({});
  const [vehiclesByUserId, setVehiclesByUserId] = useState({});
  const [expandedRowIds, setExpandedRowIds] = useState(new Set());
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    transaction: null,
  });

  // Format ISO time (server UTC or with TZ) to local time dd/MM/yyyy HH:mm:ss (no manual offset)
  const formatPlus7 = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
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
        const stRes = await apiService.getStationsByUser(user.userID);
        const st = Array.isArray(stRes?.data) ? stRes.data[0] : null;
        setStation(st || null);
        if (st?.stationID) {
          const txRes = await apiService.getTransactionsByStation(st.stationID);
          const list = Array.isArray(txRes?.data) ? txRes.data : [];
          const mapped = list.map((t) => ({
            id: t.transactionID,
            customerId: t.userID,
            customerName: `KH #${t.userID}`,
            slot: t.pinID,
            pack: t.pack || 0, // Thêm field pack từ API response
            status:
              t.status === 0
                ? "pending"
                : t.status === 1
                ? "completed"
                : t.status === 2
                ? "expired"
                : "cancelled",
            payment: t.amount || 0,
            createdAtLocal:
              formatPlus7(t.createAt) ||
              (t.createAt ? t.createAt.replace("T", " ").split(".")[0] : ""),
            expireAtLocal:
              formatPlus7(t.expireAt) ||
              (t.expireAt ? t.expireAt.replace("T", " ").split(".")[0] : ""),
          }));
          setTransactions(mapped);

          // Fetch bổ sung: driver info + vehicles theo userID
          const uniqueUserIds = [
            ...new Set(list.map((t) => t.userID).filter(Boolean)),
          ];
          try {
            const driversRes = await apiService.listDrivers();
            const drivers = Array.isArray(driversRes?.data)
              ? driversRes.data
              : [];
            const infoMap = {};
            drivers.forEach((d) => {
              if (d.userID != null) {
                infoMap[d.userID] = {
                  name: d.name,
                  email: d.email,
                  phone: d.phone,
                };
              }
            });
            setUserInfoById(infoMap);

            const vehPairs = await Promise.all(
              uniqueUserIds.map(async (uid) => {
                try {
                  const r = await apiService.getVehiclesByUser(uid);
                  return [uid, Array.isArray(r?.data) ? r.data : []];
                } catch {
                  return [uid, []];
                }
              })
            );
            const vehMap = {};
            vehPairs.forEach(([uid, arr]) => (vehMap[uid] = arr));
            setVehiclesByUserId(vehMap);
          } catch (e) {
            console.warn("Load drivers/vehicles failed", e);
          }
        } else {
          setTransactions([]);
        }
      } catch (e) {
        console.error(e);
        setError("Không thể tải giao dịch");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.userID]);

  const canUpdateToCompleted = (t) => t.status === "pending";

  const showConfirmModal = (transaction) => {
    setConfirmModal({
      isOpen: true,
      transaction: transaction,
    });
  };

  const hideConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      transaction: null,
    });
  };

  const updateToCompleted = async (transaction) => {
    try {
      // Cập nhật trạng thái transaction thành completed
      await apiService.updateTransactionStatus(transaction.id, 1);

      // Nếu pack = 1, gọi API decrement subscription total
      if (transaction.pack === 1) {
        try {
          await apiService.decrementSubscriptionTotal(transaction.customerId);
          console.log(
            `Đã giảm subscription total cho user ${transaction.customerId}`
          );
        } catch (decrementError) {
          console.error("Lỗi khi giảm subscription total:", decrementError);
          // Không hiển thị lỗi cho user vì transaction đã được cập nhật thành công
        }
      }

      setTransactions(
        transactions.map((t) =>
          t.id === transaction.id ? { ...t, status: "completed" } : t
        )
      );

      // Đóng modal sau khi thành công
      hideConfirmModal();
    } catch (e) {
      console.error(e);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  const toggleExpand = (id) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <StaffLayout>
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold m-0 flex items-center">
                <svg
                  className="w-8 h-8 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4z" />
                </svg>
                Quản lý Giao dịch
              </h1>
              <p className="text-green-100 mt-2">
                Xem và quản lý các giao dịch đổi pin tại trạm
              </p>
              {station?.stationName && (
                <p className="text-sm text-green-100 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Trạm: {station.stationName}
                </p>
              )}
            </div>
            {isLoading && (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm">Đang tải...</span>
              </div>
            )}
          </div>
          {error && <p className="text-xs mt-2 text-red-200">{error}</p>}
        </div>

        {/* Thống kê giao dịch */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê giao dịch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg text-center shadow-md border-t-4 border-green-500 hover:transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
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
              <div className="text-4xl font-bold text-green-600 mb-2">
                {transactions.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Hoàn thành
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md border-t-4 border-yellow-500 hover:transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-yellow-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {transactions.filter((t) => t.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Chờ xử lý</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md border-t-4 border-red-500 hover:transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-red-500 mr-2"
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
              <div className="text-4xl font-bold text-red-600 mb-2">
                {transactions.filter((t) => t.status === "cancelled").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Đã hủy</div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md border-t-4 border-gray-500 hover:transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-gray-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-600 mb-2">
                {transactions.filter((t) => t.status === "expired").length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Đã hết hạn
              </div>
            </div>
          </div>
          <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-green-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.187 1.276V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.187-1.276V5z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-3xl font-bold text-green-700">
                {transactions
                  .filter((t) => t.status === "completed")
                  .reduce((sum, t) => sum + t.payment, 0)
                  .toLocaleString("vi-VN")}{" "}
                VNĐ
              </div>
            </div>
            <div className="text-sm text-green-700 font-medium">
              Tổng doanh thu
            </div>
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
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Mã KH
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Tên KH
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Slot
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Trạng thái
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Thanh toán
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Thời gian
                  </th>
                  <th className="p-3 text-left border-b border-gray-200 font-semibold text-gray-800 text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-left border-b border-gray-200 text-sm">
                        {transaction.customerId}
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                            {(
                              userInfoById[transaction.customerId]?.name ||
                              transaction.customerName ||
                              "?"
                            )
                              .toString()
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium">
                              {userInfoById[transaction.customerId]?.name ||
                                transaction.customerName}
                            </div>
                            {userInfoById[transaction.customerId]?.phone && (
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {userInfoById[transaction.customerId]?.phone}
                              </div>
                            )}
                          </div>
                        </div>
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
                              : transaction.status === "expired"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Hoàn thành"
                            : transaction.status === "pending"
                            ? "Chờ xử lý"
                            : transaction.status === "expired"
                            ? "Đã hết hạn"
                            : "Đã hủy"}
                        </span>
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-sm">
                        {Number(transaction.payment || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VNĐ
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-sm">
                        <div className="space-y-0.5">
                          <div>
                            <span className="text-gray-500">Tạo:</span>{" "}
                            {transaction.createdAtLocal}
                          </div>
                          <div>
                            <span className="text-gray-500">Hết hạn:</span>{" "}
                            {transaction.expireAtLocal}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-left border-b border-gray-200 text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="px-3 py-1.5 rounded-md border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 text-xs font-medium transition-all hover:shadow-md"
                            onClick={() => toggleExpand(transaction.id)}
                          >
                            {expandedRowIds.has(transaction.id)
                              ? "Ẩn chi tiết"
                              : "Chi tiết"}
                          </button>
                          {transaction.status === "pending" && (
                            <button
                              className="px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                              onClick={() => showConfirmModal(transaction)}
                            >
                              ✓ Xác nhận
                            </button>
                          )}
                          {transaction.status === "completed" && (
                            <span className="text-xs text-green-600 font-medium flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Hoàn thành
                            </span>
                          )}
                          {transaction.status === "cancelled" && (
                            <span className="text-xs text-gray-500 italic">
                              Đã hủy
                            </span>
                          )}
                          {transaction.status === "expired" && (
                            <span className="text-xs text-gray-600 font-medium">
                              Đã hết hạn
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRowIds.has(transaction.id) && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-4 bg-gray-50 border-b border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                              <div className="font-semibold text-gray-800 mb-3">
                                Thông tin khách hàng
                              </div>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="text-gray-500">Tên:</span>{" "}
                                  {userInfoById[transaction.customerId]?.name ||
                                    "-"}
                                </div>
                                <div>
                                  <span className="text-gray-500">Email:</span>{" "}
                                  {userInfoById[transaction.customerId]
                                    ?.email || "-"}
                                </div>
                                <div>
                                  <span className="text-gray-500">SĐT:</span>{" "}
                                  {userInfoById[transaction.customerId]
                                    ?.phone || "-"}
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                              <div className="font-semibold text-gray-800 mb-3">
                                Phương tiện
                              </div>
                              {(vehiclesByUserId[transaction.customerId] || [])
                                .length === 0 ? (
                                <div className="text-gray-500">
                                  Không có phương tiện
                                </div>
                              ) : (
                                <div className="divide-y">
                                  {(
                                    vehiclesByUserId[transaction.customerId] ||
                                    []
                                  ).map((v) => (
                                    <div
                                      key={v.vehicleID}
                                      className="flex items-center justify-between py-2"
                                    >
                                      <div className="text-gray-800 font-medium">
                                        {v.licensePlate}
                                      </div>
                                      <div className="text-gray-600">
                                        {v.vehicleType}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal xác nhận */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận giao dịch
                </h3>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn xác nhận giao dịch này?
                </p>
              </div>
            </div>

            {/* Thông tin transaction */}
            {confirmModal.transaction && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Mã KH:</span>
                    <span className="ml-2 font-medium">
                      {confirmModal.transaction.customerId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Slot:</span>
                    <span className="ml-2 font-medium">
                      Slot {confirmModal.transaction.slot}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tên KH:</span>
                    <span className="ml-2 font-medium">
                      {userInfoById[confirmModal.transaction.customerId]
                        ?.name || confirmModal.transaction.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Thanh toán:</span>
                    <span className="ml-2 font-medium">
                      {Number(
                        confirmModal.transaction.payment || 0
                      ).toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </span>
                  </div>
                </div>
                {confirmModal.transaction.pack === 1 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-blue-800 font-medium">
                        Giao dịch này sẽ giảm số lần sử dụng còn lại của Gói
                        thành viên
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={hideConfirmModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => updateToCompleted(confirmModal.transaction)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ✓ Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
};

export default TransactionManagement;
