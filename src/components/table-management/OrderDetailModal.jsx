"use client";

import * as Icons from "lucide-react";

export default function OrderDetailModal({ table, onClose }) {
  if (!table) return null;

  // Order State
  const isOccupied = table.orders && table.orders.length > 0;

  // Total Amount
  const totalAmount = isOccupied ? table.orders.reduce((sum, order) => sum + (order.productId?.price * order.quantity || 0), 0) : 0;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-4xl bg-[#f3f4f6] shadow-2xl dark:bg-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#a5b4fc] p-6">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Masa {table.tableNumber}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Sipariş Detayları</p>
          </div>

          {/* Close Button */}
          <button onClick={onClose} className="rounded-2xl bg-white/20 p-2 text-white transition-all hover:bg-white/30 active:scale-90">
            <Icons.X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar max-h-[50vh] overflow-y-auto p-6">
          {isOccupied ? (
            <div className="space-y-3">
              {table.orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#2d2d2d]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a5b4fc]/10 text-sm font-black text-[#a5b4fc]">
                      {order.quantity}x
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{order.productId?.name || "Bilinmeyen Ürün"}</p>
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Birim: {order.productId?.price ? `${order.productId.price} TL` : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-sm font-black text-[#a5b4fc]">
                    {order.productId?.price ? `${(order.productId.price * order.quantity).toFixed(2)} TL` : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dddddd] opacity-50 dark:bg-[#2d2d2d]">
                <Icons.Utensils size={28} className="text-gray-400" />
              </div>

              <p className="text-sm font-bold text-gray-400">Bu masa için aktif sipariş bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/5 bg-white p-6 dark:border-white/5 dark:bg-[#232323]">
          {isOccupied && (
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Toplam Tutar</span>
              <span className="text-2xl font-black text-gray-800 dark:text-white">{totalAmount.toFixed(2)} TL</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-[#dddddd] py-4 text-sm font-bold text-gray-500 transition-all active:scale-95 dark:bg-[#2d2d2d] dark:text-gray-400"
            >
              Kapat
            </button>

            {isOccupied && (
              <button className="flex flex-2 items-center justify-center gap-2 rounded-2xl bg-[#a5b4fc] py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                <Icons.Receipt size={18} strokeWidth={2.5} />
                Ödeme Al
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}