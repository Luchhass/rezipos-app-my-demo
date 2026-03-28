"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Settings } from "lucide-react";

// Navigation Links
const NAV_LINKS = [
  { href: "/dashboard", label: "Restoran Paneli" },
  { href: "/take-order", label: "Sipariş Al" },
  { href: "/restaurant-management", label: "Restoran Yönetimi" },
  { href: "/sales-history", label: "Sipariş Geçmişi" },
  { href: "/reservations", label: "Rezervasyon" },
];

// Hidden Header Routes
const AUTH_ROUTES = ["/", "/login"];

export default function Header() {
  // Mobile Menu State
  const [isOpen, setIsOpen] = useState(false);

  // Current Route
  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) return null;

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 z-40 flex w-full items-center border-b border-[#dddddd] bg-[#f3f3f3] px-8 py-6 text-[#121212] dark:border-[#2d2d2d] dark:bg-[#111315] dark:text-white md:hidden">
        {/* Logo */}
        <span className={`text-xl font-semibold tracking-wide transition-all ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 pointer-events-none opacity-0"}`}>
          ReziPOS
        </span>

        {/* Divider */}
        <div className="ml-auto w-px self-stretch bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group ml-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dddddd] focus:outline-none active:scale-95 dark:bg-[#2d2d2d]"
        >
          <div className="relative flex h-6 w-6 flex-col items-center justify-center">
            <span
              className={`absolute block h-0.5 rounded-2xl bg-[#121212] transition-all dark:bg-white ${
                isOpen ? "top-1/2 w-5 -translate-y-1/2 rotate-45" : "top-1 w-6 group-hover:w-5"
              }`}
            />
            <span
              className={`absolute top-1/2 block h-0.5 -translate-y-1/2 rounded-2xl bg-[#121212] transition-all dark:bg-white ${
                isOpen ? "w-0 opacity-0" : "w-5 group-hover:w-6"
              }`}
            />
            <span
              className={`absolute block h-0.5 rounded-2xl bg-[#121212] transition-all dark:bg-white ${
                isOpen ? "bottom-1/2 w-5 translate-y-1/2 -rotate-45" : "bottom-1 w-4 group-hover:w-6"
              }`}
            />
          </div>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 flex h-dvh w-full flex-col gap-4 border-r border-[#dddddd] bg-[#f3f3f3] px-8 py-6 pt-26.25 transition-transform dark:border-[#2d2d2d] dark:bg-[#111315] md:h-screen md:w-70 md:translate-x-0 md:gap-6 md:py-8 lg:gap-8 lg:py-10 lg:pt-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Desktop Logo */}
        <span className="hidden text-[25px] font-semibold tracking-wide text-[#121212] dark:text-white md:flex md:text-[28px] lg:h-14.5 lg:text-[38.7px]">
          ReziPOS
        </span>
        <span className="lg:hidden" />

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`max-w-xs rounded-2xl p-4 text-base font-medium transition-all ${
                pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                  ? "bg-[#dddddd] text-[#98A2F3] dark:bg-[#2d2d2d]"
                  : "text-[#121212] opacity-70 hover:bg-[#dddddd]/50 hover:opacity-100 dark:text-white dark:hover:bg-[#2d2d2d]/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom Area */}
        <div className="mt-auto">
          {/* Divider */}
          <div className="h-px w-full bg-[#dddddd] dark:bg-[#2d2d2d]" />

          {/* Settings Button */}
          <div className="pt-4 md:pt-6 lg:pt-8">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={`flex w-full max-w-xs items-center gap-4 rounded-2xl p-4 font-bold transition-all ${
                pathname === "/settings"
                  ? "bg-[#dddddd] text-[#98A2F3] dark:bg-[#2d2d2d]"
                  : "text-[#686868] hover:bg-[#dddddd]/50 hover:text-[#121212] dark:hover:bg-[#2d2d2d]/50 dark:hover:text-white"
              }`}
            >
              <Settings size={20} />
              Ayarlar
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}