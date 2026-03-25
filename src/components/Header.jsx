"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

// Navigation links
const NAV_LINKS = [
  { href: "/dashboard",             label: "Restoran Paneli" },
  { href: "/take-order",            label: "Sipariş Al" },
  { href: "/restaurant-management", label: "Restoran Yönetimi" },
  { href: "/sales-history",         label: "Sipariş Geçmişi" },
  { href: "/reservations",          label: "Rezervasyon" },
];

// Routes where header is hidden
const AUTH_ROUTES = ["/", "/login"];

export default function Header() {
  // Mobile menu state
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  if (AUTH_ROUTES.includes(pathname)) return null;

  return (
    <>
      {/* Mobile header bar */}
      <header className="fixed top-0 z-40 flex items-center w-full py-6 px-8 border-b border-[#dddddd] bg-[#f3f3f3] text-[#121212] dark:border-[#2d2d2d] dark:bg-[#111315] dark:text-[#ffffff] md:hidden">
        {/* Logo */}
        <span className={`text-xl font-semibold tracking-wide transition-all ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 pointer-events-none opacity-0"}`}>
          ReziPOS
        </span>

        <div className="ml-auto w-px self-stretch bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Hamburger button */}
        <button onClick={() => setIsOpen(!isOpen)} className="group ml-8 flex items-center justify-center w-14 h-14 rounded-2xl bg-[#dddddd] focus:outline-none active:scale-95 dark:bg-[#2d2d2d]">
          <div className="relative flex flex-col items-center justify-center w-6 h-6">
            <span className={`absolute block h-0.5 rounded-2xl bg-[#121212] transition-all dark:bg-[#ffffff] ${isOpen ? "top-1/2 w-5 -translate-y-1/2 rotate-45" : "top-1 w-6 group-hover:w-5"}`} />
            <span className={`absolute block h-0.5 rounded-2xl bg-[#121212] transition-all top-1/2 -translate-y-1/2 dark:bg-[#ffffff] ${isOpen ? "w-0 opacity-0" : "w-5 group-hover:w-6"}`} />
            <span className={`absolute block h-0.5 rounded-2xl bg-[#121212] transition-all dark:bg-[#ffffff] ${isOpen ? "bottom-1/2 w-5 translate-y-1/2 -rotate-45" : "bottom-1 w-4 group-hover:w-6"}`} />
          </div>
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 flex flex-col gap-8 w-full h-dvh py-6 px-8 pt-26.25 border-r border-[#dddddd] bg-[#f3f3f3] transition-transform dark:border-[#2d2d2d] dark:bg-[#111315] md:w-70 md:translate-x-0 md:py-8 md:h-screen lg:pt-10 lg:py-10 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Desktop logo */}
        <span className="hidden text-[25px] font-semibold tracking-wide text-[#121212] dark:text-white md:flex md:text-[28px] lg:h-14.5 lg:text-[38.7px]">ReziPOS</span>
        <span className="lg:hidden" />

        {/* Navigation links */}
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`max-w-xs p-4 rounded-2xl text-base font-medium transition-all ${
                pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                  ? "bg-[#dddddd] text-[#98A2F3] dark:bg-[#2d2d2d]"
                  : "text-[#121212] dark:text-white opacity-70 hover:opacity-100 hover:bg-[#dddddd]/50 dark:hover:bg-[#2d2d2d]/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full h-px bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <div>
          {/* Settings button */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-4 w-full max-w-xs p-4 rounded-2xl font-bold transition-all ${
              pathname === "/settings"
                ? "bg-[#dddddd] text-[#98A2F3] dark:bg-[#2d2d2d]"
                : "text-[#686868] hover:bg-[#dddddd]/50 hover:text-[#121212] dark:hover:bg-[#2d2d2d]/50 dark:hover:text-white"
            }`}
          >
            <Settings size={20} /> Ayarlar
          </Link>
          <p className="mt-6 px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400">© {new Date().getFullYear()} ReziPOS</p>
        </div>
      </aside>
    </>
  );
}