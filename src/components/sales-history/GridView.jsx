"use client";

import * as Icons from "lucide-react";

export default function GridView({ filteredOrders }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {filteredOrders.map((order) => (
        <div
          key={order._id}
          className="relative flex min-h-38 flex-col overflow-hidden rounded-2xl bg-[#dddddd] p-4 pl-7 dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9"
        >
          {/* Paid Status Bar */}
          <div
            className="absolute top-0 bottom-0 left-0 w-2"
            style={{ backgroundColor: order.isPaid ? "#d4f0d4" : "#f0d4d4" }}
          />

          {/* Order Status */}
          <div className="mb-5 flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${order.status === "preparing" ? "animate-pulse bg-amber-500" : "bg-blue-500"}`} />
            <span className="text-[8px] font-bold uppercase tracking-widest text-black opacity-40 dark:text-white">{order.status}</span>
          </div>

          {/* Table Number */}
          <div className="mb-auto text-[#121212] dark:text-white">
            <h4 className="text-4xl leading-none font-black tracking-tighter">{order.table}</h4>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-widest opacity-40">Masa No</p>
          </div>

          {/* Divider */}
          <div className="my-3 h-px w-full bg-black/5 dark:bg-white/5" />

          {/* Order Items */}
          <div className="mb-3 flex flex-col gap-1.5">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-black/5 text-[10px] font-black text-[#121212] dark:bg-white/10 dark:text-white">
                    {item.qt}
                  </div>

                  <span className="truncate text-[12px] font-bold leading-tight text-[#121212] opacity-70 dark:text-white">
                    {item.name}
                  </span>
                </div>

                <span className="shrink-0 font-mono text-[10px] font-black text-[#121212] opacity-40 dark:text-white">
                  ${(item.price * (item.qt || 1)).toFixed(2)}
                </span>
              </div>
            ))}

            {order.items.length > 3 && (
              <span className="text-[10px] font-bold italic text-[#121212] opacity-30 dark:text-white">+{order.items.length - 3} more</span>
            )}
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#121212] opacity-40 dark:text-white">Toplam</p>
              <p className="text-base font-black tracking-tighter text-[#121212] dark:text-white">${order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[10px] font-black text-[#121212] opacity-30 dark:text-white">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10">
                {order.isPaid ? (
                  <Icons.Check size={15} className="text-green-500" />
                ) : (
                  <Icons.Wallet size={14} className="text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}