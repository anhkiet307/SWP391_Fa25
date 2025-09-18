import React, { useState } from "react";

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
      icon: "🔋",
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
      icon: "💎",
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
      icon: "👑",
      popular: false,
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    // Có thể thêm logic xử lý đăng ký gói ở đây
    console.log("Đã chọn gói:", plan.name);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "border-blue-500 bg-blue-50 text-blue-700",
      green: "border-green-500 bg-green-50 text-green-700",
      purple: "border-purple-500 bg-purple-50 text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  const getButtonClasses = (color) => {
    const colors = {
      blue: "bg-blue-600 hover:bg-blue-700 text-white",
      green: "bg-green-600 hover:bg-green-700 text-white",
      purple: "bg-purple-600 hover:bg-purple-700 text-white",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🔋 Gói Dịch Vụ Đổi Pin VoltSwap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chọn gói dịch vụ phù hợp với nhu cầu sử dụng của bạn. Tất cả gói đều
            bao gồm đặt lịch trực tuyến và hỗ trợ 24/7.
          </p>
        </div>

        {/* Service Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {servicePlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-yellow-400 ring-4 ring-yellow-100 scale-105"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ PHỔ BIẾN NHẤT
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getColorClasses(
                    plan.color
                  )}`}
                >
                  {plan.type}
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="text-green-500 mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                {plan.id === 1 ? (
                  <div className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-100 text-gray-600 text-center">
                    ✅ Đã có sẵn
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${getButtonClasses(
                      plan.color
                    )} hover:shadow-lg`}
                  >
                    {selectedPlan?.id === plan.id ? "Đã Chọn" : "Chọn Gói Này"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Plan Info */}
        {selectedPlan && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Bạn đã chọn: {selectedPlan.name}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {selectedPlan.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  🚀 Đăng Ký Ngay
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  🔄 Chọn Lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              💡 Tại sao chọn VoltSwap?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Nhanh Chóng
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Đổi pin chỉ trong 5 phút, không cần chờ đợi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">An Toàn</h4>
                  <p className="text-blue-700 text-sm">
                    Pin chính hãng, đảm bảo chất lượng 100%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Tiện Lợi</h4>
                  <p className="text-blue-700 text-sm">
                    Đặt lịch online, thanh toán linh hoạt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
