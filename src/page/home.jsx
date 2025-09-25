import React from "react";
import Map from "../components/Map";
import ServicePack from "../components/ServicePack";
import BookingSection from "../components/BookingSection";
import { Typography, Space, Row, Col, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#00083B]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-36">
            <h1 className="text-[64px] sm:text-[80px] lg:text-[112px] leading-none font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
              Voltswap
            </h1>
            <div className="h-1 w-28 rounded-full bg-cyan-300/70 mt-4 mb-8" />
            <p className="max-w-3xl text-white/80 text-lg sm:text-xl lg:text-2xl">
              Hệ thống quản lý trạm đổi pin xe điện
            </p>
            <p className="max-w-3xl text-white/60 mt-4 text-base sm:text-lg">
              Giám sát, quản lý và tối ưu vận hành hệ thống đổi pin với công
              nghệ hiện đại và phân tích thời gian thực.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#map-section"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur"
              >
                <span className="inline-block">▢</span>
                <span>Xem trạm</span>
              </a>
            </div>

            <div className="mt-16 grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 text-left hover:from-cyan-500/10 hover:border-cyan-400/40 transition-colors">
                <div className="text-3xl font-extrabold text-white">247</div>
                <div className="text-white/60 mt-1">Trạm đang hoạt động</div>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 text-left hover:from-cyan-500/10 hover:border-cyan-400/40 transition-colors">
                <div className="text-3xl font-extrabold text-white">1,834</div>
                <div className="text-white/60 mt-1">Pin sẵn sàng</div>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 text-left hover:from-cyan-500/10 hover:border-cyan-400/40 transition-colors">
                <div className="text-3xl font-extrabold text-white">5,672</div>
                <div className="text-white/60 mt-1">Lượt đổi mỗi ngày</div>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-white/10 to-white/[0.03] p-6 text-left hover:from-cyan-500/10 hover:border-cyan-400/40 transition-colors">
                <div className="text-3xl font-extrabold text-white">98.7%</div>
                <div className="text-white/60 mt-1">Hiệu suất</div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#ffffff0f_1px,transparent_1px),linear-gradient(90deg,#ffffff0f_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </section>

      {/* Gói dịch vụ đổi pin */}
      <ServicePack />

      {/* Đặt lịch đổi pin */}
      <BookingSection />

      {/* Bản đồ trạm đổi pin */}
      <section id="map-section" className="py-16 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Space direction="vertical" size="large" className="w-full">
              <Space size="large" className="justify-center">
                <EnvironmentOutlined
                  style={{ fontSize: "48px", color: "#1890ff" }}
                />
                <Title level={1} style={{ margin: 0 }}>
                  Mạng lưới trạm đổi pin VoltSwap
                </Title>
              </Space>
              <Paragraph
                style={{
                  fontSize: "20px",
                  maxWidth: "800px",
                  margin: "0 auto",
                }}
              >
                Tìm kiếm trạm đổi pin gần nhất tại Hà Nội và TP.HCM. Hệ thống
                trạm đổi pin thông minh, tiện lợi và nhanh chóng.
              </Paragraph>
            </Space>
          </div>

          <div className="mb-8">
            <Row justify="center" gutter={[24, 16]}>
              <Col>
                <Space>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Hà Nội (5 trạm)</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">TP.HCM (5 trạm)</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Tổng cộng 10 trạm</span>
                </Space>
              </Col>
            </Row>
            <div className="mt-4 text-center">
              <Space>
                <EnvironmentOutlined style={{ color: "#666" }} />
                <Paragraph
                  style={{ color: "#666", margin: 0, fontSize: "14px" }}
                >
                  Chọn thành phố và quận/huyện để xem chi tiết trạm sạc
                </Paragraph>
              </Space>
            </div>
          </div>

          <Map />
        </div>
      </section>

      {/* Nội dung khác của trang home */}
      <main className="py-16 bg-[#00083B]">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <Space
            direction="vertical"
            size="large"
            className="w-full text-center"
          >
            <Title level={2} style={{ color: "white", margin: 0 }}>
              Chào mừng đến với VoltSwap
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                margin: 0,
              }}
            >
              Nội dung trang chủ sẽ được thêm vào đây...
            </Paragraph>
          </Space>
        </div>
      </main>
    </div>
  );
}
