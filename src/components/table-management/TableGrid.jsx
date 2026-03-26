"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useTables, useDeleteTable } from "@/hooks/useTables";
import { useUISettings } from "@/contexts/UISettingsContext";

// Quick Order Area Name
const QUICK_ORDER_AREA_NAME = "Hızlı Sipariş";

// Normalize Orders
const normalizeOrders = (orders = []) => {
  return [...orders]
    .map((order) => ({
      productId: typeof order.productId === "object" ? order.productId?._id : order.productId,
      quantity: order.quantity,
    }))
    .filter((item) => item.productId)
    .sort((a, b) => String(a.productId).localeCompare(String(b.productId)));
};

// Compare Orders
const areOrdersEqual = (ordersA = [], ordersB = []) => {
  const a = normalizeOrders(ordersA);
  const b = normalizeOrders(ordersB);

  if (a.length !== b.length) return false;

  return a.every((item, index) => item.productId === b[index].productId && item.quantity === b[index].quantity);
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
  // Table Data
  const { data: tables = [], isLoading } = useTables();
  const deleteTable = useDeleteTable();
  const { ordersViewMode } = useUISettings();

  // View Mode
  const isListMode = ordersViewMode === "list";

  // Filtered Tables
  const filteredTables = useMemo(
    () =>
      tables.filter((table) => {
        const areaName = typeof table.areaId === "object" ? table.areaId?.name : null;
        if (areaName === QUICK_ORDER_AREA_NAME) return false;

        const areaMatch = selectedArea
          ? (typeof table.areaId === "object" ? table.areaId?._id : table.areaId) === selectedArea
          : true;

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
      }),
    [tables, selectedArea, statusFilter]
  );

  // Handle Table Click
  const handleTableClick = (table) => {
    if (onTableClick) onTableClick(table);
    if (setSelectedTable) setSelectedTable(table._id);
    if (setSelectedProducts) setSelectedProducts([]);
    if (setStep) setStep(1);
  };

  return (
    <div
      className={
        isListMode
          ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          : "grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
      }
    >
      {isLoading ? (
        [...Array(isListMode ? 6 : 5)].map((_, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d] ${
              isListMode
                ? "flex min-h-22 items-center gap-4 px-4 py-3 pl-6 md:px-5 md:py-3.5 md:pl-7"
                : "flex min-h-38 flex-col p-4 pl-7 md:p-5 md:pl-8 lg:p-6 lg:pl-9"
            }`}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#f4efc4] dark:bg-[#fef3b0]/20" />

            {isListMode ? (
              <div className="min-w-0 flex-1">
                <div className="mb-3 h-2 w-20 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="mb-2 h-4 w-24 rounded-lg bg-black/5 dark:bg-white/5" />
                <div className="h-3 w-20 rounded-full bg-black/5 dark:bg-white/5" />
              </div>
            ) : (
              <>
                <div className="mb-5 h-2 w-16 rounded-full bg-black/5 dark:bg-white/5" />
                <div className="mt-2">
                  <div className="mb-2 h-4 w-24 rounded-lg bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-12 rounded-full bg-black/5 dark:bg-white/5" />
                </div>
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
          const isSynced = hasOrders && hasLastSent && areOrdersEqual(orders, lastSentOrders);

          const isAvailable = !hasOrders && !hasLastSent;
          const isSent = isSynced;
          const isCancelled = !hasOrders && hasLastSent;
          const isDraftOrUpdated = hasOrders && !isSynced;

          return (
            <div key={table._id} onClick={() => handleTableClick(table)} className="relative cursor-pointer">
              {/* Delete Badge */}
              {activeAction === "delete-table" && (
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteTable.mutate(table._id);
                  }}
                  className={`absolute z-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 ${
                    isListMode ? "-top-2 -right-2 h-6 w-6" : "-top-3 -right-3 h-8 w-8"
                  }`}
                >
                  <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                </div>
              )}

              {/* Table Card */}
              <div
                className={`relative overflow-hidden rounded-2xl ${
                  isListMode
                    ? "flex min-h-22 items-center gap-4 px-4 py-3 pl-6 md:px-5 md:py-3.5 md:pl-7"
                    : "flex min-h-38 flex-col p-4 pl-7 md:p-5 md:pl-8 lg:p-6 lg:pl-9"
                } ${
                  isCancelled
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                    : isSent
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
                      : isDraftOrUpdated
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
                        : "bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white"
                }`}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{
                    backgroundColor: isCancelled
                      ? "#ef4444"
                      : isSent
                        ? "#10b981"
                        : isDraftOrUpdated
                          ? "#f59e0b"
                          : "#fef3b0",
                  }}
                />

                {isListMode ? (
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30">
                      {isCancelled
                        ? "Masa - İptal Bekliyor"
                        : isSent
                          ? "Masa - Gönderildi"
                          : isDraftOrUpdated
                            ? "Masa - Gönderilmeyi Bekliyor"
                            : "Masa - Müsait"}
                    </div>

                    <h4 className="text-[14px] font-bold leading-tight md:text-[15px]">Masa {table.tableNumber}</h4>
                    <p className="mt-1 text-[11px] font-bold opacity-50 md:text-xs">
                      {isCancelled
                        ? "Ürünler silindi, iptal bekliyor"
                        : isSent
                          ? `${orders.length} sipariş gönderildi`
                          : isDraftOrUpdated
                            ? `${orders.length} sipariş bekliyor`
                            : "Sipariş yok"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                      {isCancelled
                        ? "Masa - İptal Bekliyor"
                        : isSent
                          ? "Masa - Gönderildi"
                          : isDraftOrUpdated
                            ? "Masa - Gönderilmeyi Bekliyor"
                            : "Masa - Müsait"}
                    </div>

                    <div>
                      <h4 className="text-[15px] font-bold leading-tight">Masa {table.tableNumber}</h4>
                      <p className="mt-1 text-xs font-bold opacity-50">
                        {isCancelled
                          ? "Ürünler silindi, iptal bekliyor"
                          : isSent
                            ? `${orders.length} sipariş gönderildi`
                            : isDraftOrUpdated
                              ? `${orders.length} sipariş bekliyor`
                              : "Sipariş yok"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : isListMode ? (
        [...Array(3)].map((_, index) => (
          <div
            key={index}
            className="relative flex min-h-22 items-center gap-4 overflow-hidden rounded-2xl bg-[#dddddd] px-4 py-3 pl-6 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:px-5 md:py-3.5 md:pl-7"
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />

            <div className="min-w-0 flex-1">
              <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30">Sistem</div>
              <h4 className="text-[14px] font-bold leading-tight md:text-[15px]">
                {index === 0 ? "Masa Bulunamadı" : "—"}
              </h4>
            </div>
          </div>
        ))
      ) : (
        <div className="relative flex min-h-38 flex-col justify-between overflow-hidden rounded-2xl bg-[#dddddd] p-4 pl-7 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-30">Sistem</div>

          <div className="mt-2">
            <h4 className="text-[15px] font-bold leading-tight">Masa Bulunamadı</h4>
          </div>
        </div>
      )}
    </div>
  );
}