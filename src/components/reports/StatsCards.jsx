"use client";

import * as Icons from "lucide-react";

// Summary Card
function SummaryCard({ label, value, Icon, accent = false }) {
  return (
    <div
      className={`relative flex min-h-41 flex-col justify-between gap-5 overflow-hidden rounded-2xl p-5 md:min-h-45 md:gap-6 md:p-6 lg:min-h-49 lg:gap-7 ${
        accent
          ? "bg-[#a5b4fc] text-white"
          : "bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full md:h-13 md:w-13 lg:h-14 lg:w-14 ${
          accent
            ? "bg-white/20"
            : "bg-black/6 text-[#121212] dark:bg-white/10 dark:text-white"
        }`}
      >
        <Icon className="h-6 w-6 md:h-7 md:w-7" />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wider opacity-70 md:text-[13px] lg:text-[15px]">
          {label}
        </p>
        <h3 className="tabular-nums text-[28px] leading-none tracking-tighter md:text-[31px] lg:text-[34px]">
          {value}
        </h3>
      </div>

      {accent && (
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      )}
    </div>
  );
}

export default function ReportsStatsCards({ reportData, formatMoney, formatCount }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4 lg:gap-8">
      <SummaryCard
        label="Revenue"
        value={`₺${formatMoney(reportData.netAmount)}`}
        Icon={Icons.DollarSign}
        accent
      />
      <SummaryCard
        label="Total Orders"
        value={formatCount(reportData.totalOrders)}
        Icon={Icons.Receipt}
      />
      <SummaryCard
        label="Open Checks"
        value={formatCount(reportData.openCheckCount)}
        Icon={Icons.Activity}
      />
      <SummaryCard
        label="Dishes Sold"
        value={formatCount(reportData.totalProducts)}
        Icon={Icons.ShoppingBag}
      />
    </div>
  );
}