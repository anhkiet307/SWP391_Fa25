import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/header.jsx";
import {
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  DatePicker,
  Select,
  Input,
  Divider,
  Alert,
  Empty,
  Tooltip,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  StarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { batteryStations } from "../../data/stations";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Demo data - trong thực tế sẽ lấy từ API
const mockBookingHistory = [
  {
    id: "BK001",
    bookingDate: "2024-01-15",
    bookingTime: "09:00 - 09:10",
    stationName: "Trạm đổi pin Ba Đình",
    stationAddress: "123 Phố Huế, Ba Đình, Hà Nội",
    city: "Hà Nội",
    batterySlot: "Ổ pin #3",
    batterySoC: 100,
    batterySoH: 95,
    staffName: "Nguyễn Văn A",
    staffId: "ST001",
    completedAt: "09:05",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "BK002",
    bookingDate: "2024-01-14",
    bookingTime: "14:30 - 14:40",
    stationName: "Trạm đổi pin Quận 1",
    stationAddress: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    city: "TP.HCM",
    batterySlot: "Ổ pin #7",
    batterySoC: 100,
    batterySoH: 92,
    staffName: "Trần Thị B",
    staffId: "ST002",
    completedAt: "14:35",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-14T14:15:00Z",
  },
  {
    id: "BK003",
    bookingDate: "2024-01-13",
    bookingTime: "16:00 - 16:10",
    stationName: "Trạm đổi pin Cầu Giấy",
    stationAddress: "789 Cầu Giấy, Cầu Giấy, Hà Nội",
    city: "Hà Nội",
    batterySlot: "Ổ pin #12",
    batterySoC: 100,
    batterySoH: 88,
    staffName: "Lê Văn C",
    staffId: "ST003",
    completedAt: "16:08",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-13T15:45:00Z",
  },
  {
    id: "BK004",
    bookingDate: "2024-01-12",
    bookingTime: "11:00 - 11:10",
    stationName: "Trạm đổi pin Quận 3",
    stationAddress: "321 Võ Văn Tần, Quận 3, TP.HCM",
    city: "TP.HCM",
    batterySlot: "Ổ pin #5",
    batterySoC: 100,
    batterySoH: 90,
    staffName: "Phạm Thị D",
    staffId: "ST004",
    completedAt: "11:12",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-12T10:50:00Z",
  },
  {
    id: "BK005",
    bookingDate: "2024-01-11",
    bookingTime: "08:30 - 08:40",
    stationName: "Trạm đổi pin Hai Bà Trưng",
    stationAddress: "654 Bạch Mai, Hai Bà Trưng, Hà Nội",
    city: "Hà Nội",
    batterySlot: "Ổ pin #9",
    batterySoC: 100,
    batterySoH: 94,
    staffName: "Hoàng Văn E",
    staffId: "ST005",
    completedAt: "08:38",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-11T08:20:00Z",
  },
  {
    id: "BK006",
    bookingDate: "2024-01-10",
    bookingTime: "09:00 - 09:10",
    stationName: "Trạm đổi pin Ba Đình",
    stationAddress: "123 Phố Huế, Ba Đình, Hà Nội",
    city: "Hà Nội",
    batterySlot: "Ổ pin #2",
    batterySoC: 100,
    batterySoH: 96,
    staffName: "Nguyễn Văn A",
    staffId: "ST001",
    completedAt: null,
    cancelledAt: "09:15",
    serviceFee: 50000,
    status: "cancelled",
    createdAt: "2024-01-10T08:45:00Z",
  },
  {
    id: "BK007",
    bookingDate: "2024-01-09",
    bookingTime: "15:30 - 15:40",
    stationName: "Trạm đổi pin Quận 1",
    stationAddress: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    city: "TP.HCM",
    batterySlot: "Ổ pin #8",
    batterySoC: 100,
    batterySoH: 89,
    staffName: "Trần Thị B",
    staffId: "ST002",
    completedAt: null,
    cancelledAt: "15:45",
    serviceFee: 50000,
    status: "cancelled",
    createdAt: "2024-01-09T15:15:00Z",
  },
  {
    id: "BK008",
    bookingDate: "2024-01-08",
    bookingTime: "11:00 - 11:10",
    stationName: "Trạm đổi pin Cầu Giấy",
    stationAddress: "789 Cầu Giấy, Cầu Giấy, Hà Nội",
    city: "Hà Nội",
    batterySlot: "Ổ pin #15",
    batterySoC: 100,
    batterySoH: 91,
    staffName: "Lê Văn C",
    staffId: "ST003",
    completedAt: "11:05",
    serviceFee: 50000,
    status: "completed",
    createdAt: "2024-01-08T10:50:00Z",
  },
];

export default function BookingHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState(mockBookingHistory);
  const [filteredData, setFilteredData] = useState(mockBookingHistory);
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Thống kê tổng quan
  const totalBookings = filteredData.length;
  const completedBookings = filteredData.filter(
    (item) => item.status === "completed"
  ).length;
  const totalSpent = filteredData.reduce(
    (sum, item) => sum + item.serviceFee,
    0
  );

  // Format tiền tệ
  const formatVND = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Lọc dữ liệu
  useEffect(() => {
    let filtered = [...bookingHistory];

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange.length === 2) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.bookingDate);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Lọc theo thành phố
    if (cityFilter !== "all") {
      filtered = filtered.filter((item) => item.city === cityFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(searchText.toLowerCase()) ||
          item.stationName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.staffName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [bookingHistory, dateRange, statusFilter, cityFilter, searchText]);

  // Định nghĩa cột cho bảng
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
            Mã đặt lịch
          </Text>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 120,
      align: "center",
      render: (text) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text strong style={{ color: "#00083B", fontSize: "13px" }}>
            {text}
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
          <CalendarOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Ngày đặt
          </Text>
        </div>
      ),
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 130,
      align: "center",
      render: (date) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>
            {dayjs(date).format("DD/MM/YYYY")}
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
          <ClockCircleOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Khung giờ
          </Text>
        </div>
      ),
      dataIndex: "bookingTime",
      key: "bookingTime",
      width: 140,
      align: "center",
      render: (time) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>{time}</Text>
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
          <EnvironmentOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Trạm đổi pin
          </Text>
        </div>
      ),
      dataIndex: "stationName",
      key: "stationName",
      width: 220,
      align: "center",
      render: (name, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text strong style={{ fontSize: "13px", fontWeight: "600" }}>
            {name}
          </Text>
          <div>
            <Text
              style={{
                fontSize: "11px",
                color: "#64748b",
                lineHeight: "1.2",
              }}
            >
              {record.stationAddress}
            </Text>
          </div>
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
          <ThunderboltOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Ổ pin
          </Text>
        </div>
      ),
      dataIndex: "batterySlot",
      key: "batterySlot",
      width: 120,
      align: "center",
      render: (slot, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>{slot}</Text>
          <div>
            <Text
              style={{
                fontSize: "11px",
                color: "#64748b",
                lineHeight: "1.2",
              }}
            >
              SoC: {record.batterySoC}% | SoH: {record.batterySoH}%
            </Text>
          </div>
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
          <UserOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Nhân viên
          </Text>
        </div>
      ),
      dataIndex: "staffName",
      key: "staffName",
      width: 160,
      align: "center",
      render: (name, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text style={{ fontSize: "13px", fontWeight: "500" }}>{name}</Text>
          <div>
            <Text
              style={{
                fontSize: "11px",
                color: "#64748b",
                lineHeight: "1.2",
              }}
            >
              ID: {record.staffId}
            </Text>
          </div>
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
          <CheckCircleOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Hoàn thành
          </Text>
        </div>
      ),
      dataIndex: "completedAt",
      key: "completedAt",
      width: 140,
      align: "center",
      render: (time, record) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {record.status === "completed" ? (
            <Text
              style={{
                fontSize: "13px",
                color: "#10b981",
                fontWeight: "500",
              }}
            >
              {time}
            </Text>
          ) : record.status === "cancelled" ? (
            <Text
              style={{
                fontSize: "13px",
                color: "#dc2626",
                fontWeight: "500",
              }}
            >
              Hủy lúc: {record.cancelledAt}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: "13px",
                color: "#f59e0b",
                fontWeight: "500",
              }}
            >
              Chờ xử lý
            </Text>
          )}
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
          <DollarOutlined style={{ color: "white", fontSize: "16px" }} />
          <Text strong style={{ color: "white", fontSize: "14px" }}>
            Phí dịch vụ
          </Text>
        </div>
      ),
      dataIndex: "serviceFee",
      key: "serviceFee",
      width: 140,
      align: "center",
      render: (fee) => (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Text
            strong
            style={{ color: "#10b981", fontSize: "13px", fontWeight: "600" }}
          >
            {formatVND(fee)}
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
      width: 120,
      align: "center",
      render: (status) => {
        const statusConfig = {
          completed: { color: "green", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
          pending: { color: "orange", text: "Chờ xử lý" },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <Tag
              color={config.color}
              style={{ margin: 0, fontSize: "12px", fontWeight: "500" }}
            >
              {config.text}
            </Tag>
          </div>
        );
      },
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setDateRange(null);
    setStatusFilter("all");
    setCityFilter("all");
    setSearchText("");
  };

  // Lấy danh sách thành phố unique cho filter
  const uniqueCities = [...new Set(bookingHistory.map((item) => item.city))];

  return (
    <div className="min-h-screen relative bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)]">
      {/* Custom CSS for table styling */}
      <style jsx>{`
        .booking-history-table .ant-table-thead > tr > th {
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

        .booking-history-table
          .ant-table-thead
          > tr
          > th:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .booking-history-table .ant-table-tbody > tr > td {
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

        .booking-history-table .ant-table-tbody > tr:hover > td {
          background-color: #f5f5f5 !important;
        }

        .booking-history-table .ant-table-tbody > tr:hover.table-row-even > td {
          background-color: #f0f0f0 !important;
        }

        .booking-history-table .ant-pagination {
          margin-top: 20px !important;
          text-align: center !important;
        }

        .booking-history-table .ant-pagination .ant-pagination-item {
          border-radius: 8px !important;
        }

        .booking-history-table .ant-pagination .ant-pagination-item-active {
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

      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[linear-gradient(135deg,#00083B_0%,#1a1f5c_100%)] mb-6 shadow-[0_8px_20px_rgba(0,8,59,0.15)]">
            <CalendarOutlined style={{ fontSize: "36px", color: "white" }} />
          </div>
          <Title
            level={1}
            className="text-[#00083B] mb-3 text-[36px] font-bold"
          >
            Lịch Sử Đặt Lịch
          </Title>
          <Text className="text-slate-500 text-[18px] max-w-[600px] mx-auto leading-relaxed">
            Theo dõi tất cả các giao dịch đổi pin của bạn với thông tin chi tiết
            về nhân viên và thời gian hoàn thành
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
                    <CalendarOutlined style={{ color: "#00083B" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Tổng đặt lịch
                    </span>
                  </Space>
                }
                value={totalBookings}
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
                    <CheckCircleOutlined style={{ color: "#10b981" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Đã hoàn thành
                    </span>
                  </Space>
                }
                value={completedBookings}
                valueStyle={{
                  color: "#10b981",
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
                    <DollarOutlined style={{ color: "#f59e0b" }} />
                    <span style={{ color: "#64748b", fontSize: "14px" }}>
                      Tổng chi phí
                    </span>
                  </Space>
                }
                value={formatVND(totalSpent)}
                valueStyle={{
                  color: "#f59e0b",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Search */}
        <Card
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)] mb-6"
          bodyStyle={{ padding: "24px" }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong style={{ color: "#00083B", fontSize: "14px" }}>
                  Khoảng thời gian
                </Text>
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  value={dateRange}
                  onChange={setDateRange}
                  format="DD/MM/YYYY"
                />
              </Space>
            </Col>
            <Col xs={24} sm={4}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong style={{ color: "#00083B", fontSize: "14px" }}>
                  Trạng thái
                </Text>
                <Select
                  style={{ width: "100%" }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="pending">Chờ xử lý</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={4}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong style={{ color: "#00083B", fontSize: "14px" }}>
                  Thành phố
                </Text>
                <Select
                  style={{ width: "100%" }}
                  value={cityFilter}
                  onChange={setCityFilter}
                >
                  <Option value="all">Tất cả thành phố</Option>
                  {uniqueCities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={6}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong style={{ color: "#00083B", fontSize: "14px" }}>
                  Tìm kiếm
                </Text>
                <Input
                  placeholder="Mã đặt lịch, trạm, nhân viên..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Space>
            </Col>
            <Col xs={24} sm={4}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Làm mới
                </Button>
                <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Booking History Table */}
        <Card
          className="rounded-2xl shadow-[0_8px_24px_rgba(0,8,59,0.1)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] border border-[rgba(0,8,59,0.08)]"
          bodyStyle={{ padding: "24px" }}
        >
          <div className="flex items-center justify-between mb-6">
            <Title level={3} style={{ color: "#00083B", margin: 0 }}>
              Danh sách giao dịch
            </Title>
            <Badge
              count={filteredData.length}
              style={{ backgroundColor: "#10b981" }}
            >
              <Text style={{ color: "#64748b", fontSize: "14px" }}>
                {filteredData.length} giao dịch
              </Text>
            </Badge>
          </div>

          {filteredData.length === 0 ? (
            <Empty
              description="Không có giao dịch nào phù hợp với bộ lọc"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} giao dịch`,
                style: { marginTop: "16px" },
              }}
              scroll={{ x: 1400 }}
              size="middle"
              className="booking-history-table"
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

        {/* Information Alert */}
        <Alert
          message="ℹ️ Thông tin quan trọng"
          description={
            <div>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li>
                  <strong>Thời gian hoàn thành:</strong> Thời điểm nhân viên
                  hoàn thành việc thay pin cho bạn
                </li>
                <li>
                  <strong>Hủy lịch:</strong> Lịch sẽ bị hủy tự động nếu đến muộn
                  sau khung giờ đã đặt. Thời gian hủy được ghi lại để minh bạch
                </li>
                <li>
                  <strong>Phí dịch vụ:</strong> Chi phí cố định cho mỗi lần đổi
                  pin
                </li>
                <li>
                  <strong>SoC/SoH:</strong> Mức pin và tình trạng pin tại thời
                  điểm đổi
                </li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{
            marginTop: "24px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(0, 8, 59, 0.05) 0%, rgba(0, 8, 59, 0.02) 100%)",
            border: "1px solid rgba(0, 8, 59, 0.1)",
          }}
        />
      </div>
    </div>
  );
}
