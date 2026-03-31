"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";

const PAYMENT_METHODS = [
  { id: "cash", label: "CASH", icon: Icons.Banknote },
  { id: "card", label: "CARD", icon: Icons.CreditCard },
  { id: "qr", label: "QR", icon: Icons.QrCode },
];

export default function PaymentModal({
  open,
  onClose,
  selectedTable,
  activeMethod,
  setActiveMethod,
  onConfirmFullPayment,
  isPending = false,
}) {
  const tableOrders = selectedTable?.orders || [];
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  useEffect(() => {
    if (!open) {
      setSelectedOrderIds([]);
      return;
    }

    setSelectedOrderIds([]);
  }, [open, selectedTable?._id]);

  const selectedOrders = useMemo(() => {
    return tableOrders.filter((order) => selectedOrderIds.includes(order._id));
  }, [tableOrders, selectedOrderIds]);

  const total = useMemo(() => {
    return selectedOrders.reduce((acc, order) => {
      const price = order.productId?.price || 0;
      return acc + price * order.quantity;
    }, 0);
  }, [selectedOrders]);

  const isAllSelected = tableOrders.length > 0 && selectedOrderIds.length === tableOrders.length;
  const hasSelection = selectedOrderIds.length > 0;

  const toggleOrder = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds([]);
      return;
    }

    setSelectedOrderIds(tableOrders.map((order) => order._id));
  };

  const handleConfirm = () => {
    if (!hasSelection) return;
    onConfirmFullPayment();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-8 py-3 backdrop-blur-sm md:px-6">
      <div className="flex h-[calc(100dvh-24px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 md:h-auto md:max-h-[90vh] dark:bg-[#1a1a1a]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between bg-[#a5b4fc] px-5 py-4 text-white md:px-8 md:py-5">
          <div className="min-w-0">
            <h3 className="text-lg font-bold md:text-2xl">Ödeme Al</h3>
            <p className="mt-1 pr-4 text-xs text-white/80 md:text-sm">
              Masa {selectedTable?.tableNumber} için ödenecek ürünleri seç.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isPending}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 transition-all hover:bg-white/20 disabled:opacity-50 md:h-11 md:w-11"
          >
            <Icons.X size={18} className="text-white md:hidden" />
            <Icons.X size={20} className="hidden text-white md:block" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:p-8">
            {/* Left */}
            <div className="flex min-h-0 flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-[#121212] opacity-50 dark:text-white">
                    Ürünler
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">Ödenecekleri seç</p>
                </div>

                <button
                  onClick={handleSelectAll}
                  disabled={tableOrders.length === 0}
                  className="shrink-0 rounded-2xl bg-[#dddddd] px-3 py-2 text-xs font-bold text-[#121212] transition-all hover:bg-[#d2d2d2] disabled:opacity-50 dark:bg-[#2d2d2d] dark:text-white dark:hover:bg-[#252527]"
                >
                  {isAllSelected ? "Seçimi Temizle" : "Tümünü Seç"}
                </button>
              </div>

              <div className="rounded-2xl bg-[#f3f3f3] p-3 dark:bg-[#111315] md:max-h-105 md:overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {tableOrders.map((order, index) => {
                    const product = order.productId;
                    const name = product?.name || "Ürün";
                    const price = product?.price || 0;
                    const isSelected = selectedOrderIds.includes(order._id);

                    return (
                      <button
                        key={order._id}
                        type="button"
                        onClick={() => toggleOrder(order._id)}
                        className={`flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all md:p-4 ${
                          isSelected
                            ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100"
                            : "bg-white text-[#121212] hover:bg-[#f7f7f7] dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#202224]"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3 md:gap-4">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? "bg-green-600 text-white"
                                : "bg-[#121212] text-white dark:bg-white dark:text-black"
                            }`}
                          >
                            {isSelected ? <Icons.Check size={14} /> : index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold md:text-base">{name}</p>
                            <p className="mt-1 text-xs opacity-60">
                              {order.quantity} adet × ${price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="ml-3 shrink-0 text-sm font-bold md:text-base">
                          ${(price * order.quantity).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4 rounded-2xl bg-[#f3f3f3] p-4 dark:bg-[#111315] md:p-5">
              {/* Payment Methods */}
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Payment Method
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveMethod(id)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 transition-all md:py-3.5 ${
                        activeMethod === id
                          ? "border-transparent bg-[#121212] text-white dark:bg-white dark:text-black"
                          : "border-black/10 bg-white text-gray-500 hover:bg-[#f8f8f8] dark:border-white/10 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:bg-[#202224]"
                      }`}
                    >
                      <Icon size={18} className="md:hidden" />
                      <Icon size={20} className="hidden md:block" />
                      <span className="text-[9px] font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl bg-white p-4 dark:bg-[#1a1a1a]">
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">Özet</p>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Seçilen Ürün</span>
                    <span>{selectedOrderIds.length}</span>
                  </div>

                  <div className="border-t border-black/10 pt-4 dark:border-white/10">
                    <div className="flex items-baseline justify-between text-black dark:text-white">
                      <span className="text-lg md:text-xl">Toplam</span>
                      <span className="text-2xl font-bold tracking-tight md:text-3xl">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={isPending || !hasSelection}
                  className="w-full rounded-2xl bg-green-100 py-4 text-base font-bold text-green-700 transition-all hover:bg-green-200 disabled:opacity-50 md:text-lg dark:bg-green-900/20 dark:text-green-200 dark:hover:bg-green-900/30"
                >
                  {isPending ? "İşleniyor..." : "Ödeme Al"}
                </button>

                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="w-full rounded-2xl bg-[#dddddd] py-4 text-base font-bold text-[#121212] transition-all hover:bg-[#d2d2d2] disabled:opacity-50 md:text-lg dark:bg-[#2d2d2d] dark:text-white dark:hover:bg-[#252527]"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}