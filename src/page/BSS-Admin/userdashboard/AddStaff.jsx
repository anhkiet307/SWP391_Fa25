import React, { useState, useEffect } from "react";
import AdminLayout from "../component/AdminLayout";
import AdminHeader from "../component/AdminHeader";
import { showSuccess, showError } from "../../../utils/toast";
import apiService from "../../../services/apiService";

const AdminAddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Nhân viên",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // States cho validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Force reset form on component mount
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "Nhân viên",
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    // Validation cho field Tên - không được chứa số
    if (name === "name") {
      // Chỉ kiểm tra có số hay không
      const hasNumber = /\d/.test(value);
      if (hasNumber) {
        newErrors.name = "Tên không được chứa số, chỉ được chứa chữ cái!";
      } else {
        newErrors.name = "";
      }
    }

    // Validation cho field Email
    if (name === "email") {
      // Reset error khi đang nhập
      newErrors.email = "";
      
      // Kiểm tra khi có giá trị
      if (value) {
        // Phải có @gmail.com
        if (!value.includes("@gmail.com")) {
          newErrors.email = "Email phải có định dạng @gmail.com";
        } else {
          // Lấy phần trước @gmail.com
          const localPart = value.split("@")[0];
          
          // Kiểm tra phần trước @ không được toàn số
          const isOnlyNumbers = /^\d+$/.test(localPart);
          if (isOnlyNumbers) {
            newErrors.email = "Email không được chỉ toàn số trước @gmail.com (VD: 11111@gmail.com)";
          }
          
          // Kiểm tra phải có ít nhất 1 chữ cái
          const hasLetter = /[a-zA-Z]/.test(localPart);
          if (!hasLetter && localPart.length > 0) {
            newErrors.email = "Email phải chứa ít nhất 1 chữ cái trước @gmail.com";
          }
        }
      }
    }

    // Xử lý số điện thoại - chỉ cho phép số, bắt đầu bằng 0, và giới hạn 10 chữ số
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      
      // Validation số điện thoại
      if (phoneValue.length > 0) {
        if (phoneValue[0] !== "0") {
          newErrors.phone = "Số điện thoại phải bắt đầu bằng số 0";
        } else if (phoneValue.length < 10 && phoneValue.length > 0) {
          newErrors.phone = "Số điện thoại phải đủ 10 chữ số";
        } else {
          newErrors.phone = "";
        }
      } else {
        newErrors.phone = "";
      }
      
      setFormData({
        ...formData,
        [name]: phoneValue,
      });
      setErrors(newErrors);
      return;
    }

    // Update formData cho các field khác
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors(newErrors);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validation - kiểm tra tất cả fields required
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        showError("Vui lòng điền đầy đủ thông tin nhân viên!");
        setIsSubmitting(false);
        return;
      }

      // Validation tên - không được chứa số
      const nameHasNumber = /\d/.test(formData.name);
      if (nameHasNumber) {
        showError("Tên không được chứa số, chỉ được chứa chữ cái!");
        setIsSubmitting(false);
        return;
      }

      // Validation phone number
      if (formData.phone.length !== 10) {
        showError("Số điện thoại phải có đúng 10 chữ số!");
        setIsSubmitting(false);
        return;
      }

      // Validation số điện thoại phải bắt đầu bằng 0
      if (formData.phone[0] !== "0") {
        showError("Số điện thoại phải bắt đầu bằng số 0!");
        setIsSubmitting(false);
        return;
      }

      // Validation email format - phải có @gmail.com
      if (!formData.email.includes("@gmail.com")) {
        showError("Email phải có định dạng @gmail.com!");
        setIsSubmitting(false);
        return;
      }
      
      // Kiểm tra phần trước @gmail.com không được toàn số
      const localPart = formData.email.split("@")[0];
      const isOnlyNumbers = /^\d+$/.test(localPart);
      if (isOnlyNumbers) {
        showError("Email không được chỉ toàn số trước @gmail.com!");
        setIsSubmitting(false);
        return;
      }
      
      // Phải có ít nhất 1 chữ cái
      const hasLetter = /[a-zA-Z]/.test(localPart);
      if (!hasLetter) {
        showError("Email phải chứa ít nhất 1 chữ cái!");
        setIsSubmitting(false);
        return;
      }

      // Chuẩn bị dữ liệu cho API
      const userData = {
        Name: formData.name,
        Email: formData.email,
        Password: formData.password,
        phone: formData.phone, // Giữ nguyên string như API yêu cầu
        roleID: 2, // Staff = 2
        status: 1, // 1 = kích hoạt (active)
      };

      console.log("Sending staff data:", userData); // Debug log

      // Gọi API thật
      const response = await apiService.addUser(userData);

      if (response && response.status === "success") {
        showSuccess("Thêm Staff mới thành công!");

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "Nhân viên",
        });
        setShowPreview(false);
      } else {
        showError(response?.message || "Có lỗi xảy ra khi thêm Staff!");
      }
    } catch (error) {
      console.error("Add staff error:", error);
      
      // Parse error message from API response
      let errorMessage = "Có lỗi xảy ra khi thêm nhân viên mới!";
      
      try {
        if (error.message) {
          const errorData = JSON.parse(error.message.split('message: ')[1]);
          if (errorData.message) {
            if (errorData.message.includes("Phone number already exists")) {
              errorMessage = "Số điện thoại này đã được sử dụng! Vui lòng chọn số khác.";
            } else if (errorData.message.includes("Email already exists")) {
              errorMessage = "Email này đã được sử dụng! Vui lòng chọn email khác.";
            } else {
              errorMessage = errorData.message;
            }
          }
        }
      } catch (parseError) {
        console.error("Error parsing error message:", parseError);
      }
      
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditForm = () => {
    setShowPreview(false);
  };

  return (
    <AdminLayout>
      <div className="p-5 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <AdminHeader
          title="Thêm Nhân viên Mới"
          subtitle="Tạo tài khoản nhân viên mới trong hệ thống"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
          stats={[
            { label: "Thêm nhân viên mới", value: "", color: "bg-green-400" }
          ]}
        />

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handlePreview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nguyễn Văn B"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  💡 Chỉ được chứa chữ cái, không được có số
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="staff@gmail.com"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  💡 Phải có @gmail.com và chứa ít nhất 1 chữ cái
                </p>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0901234567"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  💡 Phải bắt đầu bằng số 0 và đủ 10 chữ số (VD: 0901234567)
                </p>
              </div>

              {/* Vai trò - Cố định là Staff */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
                  Staff (Mặc định)
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  💡 Tài khoản này sẽ được tạo với quyền Staff
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={errors.name || errors.email || errors.phone}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xem trước
              </button>
            </div>
          </form>
        </div>

        {/* Preview Modal - Only show when showPreview is true */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-100 rounded-t-3xl">
                <div className="flex items-center justify-center relative">
                  <h2 className="text-xl font-bold text-gray-900 text-center">
                    Xác nhận thông tin nhân viên
                  </h2>
                  <button
                    onClick={handleEditForm}
                    className="absolute right-0 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Staff Icon & Status */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                    <svg
                      className="w-8 h-8 text-green-600"
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
                  <div className="text-2xl font-bold text-gray-900">
                    {formData.name || "Chưa có tên nhân viên"}
                  </div>
                </div>

                {/* Staff Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Tên */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-blue-600 mr-1"
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
                      <span className="text-base font-medium text-blue-600">
                        Tên
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.name || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-orange-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-base font-medium text-orange-600">
                        Email
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.email || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-purple-600 mr-1"
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
                      <span className="text-base font-medium text-purple-600">
                        Mật khẩu
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.password ? "••••••••" : "Chưa nhập"}
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-cyan-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-base font-medium text-cyan-600">
                        Số điện thoại
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.phone || "Chưa nhập"}
                    </div>
                  </div>

                  {/* Vai trò */}
                  <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-3 h-3 text-pink-600 mr-1"
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
                      <span className="text-base font-medium text-pink-600">
                        Vai trò
                      </span>
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      Staff
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
                <div className="flex justify-center gap-6">
                  <button
                    onClick={handleEditForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
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

export default AdminAddStaff;
