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
    <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-[#a5b4fc] p-4 text-white md:gap-7 md:p-5 lg:gap-8 lg:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/30 md:h-12 md:w-12 lg:h-13 lg:w-13">
        <Icon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider opacity-70 md:text-[13px] lg:text-[15px]">{label}</p>
        <h3 className="tabular-nums text-[26px] leading-none tracking-tighter md:text-[29px] lg:text-[32px]">{value}</h3>
      </div>
    </div>
  );
}

// Default Card
function DefaultCard({ label, value, Icon }) {
  return (
    <div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-[#dddddd] p-4 text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:gap-5 md:p-5 lg:gap-6 lg:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c5c5c5] text-[#121212] dark:bg-white md:h-12 md:w-12 lg:h-13 lg:w-13">
        <Icon className="h-6 w-6 opacity-70 md:h-7 md:w-7 lg:h-8 lg:w-8" />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider opacity-70 md:text-[13px] lg:text-[15px]">{label}</p>
        <h3 className="tabular-nums text-[26px] leading-none tracking-tighter md:text-[29px] lg:text-[32px]">{value}</h3>
      </div>
    </div>
  );
}

// Compute Stats
function useStats(filteredOrders) {
  return useMemo(() => {
    const totalRevenue = filteredOrders.reduce((total, order) => total + order.totalAmount, 0);
    const activeTablesCount = filteredOrders.filter((order) => order.status === "preparing").length;
    const totalDishes = filteredOrders.reduce(
      (total, order) => total + order.items.reduce((itemTotal, item) => itemTotal + item.qt, 0),
      0
    );

    const currencyFormatter = new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    });

    return {
      revenue: currencyFormatter.format(totalRevenue),
      orders: filteredOrders.length.toLocaleString("tr-TR"),
      activeTables: activeTablesCount.toString(),
      dishes: totalDishes.toLocaleString("tr-TR"),
    };
  }, [filteredOrders]);
}

export default function StatCards({ filteredOrders }) {
  // Stats
  const stats = useStats(filteredOrders);

  return (
    <div className="row-span-2 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
      {CARDS.map(({ key, label, Icon, accent }) =>
        accent ? (
          <AccentCard key={key} label={label} value={stats[key]} Icon={Icon} />
        ) : (
          <DefaultCard key={key} label={label} value={stats[key]} Icon={Icon} />
        )
      )}
    </div>
  );
}