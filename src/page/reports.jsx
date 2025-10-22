import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Spin,
  Alert,
  Button,
  Row,
  Col,
  Statistic,
  Empty,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Reports() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [filteredReports, setFilteredReports] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Thống kê tổng quan
  const totalReports = filteredReports.length;
  const pendingReports = filteredReports.filter(
    (item) => item.status === 0
  ).length;
  const resolvedReports = filteredReports.filter(
    (item) => item.status === 2
  ).length;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchReports = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const userID = user?.userID || user?.id;
        const response = await apiService.getUserReports(userID);

        if (response?.status === "success" && response?.data) {
          setReports(response.data);
          setFilteredReports(response.data);
        } else {
          setError("Không thể tải danh sách báo cáo");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Có lỗi xảy ra khi tải danh sách báo cáo");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, user, navigate]);

  // Filter reports based on type and status
  useEffect(() => {
    let filtered = [...reports];

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === parseInt(typeFilter));
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status === parseInt(statusFilter)
      );
    }

    setFilteredReports(filtered);
  }, [reports, typeFilter, statusFilter]);

  const getStatusTag = (status, statusName) => {
    const statusConfig = {
      0: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: statusName || "Pending",
      },
      1: {
        color: "blue",
        icon: <ExclamationCircleOutlined />,
        text: statusName || "Processing",
      },
      2: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: statusName || "Resolved",
      },
      3: {
        color: "red",
        icon: <ExclamationCircleOutlined />,
        text: statusName || "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig[0];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getTypeTag = (type, typeName) => {
    const typeConfig = {
      1: { color: "blue", text: typeName || "Station" },
      2: { color: "green", text: typeName || "Service" },
      3: { color: "purple", text: typeName || "Staff" },
      4: { color: "orange", text: typeName || "Other" },
    };

    const config = typeConfig[type] || typeConfig[4];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            ID Báo cáo
          </Text>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 120,
      align: "center",
      render: (id) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text strong style={{ color: "#00083B", fontSize: "13px" }}>
            #{id}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <FileTextOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Loại báo cáo
          </Text>
        </div>
      ),
      dataIndex: "type",
      key: "type",
      width: 140,
      align: "center",
      render: (type, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {getTypeTag(type, record.typeName)}
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Mô tả
          </Text>
        </div>
      ),
      dataIndex: "description",
      key: "description",
      width: 300,
      align: "center",
      render: (description) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>
            {description}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Trạng thái
          </Text>
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center",
      render: (status, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {getStatusTag(status, record.statusName)}
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <ClockCircleOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Ngày tạo
          </Text>
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (date) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>
            {formatDate(date)}
          </Text>
        </div>
      ),
    },
  ];

  const handleRefresh = () => {
    fetchReports();
  };

  const handleCreateReport = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmitReport = async (values) => {
    try {
      setSubmitting(true);
      const userID = user?.userID || user?.id;
      const response = await apiService.createReport(
        userID,
        values.type,
        values.description
      );

      if (response?.status === "success") {
        message.success("Báo cáo đã được gửi thành công!");
        setIsModalVisible(false);
        form.resetFields();
        fetchReports(); // Refresh danh sách báo cáo
      } else {
        message.error("Có lỗi xảy ra khi gửi báo cáo");
      }
    } catch (err) {
      console.error("Error creating report:", err);
      message.error("Có lỗi xảy ra khi gửi báo cáo");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const userID = user?.userID || user?.id;
      const response = await apiService.getUserReports(userID);

      if (response?.status === "success" && response?.data) {
        setReports(response.data);
      } else {
        setError("Không thể tải danh sách báo cáo");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Có lỗi xảy ra khi tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      {/* Custom CSS for table styling */}
      <style jsx>{`
        .reports-table .ant-table-thead > tr > th {
          background: linear-gradient(
            135deg,
            #00083b 0%,
            #1a1f5c 100%
          ) !important;
          color: white !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          text-align: center !important;
          padding: 16px 8px !important;
          border: none !important;
          position: relative;
        }

        .reports-table .ant-table-thead > tr > th:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .reports-table .ant-table-tbody > tr > td {
          padding: 12px 8px !important;
          border-bottom: 1px solid #f0f0f0 !important;
          vertical-align: middle !important;
        }

        .table-row-even {
          background-color: #fafafa !important;
        }

        .table-row-odd {
          background-color: white !important;
        }

        .reports-table .ant-table-tbody > tr:hover > td {
          background-color: #f5f5f5 !important;
        }

        .reports-table .ant-table-tbody > tr:hover.table-row-even > td {
          background-color: #f0f0f0 !important;
        }

        .reports-table .ant-pagination {
          margin-top: 20px !important;
          text-align: center !important;
        }

        .reports-table .ant-pagination .ant-pagination-item {
          border-radius: 8px !important;
        }

        .reports-table .ant-pagination .ant-pagination-item-active {
          background: linear-gradient(
            135deg,
            #00083b 0%,
            #1a1f5c 100%
          ) !important;
          border-color: #00083b !important;
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,8,59,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,8,59,0.02)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)] mb-6 shadow-[0_8px_20px_rgba(0,8,59,0.15)]">
            <FileTextOutlined style={{ fontSize: "36px", color: "white" }} />
          </div>
          <Title
            level={1}
            className="text-[#00083B] mb-3 text-[36px] font-bold"
          >
            Báo cáo của tôi
          </Title>
          <Text className="text-slate-500 text-[18px] max-w-[600px] mx-auto leading-relaxed">
            Quản lý và theo dõi các báo cáo bạn đã gửi
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <FileTextOutlined style={{ color: "#00083B" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Tổng báo cáo
                    </span>
                  </Space>
                }
                value={totalReports}
                valueStyle={{
                  color: "#00083B",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: "#f59e0b" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Đang chờ xử lý
                    </span>
                  </Space>
                }
                value={pendingReports}
                valueStyle={{
                  color: "#f59e0b",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: "#10b981" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Đã giải quyết
                    </span>
                  </Space>
                }
                value={resolvedReports}
                valueStyle={{
                  color: "#10b981",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Action Bar */}
        <Card
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] mb-6"
          bodyStyle={{ padding: "20px 24px" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileTextOutlined
                    style={{ color: "white", fontSize: "18px" }}
                  />
                </div>
                <div>
                  <Title
                    level={3}
                    style={{ color: "#00083B", margin: 0, fontSize: "20px" }}
                  >
                    Danh sách báo cáo
                  </Title>
                  <Text style={{ color: "#64748b", fontSize: "14px" }}>
                    Quản lý và theo dõi các báo cáo của bạn
                  </Text>
                </div>
              </div>
              <Badge
                count={filteredReports.length}
                style={{
                  backgroundColor: "#10b981",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                offset={[8, 0]}
              >
                <div className="px-3 py-1 bg-gray-100 rounded-lg">
                  <Text
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Hiển thị {filteredReports.length}/{reports.length} báo cáo
                  </Text>
                </div>
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                className="flex items-center gap-2 px-4 py-2 h-auto border-gray-300 hover:border-blue-400 hover:text-blue-500 transition-all duration-200"
              >
                <span className="text-sm font-medium">Làm mới</span>
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={handleCreateReport}
                type="primary"
                className="flex items-center gap-2 px-6 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                <span>Gửi báo cáo mới</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Filter Controls */}
        <Card
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] mb-6"
          bodyStyle={{ padding: "20px 24px" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <span
                    style={{
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    🔍
                  </span>
                </div>
                <div>
                  <Title
                    level={4}
                    style={{ color: "#00083B", margin: 0, fontSize: "16px" }}
                  >
                    Bộ lọc
                  </Title>
                  <Text style={{ color: "#64748b", fontSize: "12px" }}>
                    Lọc báo cáo theo loại và trạng thái
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Loại:
                </Text>
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: 160 }}
                  size="small"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="1">Vấn đề về trạm</Option>
                  <Option value="2">Hỏng ổ cắm</Option>
                  <Option value="3">Vấn đề về pin</Option>
                  <Option value="4">Khác</Option>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Text
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Trạng thái:
                </Text>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 160 }}
                  size="small"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="0">Đang xử lý</Option>
                  <Option value="1">Đã giải quyết</Option>
                </Select>
              </div>

              <Button
                onClick={() => {
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                size="small"
                className="px-3 py-1 h-auto border-gray-300 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </Card>

        {/* Reports Table */}
        <Card
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
          bodyStyle={{ padding: "24px" }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="p-8">
              <Alert
                message="Lỗi"
                description={error}
                type="error"
                showIcon
                action={
                  <Button size="small" onClick={handleRefresh}>
                    Thử lại
                  </Button>
                }
              />
            </div>
          ) : filteredReports.length === 0 ? (
            <Empty
              description={
                reports.length === 0
                  ? "Bạn chưa có báo cáo nào. Hãy tạo báo cáo đầu tiên của bạn!"
                  : "Không tìm thấy báo cáo phù hợp với bộ lọc hiện tại"
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              {reports.length === 0 && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateReport}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "8px 24px",
                    height: "auto",
                  }}
                >
                  Tạo báo cáo đầu tiên
                </Button>
              )}
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredReports}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} báo cáo`,
                style: { marginTop: "16px" },
              }}
              scroll={{ x: 1000 }}
              size="middle"
              className="reports-table"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 8, 59, 0.08)",
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-even" : "table-row-odd"
              }
            />
          )}
        </Card>

        {/* Modal tạo báo cáo mới */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={700}
          className="report-modal"
          centered
          destroyOnClose
          zIndex={9999}
          maskClosable={false}
        >
          {/* Custom Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileTextOutlined style={{ color: "white", fontSize: "20px" }} />
            </div>
            <div>
              <Title
                level={3}
                style={{ color: "#00083B", margin: 0, fontSize: "22px" }}
              >
                Gửi báo cáo mới
              </Title>
              <Text style={{ color: "#64748b", fontSize: "14px" }}>
                Mô tả vấn đề bạn gặp phải để chúng tôi có thể hỗ trợ tốt nhất
              </Text>
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReport}
            className="report-form"
            size="large"
          >
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <ExclamationCircleOutlined
                    style={{ color: "#1890ff", fontSize: "16px" }}
                  />
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#00083B",
                      fontSize: "15px",
                    }}
                  >
                    Loại vấn đề
                  </span>
                  <span style={{ color: "#ff4d4f" }}>*</span>
                </div>
              }
              name="type"
              rules={[{ required: true, message: "Vui lòng chọn loại vấn đề" }]}
            >
              <Select
                placeholder="Chọn loại vấn đề bạn muốn báo cáo"
                className="report-select"
                dropdownClassName="report-dropdown"
                optionLabelProp="label"
              >
                <Option value={1} label="Vấn đề về trạm">
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExclamationCircleOutlined
                        style={{ color: "#1890ff", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", color: "#00083B" }}>
                        Vấn đề về trạm
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Trạm không hoạt động, lỗi hệ thống
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value={2} label="Hỏng ổ cắm">
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <ExclamationCircleOutlined
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", color: "#00083B" }}>
                        Hỏng ổ cắm
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Ổ cắm không hoạt động, lỗi kết nối
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value={3} label="Vấn đề về pin">
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ExclamationCircleOutlined
                        style={{ color: "#722ed1", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", color: "#00083B" }}>
                        Vấn đề về pin
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Pin không sạc, pin hỏng
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value={4} label="Khác">
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ExclamationCircleOutlined
                        style={{ color: "#fa8c16", fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", color: "#00083B" }}>
                        Khác
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        Các vấn đề khác không thuộc danh mục trên
                      </div>
                    </div>
                  </div>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <FileTextOutlined
                    style={{ color: "#1890ff", fontSize: "16px" }}
                  />
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#00083B",
                      fontSize: "15px",
                    }}
                  >
                    Mô tả chi tiết
                  </span>
                  <span style={{ color: "#ff4d4f" }}>*</span>
                </div>
              }
              name="description"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả vấn đề" },
                { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
                { max: 500, message: "Mô tả không được quá 500 ký tự" },
              ]}
            >
              <TextArea
                rows={5}
                placeholder="Mô tả chi tiết về vấn đề bạn gặp phải. Ví dụ: Thời gian xảy ra, địa điểm, mức độ nghiêm trọng..."
                showCount
                maxLength={500}
                className="report-textarea"
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  padding: "16px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              />
            </Form.Item>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span
                    style={{
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    💡
                  </span>
                </div>
                <div>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#1890ff",
                      fontSize: "14px",
                    }}
                  >
                    Mẹo viết báo cáo hiệu quả:
                  </Text>
                  <ul
                    style={{
                      margin: "8px 0 0 0",
                      paddingLeft: "16px",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    <li>Mô tả rõ ràng vấn đề gặp phải</li>
                    <li>Ghi chú thời gian và địa điểm cụ thể</li>
                    <li>Đề cập đến mức độ ảnh hưởng đến việc sử dụng</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleModalCancel}
                size="large"
                className="px-6 py-2 h-auto border-gray-300 hover:border-gray-400 hover:text-gray-600 transition-all duration-200"
                style={{ borderRadius: "10px", fontWeight: "500" }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                icon={<FileTextOutlined />}
                className="px-8 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Gửi báo cáo
              </Button>
            </div>
          </Form>
        </Modal>
      </div>

      <style jsx>{`
        .report-modal {
          z-index: 9999 !important;
        }

        .report-modal .ant-modal-mask {
          z-index: 9998 !important;
        }

        .report-modal .ant-modal-wrap {
          z-index: 9999 !important;
        }

        .report-modal .ant-modal-content {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 8, 59, 0.15);
          z-index: 9999 !important;
          position: relative;
        }

        .report-modal .ant-modal-body {
          padding: 32px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          max-height: 80vh;
          overflow-y: auto;
        }

        .report-modal .ant-modal-close {
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          transition: all 0.2s ease;
          z-index: 10000 !important;
        }

        .report-modal .ant-modal-close:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .report-select .ant-select-selector {
          border-radius: 12px !important;
          border: 2px solid #e2e8f0 !important;
          padding: 12px 16px !important;
          min-height: 48px !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
        }

        .report-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          height: auto !important;
          line-height: 1.4 !important;
          font-weight: 500 !important;
          color: #00083b !important;
        }

        .report-select .ant-select-selection-placeholder {
          display: flex !important;
          align-items: center !important;
          height: auto !important;
          line-height: 1.4 !important;
        }

        .report-select .ant-select-selector:hover {
          border-color: #3b82f6 !important;
        }

        .report-select.ant-select-focused .ant-select-selector {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .report-dropdown .ant-select-item {
          padding: 12px 16px !important;
          border-radius: 8px !important;
          margin: 4px 8px !important;
          transition: all 0.2s ease !important;
        }

        .report-dropdown .ant-select-item:hover {
          background: #f1f5f9 !important;
        }

        .report-dropdown .ant-select-item-option-selected {
          background: #dbeafe !important;
        }

        .report-textarea:hover {
          border-color: #3b82f6 !important;
        }

        .report-textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .report-form .ant-form-item {
          margin-bottom: 24px;
        }

        .report-form .ant-form-item-label {
          padding-bottom: 8px;
        }

        .report-form .ant-form-item-explain-error {
          margin-top: 8px;
          font-size: 13px;
        }

        .report-form .ant-input-affix-wrapper {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .report-form .ant-input-affix-wrapper:hover {
          border-color: #3b82f6;
        }

        .report-form .ant-input-affix-wrapper-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}
