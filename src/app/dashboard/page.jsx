"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import salesHistory from "@/data/sales-history.json";
import { useFilteredOrders } from "@/hooks/useOrders";
import StatCards from "@/components/dashboard/StatCards";
import TopProductsCard from "@/components/dashboard/TopProductsCard";
import OrdersChartCard from "@/components/dashboard/OrdersChartCard";
import CategoryPieCard from "@/components/dashboard/CategoryPieCard";

// Month Definitions
const MONTHS = [
  { n: "01", name: "January" }, { n: "02", name: "February" }, { n: "03", name: "March" },
  { n: "04", name: "April" }, { n: "05", name: "May" }, { n: "06", name: "June" },
  { n: "07", name: "July" }, { n: "08", name: "August" }, { n: "09", name: "September" },
  { n: "10", name: "October" }, { n: "11", name: "November" }, { n: "12", name: "December" },
];

export default function DashboardPage() {
  // Filter State
  const [filterMode, setFilterMode] = useState("today");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Available Years From History
  const availableYears = useMemo(() => {
    const years = salesHistory.map((item) => new Date(item.createdAt).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b - a);
  }, []);

  // Filtered Orders
  const filteredOrders = useFilteredOrders(filterMode, selectedYear, selectedMonth);

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 mt-26 md:mt-0 md:ml-70 px-8 py-6 md:px-8 md:py-8 lg:px-8 lg:py-10 lg:h-screen select-none">
      {/* Header */}
      <header className="h-14.5 shrink-0 flex justify-between gap-4 relative">
        {/* Filter Button */}
        <div className={`relative flex-1 md:flex-none md:w-50 ${filterMode === "today" ? "hidden" : ""}`}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center h-14.5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-center w-14 h-full bg-[#a5b4fc] border-r border-white/20">
              <Icons.SlidersHorizontal size={20} className="text-white" />
            </div>
            <div className="flex-1 flex items-center h-full px-5 bg-[#dddddd] dark:bg-[#2d2d2d] text-gray-400 hover:text-gray-600">
              <span className="text-sm font-bold">
                Filter{selectedYear !== "All" || selectedMonth !== "All" ? " (Active)" : ""}
              </span>
              <Icons.ChevronDown size={16} className={`ml-auto transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-[110%] left-0 flex gap-2 z-50 animate-in fade-in zoom-in duration-200">
              {/* Year Column */}
              <div className="w-32 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">Year</div>
                <button onClick={() => { setSelectedYear("All"); setFilterMode("all"); }} className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedYear === "All" ? "text-[#a5b4fc]" : "opacity-60"}`}>All</button>
                {availableYears.map((y) => (
                  <button key={y} onClick={() => { setSelectedYear(y); setFilterMode("all"); }} className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedYear === y ? "text-[#a5b4fc]" : "opacity-60"}`}>{y}</button>
                ))}
              </div>

              {/* Month Column */}
              <div className="w-40 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">Month</div>
                <button onClick={() => { setSelectedMonth("All"); setFilterMode("all"); }} className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedMonth === "All" ? "text-[#a5b4fc]" : "opacity-60"}`}>All Months</button>
                <div className="max-h-60 overflow-y-auto">
                  {MONTHS.map((m) => (
                    <button key={m.n} onClick={() => { setSelectedMonth(m.n); setFilterMode("all"); }} className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedMonth === m.n ? "text-[#a5b4fc]" : "opacity-60"}`}>{m.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${filterMode === "all" ? "hidden" : "flex-1"}`}></div>

        {/* All Time / Today Toggle */}
        <div className="flex flex-1 md:flex-none md:w-50 h-14.5 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl overflow-hidden">
          <button
            onClick={() => { setFilterMode("all"); setIsFilterOpen(false); }}
            className={`flex-1 h-full flex items-center justify-center text-[13px] font-bold transition-all ${filterMode === "all" ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            All Time
          </button>
          <button
            onClick={() => { setFilterMode("today"); setIsFilterOpen(false); setSelectedYear("All"); setSelectedMonth("All"); }}
            className={`flex-1 h-full flex items-center justify-center text-[13px] font-bold transition-all ${filterMode === "today" ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            Today
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <div className="min-h-0 flex-1 grid grid-rows-7 lg:grid-rows-5 gap-4 md:gap-6 lg:gap-8">
        <StatCards filteredOrders={filteredOrders} />

        <div className="row-span-5 lg:row-span-3 min-h-0 flex flex-col lg:grid lg:grid-rows-1 lg:grid-cols-9 gap-4 md:gap-6 lg:gap-8">
          <TopProductsCard filteredOrders={filteredOrders} />
          <OrdersChartCard filterMode={filterMode} selectedYear={selectedYear} selectedMonth={selectedMonth} />
          <CategoryPieCard filteredOrders={filteredOrders} />
        </div>
      </div>
    </div>
  );
}