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

export default function BookingSuccess() {
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  console.log("BookingSuccess - bookingData:", bookingData);
  console.log("BookingSuccess - bookingData.date:", bookingData?.date);
  console.log(
    "BookingSuccess - typeof bookingData.date:",
    typeof bookingData?.date
  );

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

  return (
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
                Thông tin đặt lịch của bạn đã được xác nhận và gửi đến email
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
            <Title level={3} style={{ color: "#00083B", marginBottom: "20px" }}>
              📋 Thông tin đặt lịch
            </Title>

            <Row gutter={[24, 16]}>
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
                    {bookingData.date
                      ? (() => {
                          const parsed = dayjs(bookingData.date);
                          return parsed.isValid()
                            ? parsed.format("DD/MM/YYYY")
                            : "Chưa chọn ngày";
                        })()
                      : "Chưa chọn ngày"}
                  </Text>
                </Space>
              </Col>

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
                    <ClockCircleOutlined
                      style={{ color: "#00083B", fontSize: "18px" }}
                    />
                    <Text strong style={{ color: "#00083B" }}>
                      Khung giờ:
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "#475569",
                      fontSize: "16px",
                      marginLeft: "26px",
                    }}
                  >
                    {bookingData.time}
                  </Text>
                </Space>
              </Col>

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
                    <CarOutlined
                      style={{ color: "#00083B", fontSize: "18px" }}
                    />
                    <Text strong style={{ color: "#00083B" }}>
                      Loại xe:
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "#475569",
                      fontSize: "16px",
                      marginLeft: "26px",
                    }}
                  >
                    {bookingData.vehicle}
                  </Text>
                </Space>
              </Col>
            </Row>

            <Divider style={{ margin: "20px 0" }} />

            {/* Payment Info */}
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
                  {formatVND(50000)}
                </Text>
              </div>
              <div
                style={{ marginTop: "8px", fontSize: "14px", color: "#64748b" }}
              >
                💳 Thanh toán khi đến trạm (tiền mặt hoặc chuyển khoản)
              </div>
            </div>
          </Card>

          {/* Important Notice */}
          <Alert
            message="⚠️ Lưu ý quan trọng về thời gian"
            description={
              <div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Quy định về thời gian đến:</strong>
                </div>
                <ul
                  style={{
                    margin: "8px 0",
                    paddingLeft: "20px",
                    fontSize: "14px",
                  }}
                >
                  <li>
                    ✅ <strong>Được phép:</strong> Đến từ{" "}
                    <strong style={{ color: "#10b981" }}>
                      {bookingData.time?.split(" - ")[0]}
                    </strong>{" "}
                    đến{" "}
                    <strong style={{ color: "#10b981" }}>
                      {bookingData.time?.split(" - ")[1]}
                    </strong>
                  </li>
                  <li>
                    ❌ <strong>Bị hủy:</strong> Đến sau{" "}
                    <strong style={{ color: "#dc2626" }}>
                      {bookingData.time?.split(" - ")[1]}
                    </strong>
                  </li>
                  <li>
                    Lịch đổi pin sẽ bị{" "}
                    <strong style={{ color: "#dc2626" }}>hủy tự động</strong>{" "}
                    nếu đến muộn
                  </li>
                </ul>
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  💡 <strong>Gợi ý:</strong> Hãy đến trong khung giờ{" "}
                  <strong>{bookingData.time}</strong> để đảm bảo không bị hủy
                  lịch!
                </div>
              </div>
            }
            type="warning"
            showIcon
            style={{
              marginTop: "24px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          />

          {/* Contact Info */}
          <Card
            size="small"
            style={{
              marginTop: "24px",
              borderRadius: "16px",
              background: "rgba(0, 8, 59, 0.05)",
              border: "1px solid rgba(0, 8, 59, 0.1)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Title level={4} style={{ color: "#00083B", marginBottom: "16px" }}>
              📞 Thông tin liên hệ
            </Title>
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={8}>
                <Space>
                  <PhoneOutlined style={{ color: "#00083B" }} />
                  <Text strong>Hotline:</Text>
                  <Text>1900 1234</Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space>
                  <MailOutlined style={{ color: "#00083B" }} />
                  <Text strong>Email:</Text>
                  <Text>support@voltswap.vn</Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space>
                  <ClockCircleOutlined style={{ color: "#00083B" }} />
                  <Text strong>Giờ làm việc:</Text>
                  <Text>8:00 - 20:00</Text>
                </Space>
              </Col>
            </Row>
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
  );
}
