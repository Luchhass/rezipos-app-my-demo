"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import salesHistory from "@/data/sales-history.json";

// Month Definitions
const MONTHS = [
  { n: "01", name: "January" },
  { n: "02", name: "February" },
  { n: "03", name: "March" },
  { n: "04", name: "April" },
  { n: "05", name: "May" },
  { n: "06", name: "June" },
  { n: "07", name: "July" },
  { n: "08", name: "August" },
  { n: "09", name: "September" },
  { n: "10", name: "October" },
  { n: "11", name: "November" },
  { n: "12", name: "December" },
];

// Chart Data By Filter Mode
function useChartData(filterMode, selectedYear, selectedMonth) {
  return useMemo(() => {
    if (filterMode === "today") {
      const today = new Date().toISOString().split("T")[0];
      const counts = Array(24).fill(0);

      salesHistory.forEach((order) => {
        if (order.createdAt.startsWith(today)) counts[new Date(order.createdAt).getHours()]++;
      });

      return counts.map((orders, hour) => ({
        label: `${hour.toString().padStart(2, "0")}:00`,
        orders,
      }));
    }

    if (selectedMonth !== "All") {
      const year = selectedYear !== "All" ? parseInt(selectedYear, 10) : new Date().getFullYear();
      const daysInMonth = new Date(year, parseInt(selectedMonth, 10), 0).getDate();
      const counts = Array(daysInMonth).fill(0);

      salesHistory.forEach((order) => {
        const date = new Date(order.createdAt);
        const yearMatch = selectedYear === "All" || date.getFullYear().toString() === selectedYear;
        const monthMatch = (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth;

        if (yearMatch && monthMatch) counts[date.getDate() - 1]++;
      });

      return counts.map((orders, index) => ({
        label: `${index + 1}`,
        orders,
      }));
    }

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);

    salesHistory.forEach((order) => {
      const date = new Date(order.createdAt);
      const yearMatch = selectedYear === "All" || date.getFullYear().toString() === selectedYear;
      if (yearMatch) counts[date.getMonth()]++;
    });

    return monthLabels.map((label, index) => ({
      label,
      orders: counts[index],
    }));
  }, [filterMode, selectedYear, selectedMonth]);
}

// Chart Sub Label
function useChartSubLabel(filterMode, selectedYear, selectedMonth) {
  return useMemo(() => {
    if (filterMode === "today") return "Hourly — Today";

    if (selectedMonth !== "All") {
      const monthName = MONTHS.find((month) => month.n === selectedMonth)?.name ?? "";
      return `Daily — ${monthName}${selectedYear !== "All" ? ` ${selectedYear}` : ""}`;
    }

    return selectedYear !== "All" ? `Monthly — ${selectedYear}` : "Monthly — All Time";
  }, [filterMode, selectedYear, selectedMonth]);
}

// Chart Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl bg-[#dddddd] px-3 py-2 shadow-lg dark:bg-[#2d2d2d]">
      <p className="mb-0.5 text-[11px] font-bold text-[#121212] opacity-50 dark:text-white">{label}</p>
      <p className="text-[14px] font-black text-[#98A2F3]">{payload[0].value} orders</p>
    </div>
  );
}

export default function OrdersChartCard({ filterMode, selectedYear, selectedMonth }) {
  // Chart State
  const chartData = useChartData(filterMode, selectedYear, selectedMonth);
  const chartSubLabel = useChartSubLabel(filterMode, selectedYear, selectedMonth);

  return (
    <div className="flex h-72 min-h-0 flex-col overflow-hidden rounded-2xl border border-[#dddddd] dark:border-[#2d2d2d] lg:col-span-4 lg:h-full">
      <div className="flex min-h-0 flex-1 flex-col p-4 text-[#121212] dark:text-white md:p-5 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4 md:mb-6 lg:mb-8">
          <h2 className="text-[26px] leading-none tracking-tighter text-[#121212] dark:text-white md:text-[29px] lg:text-[32px]">
            Total Orders
          </h2>
          <p className="mt-1 text-[11px] tracking-wider opacity-70 md:text-[13px] lg:text-[15px]">{chartSubLabel}</p>
        </div>

        {/* Bar Chart */}
        <div className="min-h-0 flex-1 text-[#121212] dark:text-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barSize={filterMode === "today" ? 8 : selectedMonth !== "All" ? 10 : 16}
              margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.06} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", opacity: 0.05 }} />
              <Bar dataKey="orders" fill="#bbf7d0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}