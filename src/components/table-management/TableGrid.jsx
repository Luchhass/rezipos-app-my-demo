"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useTables, useDeleteTable } from "@/hooks/useTables";
import { useUISettings } from "@/contexts/UISettingsContext";

// Normalize order list for safe comparison
const normalizeOrders = (orders = []) => {
  return [...orders]
    .map((order) => ({
      productId:
        typeof order.productId === "object"
          ? order.productId?._id
          : order.productId,
      quantity: order.quantity,
    }))
    .filter((item) => item.productId)
    .sort((a, b) => String(a.productId).localeCompare(String(b.productId)));
};

// Compare two order arrays deeply
const areOrdersEqual = (ordersA = [], ordersB = []) => {
  const a = normalizeOrders(ordersA);
  const b = normalizeOrders(ordersB);

  if (a.length !== b.length) return false;

  return a.every((item, index) => {
    return (
      item.productId === b[index].productId &&
      item.quantity === b[index].quantity
    );
  });
};

export default function TableGrid({
  selectedArea,
  statusFilter,
  activeAction,
  setSelectedTable,
  setSelectedProducts,
  setStep,
  onTableClick,
}) {
  const { data: tables = [], isLoading } = useTables();
  const deleteTable = useDeleteTable();
  const { ordersViewMode } = useUISettings();

  const isListMode = ordersViewMode === "list";

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const tableAreaId =
        typeof table.areaId === "object"
          ? table.areaId?._id
          : table.areaId;

      const areaMatch = selectedArea ? tableAreaId === selectedArea : true;

      const hasOrders = (table.orders || []).length > 0;
      const hasLastSent = (table.lastSentOrders || []).length > 0;
      const isOccupied = hasOrders || hasLastSent;

      const statusMatch =
        statusFilter === "all"
          ? true
          : statusFilter === "occupied"
          ? isOccupied
          : statusFilter === "available"
          ? !isOccupied
          : true;

      return areaMatch && statusMatch;
    });
  }, [tables, selectedArea, statusFilter]);

  const handleTableClick = (table) => {
    if (onTableClick) onTableClick(table);
    if (setSelectedTable) setSelectedTable(table._id);
    if (setSelectedProducts) setSelectedProducts([]);
    if (setStep) setStep(1);
  };

  const wrapperClassName = isListMode
    ? "grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
    : "grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]";

  const cardClassName = isListMode
    ? "relative flex items-center gap-4 overflow-hidden min-h-22 px-4 py-3 pl-6 rounded-2xl md:px-5 md:py-3.5 md:pl-7"
    : "relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9";

  return (
    <div className={wrapperClassName}>
      {isLoading ? (
        [...Array(isListMode ? 6 : 5)].map((_, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl animate-pulse ${
              isListMode
                ? "flex items-center gap-4 min-h-22 px-4 py-3 pl-6 bg-[#dddddd] dark:bg-[#2d2d2d] md:px-5 md:py-3.5 md:pl-7"
                : "flex flex-col min-h-38 p-4 pl-7 bg-[#dddddd] dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9"
            }`}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#f4efc4] dark:bg-[#fef3b0]/20" />

            {isListMode ? (
              <>
                <div className="flex-1 min-w-0">
                  <div className="w-18 h-2 rounded-full bg-black/5 dark:bg-white/5 mb-3" />
                  <div className="w-28 h-4 rounded-lg bg-black/5 dark:bg-white/5 mb-2" />
                  <div className="w-20 h-3 rounded-full bg-black/5 dark:bg-white/5" />
                </div>
                <span className="w-17 h-8 shrink-0" />
              </>
            ) : (
              <>
                <div className="w-16 h-2 rounded-full bg-black/5 dark:bg-white/5 mb-5" />
                <div className="mt-2">
                  <div className="w-24 h-4 mb-2 rounded-lg bg-black/5 dark:bg-white/5" />
                  <div className="w-12 h-3 rounded-full bg-black/5 dark:bg-white/5" />
                </div>
                <span />
              </>
            )}
          </div>
        ))
      ) : filteredTables.length > 0 ? (
        filteredTables.map((table) => {
          const orders = table.orders || [];
          const lastSentOrders = table.lastSentOrders || [];

          const hasOrders = orders.length > 0;
          const hasLastSent = lastSentOrders.length > 0;

          const isSynced =
            hasOrders &&
            hasLastSent &&
            areOrdersEqual(orders, lastSentOrders);

          const isSent = isSynced;
          const isCancelled = !hasOrders && hasLastSent;
          const isDraftOrUpdated = hasOrders && !isSynced;

          const cardClass = isCancelled
            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
            : isSent
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
            : isDraftOrUpdated
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
            : "bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff]";

          const stripeColor = isCancelled
            ? "#ef4444"
            : isSent
            ? "#10b981"
            : isDraftOrUpdated
            ? "#f59e0b"
            : "#fef3b0";

          const label = isCancelled
            ? "MASA - İPTAL BEKLİYOR"
            : isSent
            ? "MASA - GÖNDERİLDİ"
            : isDraftOrUpdated
            ? "MASA - GÖNDERİLMEYİ BEKLİYOR"
            : "MASA - MÜSAİT";

          const description = isCancelled
            ? "Ürünler silindi, iptal bekliyor"
            : isSent
            ? `${orders.length} sipariş gönderildi`
            : isDraftOrUpdated
            ? `${orders.length} sipariş bekliyor`
            : "Sipariş yok";

          return (
            <div
              key={table._id}
              className="relative cursor-pointer"
              onClick={() => handleTableClick(table)}
            >
              {activeAction === "delete-table" && (
                <div
                  className={`absolute z-10 flex items-center justify-center rounded-full bg-red-500 text-white cursor-pointer hover:scale-110 ${
                    isListMode
                      ? "-top-2 -right-2 w-6 h-6"
                      : "-top-3 -right-3 w-8 h-8"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable.mutate(table._id);
                  }}
                >
                  <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                </div>
              )}

              <div className={`${cardClassName} ${cardClass}`}>
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: stripeColor }}
                />

                {isListMode ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30 truncate">
                        {label}
                      </div>

                      <h4 className="text-[14px] md:text-[15px] font-bold leading-tight line-clamp-2">
                        Masa {table.tableNumber}
                      </h4>

                      <p className="mt-1 text-[11px] md:text-xs font-bold opacity-50">
                        {description}
                      </p>
                    </div>

                    <span className="w-17 h-8 shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                      {label}
                    </div>

                    <div className="mb-auto">
                      <h4 className="text-[15px] font-bold leading-tight">
                        Masa {table.tableNumber}
                      </h4>
                      <p className="mt-1 text-xs font-bold opacity-50">
                        {description}
                      </p>
                    </div>

                    <span className="h-8" />
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : isListMode ? (
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative flex items-center gap-4 overflow-hidden min-h-22 px-4 py-3 pl-6 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:px-5 md:py-3.5 md:pl-7"
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30">
                SİSTEM
              </div>
              <h4 className="text-[14px] md:text-[15px] font-bold leading-tight">
                {i === 0 ? "Masa Bulunamadı" : "—"}
              </h4>
            </div>
            <span className="w-17 h-8 shrink-0" />
          </div>
        ))
      ) : (
        <div className="relative flex flex-col justify-between overflow-hidden min-h-38 p-4 pl-7 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-30">
            SİSTEM
          </div>
          <div className="mt-2">
            <h4 className="text-[15px] font-bold leading-tight">
              Masa Bulunamadı
            </h4>
          </div>
          <span />
          <span />
        </div>
      )}
    </div>
  );
}