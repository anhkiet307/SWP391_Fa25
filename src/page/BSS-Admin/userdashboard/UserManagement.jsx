import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showConfirm, showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const UserManagement = () => {
  const navigate = useNavigate();
  
  // State cho quản lý người dùng
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho quản lý nhân viên
  const [staff, setStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState(null);


  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    role: "driver",
  });

  const [editUser, setEditUser] = useState({
    userID: "",
    Name: "",
    Email: "",
    roleID: 1,
  });

  // Function to map API staff data to component format
  const mapApiDataToStaff = (apiData) => {
    console.log("Raw Staff API Data:", apiData); // Debug log
    
    // Sắp xếp theo userID tăng dần (cũ nhất lên đầu)
    const sortedData = [...apiData].sort((a, b) => (a.userID || 0) - (b.userID || 0));
    
    return sortedData.map((staffMember, index) => {
      console.log("Processing staff:", staffMember); // Debug log
      
      return {
        id: staffMember.userID || index + 1,
        stt: index + 1, // Số thứ tự từ 1, 2, 3...
        name: staffMember.name || "N/A",
        email: staffMember.email || "N/A",
        phone: staffMember.phone || "N/A",
        role: staffMember.roleID === 2 ? "staff" : staffMember.roleID === 3 ? "admin" : "user",
        status: staffMember.status === 1 ? "active" : "suspended", // 1: active, 0: suspended
        // Thêm các field để tương thích với format user
        totalTransactions: 0,
        totalSpent: 0,
        vehicleInfo: {
          vin: "N/A",
          batteryType: "N/A", 
          lastSwap: null,
        },
        subscription: {
          type: "N/A",
          plan: "N/A",
          expiryDate: null,
          remainingSwaps: 0,
        },
      };
    });
  };

  // Function to map API data to component format
  const mapApiDataToUsers = (apiData) => {
    console.log("Raw API Data:", apiData); // Debug log
    
    // Sắp xếp theo userID tăng dần (cũ nhất lên đầu)
    const sortedData = [...apiData].sort((a, b) => (a.userID || 0) - (b.userID || 0));
    
    return sortedData.map((user, index) => {
      console.log("Processing user:", user); // Debug log cho từng user
      
      return {
        id: user.userID || index + 1,
        stt: index + 1, // Số thứ tự từ 1, 2, 3...
        name: user.name || user.userName || "N/A", // Thử cả name và userName
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role: user.roleID === 1 ? "user" : user.roleID === 2 ? "staff" : "admin",
        status: user.status === 1 ? "active" : "suspended", // 1: active, 0: suspended
        totalTransactions: 0, // API không có field này, để mặc định
        totalSpent: 0, // API không có field này, để mặc định
        vehicleInfo: {
          vin: "N/A", // API không có field này
          batteryType: "N/A", // API không có field này
          lastSwap: null, // API không có field này
        },
        subscription: {
          type: "pay-per-use", // API không có field này, để mặc định
          plan: "Basic", // API không có field này, để mặc định
          expiryDate: null, // API không có field này
          remainingSwaps: 0, // API không có field này, để mặc định
        },
      };
    });
  };

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.listDrivers();
        console.log("Full API Response:", response); // Debug log
        
        // Xử lý cả hai trường hợp: response.data hoặc response trực tiếp
        let userData = null;
        if (response && response.data && Array.isArray(response.data)) {
          userData = response.data;
        } else if (response && Array.isArray(response)) {
          userData = response;
        } else if (response && response.status === "success" && response.data) {
          userData = response.data;
        }
        
        if (userData && userData.length > 0) {
          console.log("User data found:", userData); // Debug log
          const mappedUsers = mapApiDataToUsers(userData);
          console.log("Mapped users:", mappedUsers); // Debug log
          setUsers(mappedUsers);
        } else {
          console.log("No valid user data found"); // Debug log
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Không thể tải danh sách khách hàng. Vui lòng thử lại.");
        showError("Không thể tải danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        setStaffError(null);
        const response = await apiService.listStaff();
        console.log("Full Staff API Response:", response); // Debug log
        
        // Xử lý cả hai trường hợp: response.data hoặc response trực tiếp
        let staffData = null;
        if (response && response.data && Array.isArray(response.data)) {
          staffData = response.data;
        } else if (response && Array.isArray(response)) {
          staffData = response;
        } else if (response && response.status === "success" && response.data) {
          staffData = response.data;
        }
        
        if (staffData && staffData.length > 0) {
          console.log("Staff data found:", staffData); // Debug log
          const mappedStaff = mapApiDataToStaff(staffData);
          console.log("Mapped staff:", mappedStaff); // Debug log
          setStaff(mappedStaff);
        } else {
          console.log("No valid staff data found"); // Debug log
          setStaff([]);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffError("Không thể tải danh sách nhân viên. Vui lòng thử lại.");
        showError("Không thể tải danh sách nhân viên");
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Tính tổng thống kê
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    suspendedUsers: users.filter((u) => u.status === "suspended").length,
    totalTransactions: users.reduce((sum, u) => sum + u.totalTransactions, 0),
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  const staffStats = {
    totalStaff: staff.length,
    activeStaff: staff.filter((s) => s.status === "active").length,
    stationManagers: staff.filter((s) => s.role === "station_manager").length,
  };

  // Hàm thêm người dùng mới
  const handleAddUser = async () => {
    if (newUser.userId && newUser.name && newUser.email) {
      try {
        // Call API to add user (if available)
        // await apiService.addUser(newUser);
        
        // For now, just add to local state and refresh from API
        setNewUser({
          userId: "",
          name: "",
          email: "",
          phone: "",
          role: "driver",
        });
        setShowAddForm(false);
        
        // Refresh the user list from API
        const response = await apiService.listDrivers();
        if (response && response.data) {
          const mappedUsers = mapApiDataToUsers(response.data);
          setUsers(mappedUsers);
        }
        
        showSuccess("Đã thêm người dùng thành công!");
      } catch (error) {
        console.error("Error adding user:", error);
        showError("Không thể thêm người dùng. Vui lòng thử lại.");
      }
    }
  };

  // Hàm cập nhật người dùng
  const handleUpdateUser = async () => {
    try {
      // Gọi API để cập nhật user
      await apiService.updateUser(editUser);
      
      // Xác định xem user thuộc driver list hay staff list dựa trên roleID
      const isStaff = editUser.roleID === 2 || editUser.roleID === 3; // staff hoặc admin
      
      if (isStaff) {
        // Refresh staff list
        try {
          const staffResponse = await apiService.listStaff();
          let staffData = null;
          if (staffResponse && staffResponse.data && Array.isArray(staffResponse.data)) {
            staffData = staffResponse.data;
          } else if (staffResponse && Array.isArray(staffResponse)) {
            staffData = staffResponse;
          } else if (staffResponse && staffResponse.status === "success" && staffResponse.data) {
            staffData = staffResponse.data;
          }
          
          if (staffData && staffData.length > 0) {
            const mappedStaff = mapApiDataToStaff(staffData);
            setStaff(mappedStaff);
          }
        } catch (staffError) {
          console.error("Error refreshing staff list:", staffError);
        }
      } else {
        // Refresh driver list
        try {
          const driverResponse = await apiService.listDrivers();
          let userData = null;
          if (driverResponse && driverResponse.data && Array.isArray(driverResponse.data)) {
            userData = driverResponse.data;
          } else if (driverResponse && Array.isArray(driverResponse)) {
            userData = driverResponse;
          } else if (driverResponse && driverResponse.status === "success" && driverResponse.data) {
            userData = driverResponse.data;
          }
          
          if (userData && userData.length > 0) {
            const mappedUsers = mapApiDataToUsers(userData);
            setUsers(mappedUsers);
          }
        } catch (driverError) {
          console.error("Error refreshing driver list:", driverError);
        }
      }
      
      setShowEditForm(false);
      setEditUser({
        userID: "",
        Name: "",
        Email: "",
        roleID: 1,
      });
      
      showSuccess("Đã cập nhật thông tin người dùng thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
      showError("Không thể cập nhật thông tin người dùng. Vui lòng thử lại.");
    }
  };

  // Hàm xóa người dùng
  const handleDeleteUser = (id) => {
    showConfirm("Bạn có chắc chắn muốn xóa người dùng này?", () => {
        setUsers(users.filter((user) => user.id !== id));
        showSuccess("Đã xóa người dùng thành công!");
    });
  };

  // Hàm thay đổi trạng thái người dùng
  const toggleUserStatus = (id) => {
    // TODO: Gọi API để cập nhật status thực tế
    // Hiện tại chỉ cập nhật local state
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
            }
          : user
      )
    );
    
    // Hiển thị thông báo
    const user = users.find(u => u.id === id);
    if (user) {
      const newStatus = user.status === "active" ? "suspended" : "active";
      const statusText = newStatus === "active" ? "kích hoạt" : "tạm khóa";
      showSuccess(`Đã ${statusText} tài khoản ${user.name}`);
    }
  };

  // Hàm tạo gói thuê pin
  const createSubscriptionPlan = (userId, planType, planName, duration) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              subscription: {
                type: planType,
                plan: planName,
                expiryDate: new Date(
                  Date.now() + duration * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[0],
                remainingSwaps:
                  planType === "monthly" ? 30 : planType === "yearly" ? 365 : 0,
              },
            }
          : user
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Quản lý Người dùng"
          subtitle="Quản lý khách hàng, nhân viên và phân quyền hệ thống"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          }
          stats={[
            { label: "Tổng người dùng", value: userStats.totalUsers, color: "bg-blue-400" }
          ]}
        />

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Khách hàng ({userStats.totalUsers})
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "staff"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nhân viên ({staffStats.totalStaff})
            </button>
          </div>
        </div>

        {/* Thống kê */}
        {activeTab === "users" && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
              Thống kê khách hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng khách hàng
                </h3>
                <div className="text-4xl font-bold m-0 text-blue-500">
                  {userStats.totalUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Đang hoạt động
                </h3>
                <div className="text-4xl font-bold m-0 text-green-500">
                  {userStats.activeUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tạm khóa
                </h3>
                <div className="text-4xl font-bold m-0 text-red-500">
                  {userStats.suspendedUsers}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng giao dịch
                </h3>
                <div className="text-4xl font-bold m-0 text-purple-500">
                  {userStats.totalTransactions}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng doanh thu
                </h3>
                <div className="text-4xl font-bold m-0 text-orange-500">
                  {(userStats.totalRevenue / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-gray-800 text-2xl font-semibold">
            {activeTab === "users"
              ? "Danh sách khách hàng"
              : "Danh sách nhân viên"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (activeTab === "users") {
                  navigate('/admin-add-customer');
                } else {
                  navigate('/admin-add-staff');
                }
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm {activeTab === "users" ? "khách hàng" : "nhân viên"}
            </button>
            {activeTab === "users" && (
              <button 
                onClick={() => navigate('/admin-battery-packages')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Tạo gói thuê pin
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="text-gray-600 text-lg">Đang tải danh sách khách hàng...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && activeTab === "users" && !loading && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 text-lg font-medium mb-2">Có lỗi xảy ra</p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách người dùng */}
        {activeTab === "users" && !loading && !error && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-center font-semibold text-base">
                      STT
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Tên
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Liên hệ
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Số điện thoại
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Trạng thái
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Vai trò
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-lg font-medium mb-2">Chưa có khách hàng nào</p>
                          <p className="text-gray-400 mb-4">Danh sách khách hàng sẽ hiển thị tại đây</p>
                          <button
                            onClick={() => navigate('/admin-add-customer')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Thêm khách hàng đầu tiên
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="font-bold text-base text-indigo-600">
                            {user.stt}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="text-sm text-gray-800">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="text-sm text-gray-800 font-medium">
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                            {user.status === "active"
                              ? "Hoạt động"
                              : "Tạm khóa"}
                        </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "staff"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role === "admin"
                              ? "Quản trị viên"
                              : user.role === "staff"
                              ? "Nhân viên"
                              : "Khách hàng"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                          {/* Chi tiết */}
                          <button
                            className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => setSelectedUser(user)}
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

                          {/* Sửa */}
                          <button
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => {
                              setEditUser({
                                userID: user.id,
                                Name: user.name,
                                Email: user.email,
                                roleID: user.role === "user" ? 1 : user.role === "staff" ? 2 : 3,
                              });
                              setShowEditForm(true);
                            }}
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
                              user.status === "active"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => toggleUserStatus(user.id)}
                            title={
                              user.status === "active"
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
                          >
                            {user.status === "active" ? (
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
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {user.status === "active" ? "Khóa" : "Mở khóa"}
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loading State cho Staff */}
        {staffLoading && activeTab === "staff" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="text-gray-600 text-lg">Đang tải danh sách nhân viên...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State cho Staff */}
        {staffError && activeTab === "staff" && !staffLoading && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 text-lg font-medium mb-2">Có lỗi xảy ra</p>
                <p className="text-gray-600 mb-4">{staffError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách nhân viên */}
        {activeTab === "staff" && !staffLoading && !staffError && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-4 text-center font-semibold text-base">
                      STT
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Tên
                    </th>
                    <th className="p-4 text-left font-semibold text-base">
                      Liên hệ
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Số điện thoại
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Trạng thái
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Vai trò
                    </th>
                    <th className="p-4 text-center font-semibold text-base">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-lg font-medium mb-2">Chưa có nhân viên nào</p>
                          <p className="text-gray-400 mb-4">Danh sách nhân viên sẽ hiển thị tại đây</p>
                          <button
                            onClick={() => navigate('/admin-add-staff')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Thêm nhân viên đầu tiên
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    staff.map((staffMember, index) => (
                    <tr 
                      key={staffMember.id} 
                      className={`hover:bg-indigo-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="font-bold text-base text-indigo-600">
                            {staffMember.stt}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="font-semibold text-base text-gray-800">
                            {staffMember.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div>
                          <div className="text-sm text-gray-800">
                            {staffMember.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <div className="text-sm text-gray-800 font-medium">
                            {staffMember.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            staffMember.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                            {staffMember.status === "active"
                              ? "Hoạt động"
                              : "Tạm khóa"}
                        </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                              staffMember.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : staffMember.role === "staff"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {staffMember.role === "admin"
                              ? "Quản trị viên"
                              : staffMember.role === "staff"
                              ? "Nhân viên"
                              : "Khách hàng"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                          {/* Chi tiết */}
                          <button
                            className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => setSelectedUser(staffMember)}
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

                          {/* Sửa */}
                          <button
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => {
                              setEditUser({
                                userID: staffMember.id,
                                Name: staffMember.name,
                                Email: staffMember.email,
                                roleID: staffMember.role === "user" ? 1 : staffMember.role === "staff" ? 2 : 3,
                              });
                              setShowEditForm(true);
                            }}
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
                              staffMember.status === "active"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                            onClick={() => toggleUserStatus(staffMember.id)}
                            title={
                              staffMember.status === "active"
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
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
                                d={
                                  staffMember.status === "active"
                                    ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    : "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                }
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {staffMember.status === "active"
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"}
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal thêm người dùng mới */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Thêm{" "}
                {activeTab === "users" ? "khách hàng mới" : "nhân viên mới"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã {activeTab === "users" ? "khách hàng" : "nhân viên"}:
                  </label>
                  <input
                    type="text"
                    value={newUser.userId}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        userId: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={activeTab === "users" ? "USER004" : "STAFF003"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên:
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="user@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò:
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="driver">Khách hàng</option>
                    <option value="station_manager">Quản lý trạm</option>
                    <option value="staff">Nhân viên</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa người dùng */}
        {showEditForm && (
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
                      <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa người dùng</h3>
                      <p className="text-sm text-gray-600">Cập nhật thông tin người dùng</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditUser({
                        userID: "",
                        Name: "",
                        Email: "",
                        roleID: 1,
                      });
                    }}
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
                  {/* Mã người dùng */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã người dùng
                    </label>
                    <input
                      type="text"
                      value={editUser.userID}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Họ và tên */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editUser.Name}
                      onChange={(e) => setEditUser({ ...editUser, Name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editUser.Email}
                      onChange={(e) => setEditUser({ ...editUser, Email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  {/* Vai trò */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editUser.roleID}
                      onChange={(e) => setEditUser({ ...editUser, roleID: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={1}>Khách hàng</option>
                      <option value={2}>Nhân viên</option>
                      <option value={3}>Quản trị viên</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditUser({
                      userID: "",
                      Name: "",
                      Email: "",
                      roleID: 1,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={!editUser.Name || !editUser.Email}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Cập nhật</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chi tiết người dùng */}
        {selectedUser && !showEditForm && (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        {selectedUser.name}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 backdrop-blur-sm">
                          ID: {selectedUser.userId}
                        </span>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                          selectedUser.status === "active"
                            ? "bg-green-500 bg-opacity-20 text-green-100"
                            : "bg-red-500 bg-opacity-20 text-red-100"
                        }`}>
                          {selectedUser.status === "active" ? "🟢 Hoạt động" : "🔴 Tạm khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
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
                    <h4 className="text-xl font-bold text-gray-900">Thông tin khách hàng</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Họ tên */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-blue-600 mb-1">Họ tên</div>
                        <div className="text-base text-gray-800 font-medium">{selectedUser.name}</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-green-600 mb-1">Email</div>
                        <div className="text-base text-gray-800 font-medium">{selectedUser.email}</div>
                      </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-orange-600 mb-1">Số điện thoại</div>
                        <div className="text-base text-gray-800 font-medium">(+84) {selectedUser.phone}</div>
                      </div>
                    </div>

                    {/* Vai trò */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-purple-600 mb-1">Vai trò</div>
                        <div className="text-base text-gray-800 font-medium">
                          {selectedUser.role === "admin"
                            ? "Quản trị viên"
                            : selectedUser.role === "staff"
                            ? "Nhân viên"
                            : "Khách hàng"}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
