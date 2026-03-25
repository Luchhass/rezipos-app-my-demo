"use client";

import * as Icons from "lucide-react";

// Grid View Card
export default function GridView({ filteredOrders }) {
  return (
    <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {filteredOrders.map((o) => (
        <div key={o._id} className="relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          {/* Paid Status Bar */}
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: o.isPaid ? "#d4f0d4" : "#f0d4d4" }} />

          {/* Order Status Badge */}
          <div className="mb-5 flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${o.status === "preparing" ? "animate-pulse bg-amber-500" : "bg-blue-500"}`} />
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-40 text-black dark:text-white">{o.status}</span>
          </div>

          {/* Table Number */}
          <div className="text-[#121212] dark:text-white mb-auto">
            <h4 className="text-4xl font-black leading-none tracking-tighter">{o.table}</h4>
            <p className="mt-1 text-[9px] font-bold opacity-40 uppercase tracking-widest">Masa No</p>
          </div>

          <div className="w-full h-px bg-black/5 dark:bg-white/5 my-3" />

          {/* Order Items */}
          <div className="flex flex-col gap-1.5 mb-3">
            {o.items.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black shrink-0 bg-black/5 dark:bg-white/10 text-[#121212] dark:text-white">{item.qt}</div>
                  <span className="text-[12px] font-bold leading-tight truncate text-[#121212] dark:text-white opacity-70">{item.name}</span>
                </div>
                <span className="text-[10px] font-black font-mono opacity-40 shrink-0 text-[#121212] dark:text-white">${(item.price * (item.qt || 1)).toFixed(2)}</span>
              </div>
            ))}
            {o.items.length > 3 && (
              <span className="text-[10px] font-bold opacity-30 italic text-[#121212] dark:text-white">+{o.items.length - 3} more</span>
            )}
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5 text-[#121212] dark:text-white">Toplam</p>
              <p className="text-base font-black tracking-tighter text-[#121212] dark:text-white">${o.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black opacity-30 text-[#121212] dark:text-white">
                {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10">
                {o.isPaid ? <Icons.Check size={15} className="text-green-500" /> : <Icons.Wallet size={14} className="text-red-400" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
