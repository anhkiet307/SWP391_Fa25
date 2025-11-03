import React from "react";
import Map from "../components/Map";
import BookingSection from "../components/BookingSection";
import { Typography, Space, Row, Col, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#00083B]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#00083B]">
        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-36">
            <h1 className="text-[64px] sm:text-[80px] lg:text-[112px] leading-none font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
              Voltswapssssss
            </h1>
            <div className="h-1 w-28 rounded-full bg-cyan-300/70 mt-4 mb-8" />
            <p className="max-w-3xl text-white/80 text-lg sm:text-xl lg:text-2xl">
              Đặt lịch – Đổi pin – Tiếp tục hành trình
            </p>
            <p className="max-w-3xl text-white/60 mt-4 text-base sm:text-lg">
              Đặt lịch đổi pin xe điện trước — không phải chờ đợi, tận hưởng
              chuyến đi trọn vẹn
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#map-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 font-bold text-white hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 text-lg"
              >
                <EnvironmentOutlined className="text-xl" />
                <span>Tìm Kiếm Trạm Gần Nhất</span>
              </a>
            </div>
          </div>
        </div>

        {/* subtle grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#ffffff14_1px,transparent_1px),linear-gradient(90deg,#ffffff14_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </section>

      {/* Đặt lịch đổi pin */}
      <section id="booking-section" className="bg-[#00083B]">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-16">
          <BookingSection />
        </div>
      </section>

      {/* Bản đồ trạm đổi pin */}
      <section id="map-section" className="py-16 bg-[#00083B]">
        <div
          id="map-colored-container"
          className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10"
          style={{
            background:
              "linear-gradient(135deg, #00083B 0%, #1a1f5c 50%, #2d1b69 100%)",
          }}
        >
          <div className="text-center mx-auto" style={{ maxWidth: "980px" }}>
            <Space direction="vertical" size="large" className="w-full">
              <Space size="large" className="justify-center">
                <EnvironmentOutlined
                  style={{ fontSize: "48px", color: "#7dd3fc" }}
                />
                <Title level={1} style={{ margin: 0, color: "#ffffff" }}>
                  Mạng lưới trạm đổi pin VoltSwap
                </Title>
              </Space>
              <Paragraph
                style={{
                  fontSize: "20px",
                  maxWidth: "800px",
                  margin: "0 auto",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Tìm kiếm trạm đổi pin gần nhất tại Hà Nội và TP.HCM. Hệ thống
                trạm đổi pin thông minh, tiện lợi và nhanh chóng.
              </Paragraph>
            </Space>
            <div className="mb-8 mt-8">
              <Row justify="center" gutter={[24, 16]}>
                <Col>
                  <Space>
                    <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                    <span className="text-white/80">Hà Nội (5 trạm)</span>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                    <span className="text-white/80">TP.HCM (5 trạm)</span>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Tổng cộng 10 trạm</span>
                  </Space>
                </Col>
              </Row>
              <div className="mt-4 text-center">
                <Space>
                  <EnvironmentOutlined style={{ color: "#9ca3af" }} />
                  <Paragraph
                    style={{ color: "#9ca3af", margin: 0, fontSize: "14px" }}
                  >
                    Chọn thành phố và quận/huyện để xem chi tiết trạm sạc
                  </Paragraph>
                </Space>
              </div>
            </div>
          </div>
          <Map />
        </div>
      </section>

      {/* Nội dung khác của trang home */}
    </div>
  );
}
