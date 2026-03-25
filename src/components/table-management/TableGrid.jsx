"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useTables, useDeleteTable } from "@/hooks/useTables";

// Normalize order list for safe comparison
// Amaç: orders ve lastSentOrders dizilerini aynı yapıya çevirip güvenli kıyaslamak
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
    .sort((a, b) =>
      String(a.productId).localeCompare(String(b.productId))
    );
};

// Compare two order arrays deeply
// Aynı ürün + aynı miktar kombinasyonları varsa true döner
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
  // ================================
  // TABLE DATA
  // ================================
  const { data: tables = [], isLoading } = useTables();
  const deleteTable = useDeleteTable();

  // ================================
  // FILTERED TABLES
  // Alan ve status filtresine göre liste hazırlanır
  // occupied = aktif veya gönderilmiş sipariş izi olan masa
  // available = tamamen boş masa
  // ================================
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

  // ================================
  // TABLE CLICK HANDLER
  // Take order page'de masa seçer
  // Table management page'de modal açabilir
  // ================================
  const handleTableClick = (table) => {
    if (onTableClick) onTableClick(table);
    if (setSelectedTable) setSelectedTable(table._id);
    if (setSelectedProducts) setSelectedProducts([]);
    if (setStep) setStep(1);
  };

  return (
    <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl animate-pulse bg-[#dddddd] dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9"
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#f4efc4] dark:bg-[#fef3b0]/20" />
            <div className="w-16 h-2 mb-5 rounded-full bg-black/5 dark:bg-white/5" />
            <div className="mt-2">
              <div className="w-24 h-4 mb-2 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="w-12 h-3 rounded-full bg-black/5 dark:bg-white/5" />
            </div>
          </div>
        ))
      ) : filteredTables.length > 0 ? (
        filteredTables.map((table) => {
          // ================================
          // DERIVED TABLE STATE
          // ================================
          const orders = table.orders || [];
          const lastSentOrders = table.lastSentOrders || [];

          const hasOrders = orders.length > 0;
          const hasLastSent = lastSentOrders.length > 0;

          // Masa üzerindeki current orders, son gönderilen siparişle birebir aynı mı
          const isSynced =
            hasOrders &&
            hasLastSent &&
            areOrdersEqual(orders, lastSentOrders);

          // ================================
          // VISUAL STATE MAPPING
          // ================================
          const isAvailable = !hasOrders && !hasLastSent; // sarı / default
          const isSent = isSynced; // yeşil
          const isCancelled = !hasOrders && hasLastSent; // kırmızı
          const isDraftOrUpdated = hasOrders && !isSynced; // turuncu

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
              {/* Delete badge only in table management delete mode */}
              {activeAction === "delete-table" && (
                <div
                  className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable.mutate(table._id);
                  }}
                >
                  <Icons.Minus size={18} strokeWidth={3} />
                </div>
              )}

              <div
                className={`relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9 ${cardClass}`}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: stripeColor }}
                />

                <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                  {label}
                </div>

                <div>
                  <h4 className="text-[15px] font-bold leading-tight">
                    Masa {table.tableNumber}
                  </h4>
                  <p className="mt-1 text-xs font-bold opacity-50">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          );
        })
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
        </div>
      )}
    </div>
  );
}
