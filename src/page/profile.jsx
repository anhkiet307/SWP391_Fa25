// Component quản lý thông tin cá nhân và phương tiện của người dùng
import React, { useState, useEffect } from "react";
// Context cung cấp thông tin xác thực người dùng
import { useAuth } from "../contexts/AuthContext";
// Hook điều hướng trang
import { useNavigate } from "react-router-dom";
// Service gọi API
import apiService from "../services/apiService";
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Button,
  Input,
  Form,
  Spin,
  Alert,
  Empty,
  Badge,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CarOutlined,
  ThunderboltOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Component Profile - Trang quản lý thông tin cá nhân và phương tiện
 * Chức năng chính:
 * 1. Hiển thị và chỉnh sửa thông tin cá nhân (tên, email, số điện thoại)
 * 2. Hiển thị danh sách phương tiện của người dùng
 * 3. Hiển thị thống kê về phương tiện (tổng số, pin khỏe mạnh, pin yếu)
 * 4. Kiểm tra xác thực và điều hướng nếu chưa đăng nhập
 */
export default function Profile() {
  // Lấy thông tin người dùng và trạng thái xác thực từ context
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // State quản lý chế độ chỉnh sửa thông tin cá nhân
  const [isEditing, setIsEditing] = useState(false);
  // State lưu dữ liệu form khi chỉnh sửa
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // States quản lý thông tin phương tiện
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehiclesError, setVehiclesError] = useState(null);

  // Tính toán thống kê tổng quan về phương tiện
  const totalVehicles = vehicles.length;
  const healthyVehicles = vehicles.filter((v) => v.pinHealth >= 70).length;
  const lowBatteryVehicles = vehicles.filter((v) => v.pinPercent < 50).length;

  // Kiểm tra xác thực khi component mount, điều hướng đến trang login nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Tự động fetch thông tin phương tiện khi component mount và người dùng đã xác thực
  useEffect(() => {
    if (isAuthenticated && user?.userID) {
      fetchUserVehicles();
    }
  }, [isAuthenticated, user?.userID]);

  // Hàm gọi API để lấy danh sách phương tiện của người dùng
  const fetchUserVehicles = async () => {
    setIsLoadingVehicles(true);
    setVehiclesError(null);

    try {
      console.log("Fetching vehicles for user:", user);
      console.log("User ID:", user?.userID);

      if (!user?.userID) {
        throw new Error("User ID không tồn tại");
      }

      const response = await apiService.getVehiclesByUser(user.userID);

      if (response && response.status === "success") {
        setVehicles(response.data || []);
      } else {
        setVehiclesError("Không thể tải thông tin xe");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehiclesError(`Lỗi khi tải thông tin xe: ${error.message}`);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  // Hiển thị cảnh báo nếu người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <Alert
          message="Cần đăng nhập"
          description="Bạn cần đăng nhập để xem thông tin cá nhân."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Hàm xử lý thay đổi giá trị trong form chỉnh sửa
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm xử lý submit form cập nhật thông tin cá nhân
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement update profile logic
    setIsEditing(false);
  };

  // Hàm hủy chỉnh sửa, khôi phục dữ liệu ban đầu
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen relative bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,8,59,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,8,59,0.02)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section - Hiển thị tiêu đề trang */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)] mb-6 shadow-[0_8px_20px_rgba(0,8,59,0.15)]">
            <UserOutlined style={{ fontSize: "36px", color: "white" }} />
          </div>
          <Title
            level={1}
            className="text-[#00083B] mb-3 text-[36px] font-bold"
          >
            Thông tin tài khoản
          </Title>
          <Text className="text-slate-500 text-[18px] max-w-[600px] mx-auto leading-relaxed">
            Quản lý thông tin cá nhân và phương tiện của bạn
          </Text>
        </div>

        {/* Statistics Cards - Hiển thị thống kê tổng quan về phương tiện */}
        <Row gutter={[24, 24]} className="mb-8">
          {/* Card hiển thị tổng số phương tiện */}
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <CarOutlined style={{ color: "#00083B" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Tổng phương tiện
                    </span>
                  </Space>
                }
                value={totalVehicles}
                valueStyle={{
                  color: "#00083B",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          {/* Card hiển thị số phương tiện có pin khỏe mạnh (pinHealth >= 70%) */}
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <ThunderboltOutlined style={{ color: "#10b981" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Pin khỏe mạnh
                    </span>
                  </Space>
                }
                value={healthyVehicles}
                valueStyle={{
                  color: "#10b981",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          {/* Card hiển thị số phương tiện có pin yếu (pinPercent < 50%) */}
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <ThunderboltOutlined style={{ color: "#f59e0b" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Pin yếu
                    </span>
                  </Space>
                }
                value={lowBatteryVehicles}
                valueStyle={{
                  color: "#f59e0b",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Profile Information - Card hiển thị và chỉnh sửa thông tin cá nhân */}
          <Col xs={24} lg={12}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between mb-6">
                <Title level={3} style={{ color: "#00083B", margin: 0 }}>
                  Thông tin cá nhân
                </Title>
              </div>

              {/* Profile Avatar - Hiển thị avatar và thông tin cơ bản của người dùng */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <Title level={4} style={{ color: "#00083B", margin: 0 }}>
                  {user?.name || "Người dùng"}
                </Title>
                <Text style={{ color: "#64748b" }}>{user?.email}</Text>
                {/* Hiển thị badge phân quyền người dùng */}
                <div className="mt-2">
                  <Badge
                    color={
                      user?.role === "admin"
                        ? "red"
                        : user?.role === "staff"
                        ? "blue"
                        : "green"
                    }
                    text={
                      user?.role === "admin"
                        ? "Quản trị viên"
                        : user?.role === "staff"
                        ? "Nhân viên"
                        : "Tài xế EV"
                    }
                  />
                </div>
              </div>

              <Divider />

              {/* Form hiển thị/chỉnh sửa thông tin cá nhân */}
              <Form layout="vertical">
                <Row gutter={[16, 16]}>
                  {/* Trường nhập họ và tên - chuyển đổi giữa chế độ xem và chỉnh sửa */}
                  <Col xs={24} sm={12}>
                    <Form.Item label="Họ và tên">
                      {isEditing ? (
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          prefix={<UserOutlined />}
                          placeholder="Nhập họ và tên"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                          <Text>{user?.name || "Chưa cập nhật"}</Text>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  {/* Trường nhập email - chuyển đổi giữa chế độ xem và chỉnh sửa */}
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email">
                      {isEditing ? (
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          prefix={<MailOutlined />}
                          placeholder="Nhập email"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                          <Text>{user?.email || "Chưa cập nhật"}</Text>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                  {/* Trường nhập số điện thoại - chuyển đổi giữa chế độ xem và chỉnh sửa */}
                  <Col xs={24} sm={12}>
                    <Form.Item label="Số điện thoại">
                      {isEditing ? (
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          prefix={<PhoneOutlined />}
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-lg">
                          <Text>{user?.phone || "Chưa cập nhật"}</Text>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>

          {/* Vehicles Section - Card hiển thị danh sách phương tiện của người dùng */}
          <Col xs={24} lg={12}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex items-center justify-between mb-6">
                <Title level={3} style={{ color: "#00083B", margin: 0 }}>
                  Phương tiện của tôi
                </Title>
                {/* Nút làm mới danh sách phương tiện */}
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchUserVehicles}
                  loading={isLoadingVehicles}
                >
                  Làm mới
                </Button>
              </div>

              {/* Hiển thị loading khi đang tải dữ liệu phương tiện */}
              {isLoadingVehicles && (
                <div className="flex items-center justify-center py-8">
                  <Spin size="large" />
                </div>
              )}

              {/* Hiển thị thông báo lỗi nếu có lỗi khi tải dữ liệu */}
              {vehiclesError && (
                <Alert
                  message="Lỗi"
                  description={vehiclesError}
                  type="error"
                  showIcon
                />
              )}

              {/* Hiển thị danh sách phương tiện hoặc thông báo trống */}
              {!isLoadingVehicles && !vehiclesError && (
                <>
                  {vehicles.length > 0 ? (
                    <div className="space-y-4">
                      {/* Render từng phương tiện trong danh sách */}
                      {vehicles.map((vehicle) => (
                        <Card
                          key={vehicle.vehicleID}
                          size="small"
                          className="border border-gray-200"
                        >
                          {/* Thông tin cơ bản của phương tiện */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Title level={5} style={{ margin: 0 }}>
                                {vehicle.vehicleType}
                              </Title>
                              <Text type="secondary">
                                Biển số: {vehicle.licensePlate}
                              </Text>
                            </div>
                            <Badge
                              count={`ID: ${vehicle.vehicleID}`}
                              style={{ backgroundColor: "#52c41a" }}
                            />
                          </div>

                          {/* Hiển thị trạng thái pin của phương tiện */}
                          <Row gutter={[16, 16]}>
                            {/* Hiển thị phần trăm pin hiện tại với thanh progress bar */}
                            <Col span={12}>
                              <div className="text-center">
                                <Text strong>Pin hiện tại</Text>
                                <div className="mt-1">
                                  <Text strong style={{ color: "#00083B" }}>
                                    {vehicle.pinPercent}%
                                  </Text>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      vehicle.pinPercent >= 80
                                        ? "bg-green-500"
                                        : vehicle.pinPercent >= 50
                                        ? "bg-yellow-500"
                                        : vehicle.pinPercent >= 20
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${vehicle.pinPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </Col>
                            {/* Hiển thị sức khỏe pin với thanh progress bar */}
                            <Col span={12}>
                              <div className="text-center">
                                <Text strong>Sức khỏe pin</Text>
                                <div className="mt-1">
                                  <Text strong style={{ color: "#00083B" }}>
                                    {vehicle.pinHealth}%
                                  </Text>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      vehicle.pinHealth >= 90
                                        ? "bg-green-500"
                                        : vehicle.pinHealth >= 70
                                        ? "bg-yellow-500"
                                        : vehicle.pinHealth >= 50
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${vehicle.pinHealth}%` }}
                                  ></div>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          {/* Badge hiển thị trạng thái pin (đủ/yếu, khỏe/cần kiểm tra) */}
                          <div className="mt-3 flex justify-center gap-2">
                            <Badge
                              color={vehicle.pinPercent >= 50 ? "green" : "red"}
                              text={
                                vehicle.pinPercent >= 50 ? "Pin đủ" : "Pin yếu"
                              }
                            />
                            <Badge
                              color={
                                vehicle.pinHealth >= 70 ? "blue" : "orange"
                              }
                              text={
                                vehicle.pinHealth >= 70
                                  ? "Pin khỏe"
                                  : "Cần kiểm tra"
                              }
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    // Hiển thị thông báo khi chưa có phương tiện nào
                    <Empty
                      description="Chưa có phương tiện nào"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
