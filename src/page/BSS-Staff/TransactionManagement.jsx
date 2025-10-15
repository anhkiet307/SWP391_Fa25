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
  const updateToCompleted = async (id) => {
    const target = transactions.find((t) => t.id === id);
    if (!target || !canUpdateToCompleted(target)) return;
    try {
      await apiService.updateTransactionStatus(id, 1);
      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, status: "completed" } : t
        )
      );
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
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h1 className="text-3xl font-semibold m-0">Quản lý Giao dịch</h1>
          <p className="text-purple-100 mt-2">
            Xem và quản lý các giao dịch đổi pin tại trạm
          </p>
          {station?.stationName && (
            <p className="text-xs text-purple-100 mt-1">
              Trạm: {station.stationName}
            </p>
          )}
          {isLoading && <p className="text-xs mt-1">Đang tải dữ liệu…</p>}
          {error && <p className="text-xs mt-1 text-red-200">{error}</p>}
        </div>

        {/* Thống kê giao dịch */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Thống kê giao dịch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
            <div className="bg-white p-6 rounded-lg text-center shadow-md">
              <div className="text-4xl font-bold text-gray-500 mb-2">
                {transactions.filter((t) => t.status === "expired").length}
              </div>
              <div className="text-sm text-gray-600">Đã hết hạn</div>
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
                            className="px-3 py-1.5 rounded border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs font-medium transition-colors"
                            onClick={() => toggleExpand(transaction.id)}
                          >
                            {expandedRowIds.has(transaction.id)
                              ? "Ẩn chi tiết"
                              : "Chi tiết"}
                          </button>
                          {transaction.status === "pending" && (
                            <button
                              className="px-3 py-1.5 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-medium shadow-sm"
                              onClick={() => updateToCompleted(transaction.id)}
                            >
                              ✓ Xác nhận
                            </button>
                          )}
                          {transaction.status === "completed" && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Hoàn thành
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
    </StaffLayout>
  );
};

export default TransactionManagement;
