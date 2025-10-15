import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Card,
  Result,
  Button,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Tag,
  Alert,
} from "antd";
import {
  CheckOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CarOutlined,
  DollarOutlined,
  LeftOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("BookingSuccess crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <Card style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
            <Result
              status="warning"
              title="Đã xảy ra lỗi khi hiển thị trang"
              subTitle="Vui lòng quay lại trang đặt lịch hoặc thử lại sau"
              extra={
                <Link to="/booking">
                  <Button type="primary">Quay lại đặt lịch</Button>
                </Link>
              }
            />
          </Card>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default function BookingSuccess() {
  const location = useLocation();
  const bookingData = location.state?.bookingData || null;

  // Nếu không có dữ liệu booking, chuyển về trang booking
  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          <Result
            status="warning"
            title="Không tìm thấy thông tin đặt lịch"
            subTitle="Vui lòng thực hiện đặt lịch lại"
            extra={
              <Link to="/booking">
                <Button type="primary">Đặt lịch lại</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const formatVND = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const selectedSlotId = bookingData?.selectedSlot ?? null;

  return (
    <SimpleErrorBoundary>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,8,59,0.03)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,8,59,0.02)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
          {/* Success Card */}
          <Card
            style={{
              borderRadius: "24px",
              boxShadow:
                "0 20px 40px rgba(0, 8, 59, 0.15), 0 8px 16px rgba(0, 8, 59, 0.1)",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              border: "2px solid #00083B",
              marginBottom: "32px",
            }}
          >
            <Result
              status="success"
              icon={
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    boxShadow:
                      "0 16px 32px rgba(16, 185, 129, 0.3), 0 8px 16px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <CheckOutlined style={{ fontSize: "50px", color: "white" }} />
                </div>
              }
              title={
                <Title level={1} style={{ color: "#00083B", margin: 0 }}>
                  Đặt Lịch Thành Công!
                </Title>
              }
              subTitle={
                <Paragraph
                  style={{ color: "#64748b", fontSize: "18px", margin: 0 }}
                >
                  Cảm ơn bạn đã sử dụng dịch vụ của VoltSwap! Thông tin đặt lịch
                  đã được xác nhận.
                </Paragraph>
              }
            />

            {/* Booking Details */}
            <Card
              size="small"
              style={{
                marginTop: "32px",
                borderRadius: "20px",
                background: "rgba(0, 8, 59, 0.05)",
                border: "1px solid rgba(0, 8, 59, 0.1)",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Title
                level={3}
                style={{ color: "#00083B", marginBottom: "20px" }}
              >
                📋 Thông tin đặt lịch
              </Title>

              <Row gutter={[24, 16]}>
                {bookingData?.station && (
                  <Col xs={24} sm={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <EnvironmentOutlined
                          style={{ color: "#00083B", fontSize: "18px" }}
                        />
                        <Text strong style={{ color: "#00083B" }}>
                          Trạm đổi pin:
                        </Text>
                      </div>
                      <Text
                        style={{
                          color: "#475569",
                          fontSize: "16px",
                          marginLeft: "26px",
                        }}
                      >
                        {bookingData.station}
                      </Text>
                    </Space>
                  </Col>
                )}

                {bookingData?.date && (
                  <Col xs={24} sm={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CalendarOutlined
                          style={{ color: "#00083B", fontSize: "18px" }}
                        />
                        <Text strong style={{ color: "#00083B" }}>
                          Ngày đặt lịch:
                        </Text>
                      </div>
                      <Text
                        style={{
                          color: "#475569",
                          fontSize: "16px",
                          marginLeft: "26px",
                        }}
                      >
                        {(() => {
                          const parsed = dayjs(bookingData.date);
                          return parsed.isValid()
                            ? parsed.format("DD/MM/YYYY")
                            : bookingData.date;
                        })()}
                      </Text>
                    </Space>
                  </Col>
                )}

                {/* Bỏ khung giờ theo yêu cầu */}

                {selectedSlotId && (
                  <Col xs={24} sm={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                          }}
                        >
                          ⚡
                        </div>
                        <Text strong style={{ color: "#00083B" }}>
                          Ổ pin được đặt:
                        </Text>
                      </div>
                      <Text
                        style={{
                          color: "#475569",
                          fontSize: "16px",
                          marginLeft: "26px",
                        }}
                      >
                        Ổ pin #{selectedSlotId}
                      </Text>
                    </Space>
                  </Col>
                )}
              </Row>

              <Divider style={{ margin: "20px 0" }} />

              {typeof bookingData?.amount === "number" && (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <DollarOutlined
                      style={{ color: "#10b981", fontSize: "18px" }}
                    />
                    <Text strong style={{ color: "#00083B", fontSize: "16px" }}>
                      Thông tin thanh toán
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#475569", fontSize: "16px" }}>
                      Phí dịch vụ đổi pin:
                    </Text>
                    <Text strong style={{ color: "#10b981", fontSize: "18px" }}>
                      {formatVND(bookingData.amount)}
                    </Text>
                  </div>
                  {typeof bookingData?.pack === "number" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px",
                      }}
                    >
                      <Text style={{ color: "#475569", fontSize: "16px" }}>
                        Phương thức:
                      </Text>
                      <Text
                        strong
                        style={{ color: "#0f172a", fontSize: "16px" }}
                      >
                        {bookingData.pack === 1
                          ? "Dùng lượt (Subscription)"
                          : "Thanh toán tại trạm"}
                      </Text>
                    </div>
                  )}
                  {bookingData?.transactionData?.transactionID && (
                    <div style={{ marginTop: "8px", color: "#64748b" }}>
                      <Text>Mã giao dịch: </Text>
                      <Text strong>
                        #{bookingData.transactionData.transactionID}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Lưu ý về thời gian đến */}
            <Card
              size="small"
              style={{
                marginTop: "16px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <div style={{ color: "#92400e", fontSize: "14px" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  ⚠️ Lưu ý quan trọng
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>
                    Vui lòng đến trong vòng <strong>1 tiếng</strong> kể từ thời
                    điểm đặt lịch.
                  </li>
                  <li>
                    Đến muộn sau <strong>1 tiếng</strong> hệ thống sẽ{" "}
                    <strong>hủy tự động</strong> lịch đặt.
                  </li>
                </ul>
              </div>
            </Card>

            {/* Action Buttons */}
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <Space size="large">
                <Link to="/booking">
                  <Button
                    type="primary"
                    size="large"
                    icon={<LeftOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      border: "none",
                    }}
                  >
                    Đặt Lịch Mới
                  </Button>
                </Link>
                <Link to="/">
                  <Button
                    size="large"
                    icon={<HomeOutlined />}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      border: "2px solid #cbd5e1",
                      color: "#475569",
                    }}
                  >
                    Về Trang Chủ
                  </Button>
                </Link>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </SimpleErrorBoundary>
  );
}
