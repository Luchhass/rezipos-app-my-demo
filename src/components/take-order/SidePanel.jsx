"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import PaymentModal from "@/components/take-order/PaymentModal";
import {
  useClearTable,
  useDeleteOrderItem,
  usePayTable,
  useResetTable,
  useSendOrder,
  useUpdateOrderItem,
} from "@/hooks/useTables";

// Payment Method Options
const PAYMENT_METHODS = [
  { id: "cash", label: "CASH", icon: Icons.Banknote },
  { id: "card", label: "CARD", icon: Icons.CreditCard },
  { id: "qr", label: "QR", icon: Icons.QrCode },
];

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

export default function TakeOrderSidePanel({
  selectedTable,
  setSelectedTable,
  step,
  setStep,
  isTakeOrderModalOpen,
  setIsTakeOrderModalOpen,
  isQuickOrder = false,
}) {
  // Table Mutations
  const sendOrder = useSendOrder();
  const clearTable = useClearTable();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();
  const resetTable = useResetTable();
  const payTable = usePayTable();

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [activeMethod, setActiveMethod] = useState("cash");
  const [successModal, setSuccessModal] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Order State
  const tableOrders = selectedTable?.orders || [];
  const lastSentOrders = selectedTable?.lastSentOrders || [];

  const hasOrders = tableOrders.length > 0;
  const hasLastSent = lastSentOrders.length > 0;

  const isSentSynced = hasOrders && hasLastSent && areOrdersEqual(tableOrders, lastSentOrders);
  const isCancelledState = !hasOrders && hasLastSent;
  const isDraftOrUpdated = hasOrders && !isSentSynced;
  const isAvailable = !hasOrders && !hasLastSent;

  // Total
  const total = useMemo(() => {
    return tableOrders.reduce((acc, order) => {
      const price = order.productId?.price || 0;
      return acc + price * order.quantity;
    }, 0);
  }, [tableOrders]);

  // Pending State
  const isPending =
    sendOrder.isPending ||
    clearTable.isPending ||
    deleteOrderItem.isPending ||
    updateOrderItem.isPending ||
    resetTable.isPending ||
    payTable.isPending;

  // Clear Button State
  const showClearButton = tableOrders.length > 0;

  // Auto Close Edit Mode
  useEffect(() => {
    if (tableOrders.length === 0 && isEditing) {
      setIsEditing(false);
    }
  }, [tableOrders, isEditing]);

  // Auto Close Success Modal
  useEffect(() => {
    if (!successModal) return;

    const timeout = setTimeout(() => {
      setSuccessModal(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [successModal]);

  // Close Payment Modal On Table Change
  useEffect(() => {
    setIsPaymentModalOpen(false);
  }, [selectedTable?._id]);

  // Delete Single Item
  const handleDeleteItem = async (orderId) => {
    if (!selectedTable?._id) return;

    try {
      await deleteOrderItem.mutateAsync({ tableId: selectedTable._id, orderId });
    } catch (error) {
      console.error("Delete order item error:", error);
    }
  };

  // Confirm Full Payment From Modal
  const handleConfirmFullPayment = async () => {
    if (!selectedTable?._id) return;

    try {
      if (isQuickOrder) {
        await sendOrder.mutateAsync(selectedTable._id);
        await payTable.mutateAsync(selectedTable._id);

        setIsPaymentModalOpen(false);
        setSuccessModal("quick-pay");
        setIsTakeOrderModalOpen(false);
        setStep(1);
        return;
      }

      await payTable.mutateAsync(selectedTable._id);
      setIsPaymentModalOpen(false);
      setSuccessModal("pay");
      setIsTakeOrderModalOpen(false);
      setStep(0);
    } catch (error) {
      console.error("Full payment error:", error);
    }
  };

  // Main Action
  const handleMainAction = async () => {
    if (!selectedTable?._id) return;

    try {
      if (isQuickOrder) {
        if (!hasOrders) return;

        setIsPaymentModalOpen(true);
        return;
      }

      if (isCancelledState) {
        await resetTable.mutateAsync(selectedTable._id);
        setSuccessModal("delete");
      } else if (isSentSynced) {
        setIsPaymentModalOpen(true);
        return;
      } else if (isDraftOrUpdated) {
        await sendOrder.mutateAsync(selectedTable._id);
        setSuccessModal(hasLastSent ? "update" : "send");
      }

      setIsTakeOrderModalOpen(false);
      setStep(0);
    } catch (error) {
      console.error("Main action error:", error);
    }
  };



  // Clear Table
  const handleClearTable = async () => {
    if (!selectedTable?._id || tableOrders.length === 0) return;

    try {
      await clearTable.mutateAsync(selectedTable._id);
    } catch (error) {
      console.error("Clear table error:", error);
    }
  };

  return (
    <>
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedTable={selectedTable}
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
        onConfirmFullPayment={handleConfirmFullPayment}
        isPending={isPending}
      />

      {/* Send Success Modal */}
      {successModal === "send" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Sipariş gönderildi!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Sipariş başarıyla gönderildi.</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="origin-left h-full bg-amber-100 dark:bg-amber-900/20" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Update Success Modal */}
      {successModal === "update" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Sipariş güncellendi!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Sipariş başarıyla güncellendi.</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="origin-left h-full bg-amber-100 dark:bg-amber-900/20" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {successModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <CheckCircle2 size={24} className="text-red-700 dark:text-red-200" />
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Sipariş silindi!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Sipariş başarıyla kaldırıldı.</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="origin-left h-full bg-red-100 dark:bg-red-900/20" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Pay Success Modal */}
      {successModal === "pay" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 size={24} className="text-green-700 dark:text-green-200" />
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Ödeme alındı!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Masa başarıyla kapatıldı.</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="origin-left h-full bg-green-100 dark:bg-green-900/20" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Quick Pay Success Modal */}
      {successModal === "quick-pay" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Hızlı sipariş tamamlandı!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Sipariş gönderildi ve ödeme alındı.</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="origin-left h-full bg-amber-100 dark:bg-amber-900/20" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-26.25 right-0 z-30 flex h-[calc(100dvh-105px)] w-full flex-col gap-8 border-l border-[#dddddd] bg-[#f3f3f3] px-8 py-6 dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:h-screen lg:w-100 lg:translate-x-0 lg:py-10 ${
          isTakeOrderModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {step === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d]">
              <Icons.LayoutGrid size={40} className="text-[#121212] opacity-20 dark:text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#121212] dark:text-white">Masa Seçiniz</h3>
              <p className="mx-auto max-w-50 text-sm text-gray-500">Sipariş oluşturmaya başlamak için lütfen soldan bir masa seçin.</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 md:gap-6 lg:gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setIsTakeOrderModalOpen(!isTakeOrderModalOpen)}
                  className="rounded-full bg-[#dddddd] p-3 hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527] lg:hidden"
                >
                  <Icons.ArrowLeft size={20} className="text-[#121212] opacity-60 dark:text-white" />
                </button>

                <div className="flex flex-col">
                  <h2 className="text-[25px] tracking-tight text-[#121212] dark:text-white md:text-[28px] lg:text-[31px]">
                    {isQuickOrder ? "Hızlı Sipariş" : `Masa ${selectedTable?.tableNumber}`}
                  </h2>

                  <span className="text-[11px] font-medium text-[#121212] opacity-50 dark:text-white md:text-[14px] lg:text-[16px]">
                    {isQuickOrder ? `Kasa Slotu ${selectedTable?.tableNumber}` : "Leslie K."}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditing && tableOrders.length > 0 && (
                  <button
                    onClick={handleClearTable}
                    disabled={isPending}
                    className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 transition-all hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
                  >
                    {clearTable.isPending ? "Temizleniyor..." : "Tümünü Temizle"}
                  </button>
                )}

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`rounded-full p-3.5 ${isEditing ? "bg-red-500 text-white" : "bg-[#dddddd] hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527]"}`}
                >
                  {isEditing ? <Icons.X size={16} /> : <Icons.Pencil size={16} className="text-[#121212] opacity-60 dark:text-white" />}
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
              {tableOrders.length > 0 ? (
                tableOrders.map((order, index) => {
                  const product = order.productId;
                  const name = product?.name || "Ürün";
                  const price = product?.price || 0;

                  return (
                    <div key={order._id} className="flex items-center justify-between rounded-2xl bg-[#dddddd] p-4 animate-in fade-in dark:bg-[#2d2d2d]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-6 w-6 items-center justify-center">
                          {isEditing ? (
                            <button
                              onClick={() => handleDeleteItem(order._id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-90"
                            >
                              <Icons.X size={12} strokeWidth={3} />
                            </button>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[14px] font-bold text-[#121212] dark:text-white md:text-[17px]">{name}</p>
                            <span className="text-xs font-medium text-[#121212] opacity-50 dark:text-white">x{order.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-sm text-[#121212] dark:text-white">${(price * order.quantity).toFixed(2)}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/5 bg-[#1c1c1e] opacity-40">
                    <Icons.Utensils size={32} strokeWidth={1.5} className="text-gray-400" />
                  </div>

                  <p className="text-[15px] font-medium text-gray-500">
                    {isCancelledState ? "Sipariş iptal edilmeyi bekliyor" : "No items added"}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 rounded-2xl bg-[#dddddd] p-4 dark:bg-[#2d2d2d] md:p-5 lg:p-6">
              <div className="flex flex-col gap-6">
                {tableOrders.length > 0 && (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
                    <div className="flex items-baseline justify-between text-black dark:text-white">
                      <span className="text-xl">Total</span>
                      <span className="text-2xl font-bold tracking-tight">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Main Action Button */}
                <button
                  onClick={handleMainAction}
                  disabled={isPending || (isQuickOrder ? !hasOrders : isAvailable)}
                  className={`w-full rounded-2xl py-4 text-lg font-bold transition-all disabled:opacity-50 ${
                    isQuickOrder
                      ? hasOrders
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
                        : "cursor-not-allowed border border-white/5 bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]"
                      : isCancelledState
                      ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
                      : isSentSynced
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-200 dark:hover:bg-green-900/30"
                      : isDraftOrUpdated
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
                      : "cursor-not-allowed border border-white/5 bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]"
                  }`}
                >
                  {isPending
                    ? "İşleniyor..."
                    : isQuickOrder
                    ? hasOrders
                      ? "Siparişi Gönder ve Ödeme Al"
                      : "Sipariş Yok"
                    : isCancelledState
                    ? "Siparişi Sil"
                    : isSentSynced
                    ? "Ödeme Al"
                    : isDraftOrUpdated
                    ? "Siparişi Gönder"
                    : "Sipariş Yok"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}