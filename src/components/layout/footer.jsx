import React from "react";

const companyInfo = {
  name: "Công ty TNHH Kinh doanh Thương mại và Dịch vụ Voltswap",
  mst: "0108926276 do Sở KHĐT TP Hà Nội cấp lần đầu ngày 01/10/2019 và các lần thay đổi tiếp theo.",
  address:
    "Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, Phường Việt Hưng, Thành phố Hà Nội, Việt Nam",
};

const linkGroups = [
  {
    title: "Về Voltswap",
    items: ["Tin tức", "Showroom & Đại lý", "Điều khoản chính sách"],
  },
];

const contacts = [
  {
    label: "DỊCH VỤ KHÁCH HÀNG",
    phone: "1900 23 23 89",
    email: "quanvmse161277@voltswap.com",
  },
  {
    label: "SPEAK-UP HOTLINE",
    phone: "+84 39 9294 385",
    email: "v.speakup@voltswap.vn",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#00083B] text-white/80">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: company */}
          <div className="lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/assets/images/voltswap_logo.png"
                alt="VoltSwap"
                className="h-10 w-auto"
              />
              <span className="sr-only">VoltSwap</span>
            </div>
            <p className="mb-4 text-[15px] leading-7">{companyInfo.name}</p>
            <p className="mb-2 text-[15px] leading-7">
              <span className="font-semibold text-white">MST/MSDN:</span>{" "}
              {companyInfo.mst}
            </p>
            <p className="text-[15px] leading-7">
              <span className="font-semibold text-white">
                Địa chỉ trụ sở chính:
              </span>{" "}
              {companyInfo.address}
            </p>
          </div>

          {/* Middle: links */}
          <div className="lg:col-span-3">
            <div className="grid gap-6">
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.items.map((it) => (
                      <li key={it}>
                        <a
                          href="#"
                          className="text-[15px] text-white/80 hover:text-white"
                        >
                          {it}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: contacts */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {contacts.map((c) => (
                <div key={c.label}>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">
                    {c.label}
                  </h4>
                  <div className="space-y-2 text-[15px]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-5 w-5 items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-white/70"
                        >
                          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24c1.12.37 2.33.57 3.54.57a1 1 0 011 1V21a1 1 0 01-1 1C10.3 22 2 13.7 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.21.2 2.42.57 3.54a1 1 0 01-.24 1.05l-2.2 2.2z" />
                        </svg>
                      </span>
                      <a
                        href={`tel:${c.phone}`}
                        className="text-white hover:text-blue-300"
                      >
                        {c.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-5 w-5 items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="text-white/70"
                        >
                          <path d="M20 4H4a2 2 0 00-2 2v.01l10 6.25L22 6.01V6a2 2 0 00-2-2zm0 4.99l-8 5-8-5V18a2 2 0 002 2h16a2 2 0 002-2V8.99z" />
                        </svg>
                      </span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-white hover:text-blue-300"
                      >
                        {c.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
                  Kết nối với VoltSwap
                </h4>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-white/70 hover:text-blue-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="text-white/70 hover:text-red-500"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="currentColor"
                    >
                      <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.3 31.3 0 000 12a31.3 31.3 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1 31.3 31.3 0 00.5-5.8 31.3 31.3 0 00-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
