"use client";

import * as Icons from "lucide-react";
import salesHistory from "@/data/sales-history.json";

// Payment Filter Options
const PAYMENT_FILTERS = [
  { id: "all", label: "All", icon: Icons.LayoutGrid, active: "bg-[#a5b4fc] text-white" },
  { id: "paid", label: "Paid", icon: Icons.CheckCircle, active: "bg-[#d4f0d4] text-[#166534]" },
  { id: "unpaid", label: "Unpaid", icon: Icons.XCircle, active: "bg-[#fecaca] text-[#991b1b]" },
];

// Order Status Filter Options
const ORDER_FILTERS = [
  { id: "all", label: "All", icon: Icons.List, active: "bg-[#a5b4fc] text-white" },
  { id: "preparing", label: "Prep", icon: Icons.Clock, active: "bg-[#f0e6d4] text-[#967c52]" },
  { id: "served", label: "Served", icon: Icons.CheckCheck, active: "bg-[#d4d4f0] text-[#525296]" },
];

// Sort Options
const SORT_OPTIONS = [
  { id: "highest", label: "Highest Total", icon: Icons.DollarSign, span: true },
  { id: "newest", label: "Newest", icon: Icons.ArrowDownAZ, span: false },
  { id: "oldest", label: "Oldest", icon: Icons.ArrowUpAZ, span: false },
];

// Summary Stats From Full Dataset
const totalOrders = salesHistory.length;
const unpaidOrders = salesHistory.filter((o) => !o.isPaid).length;
const paidOrders = salesHistory.filter((o) => o.isPaid).length;
const totalRevenue = salesHistory.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalAmount, 0);

export default function SalesHistorySidePanel({ isOrderModalOpen, setIsOrderModalOpen, activePayment, setActivePayment, activeOrder, setActiveOrder, sortBy, setSortBy }) {
  return (
    <div className={`fixed top-26.25 right-0 z-30 flex flex-col overflow-y-auto gap-8 w-full h-[calc(100dvh-105px)] py-6 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:w-100 lg:h-screen lg:translate-x-0 lg:py-10 ${isOrderModalOpen ? "translate-x-0" : "translate-x-full"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center justify-between p-4 rounded-2xl bg-[#a5b4fc]">
          <h2 className="text-[17.5px] font-bold capitalize text-white">Orders Filters</h2>
        </div>
        {/* Mobile Close Button */}
        <button onClick={() => setIsOrderModalOpen(!isOrderModalOpen)} className="flex items-center justify-center ml-3 w-14 h-14 rounded-2xl bg-white dark:bg-[#2d2d2d] lg:hidden">
          <Icons.X size={24} className="text-[#121212] dark:text-white" />
        </button>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Summary Cards */}
      <div>
        <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Order Summary</label>
        <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
          {/* Total Orders Card */}
          <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
            <Icons.ClipboardList size={24} className="text-[#495057] dark:text-[#868e96]" />
            <div>
              <p className="text-[14px] font-bold leading-tight">Toplam Sipariş</p>
              <h4 className="text-[13px] font-bold opacity-40">{totalOrders} adet</h4>
            </div>
          </div>

          {/* Unpaid Orders Card */}
          <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
            <Icons.Wallet size={24} className="text-[#495057] dark:text-[#868e96]" />
            <div>
              <p className="text-[14px] font-bold leading-tight">Ödenmemiş</p>
              <h4 className="text-[13px] font-bold opacity-40">{unpaidOrders} adet</h4>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="col-span-2 flex flex-col justify-between h-38 w-full p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
            <Icons.TrendingUp size={24} className="text-white" />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[14px] font-bold leading-tight text-white">Toplam Gelir</p>
                <h4 className="text-[13px] font-bold opacity-70 text-white">{paidOrders} onaylanan sipariş</h4>
              </div>
              <span className="text-[13px] font-bold opacity-70 text-white">
                ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Payment Status Filter */}
      <div>
        <h3 className="pl-1 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Status</h3>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_FILTERS.map(({ id, label, icon: Icon, active }) => (
            <button key={id} onClick={() => setActivePayment(id)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-gray-500 hover:opacity-80 ${activePayment === id ? active : "bg-[#dddddd] dark:bg-[#2d2d2d] text-[#ffffff]"}`}>
              <Icon size={20} />
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Order Status Filter */}
      <div>
        <h3 className="pl-1 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order Status</h3>
        <div className="grid grid-cols-3 gap-3">
          {ORDER_FILTERS.map(({ id, label, icon: Icon, active }) => (
            <button key={id} onClick={() => setActiveOrder(id)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-gray-500 hover:opacity-80 ${activeOrder === id ? active : "bg-[#dddddd] dark:bg-[#2d2d2d]"}`}>
              <Icon size={20} />
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Sort Options */}
      <div>
        <h3 className="pl-1 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort By</h3>
        <div className="grid grid-cols-2 gap-3">
          {SORT_OPTIONS.map(({ id, label, icon: Icon, span }) => (
            <button key={id} onClick={() => setSortBy(id)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-gray-500 hover:opacity-80 ${span ? "col-span-2" : ""} ${sortBy === id ? "bg-[#a5b4fc] text-white" : "bg-[#dddddd] dark:bg-[#2d2d2d]"}`}>
              <Icon size={20} />
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      <button onClick={() => setIsOrderModalOpen(!isOrderModalOpen)} className="w-full py-4 rounded-2xl font-black uppercase tracking-wider text-[13px] bg-[#a5b4fc] text-white hover:bg-[#90a3fc] active:scale-[0.98] lg:hidden">
        Apply Filters
      </button>
    </div>
  );
}