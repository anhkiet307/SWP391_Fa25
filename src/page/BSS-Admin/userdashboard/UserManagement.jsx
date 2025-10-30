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

  // State cho quản lý trạm (để hiển thị tên trạm)
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);

  // State cho quản lý phương tiện
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);


  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  
  // States cho modal xác nhận
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);
  const [isUserType, setIsUserType] = useState(true); // true: user, false: staff

  // States cho modal thêm phương tiện
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedUserForVehicle, setSelectedUserForVehicle] = useState(null);
  const [vehicleData, setVehicleData] = useState({
    userID: "",
    licensePlate: "",
    vehicleType: "",
    pinPercent: "",
    pinHealth: "",
  });
  const [licensePlateError, setLicensePlateError] = useState(""); // State cho lỗi biển số xe

  // States cho modal xem danh sách phương tiện
  const [showVehicleListModal, setShowVehicleListModal] = useState(false);
  const [selectedUserVehicles, setSelectedUserVehicles] = useState([]);
  const [vehicleListLoading, setVehicleListLoading] = useState(false);
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
        assignedStationID: null, // Sẽ được cập nhật sau khi check assignment
        assignedStationName: null, // Sẽ được cập nhật sau khi check assignment
        assignedStationAddress: null, // Sẽ được cập nhật sau khi check assignment
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

  // Fetch stations data from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setStationsLoading(true);
        const response = await apiService.getStations();
        console.log("Stations API Response:", response); // Debug log
        
        if (response && response.data && Array.isArray(response.data)) {
          const stationMap = {};
          response.data.forEach(station => {
            stationMap[station.stationID] = {
              name: station.stationName,
              address: station.location
            };
          });
          setStations(stationMap);
          console.log("Station map:", stationMap); // Debug log
        } else {
          setStations({});
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        setStations({});
      } finally {
        setStationsLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Fetch vehicles data from API
  // Load vehicles khi mở modal detail
  const loadUserVehicles = async (userId) => {
    try {
      setVehiclesLoading(true);
      const response = await apiService.getVehiclesByUser(userId);
      console.log("User Vehicles API Response:", response); // Debug log
      
      if (response && response.data && Array.isArray(response.data)) {
        setVehicles(response.data);
        console.log("User Vehicles data:", response.data); // Debug log
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error fetching user vehicles:", err);
      setVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  };

  // Load all vehicles to check which users have vehicles
  useEffect(() => {
    const loadAllVehicles = async () => {
      try {
        setVehiclesLoading(true);
        const response = await apiService.getVehicles();
        console.log("All Vehicles API Response:", response); // Debug log
        
        if (response && response.data && Array.isArray(response.data)) {
          setVehicles(response.data);
          console.log("All Vehicles data:", response.data); // Debug log
        } else {
          setVehicles([]);
        }
      } catch (err) {
        console.error("Error fetching all vehicles:", err);
        setVehicles([]);
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadAllVehicles();
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
          
          // Check staff assignments
          await checkStaffAssignments(mappedStaff);
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
  }, [stations]); // Depend on stations to ensure stations are loaded first

  // Function to check staff assignments and update station names
  const checkStaffAssignments = async (staffList) => {
    try {
      console.log("Checking staff assignments for:", staffList); // Debug log
      
      const updatedStaff = await Promise.all(
        staffList.map(async (staffMember) => {
          try {
            const response = await apiService.checkStaffAssignment(staffMember.id);
            console.log(`Assignment check for staff ${staffMember.id}:`, response); // Debug log
            
            // Based on API response format from the image:
            // If staff is assigned: assignedStationID will have a value
            // If staff is not assigned: assignedStationID will be null
            const isAssigned = response && response.data && response.data.assignedStationID !== null;
            const assignedStationID = response?.data?.assignedStationID || null;
            const stationInfo = assignedStationID ? stations[assignedStationID] : null;
            const assignedStationName = stationInfo ? stationInfo.name : (assignedStationID ? `Trạm ${assignedStationID}` : null);
            const assignedStationAddress = stationInfo ? stationInfo.address : null;
            
            return {
              ...staffMember,
              assignedStationID: assignedStationID,
              assignedStationName: assignedStationName,
              assignedStationAddress: assignedStationAddress,
            };
          } catch (error) {
            console.error(`Error checking assignment for staff ${staffMember.id}:`, error);
            // If API call fails, assume not assigned
            return {
              ...staffMember,
              assignedStationID: null,
              assignedStationName: null,
              assignedStationAddress: null,
            };
          }
        })
      );
      
      console.log("Updated staff with assignments:", updatedStaff); // Debug log
      setStaff(updatedStaff);
    } catch (error) {
      console.error("Error checking staff assignments:", error);
      // If overall process fails, just set the staff without assignment info
      setStaff(staffList);
    }
  };

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
    suspendedStaff: staff.filter((s) => s.status === "suspended").length,
    assignedStaff: staff.filter((s) => s.assignedStationID !== null).length,
    unassignedStaff: staff.filter((s) => s.assignedStationID === null).length,
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

  // Hàm mở modal xác nhận cho user
  const openUserStatusModal = (user) => {
    setUserToChangeStatus(user);
    setIsUserType(true);
    setShowStatusModal(true);
  };

  // Hàm thay đổi trạng thái người dùng với API integration
  const toggleUserStatus = async () => {
    if (!userToChangeStatus) return;
    
    const id = userToChangeStatus.id;
    console.log("toggleUserStatus called for user ID:", id); // Debug log
    
    try {
      const user = userToChangeStatus;
      const newStatusText = user.status === "active" ? "tạm khóa" : "kích hoạt";
      const actionText = user.status === "active" ? "khóa" : "mở khóa";
      
      console.log("About to call API"); // Debug log
      
      // Gọi API để cập nhật status
      const response = await apiService.updateUserStatus(id);
      console.log("Update status response:", response);

      // Cập nhật local state sau khi API thành công
      setUsers(prevUsers =>
        prevUsers.map((u) =>
          u.id === id
            ? {
                ...u,
                status: u.status === "active" ? "suspended" : "active",
              }
            : u
        )
      );

      // Hiển thị thông báo thành công
      showSuccess(`Đã ${newStatusText} tài khoản "${user.name}" thành công!`);
      
      // Đóng modal
      setShowStatusModal(false);
      setUserToChangeStatus(null);

    } catch (error) {
      console.error("Error updating user status:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 404) {
        showError("Không tìm thấy người dùng trong hệ thống!");
      } else if (error.response?.status === 403) {
        showError("Bạn không có quyền thực hiện thao tác này!");
      } else if (error.response?.status === 400) {
        showError("Dữ liệu không hợp lệ!");
      } else {
        showError(`Không thể cập nhật tài khoản. Vui lòng thử lại sau!`);
      }
    }
  };

  // Hàm mở modal xác nhận cho staff
  const openStaffStatusModal = (staffMember) => {
    setUserToChangeStatus(staffMember);
    setIsUserType(false);
    setShowStatusModal(true);
  };

  // Hàm thay đổi trạng thái nhân viên với API integration
  const toggleStaffStatus = async () => {
    if (!userToChangeStatus) return;
    
    const id = userToChangeStatus.id;
    console.log("toggleStaffStatus called for staff ID:", id); // Debug log
    
    try {
      const staffMember = userToChangeStatus;
      const newStatusText = staffMember.status === "active" ? "tạm khóa" : "kích hoạt";
      
      console.log("About to call API for staff"); // Debug log
      
      // Gọi API để cập nhật status (sử dụng cùng API với user)
      const response = await apiService.updateUserStatus(id);
      console.log("Update staff status response:", response);

      // Cập nhật local state sau khi API thành công
      setStaff(prevStaff =>
        prevStaff.map((s) =>
          s.id === id
            ? {
                ...s,
                status: s.status === "active" ? "suspended" : "active",
              }
            : s
        )
      );

      // Hiển thị thông báo thành công
      showSuccess(`Đã ${newStatusText} tài khoản nhân viên "${staffMember.name}" thành công!`);
      
      // Đóng modal
      setShowStatusModal(false);
      setUserToChangeStatus(null);

    } catch (error) {
      console.error("Error updating staff status:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 404) {
        showError("Không tìm thấy nhân viên trong hệ thống!");
      } else if (error.response?.status === 403) {
        showError("Bạn không có quyền thực hiện thao tác này!");
      } else if (error.response?.status === 400) {
        showError("Dữ liệu không hợp lệ!");
      } else {
        showError(`Không thể cập nhật tài khoản nhân viên. Vui lòng thử lại sau!`);
      }
    }
  };

  // Hàm hủy modal
  const cancelStatusChange = () => {
    setShowStatusModal(false);
    setUserToChangeStatus(null);
  };

  // Hàm format biển số xe với validation
  const formatLicensePlate = (value) => {
    // Loại bỏ ký tự đặc biệt (giữ số và chữ)
    const cleaned = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    
    let result = '';
    
    // Format: XXA[B/X]-XXX.XX (tổng 9 ký tự)
    for (let i = 0; i < cleaned.length && result.length < 9; i++) {
      const char = cleaned[i];
      const currentPos = result.length;
      
      // Vị trí 0-1: CHỈ SỐ (2 số đầu)
      if (currentPos < 2) {
        if (/[0-9]/.test(char)) {
          result += char;
        }
        // Bỏ qua chữ cái ở vị trí này
      }
      // Vị trí 2: CHỈ CHỮ (bắt buộc là chữ cái)
      else if (currentPos === 2) {
        if (/[A-Z]/.test(char)) {
          result += char;
        }
        // Bỏ qua số ở vị trí này
      }
      // Vị trí 3: CHỮ hoặc SỐ đều được
      else if (currentPos === 3) {
        if (/[A-Z0-9]/.test(char)) {
          result += char;
        }
      }
      // Vị trí 4-6: CHỈ SỐ (3 số sau dấu gạch ngang)
      else if (currentPos < 7) {
        if (/[0-9]/.test(char)) {
          result += char;
        }
        // Bỏ qua chữ cái ở vị trí này
      }
      // Vị trí 7-8: CHỈ SỐ (2 số cuối)
      else if (currentPos < 9) {
        if (/[0-9]/.test(char)) {
          result += char;
        }
        // Bỏ qua chữ cái ở vị trí này
      }
    }
    
    // Thêm dấu phân cách
    let formatted = '';
    if (result.length > 0) {
      formatted += result.substring(0, 2); // XX
    }
    if (result.length > 2) {
      formatted += result.substring(2, 4); // A[B/X]
    }
    if (result.length > 4) {
      formatted += '-' + result.substring(4, 7); // -XXX
    }
    if (result.length > 7) {
      formatted += '.' + result.substring(7, 9); // .XX
    }
    
    return formatted;
  };

  // Hàm kiểm tra biển số xe trùng lặp (real-time)
  const checkLicensePlateRealtime = (licensePlate) => {
    // Xóa lỗi nếu chưa nhập đủ
    if (!licensePlate || licensePlate.length === 0) {
      setLicensePlateError("");
      return;
    }

    // Loại bỏ dấu gạch ngang và dấu chấm để so sánh
    const cleanedInput = licensePlate.replace(/[-\.]/g, '');
    
    // Chưa đủ 9 ký tự thì không hiện lỗi (đang nhập)
    if (cleanedInput.length < 9) {
      setLicensePlateError("");
      return;
    }
    
    // Lấy 4 ký tự đầu và 5 ký tự sau
    const first4 = cleanedInput.substring(0, 4); // XXA[B/X]
    const last5 = cleanedInput.substring(4, 9);  // XXXXX
    
    // Kiểm tra trong danh sách xe hiện có
    for (const vehicle of vehicles) {
      const existingClean = vehicle.licensePlate.replace(/[-\.]/g, '');
      const existingFirst4 = existingClean.substring(0, 4);
      const existingLast5 = existingClean.substring(4, 9);
      
      // Nếu 4 ký tự đầu giống nhau VÀ 5 ký tự sau cũng giống nhau → Trùng
      if (first4 === existingFirst4 && last5 === existingLast5) {
        setLicensePlateError(`Xe này đã tồn tại (${vehicle.licensePlate} đã được đăng ký)`);
        return;
      }
    }
    
    // Không có lỗi
    setLicensePlateError("");
  };

  // Hàm kiểm tra biển số xe trùng lặp (khi submit)
  const validateLicensePlate = (licensePlate) => {
    // Loại bỏ dấu gạch ngang và dấu chấm để so sánh
    const cleanedInput = licensePlate.replace(/[-\.]/g, '');
    
    // Phải đủ 9 ký tự (XXA[B/X]-XXX.XX)
    if (cleanedInput.length !== 9) {
      return {
        isValid: false,
        message: "Biển số xe chưa đầy đủ! Vui lòng nhập đủ 9 ký tự theo format XXA[B/X]-XXX.XX"
      };
    }
    
    // Lấy 4 ký tự đầu và 5 ký tự sau
    const first4 = cleanedInput.substring(0, 4); // XXA[B/X]
    const last5 = cleanedInput.substring(4, 9);  // XXXXX
    
    // Kiểm tra trong danh sách xe hiện có
    for (const vehicle of vehicles) {
      const existingClean = vehicle.licensePlate.replace(/[-\.]/g, '');
      const existingFirst4 = existingClean.substring(0, 4);
      const existingLast5 = existingClean.substring(4, 9);
      
      // Nếu 4 ký tự đầu giống nhau VÀ 5 ký tự sau cũng giống nhau → Trùng
      if (first4 === existingFirst4 && last5 === existingLast5) {
        return {
          isValid: false,
          message: `Biển số xe đã tồn tại! (${vehicle.licensePlate} đã được đăng ký)`
        };
      }
    }
    
    return { isValid: true };
  };

  // Hàm mở modal thêm phương tiện
  const openVehicleModal = (user) => {
    setSelectedUserForVehicle(user);
    setVehicleData({
      userID: user.id,
      licensePlate: "",
      vehicleType: "",
      pinPercent: "",
      pinHealth: "",
    });
    setLicensePlateError(""); // Reset lỗi biển số xe
    setShowVehicleModal(true);
  };

  // Hàm thêm phương tiện
  const handleAddVehicle = async () => {
    if (!vehicleData.licensePlate || !vehicleData.vehicleType || !vehicleData.pinPercent || !vehicleData.pinHealth) {
      showError("Vui lòng điền đầy đủ thông tin phương tiện!");
      return;
    }

    // Validate biển số xe (kiểm tra trùng lặp)
    const licenseValidation = validateLicensePlate(vehicleData.licensePlate);
    if (!licenseValidation.isValid) {
      showError(licenseValidation.message);
      return;
    }

    // Validate pinPercent and pinHealth are numbers between 0-100
    const pinPercent = parseInt(vehicleData.pinPercent);
    const pinHealth = parseInt(vehicleData.pinHealth);
    
    if (isNaN(pinPercent) || pinPercent < 0 || pinPercent > 100) {
      showError("Phần trăm pin phải là số từ 0 đến 100!");
      return;
    }
    
    if (isNaN(pinHealth) || pinHealth < 0 || pinHealth > 100) {
      showError("Sức khỏe pin phải là số từ 0 đến 100!");
      return;
    }

    try {
      await apiService.createVehicle(vehicleData);
      showSuccess(`Đã thêm phương tiện cho ${selectedUserForVehicle.name} thành công!`);
      
      // Refresh vehicles list
      const response = await apiService.getVehicles();
      if (response && response.data && Array.isArray(response.data)) {
        setVehicles(response.data);
      }
      
      setShowVehicleModal(false);
      setSelectedUserForVehicle(null);
      setVehicleData({
        userID: "",
        licensePlate: "",
        vehicleType: "",
        pinPercent: "",
        pinHealth: "",
      });
      setLicensePlateError(""); // Reset lỗi biển số xe
    } catch (error) {
      console.error("Error adding vehicle:", error);
      showError("Không thể thêm phương tiện. Vui lòng thử lại.");
    }
  };

  // Hàm hủy modal thêm phương tiện
  const cancelVehicleModal = () => {
    setShowVehicleModal(false);
    setSelectedUserForVehicle(null);
    setVehicleData({
      userID: "",
      licensePlate: "",
      vehicleType: "",
      pinPercent: "",
      pinHealth: "",
    });
    setLicensePlateError(""); // Reset lỗi biển số xe
  };

  // Hàm mở modal xem danh sách phương tiện
  const openVehicleListModal = async (user) => {
    setShowVehicleListModal(true);
    setVehicleListLoading(true);
    try {
      const response = await apiService.getVehiclesByUser(user.id);
      console.log("User vehicles response:", response);
      
      if (response && response.data && Array.isArray(response.data)) {
        setSelectedUserVehicles(response.data);
      } else {
        setSelectedUserVehicles([]);
      }
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      showError("Không thể tải danh sách phương tiện");
      setSelectedUserVehicles([]);
    } finally {
      setVehicleListLoading(false);
    }
  };

  // Hàm đóng modal xem danh sách phương tiện
  const closeVehicleListModal = () => {
    setShowVehicleListModal(false);
    setSelectedUserVehicles([]);
  };

  // Hàm kiểm tra user có phương tiện hay không
  const userHasVehicle = (userId) => {
    return vehicles.some(vehicle => vehicle.userID === userId);
  };

  // Hàm lấy thông tin phương tiện của user
  const getUserVehicle = (userId) => {
    return vehicles.find(vehicle => vehicle.userID === userId);
  };

  // Hàm đếm số xe của user
  const getUserVehicleCount = (userId) => {
    return vehicles.filter(vehicle => vehicle.userID === userId).length;
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
            { label: "Tổng người dùng", value: userStats.totalUsers, color: "bg-green-400" }
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
                <div className="text-4xl font-bold m-0 text-green-500">
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

        {/* Thống kê nhân viên */}
        {activeTab === "staff" && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
              Thống kê nhân viên
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tổng nhân viên
                </h3>
                <div className="text-4xl font-bold m-0 text-green-500">
                  {staffStats.totalStaff}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Đang hoạt động
                </h3>
                <div className="text-4xl font-bold m-0 text-green-500">
                  {staffStats.activeStaff}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Tạm khóa
                </h3>
                <div className="text-4xl font-bold m-0 text-red-500">
                  {staffStats.suspendedStaff}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Đã phân công
                </h3>
                <div className="text-4xl font-bold m-0 text-purple-500">
                  {staffStats.assignedStaff}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg text-center shadow-md hover:transform hover:-translate-y-1 transition-transform">
                <h3 className="m-0 mb-4 text-gray-600 text-base font-medium">
                  Chưa phân công
                </h3>
                <div className="text-4xl font-bold m-0 text-orange-500">
                  {staffStats.unassignedStaff}
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Thêm {activeTab === "users" ? "khách hàng" : "nhân viên"}
            </button>
            {activeTab === "users" && (
              <button 
                onClick={() => navigate('/admin-battery-packages')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 py-3 px-6 rounded-md cursor-pointer text-sm font-medium transition-transform hover:transform hover:-translate-y-0.5 hover:shadow-lg"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
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
                      Số xe liên kết
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
                      <td colSpan="8" className="p-12 text-center">
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
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
                      className={`hover:bg-green-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                        <div className="font-bold text-base text-green-600">
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
                            (+84) {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                          {getUserVehicleCount(user.id) > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                {/* <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg> */}
                                {getUserVehicleCount(user.id)} chiếc
                              </span>
                              <button
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
                                onClick={() => openVehicleModal(user)}
                                title="Thêm xe mới"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                              onClick={() => openVehicleModal(user)}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                             Thêm xe
                            </button>
                          )}
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
                                ? "bg-green-100 text-green-800"
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
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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

                          {/* Xem phương tiện */}
                          <button
                            className="group relative bg-teal-500 hover:bg-teal-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            onClick={() => openVehicleListModal(user)}
                            title="Xem phương tiện"
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
                                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                              />
                            </svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Xem phương tiện
                            </div>
                          </button>

                          {/* Sửa */}
                          <button
                            className="group relative bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
                            onClick={() => openUserStatusModal(user)}
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
                  <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
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
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
                      className={`hover:bg-green-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex justify-center">
                        <div className="font-bold text-base text-green-600">
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
                            (+84) {staffMember.phone}
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
                                ? "bg-green-100 text-green-800"
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
                            className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
                            className="group relative bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
                            onClick={() => openStaffStatusModal(staffMember)}
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
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
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
              <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 text-white p-8">
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
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                            </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedUser.role === "admin"
                        ? "Thông tin quản trị viên"
                        : selectedUser.role === "staff"
                        ? "Thông tin nhân viên"
                        : "Thông tin khách hàng"}
                    </h4>
                            </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Họ tên */}
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                          </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-green-600 mb-1">Họ tên</div>
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

                    {/* Trạm đã phân công - chỉ hiển thị cho nhân viên */}
                    {(selectedUser.role === "staff" || selectedUser.role === "admin") && (
                      <>
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-indigo-600 mb-1">Trạm đã phân công</div>
                            <div className="text-base text-gray-800 font-medium">
                              {selectedUser.assignedStationName || "Chưa phân công"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-teal-600 mb-1">Địa chỉ trạm</div>
                            <div className="text-base text-gray-800 font-medium">
                              {selectedUser.assignedStationAddress || "N/A"}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Thông tin phương tiện - chỉ hiển thị cho khách hàng (role = "user") */}
                    {selectedUser.role === "user" && (() => {
                      const userVehicle = vehicles.find(v => v.userID === selectedUser.id);
                      return userVehicle ? (
                        <>
                          {/* Loại phương tiện */}
                          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-1-1V8a1 1 0 00-1-1H9m4 8V8a1 1 0 00-1-1H9" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-blue-600 mb-1">Loại phương tiện</div>
                              <div className="text-base text-gray-800 font-medium">
                                {userVehicle.vehicleType}
                              </div>
                            </div>
                          </div>

                          {/* Biển số xe */}
                          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12l-1-16M10 8v8M14 8v8" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-cyan-600 mb-1">Biển số xe</div>
                              <div className="text-lg text-gray-800 font-bold font-mono tracking-wider">
                                {userVehicle.licensePlate}
                              </div>
                            </div>
                          </div>

                          {/* Phần trăm pin */}
                          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-green-600 mb-1">Phần trăm pin</div>
                              <div className="text-base text-gray-800 font-medium">
                                {userVehicle.pinPercent}%
                              </div>
                            </div>
                          </div>

                          {/* Sức khỏe pin */}
                          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl h-24">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-orange-600 mb-1">Sức khỏe pin</div>
                              <div className="text-base text-gray-800 font-medium">
                                {userVehicle.pinHealth}%
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Hiển thị thông báo khi khách hàng chưa có xe */
                        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">Chưa có phương tiện</p>
                            <p className="text-gray-400 mb-4">Khách hàng này chưa được liên kết với phương tiện nào</p>
                            <button
                              onClick={() => openVehicleModal(selectedUser)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Thêm phương tiện
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                          </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận thay đổi trạng thái */}
        {showStatusModal && userToChangeStatus && (
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
                  {userToChangeStatus.status === "active"
                    ? "Khóa tài khoản"
                    : "Mở khóa tài khoản"}
                </h3>
                <p className="text-gray-600 text-center">
                  Bạn có chắc chắn muốn{" "}
                  {userToChangeStatus.status === "active"
                    ? "khóa tài khoản"
                    : "mở khóa tài khoản"}{" "}
                  {isUserType ? "này" : "nhân viên này"} không?
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {userToChangeStatus.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ID: {userToChangeStatus.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            userToChangeStatus.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userToChangeStatus.status === "active"
                            ? "🟢 Hoạt động"
                            : "🔴 Tạm khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Thông báo */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
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
                      <p className="text-sm font-semibold text-green-800">
                        {userToChangeStatus.status === "active"
                          ? "Tài khoản sẽ bị khóa và không thể đăng nhập."
                          : "Tài khoản sẽ được kích hoạt và có thể đăng nhập bình thường."}
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
                    onClick={isUserType ? toggleUserStatus : toggleStaffStatus}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                      userToChangeStatus.status === "active"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          userToChangeStatus.status === "active"
                            ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            : "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        }
                      />
                    </svg>
                    <span>
                      {userToChangeStatus.status === "active"
                        ? "Khóa tài khoản"
                        : "Mở khóa"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xem danh sách phương tiện */}
        {showVehicleListModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">Danh sách phương tiện</h3>
                      <p className="text-green-100">
                        {vehicleListLoading 
                          ? "Đang tải dữ liệu..." 
                          : `Tổng cộng: ${selectedUserVehicles.length} phương tiện`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeVehicleListModal}
                    className="p-3 text-white hover:text-red-200 hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 bg-gray-50 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                {vehicleListLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                      <span className="text-lg text-gray-600 font-medium">Đang tải danh sách phương tiện...</span>
                    </div>
                  </div>
                ) : selectedUserVehicles.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xl font-medium mb-2">Chưa có phương tiện</p>
                      <p className="text-gray-400">Người dùng này chưa đăng ký phương tiện nào</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedUserVehicles.map((vehicle, index) => (
                      <div
                        key={vehicle.vehicleID}
                        className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-green-300"
                      >
                        {/* Card Header */}
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <p className="text-green-100 text-base font-medium">{vehicle.vehicleType}</p>
                            </div>
                            <span className="text-xs font-medium bg-white bg-opacity-20 px-3 py-1.5 rounded-full">
                              ID xe: {vehicle.vehicleID}
                            </span>
                          </div>
                          <h4 className="text-3xl font-bold font-mono tracking-wider">{vehicle.licensePlate}</h4>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-4">
                          {/* Pin Percent */}
                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-green-600">Mức pin</div>
                                <div className="text-2xl font-bold text-green-700">{vehicle.pinPercent}%</div>
                              </div>
                            </div>
                            <div className="relative w-16 h-16">
                              <svg className="transform -rotate-90 w-16 h-16">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#d1fae5"
                                  strokeWidth="6"
                                  fill="none"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#10b981"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 28}`}
                                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - vehicle.pinPercent / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Pin Health */}
                          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-orange-600">Sức khỏe pin</div>
                                <div className="text-2xl font-bold text-orange-700">{vehicle.pinHealth}%</div>
                              </div>
                            </div>
                            <div className="relative w-16 h-16">
                              <svg className="transform -rotate-90 w-16 h-16">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#fed7aa"
                                  strokeWidth="6"
                                  fill="none"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#f97316"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 28}`}
                                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - vehicle.pinHealth / 100)}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal thêm phương tiện */}
        {showVehicleModal && selectedUserForVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header với gradient đẹp hơn */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Thêm phương tiện mới</h3>
                      <p className="text-green-100 text-base mt-1">
                        Thêm phương tiện cho {selectedUserForVehicle.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelVehicleModal}
                    className="text-white hover:text-green-200 transition-all duration-200 p-3 hover:bg-white hover:bg-opacity-20 rounded-xl"
                  >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body với layout 2 cột */}
              <div className="p-8">
                <form onSubmit={(e) => { e.preventDefault(); handleAddVehicle(); }} className="space-y-8">
                  {/* Row 1: Biển số xe và Loại xe */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Biển số xe *</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={vehicleData.licensePlate}
                          onChange={(e) => {
                            const formatted = formatLicensePlate(e.target.value);
                            setVehicleData({ ...vehicleData, licensePlate: formatted });
                            checkLicensePlateRealtime(formatted); // Validate real-time
                          }}
                          maxLength={11}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-lg tracking-wider ${
                            licensePlateError 
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                          }`}
                          placeholder="60B2-188.88"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">
                          
                        </div>
                      </div>
                      {/* Hiển thị lỗi real-time */}
                      {licensePlateError && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">{licensePlateError}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Loại phương tiện *</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        required
                        value={vehicleData.vehicleType}
                        onChange={(e) => setVehicleData({ ...vehicleData, vehicleType: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập loại xe (VD: Vision Honda)"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phần trăm pin và Sức khỏe pin */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span>Mức pin hiện tại (%) *</span>
                        </div>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        value={vehicleData.pinPercent}
                        onChange={(e) => setVehicleData({ ...vehicleData, pinPercent: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập mức pin (0-100)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span>Sức khỏe pin (%) *</span>
                        </div>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        value={vehicleData.pinHealth}
                        onChange={(e) => setVehicleData({ ...vehicleData, pinHealth: e.target.value })}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nhập sức khỏe pin (0-100)"
                      />
                    </div>
                  </div>

                  {/* Footer với buttons đẹp hơn */}
                  <div className="flex items-center justify-between pt-8 border-t-2 border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Các trường có dấu * là bắt buộc</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={cancelVehicleModal}
                        className="px-8 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-gray-300"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Thêm phương tiện</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
