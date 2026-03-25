"use client";

import { useRouter } from "next/navigation";
import { UtensilsCrossed, LayoutGrid } from "lucide-react";

const SECTIONS = [
  {
    href: "/restaurant-management/tables",
    label: "Masa Yönetimi",
    icon: LayoutGrid,
    color: "#fde68a",
  },
  {
    href: "/restaurant-management/menu",
    label: "Menü Yönetimi",
    icon: UtensilsCrossed,
    color: "#a5b4fc",
  },
];

export default function RestaurantManagementPage() {
  const router = useRouter();

  return (
    <div className="select-none mt-26 md:mt-0 md:ml-70 lg:mr-100 py-6 px-8 md:py-8 lg:py-10 h-[calc(100dvh-105px)] md:h-[calc(100dvh-92px)]">
      <div className="h-14.5 mb-8"></div>

      <div className="grid grid-cols-1 grid-rows-2 gap-4 md:gap-6 lg:gap-8 h-full">
        {SECTIONS.map(({ href, label, icon: Icon, color }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl active:opacity-80 transition-all"
            style={{ backgroundColor: color }}
          >
            <Icon size={40} className="text-white/80" />
            <h2 className="text-xl font-bold text-white">{label}</h2>
          </button>
        ))}
      </div>

      {/* Side Panel */}
      <div className="fixed top-0 right-0 z-30 hidden lg:flex flex-col w-100 h-screen py-10 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315]">
        <div className="flex items-center h-14.5 p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold text-white">
            Restoran Yönetimi
          </h2>
        </div>
        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d] my-8" />
        <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 rounded-2xl text-center bg-[#dddddd]/50 dark:bg-[#2d2d2d]/50">
          <div className="p-4 rounded-full bg-[#a5b4fc]/20">
            <LayoutGrid size={32} className="text-[#a5b4fc]" />
          </div>
          <h3 className="font-bold text-[#121212] dark:text-white">
            Lütfen Seçim Yapınız
          </h3>
          <p className="text-xs opacity-50 text-[#121212] dark:text-white max-w-45">
            Devam etmek için sol taraftan bir yönetim bölümü seçin.
          </p>
        </div>
      </div>
    </div>
  );
}
