import React from "react";
import ServicePack from "../components/ServicePack";
import { Typography, Space } from "antd";

const { Title, Paragraph } = Typography;

export default function Upgrade() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Space direction="vertical" size="small" className="w-full">
            <Title level={2} style={{ margin: 0, color: "#ffffff" }}>
              Nâng cấp tài khoản
            </Title>
            <Paragraph style={{ margin: 0, color: "#cbd5e1" }}>
              Chọn gói phù hợp để nhận nhiều quyền lợi hơn
            </Paragraph>
          </Space>
        </div>
        <ServicePack />
      </div>
    </div>
  );
}
