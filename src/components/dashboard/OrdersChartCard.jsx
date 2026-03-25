"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import salesHistory from "@/data/sales-history.json";

// Compute Chart Data By Filter Mode
function useChartData(filterMode, selectedYear, selectedMonth) {
  return useMemo(() => {
    if (filterMode === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      const counts = Array(24).fill(0);
      salesHistory.forEach((order) => {
        if (order.createdAt.startsWith(todayStr)) counts[new Date(order.createdAt).getHours()]++;
      });
      return counts.map((orders, h) => ({ label: `${h.toString().padStart(2, "0")}:00`, orders }));
    }

    if (selectedMonth !== "All") {
      const year = selectedYear !== "All" ? parseInt(selectedYear) : new Date().getFullYear();
      const daysInMonth = new Date(year, parseInt(selectedMonth), 0).getDate();
      const counts = Array(daysInMonth).fill(0);
      salesHistory.forEach((order) => {
        const date = new Date(order.createdAt);
        const yearMatch = selectedYear === "All" || date.getFullYear().toString() === selectedYear;
        const monthMatch = (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth;
        if (yearMatch && monthMatch) counts[date.getDate() - 1]++;
      });
      return counts.map((orders, i) => ({ label: `${i + 1}`, orders }));
    }

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);
    salesHistory.forEach((order) => {
      const date = new Date(order.createdAt);
      const yearMatch = selectedYear === "All" || date.getFullYear().toString() === selectedYear;
      if (yearMatch) counts[date.getMonth()]++;
    });
    return monthLabels.map((label, i) => ({ label, orders: counts[i] }));
  }, [filterMode, selectedYear, selectedMonth]);
}

// Compute Chart Sub Label
const MONTHS = [
  { n: "01", name: "January" }, { n: "02", name: "February" }, { n: "03", name: "March" },
  { n: "04", name: "April" }, { n: "05", name: "May" }, { n: "06", name: "June" },
  { n: "07", name: "July" }, { n: "08", name: "August" }, { n: "09", name: "September" },
  { n: "10", name: "October" }, { n: "11", name: "November" }, { n: "12", name: "December" },
];

function useChartSubLabel(filterMode, selectedYear, selectedMonth) {
  return useMemo(() => {
    if (filterMode === "today") return "Hourly — Today";
    if (selectedMonth !== "All") {
      const monthName = MONTHS.find((m) => m.n === selectedMonth)?.name ?? "";
      return `Daily — ${monthName}${selectedYear !== "All" ? ` ${selectedYear}` : ""}`;
    }
    return selectedYear !== "All" ? `Monthly — ${selectedYear}` : "Monthly — All Time";
  }, [filterMode, selectedYear, selectedMonth]);
}

// Custom Bar Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#dddddd] dark:bg-[#2d2d2d] rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[11px] font-bold text-[#121212] dark:text-[#ffffff] opacity-50 mb-0.5">{label}</p>
      <p className="text-[14px] font-black text-[#98A2F3]">{payload[0].value} orders</p>
    </div>
  );
}

// Orders Chart Card
export default function OrdersChartCard({ filterMode, selectedYear, selectedMonth }) {
  const chartData = useChartData(filterMode, selectedYear, selectedMonth);
  const chartSubLabel = useChartSubLabel(filterMode, selectedYear, selectedMonth);
  const barSize = filterMode === "today" ? 8 : selectedMonth !== "All" ? 10 : 16;

  return (
    <div className="h-72 lg:h-full min-h-0 overflow-hidden flex flex-col border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl lg:col-span-4">
      <div className="p-6 flex flex-col h-full min-h-0 text-[#121212] dark:text-white">
        <div className="flex items-start justify-between mb-6 shrink-0">
          <h2 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter tabular-nums leading-none text-[#121212] dark:text-white">Total orders</h2>
          <p className="text-[11px] md:text-[13px] lg:text-[15px] opacity-70 tracking-wider mt-1">{chartSubLabel}</p>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 min-h-0 text-[#121212] dark:text-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={barSize} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.06} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", opacity: 0.05 }} />
              <Bar dataKey="orders" fill="#bbf7d0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
