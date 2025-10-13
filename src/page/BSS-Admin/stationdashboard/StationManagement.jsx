import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showConfirm, showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminStationManagement = () => {
  const navigate = useNavigate();
  
  // State cho quản lý trạm
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho quản lý staff
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);

  const [selectedStation, setSelectedStation] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [stationToChangeStatus, setStationToChangeStatus] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [stationToAssign, setStationToAssign] = useState(null);
  const [showConfirmAssignModal, setShowConfirmAssignModal] = useState(false);
  const [staffToAssign, setStaffToAssign] = useState(null);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    stationID: "",
    stationName: "",
    location: "",
    status: 1,
    x: "",
    y: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getStations();
        
        // Transform API data to match UI format
        const transformedStations = response.data.map((station) => ({
          id: station.stationID,
          stationId: station.stationID.toString(),
          name: station.stationName,
          address: station.location,
          status: station.status === 1 ? "active" : "maintenance",
          createdAt: station.createAt,
          x: station.x,
          y: station.y,
          userID: station.userID, // Thêm userID để track staff assignment
        }));
        
        setStations(transformedStations);
      } catch (err) {
        console.error("Error loading stations:", err);
        setError("Không thể tải danh sách trạm. Vui lòng thử lại sau.");
        showError("Lỗi khi tải danh sách trạm!");
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Load staff data from API
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setStaffLoading(true);
        const response = await apiService.listStaff();
        
        // Transform staff data
        let staffData = null;
        if (response && response.data && Array.isArray(response.data)) {
          staffData = response.data;
        } else if (response && Array.isArray(response)) {
          staffData = response;
        } else if (response && response.status === "success" && response.data) {
          staffData = response.data;
        }
        
        if (staffData && staffData.length > 0) {
          const transformedStaff = staffData.map((staffMember) => ({
            id: staffMember.userID,
            name: staffMember.name,
            email: staffMember.email,
            phone: staffMember.phone,
            roleID: staffMember.roleID,
            status: staffMember.status === 1 ? "active" : "suspended",
          }));
          setStaff(transformedStaff);
        } else {
          setStaff([]);
        }
      } catch (err) {
        console.error("Error loading staff:", err);
        // Không hiển thị error cho staff loading để không làm phiền user
      } finally {
        setStaffLoading(false);
      }
    };

    loadStaff();
  }, []);

  // Use stations directly without transformation
  const updatedStations = stations;

  // Tính tổng thống kê
  const totalStats = {
    totalStations: stations.length,
    activeStations: stations.filter((s) => s.status === "active").length,
    maintenanceStations: stations.filter((s) => s.status === "maintenance").length,
  };

  // Function to get staff name by userID
  const getStaffName = (userID) => {
    if (!userID) return null;
    const staffMember = staff.find(s => s.id === userID);
    return staffMember ? staffMember.name : "Không tìm thấy";
  };

  // Function to refresh stations list
  const refreshStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getStations();
      
      const transformedStations = response.data.map((station) => ({
        id: station.stationID,
        stationId: station.stationID.toString(),
        name: station.stationName,
        address: station.location,
        status: station.status === 1 ? "active" : "maintenance",
        createdAt: station.createAt,
        x: station.x,
        y: station.y,
        userID: station.userID, // Thêm userID để track staff assignment
      }));
      
      setStations(transformedStations);
    } catch (err) {
      console.error("Error refreshing stations:", err);
      setError("Không thể tải danh sách trạm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Function to open assign staff modal
  const openAssignModal = (station) => {
    setStationToAssign(station);
    setShowAssignModal(true);
  };

  // Function to get assigned staff IDs
  const getAssignedStaffIds = () => {
    return stations
      .filter(station => station.userID)
      .map(station => station.userID);
  };

  // Function to get available staff (not assigned to any station)
  const getAvailableStaff = () => {
    const assignedStaffIds = getAssignedStaffIds();
    return staff.filter(s => 
      s.status === "active" && 
      !assignedStaffIds.includes(s.id)
    );
  };

  // Function to open confirm assign modal
  const handleAssignStaff = (staffId) => {
    if (!stationToAssign) return;
    
    const selectedStaff = staff.find(s => s.id === staffId);
    if (selectedStaff) {
      setStaffToAssign(selectedStaff);
      setShowConfirmAssignModal(true);
    }
  };

  // Function to confirm and assign staff to station
  const confirmAssignStaff = async () => {
    if (!stationToAssign || !staffToAssign) return;
    
    try {
      await apiService.assignStaff(staffToAssign.id, stationToAssign.id);
      
      // Update local state
      setStations(stations.map(station => 
        station.id === stationToAssign.id 
          ? { ...station, userID: staffToAssign.id }
          : station
      ));
      
      showSuccess(`Đã phân công ${staffToAssign.name} cho trạm ${stationToAssign.name}!`);
      
      // Close modals
      setShowConfirmAssignModal(false);
      setShowAssignModal(false);
      setStationToAssign(null);
      setStaffToAssign(null);
    } catch (error) {
      console.error("Error assigning staff:", error);
      showError("Không thể phân công nhân viên. Vui lòng thử lại!");
    }
  };

  // Function to cancel assign confirmation
  const cancelAssignConfirm = () => {
    setShowConfirmAssignModal(false);
    setStaffToAssign(null);
  };

  // Function to cancel assign modal
  const cancelAssign = () => {
    setShowAssignModal(false);
    setStationToAssign(null);
  };

  // Hàm chuyển đến trang thêm trạm mới
  const handleAddStation = () => {
    navigate("/admin-add-station");
  };

  // Hàm chuyển đến trang điều phối pin
  const handleBatteryDispatch = () => {
    navigate("/admin-battery-dispatch");
  };

  // Hàm mở form chỉnh sửa
  const openEditForm = (station) => {
    setEditFormData({
      stationID: station.id,
      stationName: station.name,
      location: station.address,
      status: station.status === "active" ? 1 : 0,
      x: station.x ? station.x.toString() : "",
      y: station.y ? station.y.toString() : ""
    });
    setShowEditForm(true);
    setSelectedStation(station);
  };

  // Hàm đóng form chỉnh sửa
  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedStation(null);
    setEditFormData({
      stationID: "",
      stationName: "",
      location: "",
      status: 1,
      x: "",
      y: ""
    });
  };

  // Hàm xử lý input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm cập nhật trạm
  const handleUpdateStation = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!editFormData.stationName || !editFormData.location || !editFormData.x || !editFormData.y) {
        showError("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      // Validate numeric fields
      const x = parseFloat(editFormData.x);
      const y = parseFloat(editFormData.y);
      if (isNaN(x) || isNaN(y)) {
        showError("Vui lòng nhập đúng định dạng số cho tọa độ!");
        return;
      }

      // Prepare data without status field
      const updateData = {
        stationID: editFormData.stationID,
        stationName: editFormData.stationName,
        location: editFormData.location,
        x: x,
        y: y
      };

      // Call API to update station
      await apiService.updateStation(updateData);
      
      // Update local state
      setStations(
        stations.map((station) =>
          station.id === editFormData.stationID
            ? {
                ...station,
                name: editFormData.stationName,
                address: editFormData.location,
                x: x,
                y: y
              }
            : station
        )
      );
      
      showSuccess("Cập nhật trạm thành công!");
      closeEditForm();
    } catch (error) {
      console.error("Error updating station:", error);
      showError("Lỗi khi cập nhật trạm!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm mở modal xác nhận xóa
  const openDeleteModal = (station) => {
    setStationToDelete(station);
    setShowDeleteModal(true);
  };

  // Hàm xóa trạm
  const handleDeleteStation = async () => {
    if (stationToDelete) {
      try {
        // Note: API doesn't have delete endpoint, so we'll just remove from local state
        setStations(
          stations.filter((station) => station.id !== stationToDelete.id)
        );
        showSuccess("Đã xóa trạm thành công!");
        setShowDeleteModal(false);
        setStationToDelete(null);
      } catch (error) {
        console.error("Error deleting station:", error);
        showError("Lỗi khi xóa trạm!");
      }
    }
  };

  // Hàm hủy xóa
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStationToDelete(null);
  };

  // Hàm mở modal xác nhận thay đổi trạng thái
  const openStatusModal = (station) => {
    setStationToChangeStatus(station);
    setShowStatusModal(true);
  };

  // Hàm thay đổi trạng thái trạm
  const toggleStationStatus = async () => {
    if (stationToChangeStatus) {
      try {
        // Call API to toggle status on server (API handles the toggle logic)
        await apiService.updateStationStatus(stationToChangeStatus.id);
        
        // Update local state after successful API call
        setStations(
          stations.map((station) =>
              station.id === stationToChangeStatus.id
              ? {
                  ...station,
                  status: station.status === "active" ? "maintenance" : "active",
                }
              : station
          )
        );
        
        showSuccess(
          stationToChangeStatus.status === "active"
            ? "Đã tạm ngưng trạm thành công!"
            : "Đã kích hoạt trạm thành công!"
        );
        setShowStatusModal(false);
        setStationToChangeStatus(null);
      } catch (error) {
        console.error("Error updating station status:", error);
        showError("Lỗi khi cập nhật trạng thái trạm!");
      }
    }
  };

  // Hàm hủy thay đổi trạng thái
  const cancelStatusChange = () => {
    setShowStatusModal(false);
    setStationToChangeStatus(null);
  };

  // Hàm điều phối pin
  const redistributeBatteries = (fromStationId, toStationId, batteryCount) => {
    setStations(
      stations.map((station) => {
        if (station.stationId === fromStationId) {
          return {
            ...station,
            batteryFull: Math.max(0, station.batteryFull - batteryCount),
            batteryCharging: station.batteryCharging + batteryCount,
          };
        }
        if (station.stationId === toStationId) {
          return {
            ...station,
            batteryFull: station.batteryFull + batteryCount,
            batteryCharging: Math.max(
              0,
              station.batteryCharging - batteryCount
            ),
          };
        }
        return station;
      })
    );
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Quản lý Trạm Đổi Pin"
          subtitle="Quản lý và theo dõi tất cả các trạm đổi pin trong hệ thống"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          stats={[
            { label: "Tổng số trạm", value: totalStats.totalStations, color: "bg-blue-400" }
          ]}
        />

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
            Tổng quan hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Tổng trạm
              </h3>
              <div className="text-4xl font-bold m-0 text-blue-500">
                {totalStats.totalStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Đang hoạt động
              </h3>
              <div className="text-4xl font-bold m-0 text-green-500">
                {totalStats.activeStations}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
              <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                Bảo dưỡng
              </h3>
              <div className="text-4xl font-bold m-0 text-red-500">
                {totalStats.maintenanceStations}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Danh sách trạm đổi pin
          </h2>
          <div className="flex gap-3">
            <button
              onClick={refreshStations}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Tải lại</span>
            </button>
            <button
              onClick={handleAddStation}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm trạm mới
            </button>
            <button
              onClick={handleBatteryDispatch}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Điều phối pin
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-lg font-medium text-gray-600">Đang tải danh sách trạm...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-lg font-medium text-red-800">{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Danh sách trạm */}
        {!loading && !error && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-4 text-center font-semibold text-base">
                    Mã trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Tên trạm
                  </th>
                  <th className="p-4 text-left font-semibold text-base">
                    Địa chỉ
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Nhân viên
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Trạng thái
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Ngày tạo
                  </th>
                  <th className="p-4 text-center font-semibold text-base">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {updatedStations.map((station, index) => (
                  <tr 
                    key={station.id} 
                    className={`hover:bg-indigo-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                        <div className="font-bold text-base text-indigo-600">
                          {station.stationId}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-base text-gray-800">
                        {station.name}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {station.address}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                        {station.userID ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {getStaffName(station.userID)}
                          </span>
                        ) : (
                          <button
                            onClick={() => openAssignModal(station)}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors cursor-pointer"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Phân công
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                      <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          station.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {station.status === "active"
                          ? "Hoạt động"
                          : "Bảo dưỡng"}
                      </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center">
                        <div className="text-sm text-gray-700 text-center">
                          <div className="font-medium text-gray-800">
                            {new Date(station.createdAt).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(station.createdAt).toLocaleTimeString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex justify-center items-center gap-2">
                        {/* Chi tiết */}
                        <button
                          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => setSelectedStation(station)}
                          title="Chi tiết"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chi tiết
                          </div>
                        </button>

                        {/* Xem Pin Slot */}
                        <button
                          className="group relative bg-purple-500 hover:bg-purple-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => navigate(`/admin-pinslot-management?stationId=${station.id}&stationName=${encodeURIComponent(station.name)}`)}
                          title="Xem pin slot"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Xem pin slot
                          </div>
                        </button>

                        {/* Sửa */}
                        <button
                          className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          onClick={() => openEditForm(station)}
                          title="Sửa"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Chỉnh sửa
                          </div>
                        </button>

                        {/* Toggle Status */}
                        <button
                          className={`group relative p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-white ${
                            station.status === "active"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          onClick={() => openStatusModal(station)}
                          title={
                            station.status === "active"
                              ? "Tạm ngưng hoạt động"
                              : "Kích hoạt trạm"
                          }
                        >
                          {station.status === "active" ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          )}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            {station.status === "active" ? "Tạm ngưng" : "Kích hoạt"}
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Modal chi tiết trạm */}
        {selectedStation && !showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        {selectedStation.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 backdrop-blur-sm">
                          ID: {selectedStation.stationId}
                        </span>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                          selectedStation.status === "active"
                            ? "bg-green-500 bg-opacity-20 text-green-100"
                            : "bg-red-500 bg-opacity-20 text-red-100"
                        }`}>
                          {selectedStation.status === "active" ? "🟢 Hoạt động" : "🔴 Bảo dưỡng"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="p-3 text-white hover:text-red-200 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 bg-gray-50">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Thông tin trạm</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Địa chỉ */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-blue-600 mb-1">Địa chỉ</div>
                        <div className="text-base text-gray-800 font-medium">{selectedStation.address}</div>
                      </div>
                    </div>

                    {/* Ngày tạo */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-green-600 mb-1">Ngày tạo</div>
                        <div className="text-base text-gray-800 font-medium">
                          {new Date(selectedStation.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(selectedStation.createdAt).toLocaleTimeString("vi-VN")}
                        </div>
                      </div>
                    </div>

                    {/* Tọa độ X */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-orange-600 mb-1">Tọa độ X</div>
                        <div className="text-base text-gray-800 font-medium">{selectedStation.x || "N/A"}</div>
                      </div>
                    </div>

                    {/* Tọa độ Y */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-pink-600 mb-1">Tọa độ Y</div>
                        <div className="text-base text-gray-800 font-medium">{selectedStation.y || "N/A"}</div>
                      </div>
                    </div>

                    {/* Nhân viên phân công */}
                    {selectedStation.userID ? (
                      <>
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-purple-600 mb-1">Nhân viên phụ trách</div>
                            <div className="text-base text-gray-800 font-medium">
                              {getStaffName(selectedStation.userID) || "Không tìm thấy"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-cyan-600 mb-1">Số điện thoại</div>
                            <div className="text-base text-gray-800 font-medium">
                              {(() => {
                                const staffMember = staff.find(s => s.id === selectedStation.userID);
                                return staffMember ? `(+84) ${staffMember.phone}` : "N/A";
                              })()}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-400 mb-1">Nhân viên phụ trách</div>
                          <div className="text-base text-gray-500 font-medium italic">
                            Chưa phân công nhân viên
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && stationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[85vh] flex flex-col transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2">
                  Xác nhận xóa trạm
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  Bạn có chắc chắn muốn xóa trạm này không?
                </p>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 bg-gray-50 flex-1 overflow-y-auto">
                {/* Cảnh báo quan trọng - Hiển thị đầu tiên */}
                <div className="mb-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                        </svg>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-red-800 mb-2">
                        ⚠️ Cảnh báo quan trọng!
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-red-700 leading-relaxed">
                        <strong>Hành động này không thể hoàn tác.</strong> Tất
                        cả dữ liệu liên quan đến trạm sẽ bị{" "}
                        <strong>xóa vĩnh viễn</strong>, bao gồm:
                      </p>
                      <ul className="mt-2 text-xs sm:text-sm font-medium text-red-700 list-disc list-inside space-y-1">
                        <li>
                          <strong>Lịch sử giao dịch</strong> và dữ liệu khách
                          hàng
                        </li>
                        <li>
                          <strong>Thông tin pin</strong> và trạng thái thiết bị
                        </li>
                        <li>
                          <strong>Báo cáo doanh thu</strong> và thống kê
                        </li>
                      </ul>
                      </div>
                    </div>
                </div>

                {/* Thông tin trạm - Tinh gọn */}
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                            {stationToDelete.name}
                          </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {stationToDelete.stationId}
                            </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              stationToDelete.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stationToDelete.status === "active"
                              ? "🟢 Hoạt động"
                              : "🔴 Bảo dưỡng"}
                            </span>
                          </div>
                      </div>
                          </div>
                        </div>

                  {/* Thông tin tóm tắt */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-green-600 mb-1">
                        Ngày tạo
                      </p>
                      <p className="text-xs font-bold text-gray-600">
                        {new Date(stationToDelete.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(stationToDelete.createdAt).toLocaleTimeString("vi-VN")}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="text-xs font-medium text-purple-600 mb-1">
                        Trạng thái
                      </p>
                      <p className="text-xs font-bold text-purple-600">
                        {stationToDelete.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                      </p>
                    </div>
                  </div>
                        </div>
                      </div>
                      
              {/* Footer - Fixed at bottom */}
              <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex-shrink-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleDeleteStation}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Xóa trạm
                  </button>
                          </div>
                        </div>
                        </div>
                      </div>
        )}

        {/* Modal xác nhận thay đổi trạng thái */}
        {showStatusModal && stationToChangeStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {stationToChangeStatus.status === "active"
                    ? "Tạm ngưng trạm"
                    : "Kích hoạt trạm"}
                </h3>
                <p className="text-gray-600 text-center">
                  Bạn có chắc chắn muốn{" "}
                  {stationToChangeStatus.status === "active"
                    ? "tạm ngưng hoạt động trạm"
                    : "kích hoạt trạm"}{" "}
                  không?
                </p>
                        </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {stationToChangeStatus.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {stationToChangeStatus.stationId}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            stationToChangeStatus.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stationToChangeStatus.status === "active"
                            ? "🟢 Hoạt động"
                            : "🔴 Bảo dưỡng"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Thông báo */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        {stationToChangeStatus.status === "active"
                          ? "Trạm sẽ được tạm ngưng và ngừng hoạt động."
                          : "Trạm sẽ được kích hoạt và bắt đầu hoạt động bình thường."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={cancelStatusChange}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={toggleStationStatus}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl ${
                      stationToChangeStatus.status === "active"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    }`}
                  >
                    {stationToChangeStatus.status === "active"
                      ? "Tạm ngưng"
                      : "Kích hoạt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Station Modal */}
        {showEditForm && selectedStation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa trạm</h3>
                      <p className="text-sm text-gray-600">Cập nhật thông tin trạm đổi pin</p>
                    </div>
                  </div>
                  <button
                    onClick={closeEditForm}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tên trạm */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên trạm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="stationName"
                      value={editFormData.stationName}
                      onChange={handleEditInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập tên trạm"
                      required
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập địa chỉ trạm"
                      required
                    />
                  </div>


                  {/* Tọa độ X */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tọa độ X <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="x"
                      value={editFormData.x}
                      onChange={handleEditInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="21.424112"
                      step="any"
                      required
                    />
                  </div>

                  {/* Tọa độ Y */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tọa độ Y <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="y"
                      value={editFormData.y}
                      onChange={handleEditInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="106.23134"
                      step="any"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end space-x-3">
                <button
                  onClick={closeEditForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleUpdateStation}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isSubmitting ? "Đang cập nhật..." : "Cập nhật"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal phân công nhân viên */}
        {showAssignModal && stationToAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Phân công nhân viên</h3>
                      <p className="text-sm text-gray-600">Chọn nhân viên để phân công cho trạm {stationToAssign.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelAssign}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Station Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{stationToAssign.name}</h4>
                      <p className="text-sm text-gray-600">{stationToAssign.address}</p>
                    </div>
                  </div>
                </div>

                {/* Staff Statistics */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-700 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Tổng số nhân viên: <span className="text-blue-600 font-bold">{staff.filter(s => s.status === "active").length}</span></span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Có thể phân công: <span className="text-green-600 font-bold">{getAvailableStaff().length}</span></span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Đã phân công: <span className="text-red-600 font-bold">{getAssignedStaffIds().length}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff List */}
                <div>
                  {staffLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-600">Đang tải danh sách nhân viên...</span>
                    </div>
                  ) : getAvailableStaff().length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">Không có nhân viên khả dụng</p>
                      <p className="text-gray-400 text-sm">Tất cả nhân viên đã được phân công hoặc không hoạt động</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staff.filter(s => s.status === "active").map((staffMember) => {
                        const isAssigned = getAssignedStaffIds().includes(staffMember.id);
                        const assignedStation = isAssigned ? stations.find(station => station.userID === staffMember.id) : null;
                        const canAssign = !isAssigned;

                        return (
                          <div
                            key={staffMember.id}
                            onClick={canAssign ? () => handleAssignStaff(staffMember.id) : undefined}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                              canAssign 
                                ? 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1' 
                                : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75'
                            }`}
                          >
                            {/* Staff Info */}
                            <div className="flex items-start space-x-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                canAssign 
                                  ? 'bg-gradient-to-br from-blue-100 to-indigo-100' 
                                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
                              }`}>
                                <svg className={`w-6 h-6 ${canAssign ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-base mb-1 ${canAssign ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {staffMember.name}
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                                    <span className="text-sm font-medium text-gray-800">
                                      (+84) {staffMember.phone}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Trạng thái:</span>
                                    {canAssign ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Có thể phân công
                                      </span>
                                    ) : (
                                      <div className="text-right">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          Đã phân công
                                        </span>
                                        {assignedStation && (
                                          <p className="text-xs text-gray-500 mt-1">{assignedStation.name}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Disabled overlay for assigned staff */}
                            {!canAssign && (
                              <div className="absolute top-2 right-2">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal xác nhận phân công nhân viên */}
        {showConfirmAssignModal && staffToAssign && stationToAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Xác nhận phân công
                </h3>
                <p className="text-gray-600 text-center">
                  Bạn có chắc chắn muốn phân công nhân viên này không?
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      {/* Staff Info */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{staffToAssign.name}</h4>
                        <p className="text-xs text-gray-500">Nhân viên</p>
                      </div>

                      {/* Arrow */}
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>

                      {/* Station Info */}
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{stationToAssign.name}</h4>
                        <p className="text-xs text-gray-500">Trạm sạc</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-600">{staffToAssign.name}</span> sẽ được phân công cho{" "}
                        <span className="font-semibold text-indigo-600">{stationToAssign.name}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Địa chỉ: {stationToAssign.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Lưu ý
                      </p>
                      <p className="text-sm text-yellow-700">
                        Sau khi phân công, nhân viên này sẽ chịu trách nhiệm quản lý trạm sạc được chỉ định.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={cancelAssignConfirm}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={confirmAssignStaff}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Xác nhận phân công</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStationManagement;
