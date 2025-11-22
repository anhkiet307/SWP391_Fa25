// Component trang nâng cấp tài khoản - hiển thị các gói dịch vụ để người dùng chọn nâng cấp
import React from "react";
// Component hiển thị danh sách các gói dịch vụ và xử lý logic nâng cấp
import ServicePack from "../components/ServicePack";
import { Typography, Space } from "antd";

const { Title, Paragraph } = Typography;

/**
 * Component Upgrade - Trang nâng cấp tài khoản
 * Chức năng:
 * 1. Hiển thị tiêu đề và mô tả về việc nâng cấp tài khoản
 * 2. Render component ServicePack để hiển thị các gói dịch vụ và xử lý logic nâng cấp
 */
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
        {/* Header Section - Hiển thị tiêu đề và mô tả trang nâng cấp */}
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
        {/* Component ServicePack - Hiển thị các gói dịch vụ và xử lý logic nâng cấp tài khoản */}
        <ServicePack />
      </div>
    </div>
  );
}
