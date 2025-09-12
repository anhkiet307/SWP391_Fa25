import React from "react";

const logo = "/assets/images/voltswap_logo.png";

const navItems = [
  { label: "Giới thiệu", href: "#" },
  { label: "Ô tô", href: "#" },
  { label: "Xe máy điện", href: "#" },
  { label: "Dịch vụ hậu mãi", href: "#" },
  { label: "Pin và trạm sạc", href: "#" },
  { label: "Lưu trữ năng lượng", href: "#" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#00083B]">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <a className="flex items-center gap-3" href="#" aria-label="VoltSwap">
          <img src={logo} alt="VoltSwap" className="h-10 w-auto sm:h-12" />
        </a>

        {/* Center nav */}
        <nav className="hidden items-center space-x-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-white/90 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden text-sm font-semibold text-blue-300 hover:text-white lg:inline"
          >
            TÀI KHOẢN
          </a>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md lg:hidden hover:bg-white/10"
            aria-label="Menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
