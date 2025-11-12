import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
  PoweroffOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  RightOutlined,
  SafetyOutlined,
  DollarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const { Title, Paragraph } = Typography;

export default function BookingSection() {
  const { isAuthenticated } = useAuth();
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #00083B 0%, #1a1f5c 50%, #2d1b69 100%)",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/8 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/6 rounded-full blur-sm"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white/4 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/3 rounded-full blur-md"></div>
        <div className="absolute bottom-10 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-sm"></div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Space direction="vertical" size="large" className="w-full">
            <Space size="large" className="justify-center">
              <PoweroffOutlined style={{ fontSize: "48px", color: "white" }} />
              <Title level={1} style={{ color: "white", margin: 0 }}>
                Đặt Lịch Đổi Pin Ngay
              </Title>
            </Space>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "20px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              Chọn trạm, thời gian và đặt lịch đổi pin một cách nhanh chóng và
              tiện lợi
            </Paragraph>
          </Space>
        </div>

        {/* Booking Preview Cards */}
        <div className="max-w-6xl mx-auto">
          <Row gutter={[32, 32]} className="mb-12">
            {/* Station Selection Card */}
            <Col xs={24} md={8}>
              <Card
                className="text-center h-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
                bodyStyle={{ padding: "32px" }}
                hoverable
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <EnvironmentOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </div>
                <Title
                  level={3}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  Chọn Trạm
                </Title>
                <Paragraph
                  style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}
                >
                  Chọn trạm đổi pin gần nhất hoặc thuận tiện nhất
                </Paragraph>
              </Card>
            </Col>

            {/* Date Selection Card */}
            <Col xs={24} md={8}>
              <Card
                className="text-center h-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
                bodyStyle={{ padding: "32px" }}
                hoverable
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <CalendarOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </div>
                <Title
                  level={3}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  Đặt lịch đổi pin trong ngày
                </Title>
                <Paragraph
                  style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}
                >
                  Giữ Slot Pin trong vòng 1 tiếng
                </Paragraph>
              </Card>
            </Col>

            {/* Time Selection Card */}
            <Col xs={24} md={8}>
              <Card
                className="text-center h-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
                bodyStyle={{ padding: "32px" }}
                hoverable
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <ClockCircleOutlined
                    style={{ fontSize: "24px", color: "white" }}
                  />
                </div>
                <Title
                  level={3}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  Giờ làm việc
                </Title>
                <Paragraph
                  style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}
                >
                  Khung giờ từ 8:00 - 20:00
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {/* Main CTA Button */}
          <div className="text-center mb-12">
            <Link to={isAuthenticated ? "/booking" : "/login"}>
              <Button
                type="primary"
                size="large"
                icon={<RightOutlined />}
                style={{
                  height: "60px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  color: "#00083B",
                  border: "2px solid rgba(255,255,255,0.3)",
                  boxShadow:
                    "0 12px 40px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
                  transform: "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="hover:scale-105"
              >
                Đặt Lịch Ngay
              </Button>
            </Link>
          </div>

          {/* Benefits Grid */}
          <Row gutter={[24, 24]} className="text-center">
            <Col xs={24} md={8}>
              <Card
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <ThunderboltOutlined
                    style={{ fontSize: "20px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  Nhanh Chóng
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    fontSize: "14px",
                  }}
                >
                  Chỉ mất 5 phút để đổi pin
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <SafetyOutlined
                    style={{ fontSize: "20px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  An Toàn
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    fontSize: "14px",
                  }}
                >
                  Pin chính hãng 100%
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <DollarOutlined
                    style={{ fontSize: "20px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{ color: "white", marginBottom: "8px" }}
                >
                  Tiết Kiệm
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: 0,
                    fontSize: "14px",
                  }}
                >
                  Mua gói đổi pin với giá rẻ hơn
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Space direction="vertical" size="large" className="w-full">
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                margin: 0,
              }}
            >
              Chưa chắc chắn? Hãy xem bản đồ trạm sạc bên dưới để chọn vị trí
              phù hợp!
            </Paragraph>
            <Button
              type="default"
              icon={<EnvironmentOutlined />}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                height: "52px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="hover:bg-white/25"
              href="#map-section"
            >
              Xem Bản Đồ Trạm
              <RightOutlined
                style={{ transform: "rotate(90deg)", marginLeft: "8px" }}
              />
            </Button>
          </Space>
        </div>
      </div>
    </section>
  );
}
