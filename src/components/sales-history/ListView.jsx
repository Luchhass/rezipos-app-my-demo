"use client";

import * as Icons from "lucide-react";

export default function ListView({ filteredOrders }) {
  return (
    <div className="flex flex-col gap-4">
      {filteredOrders.map((order) => (
        <div key={order._id} className="relative flex items-stretch overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
          {/* Paid Status Bar */}
          <div
            className="absolute top-0 bottom-0 left-0 w-2"
            style={{ backgroundColor: order.isPaid ? "#d4f0d4" : "#f0d4d4" }}
          />

          {/* Table Number */}
          <div className="ml-2 flex w-16 shrink-0 flex-col items-center justify-center bg-black/5 px-2 py-4 dark:bg-white/5 md:w-20">
            <span className="text-2xl leading-none font-black tracking-tighter text-[#121212] dark:text-white md:text-3xl">
              {order.table}
            </span>
            <span className="mt-0.5 text-[8px] font-black uppercase tracking-widest text-[#121212] opacity-40 dark:text-white">
              Masa
            </span>
          </div>

          {/* Row Content */}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-[13px] font-bold leading-tight text-[#121212] opacity-80 dark:text-white">
                {order.items
                  .slice(0, 3)
                  .map((item) => item.name)
                  .join(", ")}
                {order.items.length > 3 && <span className="italic opacity-40"> +{order.items.length - 3}</span>}
              </p>

              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    order.status === "preparing" ? "animate-pulse bg-amber-500" : "bg-blue-500"
                  }`}
                />
                <span className="text-[10px] font-black uppercase tracking-wide text-[#121212] opacity-40 dark:text-white">
                  {order.status}
                </span>
                <span className="text-[10px] text-[#121212] opacity-20 dark:text-white">·</span>
                <span className="text-[10px] font-black text-[#121212] opacity-30 dark:text-white">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Amount And Payment Status */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider text-[#121212] opacity-40 dark:text-white">Tutar</p>
                <p className="text-base font-black tracking-tight text-[#121212] dark:text-white md:text-lg">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                {order.isPaid ? (
                  <Icons.Check size={16} className="text-green-500" />
                ) : (
                  <Icons.Wallet size={15} className="text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}