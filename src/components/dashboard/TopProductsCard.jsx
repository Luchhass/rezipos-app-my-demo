"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";

// Compute Top Products
function useTopProducts(filteredOrders) {
  return useMemo(() => {
    const productMap = {};

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (productMap[item.name]) {
          productMap[item.name].qt += item.qt;
          productMap[item.name].revenue += item.price * item.qt;
        } else {
          productMap[item.name] = {
            name: item.name,
            qt: item.qt,
            revenue: item.price * item.qt,
          };
        }
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.qt - a.qt)
      .slice(0, 5);
  }, [filteredOrders]);
}

export default function TopProductsCard({ filteredOrders }) {
  // Top Products
  const topProducts = useTopProducts(filteredOrders);

  return (
    <div className="flex h-72 min-h-0 flex-col gap-4 overflow-hidden rounded-2xl border border-[#dddddd] p-4 dark:border-[#2d2d2d] md:gap-6 md:p-5 lg:col-span-2 lg:h-full lg:gap-8 lg:p-6">
      {/* Header */}
      <h2 className="text-[26px] leading-none tracking-tighter text-[#121212] dark:text-white md:text-[29px] lg:text-[32px]">
        Top Products
      </h2>

      {/* Product List */}
      <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {topProducts.length > 0 ? (
          topProducts.map((product) => (
            <div
              key={product.name}
              className="group flex shrink-0 cursor-pointer items-center gap-5 rounded-2xl hover:bg-[#121212]/5 dark:hover:bg-white/5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#cacaca] dark:bg-[#383838] md:h-12 md:w-12 lg:h-13 lg:w-13">
                <Icons.Utensils className="h-6 w-6 opacity-70 group-hover:text-[#98A2F3] md:h-7 md:w-7 lg:h-8 lg:w-8" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[14px] text-[#121212] dark:text-white md:text-[17px] lg:text-[20px]">
                  {product.name}
                </h4>
                <p className="text-[11px] tracking-wider text-[#121212] dark:text-white md:text-[13px] lg:text-[15px]">
                  <span className="opacity-50">Order:</span> {product.qt}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 opacity-40">
            <Icons.Utensils className="h-6 w-6 text-[#121212] dark:text-white md:h-7 md:w-7 lg:h-8 lg:w-8" />
            <p className="text-xs font-bold text-[#121212] dark:text-white">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}