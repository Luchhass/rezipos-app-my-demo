"use client";

import * as Icons from "lucide-react";

export default function OrderDetailModal({ table, onClose }) {
  if (!table) return null;

  const isOccupied = table.orders && table.orders.length > 0;

  // Toplam Tutar Hesaplama
  const totalAmount = isOccupied 
    ? table.orders.reduce((sum, order) => sum + (order.productId?.price * order.quantity || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#f3f4f6] dark:bg-[#1a1a1a] w-full max-w-md rounded-4xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center bg-[#a5b4fc]">
          <div>
            <h3 className="text-white font-black text-xl tracking-tight">Masa {table.tableNumber}</h3>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Sipariş Detayları</p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/20 hover:bg-white/30 p-2 rounded-2xl text-white transition-all active:scale-90"
          >
            <Icons.X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {isOccupied ? (
            <div className="space-y-3">
              {table.orders.map((order, idx) => (
                <div 
                  key={order._id || idx} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#2d2d2d] shadow-sm border border-black/5 dark:border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#a5b4fc]/10 flex items-center justify-center text-[#a5b4fc] font-black text-sm">
                      {order.quantity}x
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                        {order.productId?.name || "Bilinmeyen Ürün"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Birim: {order.productId?.price ? `${order.productId.price} TL` : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-black text-sm text-[#a5b4fc]">
                    {order.productId?.price ? `${(order.productId.price * order.quantity).toFixed(2)} TL` : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="bg-[#dddddd] dark:bg-[#2d2d2d] w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Icons.Utensils className="text-gray-400" size={28} />
              </div>
              <p className="text-gray-400 font-bold text-sm">Bu masa için aktif sipariş bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white dark:bg-[#232323] border-t border-black/5 dark:border-white/5">
          {isOccupied && (
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Toplam Tutar</span>
              <span className="text-2xl font-black text-gray-800 dark:text-white">
                {totalAmount.toFixed(2)} TL
              </span>
            </div>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-[#dddddd] dark:bg-[#2d2d2d] text-gray-500 dark:text-gray-400 rounded-2xl font-bold text-sm transition-all active:scale-95"
            >
              Kapat
            </button>
            {isOccupied && (
              <button className="flex-2 py-4 bg-[#a5b4fc] text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
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