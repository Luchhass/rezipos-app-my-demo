"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";

// Compute Top 5 Products
function useTopProducts(filteredOrders) {
  return useMemo(() => {
    const counts = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (counts[item.name]) {
          counts[item.name].qt += item.qt;
          counts[item.name].revenue += item.price * item.qt;
        } else {
          counts[item.name] = { name: item.name, qt: item.qt, revenue: item.price * item.qt };
        }
      });
    });
    return Object.values(counts).sort((a, b) => b.qt - a.qt).slice(0, 5);
  }, [filteredOrders]);
}

// Top Products Card
export default function TopProductsCard({ filteredOrders }) {
  const topProducts = useTopProducts(filteredOrders);

  return (
    <div className="h-72 lg:h-full min-h-0 overflow-hidden flex flex-col gap-4 md:gap-6 lg:gap-8 p-4 md:p-5 lg:p-6 border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl lg:col-span-2">
      <h2 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter tabular-nums leading-none text-[#121212] dark:text-white">Top products</h2>

      <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {topProducts.length > 0 ? (
          topProducts.map((p) => (
            <div key={p.name} className="flex items-center gap-5 group cursor-pointer hover:bg-[#121212]/5 dark:hover:bg-white/5 rounded-2xl shrink-0">
              <div className="w-11 h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 bg-[#cacaca] dark:bg-[#383838] rounded-2xl flex items-center justify-center shrink-0">
                <Icons.Utensils className="group-hover:text-[#98A2F3] w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 opacity-70" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] md:text-[17px] lg:text-[20px] truncate text-[#121212] dark:text-[#ffffff]">{p.name}</h4>
                <p className="text-[11px] md:text-[13px] lg:text-[15px] tracking-wider text-[#121212] dark:text-[#ffffff]">
                  <span className="opacity-50">Order:</span>{p.qt}
                </p>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 opacity-40">
            <Icons.Utensils className="text-[#121212] dark:text-[#ffffff] w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <p className="text-xs font-bold text-[#121212] dark:text-[#ffffff]">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
