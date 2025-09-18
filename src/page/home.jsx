import React from "react";
import Map from "../components/Map";
import ServicePack from "../components/ServicePack";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#00083B]">
      {/* Video Section - ngay dưới header */}
      <section className="relative w-full">
        <video
          className="h-screen w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/videos/voltswap_debut.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </section>

      {/* Gói dịch vụ đổi pin */}
      <ServicePack />

      {/* Bản đồ trạm đổi pin */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mạng lưới trạm đổi pin VoltSwap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tìm kiếm trạm đổi pin gần nhất tại Hà Nội và TP.HCM. Hệ thống trạm
              đổi pin thông minh, tiện lợi và nhanh chóng.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Hà Nội (5 trạm)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">TP.HCM (5 trạm)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Tổng cộng 10 trạm</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                🗺️ Chọn thành phố và quận/huyện để xem chi tiết trạm sạc
              </p>
            </div>
          </div>

          <Map />
        </div>
      </section>

      {/* Nội dung khác của trang home */}
      <main className="py-16 bg-[#00083B]">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Chào mừng đến với VoltSwap
          </h2>
          <p className="text-center text-lg text-white/80">
            Nội dung trang chủ sẽ được thêm vào đây...
          </p>
        </div>
      </main>
    </div>
  );
}
