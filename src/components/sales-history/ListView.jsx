"use client";

import * as Icons from "lucide-react";

// List View Row
export default function ListView({ filteredOrders }) {
  return (
    <div className="flex flex-col gap-2">
      {filteredOrders.map((o) => (
        <div key={o._id} className="relative flex items-stretch overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
          {/* Paid Status Bar */}
          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: o.isPaid ? "#d4f0d4" : "#f0d4d4" }} />

          {/* Table Number Block */}
          <div className="flex flex-col items-center justify-center w-16 shrink-0 bg-black/5 dark:bg-white/5 px-2 py-4 ml-2 md:w-20">
            <span className="text-2xl font-black leading-none tracking-tighter text-[#121212] dark:text-white md:text-3xl">{o.table}</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-0.5 text-[#121212] dark:text-white">Masa</span>
          </div>

          {/* Row Content */}
          <div className="flex flex-1 items-center justify-between gap-3 min-w-0 px-4 py-3">
            <div className="flex flex-col min-w-0 gap-1">
              <p className="text-[13px] font-bold leading-tight truncate text-[#121212] dark:text-white opacity-80">
                {o.items.slice(0, 3).map((i) => i.name).join(", ")}
                {o.items.length > 3 && <span className="italic opacity-40"> +{o.items.length - 3}</span>}
              </p>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${o.status === "preparing" ? "animate-pulse bg-amber-500" : "bg-blue-500"}`} />
                <span className="text-[10px] font-black uppercase tracking-wide opacity-40 text-[#121212] dark:text-white">{o.status}</span>
                <span className="text-[10px] opacity-20 text-[#121212] dark:text-white">·</span>
                <span className="text-[10px] font-black opacity-30 text-[#121212] dark:text-white">
                  {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Amount And Payment Status */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider opacity-40 text-[#121212] dark:text-white">Tutar</p>
                <p className="text-base font-black tracking-tight text-[#121212] dark:text-white md:text-lg">${o.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10">
                {o.isPaid ? <Icons.Check size={16} className="text-green-500" /> : <Icons.Wallet size={15} className="text-red-400" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
