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
    <div className="mt-26 flex h-auto select-none flex-col gap-4 px-8 py-6 md:mt-0 md:ml-70 md:gap-6 md:px-8 md:py-8 lg:h-screen lg:gap-8 lg:px-8 lg:py-10">
      {/* Header */}
      <header className="relative flex h-14.5 shrink-0 justify-between gap-4">
        {/* Filter Button */}
        <div className={`relative flex-1 md:w-50 md:flex-none ${filterMode === "today" ? "hidden" : ""}`}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex h-14.5 w-full items-center overflow-hidden rounded-2xl">
            <div className="flex h-full w-14 items-center justify-center border-r border-white/20 bg-[#a5b4fc]">
              <Icons.SlidersHorizontal size={20} className="text-white" />
            </div>

            <div className="flex h-full flex-1 items-center bg-[#dddddd] px-5 text-gray-400 hover:text-gray-600 dark:bg-[#2d2d2d]">
              <span className="text-sm font-bold">
                Filter{selectedYear !== "All" || selectedMonth !== "All" ? " (Active)" : ""}
              </span>
              <Icons.ChevronDown size={16} className={`ml-auto transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-[110%] left-0 z-50 flex gap-2 animate-in fade-in zoom-in duration-200">
              {/* Year Column */}
              <div className="w-32 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
                <div className="bg-[#a5b4fc] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">
                  Year
                </div>

                <button
                  onClick={() => {
                    setSelectedYear("All");
                    setFilterMode("all");
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedYear === "All" ? "text-[#a5b4fc]" : "opacity-60"}`}
                >
                  All
                </button>

                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setFilterMode("all");
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedYear === year ? "text-[#a5b4fc]" : "opacity-60"}`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Month Column */}
              <div className="w-40 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
                <div className="bg-[#a5b4fc] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">
                  Month
                </div>

                <button
                  onClick={() => {
                    setSelectedMonth("All");
                    setFilterMode("all");
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedMonth === "All" ? "text-[#a5b4fc]" : "opacity-60"}`}
                >
                  All Months
                </button>

                <div className="max-h-60 overflow-y-auto">
                  {MONTHS.map((month) => (
                    <button
                      key={month.n}
                      onClick={() => {
                        setSelectedMonth(month.n);
                        setFilterMode("all");
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-bold ${selectedMonth === month.n ? "text-[#a5b4fc]" : "opacity-60"}`}
                    >
                      {month.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={filterMode === "all" ? "hidden" : "flex-1"} />

        {/* Time Toggle */}
        <div className="flex h-14.5 flex-1 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] md:w-50 md:flex-none">
          <button
            onClick={() => {
              setFilterMode("all");
              setIsFilterOpen(false);
            }}
            className={`flex flex-1 items-center justify-center text-[13px] font-bold transition-all ${filterMode === "all" ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            All Time
          </button>

          <button
            onClick={() => {
              setFilterMode("today");
              setIsFilterOpen(false);
              setSelectedYear("All");
              setSelectedMonth("All");
            }}
            className={`flex flex-1 items-center justify-center text-[13px] font-bold transition-all ${filterMode === "today" ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            Today
          </button>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid min-h-0 flex-1 grid-rows-7 gap-4 md:gap-6 lg:grid-rows-5 lg:gap-8">
        <StatCards filteredOrders={filteredOrders} />

        {/* Bottom Cards */}
        <div className="row-span-5 flex min-h-0 flex-col gap-4 md:gap-6 lg:row-span-3 lg:grid lg:grid-cols-9 lg:grid-rows-1 lg:gap-8">
          <TopProductsCard filteredOrders={filteredOrders} />
          <OrdersChartCard filterMode={filterMode} selectedYear={selectedYear} selectedMonth={selectedMonth} />
          <CategoryPieCard filteredOrders={filteredOrders} />
        </div>
      </div>
    </div>
  );
}