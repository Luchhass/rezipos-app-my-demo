"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";

// Stat Card Config
const CARDS = [
  { key: "revenue", label: "Revenue", Icon: Icons.DollarSign, accent: true },
  { key: "orders", label: "Total Orders", Icon: Icons.Receipt, accent: false },
  { key: "activeTables", label: "Prep Tables", Icon: Icons.Activity, accent: false },
  { key: "dishes", label: "Dishes Sold", Icon: Icons.ShoppingBag, accent: false },
];

// Accent Card
function AccentCard({ label, value, Icon }) {
  return (
    <div className="flex flex-col gap-6 md:gap-7 lg:gap-8 justify-between p-4 md:p-5 lg:p-6 rounded-2xl bg-[#a5b4fc] text-[#ffffff] overflow-hidden relative">
      <div className="w-11 h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 rounded-full flex items-center justify-center bg-white/30">
        <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      </div>
      <div>
        <p className="text-[11px] md:text-[13px] lg:text-[15px] opacity-70 uppercase tracking-wider">{label}</p>
        <h3 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter tabular-nums leading-none">{value}</h3>
      </div>
    </div>
  );
}

// Default Card
function DefaultCard({ label, value, Icon }) {
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 justify-between p-4 md:p-5 lg:p-6 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] overflow-hidden relative">
      <div className="w-11 h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 rounded-full flex items-center justify-center bg-[#c5c5c5] dark:bg-white text-[#121212]">
        <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 opacity-70" />
      </div>
      <div>
        <p className="text-[11px] md:text-[13px] lg:text-[15px] opacity-70 uppercase tracking-wider">{label}</p>
        <h3 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter tabular-nums leading-none">{value}</h3>
      </div>
    </div>
  );
}

// Compute Stats From Orders
function useStats(filteredOrders) {
  return useMemo(() => {
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const activeTablesCount = filteredOrders.filter((o) => o.status === "preparing").length;
    const totalDishes = filteredOrders.reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.qt, 0), 0);
    const fmt = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
    return {
      revenue: fmt.format(totalRevenue),
      orders: filteredOrders.length.toLocaleString("tr-TR"),
      activeTables: activeTablesCount.toString(),
      dishes: totalDishes.toLocaleString("tr-TR"),
    };
  }, [filteredOrders]);
}

// Stat Cards Grid
export default function StatCards({ filteredOrders }) {
  const stats = useStats(filteredOrders);
  return (
    <div className="row-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {CARDS.map(({ key, label, Icon, accent }) =>
        accent
          ? <AccentCard  key={key} label={label} value={stats[key]} Icon={Icon} />
          : <DefaultCard key={key} label={label} value={stats[key]} Icon={Icon} />
      )}
    </div>
  );
}
