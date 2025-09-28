import React, { useState } from "react";
import { Card, Row, Col, Typography, Button, Space, Tag } from "antd";
import {
  PoweroffOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  MobileOutlined,
  DollarOutlined,
  StarOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ServicePack() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const servicePlans = [
    {
      id: 1,
      name: "Gói Cơ Bản",
      type: "Mặc Định",
      price: "50,000 VNĐ",
      period: "mỗi lần đổi",
      description:
        "Gói mặc định cho tất cả người dùng, đặt lịch và thanh toán khi đổi pin",
      features: [
        "Đặt lịch trực tuyến",
        "Nhân viên hỗ trợ đổi pin",
        "Thanh toán khi đổi pin",
        "Không ràng buộc thời gian",
        "Có sẵn cho mọi tài khoản",
      ],
      color: "blue",
      icon: <DollarOutlined />,
      popular: false,
    },
    {
      id: 2,
      name: "Gói Tiết Kiệm",
      type: "Premium",
      price: "299,000 VNĐ",
      period: "tháng",
      description: "Đổi pin 10 lần/tháng, tiết kiệm 50% so với gói cơ bản",
      features: [
        "10 lần đổi pin/tháng",
        "Không cần thanh toán khi đổi",
        "Ưu tiên đặt lịch",
        "Hỗ trợ 24/7",
        "Tiết kiệm 50% chi phí",
      ],
      color: "green",
      icon: <StarOutlined />,
      popular: true,
    },
    {
      id: 3,
      name: "Gói Không Giới Hạn",
      type: "Unlimited",
      price: "599,000 VNĐ",
      period: "tháng",
      description: "Đổi pin không giới hạn trong 1 tháng",
      features: [
        "Đổi pin không giới hạn",
        "Không cần thanh toán khi đổi",
        "Ưu tiên cao nhất",
        "Hỗ trợ VIP 24/7",
        "Đặt lịch linh hoạt",
        "Tiết kiệm tối đa",
      ],
      color: "purple",
      icon: <RocketOutlined />,
      popular: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    // Có thể thêm logic xử lý đăng ký gói ở đây
    console.log("Đã chọn gói:", plan.name);
  };

  const getIconColor = (color) => {
    const colors = {
      blue: "#00083B", // Màu xanh đậm của header
      green: "#00083B", // Sử dụng cùng màu header
      purple: "#00083B", // Sử dụng cùng màu header
    };
    return colors[color] || colors.blue;
  };

  const getButtonColor = (color) => {
    const colors = {
      blue: "#00083B", // Màu xanh đậm của header
      green: "#00083B", // Sử dụng cùng màu header
      purple: "#00083B", // Sử dụng cùng màu header
    };
    return colors[color] || colors.blue;
  };

  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Space direction="vertical" size="large" className="w-full">
            <Space size="large" className="justify-center">
              <PoweroffOutlined
                style={{ fontSize: "48px", color: "#00083B" }}
              />
              <Title level={1} style={{ margin: 0 }}>
                Gói Dịch Vụ Đổi Pin VoltSwap
              </Title>
            </Space>
            <Paragraph
              style={{ fontSize: "20px", maxWidth: "800px", margin: "0 auto" }}
            >
              Chọn gói dịch vụ phù hợp với nhu cầu sử dụng của bạn. Tất cả gói
              đều bao gồm đặt lịch trực tuyến và hỗ trợ 24/7.
            </Paragraph>
          </Space>
        </div>

        {/* Service Plans Grid */}
        <Row gutter={[32, 32]} className="mb-12">
          {servicePlans.map((plan) => (
            <Col xs={24} md={12} lg={8} key={plan.id}>
              <Card
                className="relative h-full"
                style={{
                  borderRadius: "20px",
                  boxShadow: plan.popular
                    ? "0 20px 40px rgba(0, 8, 59, 0.15), 0 8px 16px rgba(0, 8, 59, 0.1)"
                    : "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)",
                  border: plan.popular
                    ? "2px solid #00083B"
                    : "1px solid rgba(0, 8, 59, 0.1)",
                  transform: plan.popular ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: plan.popular
                    ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                }}
                hoverable
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <Tag
                    color="#00083B"
                    style={{
                      position: "absolute",
                      top: "-18px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 20px",
                      borderRadius: "20px",
                      boxShadow:
                        "0 8px 20px rgba(0, 8, 59, 0.25), 0 4px 8px rgba(0, 8, 59, 0.15)",
                      background:
                        "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      border: "2px solid #ffffff",
                    }}
                  >
                    ⭐ PHỔ BIẾN NHẤT
                  </Tag>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "16px",
                      color: getIconColor(plan.color),
                      background:
                        "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 2px 4px rgba(0, 8, 59, 0.2))",
                    }}
                  >
                    {plan.icon}
                  </div>
                  <Title level={3} style={{ marginBottom: "8px" }}>
                    {plan.name}
                  </Title>
                  <Tag color={plan.color} style={{ marginBottom: "16px" }}>
                    {plan.type}
                  </Tag>
                  <div style={{ marginBottom: "16px" }}>
                    <span
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        color: "#64748b",
                        marginLeft: "8px",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      /{plan.period}
                    </span>
                  </div>
                  <Paragraph style={{ color: "#666", margin: 0 }}>
                    {plan.description}
                  </Paragraph>
                </div>

                {/* Features */}
                <div style={{ marginBottom: "24px" }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    {plan.features.map((feature, index) => (
                      <Space key={index}>
                        <CheckCircleOutlined
                          style={{
                            color: "#10b981",
                            fontSize: "16px",
                            filter:
                              "drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3))",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#475569",
                            fontWeight: "500",
                            lineHeight: "1.5",
                          }}
                        >
                          {feature}
                        </span>
                      </Space>
                    ))}
                  </Space>
                </div>

                {/* Action Button */}
                {plan.id === 1 ? (
                  <Button
                    block
                    disabled
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "8px",
                    }}
                  >
                    <CheckCircleOutlined />
                    Đã có sẵn
                  </Button>
                ) : (
                  <Button
                    type={selectedPlan?.id === plan.id ? "default" : "primary"}
                    block
                    onClick={() => handleSelectPlan(plan)}
                    style={{
                      height: "52px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "12px",
                      background:
                        selectedPlan?.id === plan.id
                          ? "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"
                          : "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      borderColor:
                        selectedPlan?.id === plan.id ? "#cbd5e1" : "#00083B",
                      boxShadow:
                        selectedPlan?.id === plan.id
                          ? "0 4px 12px rgba(0,0,0,0.1)"
                          : "0 8px 20px rgba(0, 8, 59, 0.25), 0 4px 8px rgba(0, 8, 59, 0.15)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {selectedPlan?.id === plan.id ? "Đã Chọn" : "Chọn Gói Này"}
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {/* Selected Plan Info */}
        {selectedPlan && (
          <Card
            style={{
              borderRadius: "24px",
              boxShadow:
                "0 20px 40px rgba(0, 8, 59, 0.15), 0 8px 16px rgba(0, 8, 59, 0.1)",
              border: "2px solid #00083B",
              marginBottom: "48px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative Background */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "100px",
                height: "100px",
                background:
                  "linear-gradient(135deg, rgba(0, 8, 59, 0.1) 0%, rgba(26, 31, 92, 0.05) 100%)",
                borderRadius: "50%",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "60px",
                height: "60px",
                background:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                borderRadius: "50%",
                zIndex: 0,
              }}
            />

            <div
              className="text-center"
              style={{ position: "relative", zIndex: 1 }}
            >
              <Space direction="vertical" size="large" className="w-full">
                <Space size="middle">
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        "0 8px 20px rgba(16, 185, 129, 0.3), 0 4px 8px rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <CheckCircleOutlined
                      style={{ fontSize: "32px", color: "white" }}
                    />
                  </div>
                  <div>
                    <Title level={2} style={{ margin: 0, color: "#00083B" }}>
                      Bạn đã chọn: {selectedPlan.name}
                    </Title>
                    <Tag
                      color="#00083B"
                      style={{
                        marginTop: "8px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                        border: "none",
                      }}
                    >
                      {selectedPlan.type}
                    </Tag>
                  </div>
                </Space>

                <div
                  style={{
                    background: "rgba(0, 8, 59, 0.05)",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px solid rgba(0, 8, 59, 0.1)",
                  }}
                >
                  <Paragraph
                    style={{
                      fontSize: "18px",
                      color: "#475569",
                      margin: 0,
                      fontWeight: "500",
                      lineHeight: "1.6",
                    }}
                  >
                    {selectedPlan.description}
                  </Paragraph>
                  <div style={{ marginTop: "16px" }}>
                    <span
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {selectedPlan.price}
                    </span>
                    <span
                      style={{
                        color: "#64748b",
                        marginLeft: "8px",
                        fontSize: "16px",
                      }}
                    >
                      /{selectedPlan.period}
                    </span>
                  </div>
                </div>

                <Space size="large">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    style={{
                      height: "56px",
                      fontSize: "18px",
                      fontWeight: "700",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                      border: "none",
                      boxShadow:
                        "0 12px 24px rgba(0, 8, 59, 0.3), 0 4px 8px rgba(0, 8, 59, 0.2)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="hover:scale-105"
                  >
                    Đăng Ký Ngay
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setSelectedPlan(null)}
                    style={{
                      height: "56px",
                      fontSize: "18px",
                      fontWeight: "600",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      border: "2px solid #cbd5e1",
                      color: "#475569",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="hover:scale-105"
                  >
                    Chọn Lại
                  </Button>
                </Space>
              </Space>
            </div>
          </Card>
        )}

        {/* Additional Info */}
        <Card
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: "1px solid rgba(0, 8, 59, 0.1)",
            borderRadius: "24px",
            boxShadow:
              "0 20px 40px rgba(0, 8, 59, 0.1), 0 8px 16px rgba(0, 8, 59, 0.05)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              left: "-40px",
              width: "80px",
              height: "80px",
              background:
                "linear-gradient(135deg, rgba(0, 8, 59, 0.08) 0%, rgba(26, 31, 92, 0.04) 100%)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              right: "-30px",
              width: "60px",
              height: "60px",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />

          <div
            className="text-center mb-8"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                marginBottom: "24px",
                boxShadow:
                  "0 12px 24px rgba(0, 8, 59, 0.2), 0 4px 8px rgba(0, 8, 59, 0.1)",
              }}
            >
              <MobileOutlined style={{ fontSize: "36px", color: "white" }} />
            </div>
            <Title
              level={2}
              style={{ color: "#00083B", margin: 0, marginBottom: "8px" }}
            >
              Tại sao chọn VoltSwap?
            </Title>
            <Paragraph
              style={{
                color: "#64748b",
                fontSize: "18px",
                margin: 0,
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Giải pháp đổi pin xe điện hiện đại, nhanh chóng và tiện lợi nhất
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} style={{ position: "relative", zIndex: 1 }}>
            <Col xs={24} md={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(0, 8, 59, 0.02) 0%, rgba(0, 8, 59, 0.01) 100%)",
                  border: "1px solid rgba(0, 8, 59, 0.08)",
                  height: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="hover:shadow-lg"
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow:
                      "0 8px 20px rgba(0, 8, 59, 0.2), 0 4px 8px rgba(0, 8, 59, 0.1)",
                  }}
                >
                  <ThunderboltOutlined
                    style={{ fontSize: "28px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#00083B",
                    margin: "0 0 12px 0",
                    fontSize: "20px",
                  }}
                >
                  Nhanh Chóng
                </Title>
                <Paragraph
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                >
                  Đổi pin chỉ trong 5 phút, không cần chờ đợi
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(0, 8, 59, 0.02) 0%, rgba(0, 8, 59, 0.01) 100%)",
                  border: "1px solid rgba(0, 8, 59, 0.08)",
                  height: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="hover:shadow-lg"
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow:
                      "0 8px 20px rgba(0, 8, 59, 0.2), 0 4px 8px rgba(0, 8, 59, 0.1)",
                  }}
                >
                  <SafetyOutlined
                    style={{ fontSize: "28px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#00083B",
                    margin: "0 0 12px 0",
                    fontSize: "20px",
                  }}
                >
                  An Toàn
                </Title>
                <Paragraph
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                >
                  Pin chính hãng, đảm bảo chất lượng 100%
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, rgba(0, 8, 59, 0.02) 0%, rgba(0, 8, 59, 0.01) 100%)",
                  border: "1px solid rgba(0, 8, 59, 0.08)",
                  height: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="hover:shadow-lg"
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #00083B 0%, #1a1f5c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    boxShadow:
                      "0 8px 20px rgba(0, 8, 59, 0.2), 0 4px 8px rgba(0, 8, 59, 0.1)",
                  }}
                >
                  <MobileOutlined
                    style={{ fontSize: "28px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#00083B",
                    margin: "0 0 12px 0",
                    fontSize: "20px",
                  }}
                >
                  Tiện Lợi
                </Title>
                <Paragraph
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                  }}
                >
                  Đặt lịch online, thanh toán linh hoạt
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </section>
  );
}
