"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useTables, useDeleteTable } from "@/hooks/useTables";

// Table Grid
export default function TableGrid({ selectedArea, statusFilter, activeAction, setSelectedTable, setSelectedProducts, setStep, onTableClick }) {
  // Tables Data
  const { data: tables = [], isLoading } = useTables();
  const deleteTable = useDeleteTable();

  // Filtered Tables By Area And Status
  const filteredTables = useMemo(() => tables.filter((t) => {
    const areaMatch = selectedArea ? (typeof t.areaId === "object" ? t.areaId?._id : t.areaId) === selectedArea : true;
    const isOccupied = t.orders && t.orders.length > 0;
    const statusMatch = statusFilter === "all" ? true : statusFilter === "occupied" ? isOccupied : statusFilter === "available" ? !isOccupied : true;
    return areaMatch && statusMatch;
  }), [tables, selectedArea, statusFilter]);

  // Table Click Handler
  const handleTableClick = (t) => {
    // Management modal action
    if (onTableClick) onTableClick(t);

    const isOccupied = t.orders && t.orders.length > 0;
    if (setSelectedTable) setSelectedTable(t);
    if (setSelectedProducts) {
      if (isOccupied) {
        const formattedProducts = t.orders
          .filter((o) => o.productId && typeof o.productId === "object")
          .map((o) => ({ ...o.productId, _id: o.productId._id, orderId: o._id, quantity: o.quantity }));
        setSelectedProducts(formattedProducts);
      } else {
        setSelectedProducts([]);
      }
    }
    if (setStep) setStep(1);
  };

  return (
    <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl animate-pulse bg-[#dddddd] dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#f4efc4] dark:bg-[#fef3b0]/20" />
            <div className="w-16 h-2 mb-5 rounded-full bg-black/5 dark:bg-white/5" />
            <div className="mt-2">
              <div className="w-24 h-4 mb-2 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="w-12 h-3 rounded-full bg-black/5 dark:bg-white/5" />
            </div>
          </div>
        ))
      ) : filteredTables.length > 0 ? (
        filteredTables.map((t) => {
          const isOccupied = t.orders && t.orders.length > 0;
          return (
            <div key={t._id} className="relative cursor-pointer" onClick={() => handleTableClick(t)}>
              {/* Delete Badge */}
              {activeAction === "delete-table" && (
                <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); deleteTable.mutate(t._id); }}>
                  <Icons.Minus size={18} strokeWidth={3} />
                </div>
              )}
              <div className={`relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9 ${isOccupied ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200" : "bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff]"}`}>
                <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: isOccupied ? "#ef4444" : "#fef3b0" }} />
                <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">{isOccupied ? "MASA - DOLU" : "MASA - MÜSAİT"}</div>
                <div>
                  <h4 className="text-[15px] font-bold leading-tight">Masa {t.tableNumber}</h4>
                  <p className="mt-1 text-xs font-bold opacity-50">{isOccupied ? `${t.orders.length} Sipariş aktif` : "Sipariş yok"}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        // Empty State
        <div className="relative flex flex-col justify-between overflow-hidden min-h-38 p-4 pl-7 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-30">SİSTEM</div>
          <div className="mt-2">
            <h4 className="text-[15px] font-bold leading-tight">Masa Bulunamadı</h4>
          </div>
        </div>
      )}
    </div>
  );
}