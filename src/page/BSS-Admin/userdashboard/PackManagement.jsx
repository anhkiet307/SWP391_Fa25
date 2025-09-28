import React, { useState } from "react";
import AdminLayout from "../component/AdminLayout";
import { showSuccess, showError } from "../../../utils/toast";

const AdminPackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPack, setEditingPack] = useState(null);

  // Dữ liệu gói thuê pin từ ServicePack.jsx
  const [packs, setPacks] = useState([
    {
      id: 1,
      name: "Gói Cơ Bản",
      type: "Mặc Định",
      price: "50,000 VNĐ",
      period: "mỗi lần đổi",
      description: "Gói mặc định cho tất cả người dùng, đặt lịch và thanh toán khi đổi pin",
      features: [
        "Đặt lịch trực tuyến",
        "Nhân viên hỗ trợ đổi pin",
        "Thanh toán khi đổi pin",
        "Không ràng buộc thời gian",
        "Có sẵn cho mọi tài khoản",
      ],
      color: "blue",
      popular: false,
      status: "active",
      createdAt: "2024-01-01",
      totalUsers: 1250,
    },
    {
      id: 2,
      name: "Gói Tiết Kiệm",
      type: "Premium",
      price: "299,000 VNĐ",
      period: "tháng",
      description: "Đổi pin 10 lần/tháng, tiết kiệm 50% so với gói cơ bản",
      features: [
        "10 lần đổi pin/tháng",
        "Không cần thanh toán khi đổi",
        "Ưu tiên đặt lịch",
        "Hỗ trợ 24/7",
        "Tiết kiệm 50% chi phí",
      ],
      color: "green",
      popular: true,
      status: "active",
      createdAt: "2024-01-15",
      totalUsers: 850,
    },
    {
      id: 3,
      name: "Gói Không Giới Hạn",
      type: "Unlimited",
      price: "599,000 VNĐ",
      period: "tháng",
      description: "Đổi pin không giới hạn trong 1 tháng",
      features: [
        "Đổi pin không giới hạn",
        "Không cần thanh toán khi đổi",
        "Ưu tiên cao nhất",
        "Hỗ trợ VIP 24/7",
        "Đặt lịch linh hoạt",
        "Tiết kiệm tối đa",
      ],
      color: "purple",
      popular: false,
      status: "active",
      createdAt: "2024-02-01",
      totalUsers: 320,
    },
  ]);

  const [newPack, setNewPack] = useState({
    name: "",
    type: "",
    price: "",
    period: "",
    description: "",
    features: [],
    color: "blue",
    popular: false,
  });

  // Format giá tiền với dấu phẩy
  const formatPrice = (price) => {
    if (!price) return "";
    // Loại bỏ "VNĐ" và các ký tự không phải số
    const numericPrice = price.replace(/[^\d]/g, "");
    if (!numericPrice) return price;
    
    // Format với dấu phẩy (thay vì dấu chấm)
    const number = parseInt(numericPrice);
    const formattedPrice = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedPrice} VNĐ`;
  };

  // Xác định màu sắc dựa trên tên gói
  const getPackColor = (name, type) => {
    if (name === "Gói Không Giới Hạn" || type === "Unlimited") {
      return "purple";
    } else if (name === "Gói Tiết Kiệm" || type === "Premium") {
      return "green";
    } else {
      return "blue";
    }
  };

  const filteredPacks = packs.filter((pack) => {
    const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || pack.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddPack = () => {
    if (!newPack.name || !newPack.type || !newPack.price) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const pack = {
      ...newPack,
      id: packs.length + 1,
      price: formatPrice(newPack.price),
      color: getPackColor(newPack.name, newPack.type),
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      totalUsers: 0,
    };

    setPacks([...packs, pack]);
    setNewPack({
      name: "",
      type: "",
      price: "",
      period: "",
      description: "",
      features: [],
      color: "blue",
      popular: false,
    });
    setShowAddModal(false);
    showSuccess("Thêm gói thuê mới thành công!");
  };

  const handleEditPack = (pack) => {
    setEditingPack(pack);
    setShowAddModal(true);
  };

  const handleUpdatePack = () => {
    if (!editingPack.name || !editingPack.type || !editingPack.price) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const updatedPack = {
      ...editingPack,
      price: formatPrice(editingPack.price),
      color: getPackColor(editingPack.name, editingPack.type),
    };

    setPacks(packs.map(pack => 
      pack.id === editingPack.id ? updatedPack : pack
    ));
    setEditingPack(null);
    setShowAddModal(false);
    showSuccess("Cập nhật gói thuê thành công!");
  };


  const handleToggleStatus = (id) => {
    setPacks(packs.map(pack => 
      pack.id === id ? { ...pack, status: pack.status === "active" ? "inactive" : "active" } : pack
    ));
    showSuccess("Cập nhật trạng thái thành công!");
  };

  const getStatusColor = (status) => {
    return status === "active" ? "green" : "red";
  };

  const getStatusText = (status) => {
    return status === "active" ? "Hoạt động" : "Tạm dừng";
  };

  const getColorClass = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
    };
    return colors[color] || colors.blue;
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <div className="mb-8">
          {/* Main Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 p-5">
              <div className="flex justify-between items-center">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">Quản lý Gói Thuê Pin</h1>
                      <p className="text-white text-opacity-90 text-sm">
                        Quản lý và theo dõi tất cả gói thuê pin trong hệ thống
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="flex space-x-3">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-medium">Admin: Quản trị hệ thống</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-30">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-xs font-medium">Tổng gói: {packs.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Admin Profile */}
                <div className="ml-6">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                        <p className="text-white font-semibold text-sm">Admin System</p>
                        <p className="text-white text-opacity-80 text-xs">Quản trị viên</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        localStorage.removeItem('stationMenuOpen');
                        localStorage.removeItem('userMenuOpen');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                    >
                      <svg
                        className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm gói thuê..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-80"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setEditingPack(null);
                setShowAddModal(true);
              }}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Thêm gói mới</span>
            </button>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPacks.map((pack) => (
            <div
              key={pack.id}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 flex flex-col border border-white/20 backdrop-blur-sm"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Popular Badge */}
              {pack.popular && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12">
                    ⭐ PHỔ BIẾN
                  </div>
                </div>
              )}

              <div className="relative z-10 p-8 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${
                      pack.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      pack.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      'bg-gradient-to-br from-purple-500 to-purple-600'
                    }`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{pack.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        pack.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        pack.color === 'green' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {pack.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                    {pack.price}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">/{pack.period}</div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">{pack.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <span className="flex items-center text-sm text-gray-600 font-medium">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold">{pack.totalUsers} người dùng</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    pack.status === "active" 
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200" 
                      : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                  }`}>
                    {getStatusText(pack.status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-auto">
                  <button
                    onClick={() => handleEditPack(pack)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(pack.id)}
                    className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                      pack.status === "active" 
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600" 
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                    }`}
                  >
                    {pack.status === "active" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tạm dừng</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                        </svg>
                        <span>Kích hoạt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-100/50">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-t-2xl"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {editingPack ? "Chỉnh sửa gói thuê" : "Thêm gói thuê mới"}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        {editingPack ? "Cập nhật thông tin gói thuê" : "Tạo gói thuê pin mới cho hệ thống"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPack(null);
                    }}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Package Name & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                          <span>Tên gói</span>
                        </div>
                      </label>
                      {editingPack ? (
                        <select
                          value={editingPack.name}
                          onChange={(e) => {
                            setEditingPack({...editingPack, name: e.target.value});
                          }}
                          disabled={editingPack.name === "Gói Cơ Bản"}
                          className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            editingPack.name === "Gói Cơ Bản" ? "bg-gray-100 cursor-not-allowed opacity-60 [appearance:none]" : ""
                          }`}
                        >
                          <option value={editingPack.name}>{editingPack.name}</option>
                        </select>
                      ) : (
                        <select
                          value={newPack.name}
                          onChange={(e) => {
                            const selectedName = e.target.value;
                            const autoType = selectedName === "Gói Tiết Kiệm" ? "Premium" : 
                                            selectedName === "Gói Không Giới Hạn" ? "Unlimited" : "";
                            const autoPeriod = selectedName === "Gói Tiết Kiệm" ? "tháng" : 
                                              selectedName === "Gói Không Giới Hạn" ? "năm" : "";
                            
                            setNewPack({
                              ...newPack, 
                              name: selectedName,
                              type: autoType || newPack.type,
                              period: autoPeriod || newPack.period
                            });
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="">Chọn tên gói</option>
                          <option value="Gói Tiết Kiệm">Gói Tiết Kiệm</option>
                          <option value="Gói Không Giới Hạn">Gói Không Giới Hạn</option>
                        </select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                          <span>Loại</span>
                        </div>
                      </label>
                      {editingPack ? (
                        <select
                          value={editingPack.type}
                          onChange={(e) => {
                            setEditingPack({...editingPack, type: e.target.value});
                          }}
                          disabled={editingPack.name === "Gói Cơ Bản"}
                          className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            editingPack.name === "Gói Cơ Bản" ? "bg-gray-100 cursor-not-allowed opacity-60 [appearance:none]" : ""
                          }`}
                        >
                          <option value={editingPack.type}>{editingPack.type}</option>
                        </select>
                      ) : (
                        <select
                          value={newPack.type}
                          onChange={(e) => {
                            setNewPack({...newPack, type: e.target.value});
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="">Chọn loại gói</option>
                          <option value="Premium">Premium</option>
                          <option value="Unlimited">Unlimited</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Price & Period */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                          <span>Giá</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        value={editingPack ? editingPack.price.replace(/[^\d,]/g, '') : newPack.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Format với dấu phẩy khi nhập
                          const numericValue = value.replace(/[^\d]/g, '');
                          const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                          
                          if (editingPack) {
                            setEditingPack({...editingPack, price: formattedValue});
                          } else {
                            setNewPack({...newPack, price: formattedValue});
                          }
                        }}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder={editingPack ? "299,000" : "299,000 VNĐ"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                          <span>Chu kỳ</span>
                        </div>
                      </label>
                      {editingPack ? (
                        <select
                          value={editingPack.period}
                          onChange={(e) => {
                            setEditingPack({...editingPack, period: e.target.value});
                          }}
                          disabled={editingPack.name === "Gói Cơ Bản"}
                          className={`w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                            editingPack.name === "Gói Cơ Bản" ? "bg-gray-100 cursor-not-allowed opacity-60 [appearance:none]" : ""
                          }`}
                        >
                          <option value={editingPack.period}>{editingPack.period}</option>
                        </select>
                      ) : (
                        <select
                          value={newPack.period}
                          onChange={(e) => {
                            setNewPack({...newPack, period: e.target.value});
                          }}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        >
                          <option value="">Chọn chu kỳ</option>                          
                          <option value="tháng">Tháng</option>
                          <option value="năm">Năm</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"></div>
                        <span>Mô tả</span>
                      </div>
                    </label>
                    <textarea
                      value={editingPack?.description || newPack.description}
                      onChange={(e) => {
                        if (editingPack) {
                          setEditingPack({...editingPack, description: e.target.value});
                        } else {
                          setNewPack({...newPack, description: e.target.value});
                        }
                      }}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      rows="3"
                      placeholder="Mô tả chi tiết về gói thuê pin..."
                    />
                  </div>

                  {/* Popular Checkbox */}
                  <div className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="popular"
                          checked={editingPack?.popular || newPack.popular}
                          onChange={(e) => {
                            if (editingPack) {
                              setEditingPack({...editingPack, popular: e.target.checked});
                            } else {
                              setNewPack({...newPack, popular: e.target.checked});
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 bg-white border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200"
                        />
                        <div className="absolute inset-0 rounded bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 transition-opacity duration-200 pointer-events-none"></div>
                      </div>
                      <label htmlFor="popular" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <span>⭐</span>
                          <span>Gói phổ biến</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100/50">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPack(null);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Hủy</span>
                  </button>
                  <button
                    onClick={editingPack ? handleUpdatePack : handleAddPack}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    {editingPack ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Cập nhật</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Thêm mới</span>
                      </>
                    )}
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

export default AdminPackManagement;
