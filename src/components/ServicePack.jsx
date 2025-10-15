import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  message,
  Modal,
  Radio,
} from "antd";
import {
  PoweroffOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  MobileOutlined,
  DollarOutlined,
  StarOutlined,
  RocketOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import apiService from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";

const { Title, Paragraph } = Typography;

// Mock data for demo

export default function ServicePack() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [servicePlans, setServicePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getServicePacks();
        const packs = Array.isArray(res?.data) ? res.data : [];
        const activePacks = packs.filter((p) => p.status === 1);

        const formatVND = (amount) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(Number(amount || 0));

        const mapped = activePacks.map((p, idx) => {
          const isDefault = p.packID === 1;
          const type = isDefault ? "Mặc định" : "Thành viên";
          const period = isDefault ? "mỗi lần đổi" : "gói"; // giữ để tương thích cũ
          const color = isDefault ? "blue" : idx % 2 === 0 ? "green" : "purple";
          const icon = isDefault ? (
            <DollarOutlined />
          ) : idx % 2 === 0 ? (
            <StarOutlined />
          ) : (
            <RocketOutlined />
          );

          const desc = typeof p.description === "string" ? p.description : "";
          const parsedFeatures = desc
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          const features = parsedFeatures.length
            ? parsedFeatures
            : isDefault
            ? ["Gói cơ bản"]
            : [`Tổng số lượt đổi miễn phí: ${p.total || 0}`, "Ưu tiên hỗ trợ"];

          return {
            id: p.packID,
            name: p.packName || (isDefault ? "Free" : "Membership"),
            type,
            price: formatVND(p.price || 0),
            period,
            total: p.total || (isDefault ? 1 : 0),
            description: p.description || "",
            features,
            color,
            icon,
            popular: !isDefault && idx === 0,
          };
        });

        if (isMounted) setServicePlans(mapped);
      } catch (e) {
        if (isMounted) setError("Không tải được danh sách gói dịch vụ");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPacks();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để đăng ký gói.");
      return;
    }
    setPendingPlan(plan);
    setConfirmOpen(true);
  };

  const confirmPayment = async () => {
    if (!pendingPlan) return;
    try {
      message.loading({
        content: "Đang tạo liên kết thanh toán...",
        key: "pay",
      });
      const userID = user?.userID || user?.id;
      const amount =
        Number(String(pendingPlan.price).replace(/[^0-9]/g, "")) || 0;
      const extractedTotal =
        Number(
          (pendingPlan.features || [])
            .find((f) => f.toLowerCase().includes("tổng số lượt đổi"))
            ?.match(/\d+/)?.[0]
        ) ||
        pendingPlan.total ||
        0;

      const payload = {
        userID,
        packID: pendingPlan.id,
        amount,
        orderInfo: "Mua gói đổi pin",
        total: extractedTotal,
      };

      const res = await apiService.createVnpayUrl(payload);
      const paymentUrl = res?.data || res; // API trả trực tiếp URL ở field data

      setSelectedPlan(pendingPlan);
      setConfirmOpen(false);

      if (paymentUrl) {
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
        message.success({
          content: "Chuyển đến cổng thanh toán VNPay",
          key: "pay",
        });
      } else {
        message.error({
          content: "Không nhận được URL thanh toán",
          key: "pay",
        });
      }
    } catch (e) {
      message.error({ content: "Tạo URL thanh toán thất bại.", key: "pay" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: "80px 0",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              marginBottom: "32px",
              boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <PoweroffOutlined style={{ fontSize: "48px", color: "white" }} />
          </div>

          <Title
            level={1}
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "16px",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            Gói Dịch Vụ VoltSwap
          </Title>

          <Paragraph
            style={{
              fontSize: "20px",
              maxWidth: "700px",
              margin: "0 auto",
              color: "#cbd5e1",
              lineHeight: "1.8",
              fontWeight: "400",
            }}
          >
            Chọn gói dịch vụ phù hợp với nhu cầu của bạn.
            <br />
            Đổi pin nhanh chóng, tiện lợi và an toàn.
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        {loading && (
          <div
            style={{ textAlign: "center", color: "#94a3b8", fontSize: "18px" }}
          >
            Đang tải gói dịch vụ...
          </div>
        )}

        <Row gutter={[32, 32]} style={{ marginBottom: "80px" }}>
          {servicePlans.map((plan) => (
            <Col xs={24} md={8} key={plan.id}>
              <Card
                style={{
                  height: "100%",
                  borderRadius: "24px",
                  background: plan.popular
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                    : "rgba(30, 41, 59, 0.5)",
                  backdropFilter: "blur(20px)",
                  border: plan.popular
                    ? "2px solid rgba(59, 130, 246, 0.5)"
                    : "1px solid rgba(148, 163, 184, 0.2)",
                  boxShadow: plan.popular
                    ? "0 30px 60px rgba(59, 130, 246, 0.3)"
                    : "0 10px 30px rgba(0, 0, 0, 0.3)",
                  transform: plan.popular ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "visible",
                }}
                bodyStyle={{ padding: "40px 32px" }}
                hoverable
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-16px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      padding: "8px 24px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <CrownOutlined /> PHỔ BIẾN NHẤT
                  </div>
                )}

                {/* Icon */}
                <div
                  style={{
                    fontSize: "56px",
                    marginBottom: "24px",
                    color: "#93c5fd",
                    filter: "drop-shadow(0 6px 20px rgba(59,130,246,0.35))",
                    textAlign: "center",
                  }}
                >
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <Title
                  level={3}
                  style={{
                    color: "#ffffff",
                    marginBottom: "12px",
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "700",
                  }}
                >
                  {plan.name}
                </Title>

                {/* Type Tag */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <Tag
                    style={{
                      background: "rgba(59, 130, 246, 0.28)",
                      border: "1px solid rgba(59, 130, 246, 0.6)",
                      color: "#bfdbfe",
                      padding: "4px 16px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {plan.type}
                  </Tag>
                </div>

                {/* Price */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: "16px" }}>
                      /{plan.total} lượt
                    </span>
                  </div>
                </div>

                {/* Description */}
                <Paragraph
                  style={{
                    color: "#94a3b8",
                    textAlign: "center",
                    marginBottom: "32px",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    minHeight: "48px",
                  }}
                >
                  {plan.description}
                </Paragraph>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)",
                    marginBottom: "32px",
                  }}
                />

                {/* Features */}
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%", marginBottom: "32px" }}
                >
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <CheckCircleOutlined
                        style={{
                          color: "#22c55e",
                          fontSize: "18px",
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          color: "#f8fafc",
                          fontSize: "15px",
                          lineHeight: "1.6",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </Space>

                {/* Action Button */}
                {plan.id === 1 ? (
                  <Button
                    block
                    disabled
                    size="large"
                    style={{
                      height: "56px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "16px",
                      background: "rgba(51, 65, 85, 0.5)",
                      border: "1px solid rgba(148, 163, 184, 0.3)",
                      color: "#64748b",
                    }}
                  >
                    <CheckCircleOutlined /> Đã có sẵn
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => handleSubscribe(plan)}
                    style={{
                      height: "56px",
                      fontSize: "16px",
                      fontWeight: "700",
                      borderRadius: "16px",
                      background:
                        selectedPlan?.id === plan.id
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {selectedPlan?.id === plan.id ? (
                      <>
                        <CheckCircleOutlined /> Tiếp tục thanh toán
                      </>
                    ) : (
                      "Mua gói này"
                    )}
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {/* Selected Plan Info removed per requirement */}

        {/* Features Section */}
        <Card
          style={{
            borderRadius: "24px",
            background: "rgba(30, 41, 59, 0.5)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
          bodyStyle={{ padding: "60px 48px" }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Title
              level={2}
              style={{
                color: "#ffffff",
                marginBottom: "16px",
                fontSize: "36px",
              }}
            >
              Tại sao chọn VoltSwap?
            </Title>
            <Paragraph
              style={{
                color: "#94a3b8",
                fontSize: "18px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Giải pháp đổi pin xe điện hiện đại, nhanh chóng và tiện lợi nhất
            </Paragraph>
          </div>

          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    marginBottom: "24px",
                    boxShadow: "0 15px 40px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <ThunderboltOutlined
                    style={{ fontSize: "36px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#ffffff",
                    marginBottom: "12px",
                    fontSize: "22px",
                  }}
                >
                  Nhanh Chóng
                </Title>
                <Paragraph
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                >
                  Đổi pin chỉ trong 5 phút, không cần chờ đợi
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    marginBottom: "24px",
                    boxShadow: "0 15px 40px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <SafetyOutlined
                    style={{ fontSize: "36px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#ffffff",
                    marginBottom: "12px",
                    fontSize: "22px",
                  }}
                >
                  An Toàn
                </Title>
                <Paragraph
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                >
                  Pin chính hãng, đảm bảo chất lượng 100%
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    marginBottom: "24px",
                    boxShadow: "0 15px 40px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <MobileOutlined
                    style={{ fontSize: "36px", color: "white" }}
                  />
                </div>
                <Title
                  level={4}
                  style={{
                    color: "#ffffff",
                    marginBottom: "12px",
                    fontSize: "22px",
                  }}
                >
                  Tiện Lợi
                </Title>
                <Paragraph
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.7",
                  }}
                >
                  Đặt lịch online, thanh toán linh hoạt
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Modal xác nhận mua gói */}
      <Modal
        title="Xác nhận mua gói"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={confirmPayment}
        okText="Đồng ý"
        cancelText="Hủy"
        centered
      >
        <Paragraph>
          Bạn có chắc sẽ mua <strong>{pendingPlan?.name}</strong> với giá
          <strong> {pendingPlan?.price}</strong>? Bạn sẽ được chuyển sang trang
          thanh toán VNPay.
        </Paragraph>
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 70px rgba(59, 130, 246, 0.6);
          }
        }

        .ant-card:hover {
          transform: translateY(-8px) !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5) !important;
        }
      `}</style>
    </div>
  );
}
