"use client";

import { LayoutGrid, UtensilsCrossed, ChartColumn } from "lucide-react";
import { useRouter } from "next/navigation";

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
  {
    href: "/restaurant-management/reports",
    label: "Raporlar",
    icon: ChartColumn,
    color: "#f9a8d4",
  },
];

export default function RestaurantManagementPage() {
  // Router
  const router = useRouter();

  return (
    <div className="pt-32 h-screen select-none px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:mr-100 lg:py-10">
      {/* Management Grid */}
      <div className="grid h-full grid-cols-1 grid-rows-3 gap-8">
        {SECTIONS.map(({ href, label, icon: Icon, color }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl transition-all active:opacity-80"
            style={{ backgroundColor: color }}
          >
            <Icon size={40} className="text-white/80" />
            <h2 className="text-xl font-bold text-white">{label}</h2>
          </button>
        ))}
      </div>

      {/* Side Panel */}
      <div className="fixed top-0 right-0 z-30 hidden h-screen w-100 flex-col border-l border-[#dddddd] bg-[#f3f3f3] px-8 py-10 dark:border-[#2d2d2d] dark:bg-[#111315] lg:flex">
        {/* Side Panel Header */}
        <div className="flex h-14.5 items-center rounded-2xl bg-[#a5b4fc] p-4 md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold text-white">Restoran Yönetimi</h2>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d] md:my-6 lg:my-8" />

        {/* Empty State */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-[#dddddd]/50 p-8 text-center dark:bg-[#2d2d2d]/50">
          <div className="rounded-full bg-[#a5b4fc]/20 p-4">
            <LayoutGrid size={32} className="text-[#a5b4fc]" />
          </div>

          <h3 className="font-bold text-[#121212] dark:text-white">Lütfen Seçim Yapınız</h3>
          <p className="max-w-45 text-xs text-[#121212] opacity-50 dark:text-white">
            Devam etmek için sol taraftan bir yönetim bölümü seçin.
          </p>
        </div>
      </div>
    </div>
  );
}