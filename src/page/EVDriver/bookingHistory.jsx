import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
  Modal,
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
import apiService from "../../services/apiService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// ĐÃ BỎ mock data, sử dụng dữ liệu từ API
const mockBookingHistory = [];

export default function BookingHistory() {
  const { user } = useAuth();
  const [modal, modalContextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stationsMap, setStationsMap] = useState({});
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");
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

    // Lọc theo trạm (theo stationID)
    if (stationFilter !== "all") {
      filtered = filtered.filter(
        (item) => String(item.stationId) === String(stationFilter)
      );
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filtered = filtered.filter((item) =>
        String(item.id).toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [bookingHistory, dateRange, statusFilter, stationFilter, searchText]);

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
          pending: { color: "orange", text: "Đang xử lý" },
          completed: { color: "green", text: "Đã thanh toán" },
          expired: { color: "gold", text: "Đã quá hạn" },
          cancelled: { color: "red", text: "Đã hủy lịch" },
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
            Hành động
          </Text>
        </div>
      ),
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => {
        const canCancel = record.status === "pending"; // chỉ cho phép khi đang chờ
        return (
          <Space>
            <Tooltip title={canCancel ? "" : "Chỉ có thể hủy khi đang chờ"}>
              <Button
                size="small"
                danger
                disabled={!canCancel}
                onClick={() => {
                  modal.confirm({
                    title: "Xác nhận hủy đặt lịch",
                    content:
                      "Bạn có chắc chắn muốn hủy lịch này? Ổ pin sẽ được trả về trạng thái khả dụng.",
                    okText: canCancel ? "Hủy đặt lịch" : "Không thể hủy",
                    okButtonProps: { danger: true, disabled: !canCancel },
                    cancelText: "Đóng",
                    onOk: () =>
                      new Promise(async (resolve) => {
                        try {
                          const [updateRes] = await Promise.all([
                            // 3 = cancel theo quy ước mới
                            apiService.updateTransactionStatus(record.id, 3),
                            apiService.unreservePinSlot(
                              record.pinId || record.batterySlot?.split("#")[1]
                            ),
                          ]);
                          if (updateRes?.status === "success") {
                            fetchHistory();
                          }
                        } catch (e) {
                          console.error("Cancel transaction failed", e);
                        } finally {
                          resolve();
                        }
                      }),
                  });
                }}
              >
                Hủy
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mapApiStatusToText = (status) => {
    // 0=pending, 1=completed, 2=expired, 3=cancelled
    if (status === 1) return "completed";
    if (status === 2) return "expired";
    if (status === 3) return "cancelled";
    return "pending";
  };

  const fetchHistory = async () => {
    if (!user?.userID) return;
    setLoading(true);
    try {
      const res = await apiService.getTransactionsByUser(user.userID);
      if (res?.status === "success" && Array.isArray(res.data)) {
        const mapped = res.data.map((t, idx) => ({
          id: t.transactionID,
          bookingDate: dayjs(t.createAt).format("YYYY-MM-DD"),
          bookingTime: `${dayjs(t.createAt).format("HH:mm")} - ${dayjs(
            t.expireAt
          ).format("HH:mm")}`,
          stationId: t.stationID,
          stationName:
            stationsMap[t.stationID]?.stationName || `Trạm #${t.stationID}`,
          stationAddress:
            stationsMap[t.stationID]?.location || `Mã trạm: ${t.stationID}`,
          city: "-",
          batterySlot: `Ổ pin #${t.pinID}`,
          batterySoC: 100,
          batterySoH: 100,
          staffName: "-",
          staffId: "-",
          completedAt:
            t.status === 1 ? dayjs(t.expireAt).format("HH:mm") : null,
          cancelledAt:
            t.status === 3 ? dayjs(t.expireAt).format("HH:mm") : null,
          serviceFee: t.amount,
          status: mapApiStatusToText(t.status),
          createdAt: t.createAt,
        }));
        const sorted = mapped.sort((a, b) => a.id - b.id);
        setBookingHistory(sorted);
        setFilteredData(sorted);
      } else {
        setBookingHistory([]);
        setFilteredData([]);
      }
    } catch (e) {
      console.error("Fetch history error", e);
      setBookingHistory([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const res = await apiService.getPinStations();
      if (res?.status === "success" && Array.isArray(res.data)) {
        const map = {};
        res.data.forEach((s) => {
          map[s.stationID] = {
            stationName: s.stationName,
            location: s.location,
          };
        });
        setStationsMap(map);
      }
    } catch (e) {
      console.error("Fetch stations error", e);
    }
  };

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userID, stationsMap]);

  const handleRefresh = () => {
    fetchHistory();
  };

  const handleClearFilters = () => {
    setDateRange(null);
    setStatusFilter("all");
    setStationFilter("all");
    setSearchText("");
  };

  // Danh sách trạm để filter
  const stationsOptions = Object.entries(stationsMap).map(([id, info]) => ({
    id,
    name: info.stationName,
  }));

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {modalContextHolder}
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
            Theo dõi tất cả các giao dịch đổi pin của bạn.
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
            <Col xs={24} sm={6}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Text strong style={{ color: "#00083B", fontSize: "14px" }}>
                  Trạm
                </Text>
                <Select
                  style={{ width: "100%" }}
                  value={stationFilter}
                  onChange={setStationFilter}
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn trạm"
                >
                  <Option value="all" label="Tất cả trạm">
                    Tất cả trạm
                  </Option>
                  {stationsOptions.map((s) => (
                    <Option key={s.id} value={s.id} label={s.name}>
                      {s.name}
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
      </div>
    </div>
  );
}
