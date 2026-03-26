"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Chart Colors
const PIE_COLORS = ["#a5b4fc", "#bbf7d0", "#fde68a", "#fca5a5", "#c4b5fd", "#6ee7b7", "#fdba74", "#86efac"];

// Format Currency
const formatTRY = (value) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

// Category Pie Data
function useCategoryPieData(filteredOrders) {
  return useMemo(() => {
    const categoryMap = {};

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.category || "Diğer";
        categoryMap[category] = (categoryMap[category] || 0) + item.price * item.qt;
      });
    });

    const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    return entries.map(([name, value]) => ({
      name,
      value,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  }, [filteredOrders]);
}

export default function CategoryPieCard({ filteredOrders }) {
  // Chart Data
  const categoryPieData = useCategoryPieData(filteredOrders);

  return (
    <div className="flex h-72 min-h-0 flex-col overflow-hidden rounded-2xl border border-[#dddddd] p-4 dark:border-[#2d2d2d] md:p-5 lg:col-span-3 lg:h-full lg:p-6">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4 md:mb-6 lg:mb-8">
          <h2 className="text-[26px] leading-none tracking-tighter text-[#121212] dark:text-white md:text-[29px] lg:text-[32px]">
            Kategoriler
          </h2>
          <p className="mt-1 text-[11px] tracking-wider text-[#121212] opacity-70 dark:text-white md:text-[13px] lg:text-[15px]">
            Ciro bazında
          </p>
        </div>

        {categoryPieData.length > 0 ? (
          <div className="flex min-h-0 flex-1 gap-4 md:gap-6 lg:gap-8">
            {/* Donut Chart */}
            <div className="min-h-0 w-[45%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={formatTRY}
                    contentStyle={{
                      background: "#dddddd",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              {categoryPieData.slice(0, 6).map((category, index) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 shrink-0 rounded-sm"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />

                  <span className="flex-1 truncate text-[11px] font-bold text-[#121212] opacity-60 dark:text-white md:text-[12px]">
                    {category.name}
                  </span>

                  <span className="tabular-nums text-[11px] font-black text-[#121212] opacity-70 dark:text-white md:text-[12px]">
                    %{category.pct}
                  </span>
                </div>
              ))}

              {categoryPieData.length > 6 && (
                <p className="text-[11px] italic text-[#121212] opacity-30 dark:text-white">+{categoryPieData.length - 6} daha</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 opacity-30">
            <Icons.PieChart className="h-8 w-8 text-[#121212] dark:text-white" />
            <p className="text-xs font-bold text-[#121212] dark:text-white">Veri yok</p>
          </div>
        )}
      </div>
    </div>
  );
}