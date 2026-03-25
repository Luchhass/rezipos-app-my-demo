"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import * as Icons from "lucide-react";

const PIE_COLORS = ["#a5b4fc", "#bbf7d0", "#fde68a", "#fca5a5", "#c4b5fd", "#6ee7b7", "#fdba74", "#86efac"];

const formatTRY = (value) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);

function useCategoryPieData(filteredOrders) {
  return useMemo(() => {
    const map = {};
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = item.category || "Diğer";
        map[cat] = (map[cat] || 0) + item.price * item.qt;
      });
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    return entries.map(([name, value]) => ({ name, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 }));
  }, [filteredOrders]);
}

export default function CategoryPieCard({ filteredOrders }) {
  const categoryPieData = useCategoryPieData(filteredOrders);

  return (
    <div className="h-72 lg:h-full min-h-0 overflow-hidden flex flex-col p-4 md:p-5 lg:p-6 border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl lg:col-span-3">
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-start justify-between mb-6 shrink-0">
          <h2 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter tabular-nums leading-none text-[#121212] dark:text-white">Kategoriler</h2>
          <p className="text-[11px] md:text-[13px] lg:text-[15px] opacity-70 tracking-wider mt-1 text-[#121212] dark:text-white">Ciro bazında</p>
        </div>

        {categoryPieData.length > 0 ? (
          <div className="flex flex-1 min-h-0 gap-4">
            {/* Donut Chart */}
            <div className="w-[45%] min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {categoryPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTRY} contentStyle={{ background: "#dddddd", border: "none", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
              {categoryPieData.slice(0, 6).map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[11px] md:text-[12px] font-bold flex-1 truncate text-[#121212] dark:text-white opacity-60">{cat.name}</span>
                  <span className="text-[11px] md:text-[12px] font-black text-[#121212] dark:text-white opacity-70 tabular-nums">%{cat.pct}</span>
                </div>
              ))}
              {categoryPieData.length > 6 && (
                <p className="text-[11px] italic opacity-30 text-[#121212] dark:text-white">+{categoryPieData.length - 6} daha</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30">
            <Icons.PieChart className="w-8 h-8 text-[#121212] dark:text-white" />
            <p className="text-xs font-bold text-[#121212] dark:text-white">Veri yok</p>
          </div>
        )}
      </div>
    </div>
  );
}