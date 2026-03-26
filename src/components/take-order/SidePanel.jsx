"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
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
    .sort((a, b) => String(a.productId).localeCompare(String(b.productId)));
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

export default function TakeOrderSidePanel({
  selectedTable,
  setSelectedTable,
  step,
  setStep,
  isTakeOrderModalOpen,
  setIsTakeOrderModalOpen,
  isQuickOrder = false,
}) {
  // ================================
  // TABLE ORDER MUTATIONS
  // ================================
  const sendOrder = useSendOrder();
  const clearTable = useClearTable();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();
  const resetTable = useResetTable();
  const payTable = usePayTable();

  // ================================
  // LOCAL UI STATE
  // ================================
  const [isEditing, setIsEditing] = useState(false);
  const [activeMethod, setActiveMethod] = useState("cash");

  // Success modal state
  // "send" | "update" | "delete" | "pay" | "quick-pay" | null
  const [successModal, setSuccessModal] = useState(null);

  // ================================
  // DERIVED TABLE DATA
  // ================================
  const tableOrders = selectedTable?.orders || [];
  const lastSentOrders = selectedTable?.lastSentOrders || [];

  const hasOrders = tableOrders.length > 0;
  const hasLastSent = lastSentOrders.length > 0;

  // Sipariş son gönderilen haliyle birebir aynı mı
  const isSentSynced =
    hasOrders && hasLastSent && areOrdersEqual(tableOrders, lastSentOrders);

  // Siparişlerin hepsi silinmiş ama reset/iptal henüz onaylanmamış
  const isCancelledState = !hasOrders && hasLastSent;

  // Ürün var ama henüz gönderilmemiş ya da gönderilmiş sipariş üstünde değişiklik yapılmış
  const isDraftOrUpdated = hasOrders && !isSentSynced;

  // Masa tamamen boş
  const isAvailable = !hasOrders && !hasLastSent;

  // ================================
  // TOTALS
  // ================================
  const subtotal = useMemo(() => {
    return tableOrders.reduce((acc, order) => {
      const price = order.productId?.price || 0;
      return acc + price * order.quantity;
    }, 0);
  }, [tableOrders]);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // ================================
  // PENDING STATE
  // ================================
  const isPending =
    sendOrder.isPending ||
    clearTable.isPending ||
    deleteOrderItem.isPending ||
    updateOrderItem.isPending ||
    resetTable.isPending ||
    payTable.isPending;

  // ================================
  // PRIMARY BUTTON LABEL
  // NORMAL MASA:
  // Kırmızı  -> Siparişi Sil
  // Yeşil    -> Ödeme Al
  // Turuncu  -> Siparişi Gönder
  //
  // QUICK ORDER:
  // Ürün varsa -> Siparişi Gönder ve Ödeme Al
  // ================================
  const primaryButtonLabel = isPending
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
    : "Sipariş Yok";

  // ================================
  // PRIMARY BUTTON COLOR
  // Pastel tonlar
  // ================================
  const primaryButtonClass = isQuickOrder
    ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
    : isCancelledState
    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
    : isSentSynced
    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-200 dark:hover:bg-green-900/30"
    : isDraftOrUpdated
    ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/30"
    : "bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]";

  // ================================
  // SECONDARY CLEAR BUTTON
  // orders temizlenir
  // lastSentOrders kalır
  // modal yok
  // ================================
  const showClearButton = tableOrders.length > 0;

  // ================================
  // AUTO CLOSE EDIT MODE
  // Sipariş listesi tamamen boşalırsa edit mode açık kalmasın
  // ================================
  useEffect(() => {
    if (tableOrders.length === 0 && isEditing) {
      setIsEditing(false);
    }
  }, [tableOrders, isEditing]);

  // ================================
  // AUTO CLOSE SUCCESS MODAL
  // 2 saniye sonra kendi kendine kaybolur
  // ================================
  useEffect(() => {
    if (!successModal) return;

    const timeout = setTimeout(() => {
      setSuccessModal(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [successModal]);

  // ================================
  // CHANGE ITEM QUANTITY
  // - quantity 0 altına düşerse item silinir
  // - aksi halde quantity güncellenir
  // ================================
  const handleChangeQuantity = async (orderId, currentQty, delta) => {
    if (!selectedTable?._id) return;

    try {
      const nextQty = currentQty + delta;

      if (nextQty <= 0) {
        await deleteOrderItem.mutateAsync({
          tableId: selectedTable._id,
          orderId,
        });
      } else {
        await updateOrderItem.mutateAsync({
          tableId: selectedTable._id,
          orderId,
          quantity: nextQty,
        });
      }
    } catch (err) {
      console.error("Order item update error:", err);
    }
  };

  // ================================
  // DELETE SINGLE ITEM
  // ================================
  const handleDeleteItem = async (orderId) => {
    if (!selectedTable?._id) return;

    try {
      await deleteOrderItem.mutateAsync({
        tableId: selectedTable._id,
        orderId,
      });
    } catch (err) {
      console.error("Delete order item error:", err);
    }
  };

  // ================================
  // MAIN ACTION BUTTON
  //
  // NORMAL MASA:
  // Kırmızı  -> reset + delete modal
  // Yeşil    -> pay + pay modal
  // Turuncu  -> send + send/update modal
  //
  // QUICK ORDER:
  // Tek buton -> send + pay + quick-pay modal
  // ================================
  const handleMainAction = async () => {
    if (!selectedTable?._id) return;

    try {
      // QUICK ORDER FLOW
      if (isQuickOrder) {
        if (!hasOrders) return;

        await sendOrder.mutateAsync(selectedTable._id);
        await payTable.mutateAsync(selectedTable._id);

        setSuccessModal("quick-pay");
        setIsTakeOrderModalOpen(false);
        setStep(0);
        return;
      }

      // NORMAL TABLE FLOW
      if (isCancelledState) {
        await resetTable.mutateAsync(selectedTable._id);
        setSuccessModal("delete");
      } else if (isSentSynced) {
        await payTable.mutateAsync(selectedTable._id);
        setSuccessModal("pay");
      } else if (isDraftOrUpdated) {
        const isUpdate = hasLastSent;
        await sendOrder.mutateAsync(selectedTable._id);
        setSuccessModal(isUpdate ? "update" : "send");
      }

      setIsTakeOrderModalOpen(false);
      setStep(0);
    } catch (err) {
      console.error("Main action error:", err);
    }
  };

  // ================================
  // CLEAR BUTTON ACTION
  // orders temizlenir
  // lastSentOrders backend'de kalır
  // modal yok
  // ================================
  const handleClearTable = async () => {
    if (!selectedTable?._id || tableOrders.length === 0) return;

    try {
      await clearTable.mutateAsync(selectedTable._id);
    } catch (err) {
      console.error("Clear table error:", err);
    }
  };

  return (
    <>
      {/* Success Send Modal */}
      {successModal === "send" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Sipariş gönderildi!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Sipariş başarıyla gönderildi.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-amber-100 dark:bg-amber-900/20 origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Success Update Modal */}
      {successModal === "update" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Sipariş güncellendi!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Sipariş başarıyla güncellendi.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-amber-100 dark:bg-amber-900/20 origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Success Delete Modal */}
      {successModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
                <CheckCircle2 size={24} className="text-red-700 dark:text-red-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Sipariş silindi!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Sipariş başarıyla kaldırıldı.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-red-100 dark:bg-red-900/20 origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Success Pay Modal */}
      {successModal === "pay" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 size={24} className="text-green-700 dark:text-green-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Ödeme alındı!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Masa başarıyla kapatıldı.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-green-100 dark:bg-green-900/20 origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Success Quick Pay Modal */}
      {successModal === "quick-pay" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20">
                <CheckCircle2 size={24} className="text-amber-700 dark:text-amber-200" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Hızlı sipariş tamamlandı!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Sipariş gönderildi ve ödeme alındı.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-amber-100 dark:bg-amber-900/20 origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      <div
        className={`fixed top-26.25 right-0 z-30 flex flex-col w-full h-[calc(100dvh-105px)] gap-8 py-6 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:w-100 lg:h-screen lg:translate-x-0 lg:py-10 ${
          isTakeOrderModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {step === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center space-y-6 text-center">
            <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d]">
              <Icons.LayoutGrid
                size={40}
                className="opacity-20 text-[#121212] dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#121212] dark:text-white">
                Masa Seçiniz
              </h3>
              <p className="mx-auto max-w-50 text-sm text-gray-500">
                Sipariş oluşturmaya başlamak için lütfen soldan bir masa seçin.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-8 min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setIsTakeOrderModalOpen(!isTakeOrderModalOpen)}
                  className="p-3 rounded-full bg-[#dddddd] hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527] lg:hidden"
                >
                  <Icons.ArrowLeft
                    size={20}
                    className="opacity-60 text-[#121212] dark:text-[#ffffff]"
                  />
                </button>

                <div className="flex flex-col">
                  <h2 className="text-[25px] tracking-tight text-[#121212] dark:text-[#ffffff] md:text-[28px] lg:text-[31px]">
                    Masa {selectedTable?.tableNumber}
                  </h2>
                  <span className="text-[11px] font-medium opacity-50 text-[#121212] dark:text-[#ffffff] md:text-[14px] lg:text-[16px]">
                    {isQuickOrder ? "Hızlı Sipariş" : "Leslie K."}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3.5 rounded-full ${
                  isEditing
                    ? "bg-red-500 text-white"
                    : "bg-[#dddddd] hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527]"
                }`}
              >
                {isEditing ? (
                  <Icons.X size={16} />
                ) : (
                  <Icons.Pencil
                    size={16}
                    className="opacity-60 text-[#121212] dark:text-[#ffffff]"
                  />
                )}
              </button>
            </div>

            {/* Orders List */}
            <div className="flex flex-col flex-1 gap-3 overflow-y-auto min-h-0">
              {tableOrders.length > 0 ? (
                tableOrders.map((order, index) => {
                  const product = order.productId;
                  const name = product?.name || "Ürün";
                  const price = product?.price || 0;

                  return (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#dddddd] animate-in fade-in dark:bg-[#2d2d2d]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-6 h-6">
                          {isEditing ? (
                            <button
                              onClick={() => handleDeleteItem(order._id)}
                              className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-90"
                            >
                              <Icons.X size={12} strokeWidth={3} />
                            </button>
                          ) : (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-[10px] font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-baseline gap-2">
                            <p className="text-[14px] font-bold text-[#121212] dark:text-[#ffffff] md:text-[17px]">
                              {name}
                            </p>
                            <span className="text-xs font-medium opacity-50 text-[#121212] dark:text-[#ffffff]">
                              x{order.quantity}
                            </span>
                          </div>

                          {isEditing && (
                            <div className="flex items-center gap-2 text-black dark:text-white">
                              <button
                                onClick={() =>
                                  handleChangeQuantity(order._id, order.quantity, -1)
                                }
                                className="flex items-center justify-center w-7 h-7 rounded-[10px] border border-black/20 dark:border-white/20 transition-all active:scale-90"
                              >
                                −
                              </button>

                              <span className="w-4 text-sm font-bold text-center">
                                {order.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  handleChangeQuantity(order._id, order.quantity, 1)
                                }
                                className="flex items-center justify-center w-7 h-7 rounded-[10px] border border-black/20 dark:border-white/20 transition-all active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-sm text-[#121212] dark:text-[#ffffff]">
                        ${(price * order.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full border border-white/5 bg-[#1c1c1e] opacity-40">
                    <Icons.Utensils
                      size={32}
                      strokeWidth={1.5}
                      className="text-gray-400"
                    />
                  </div>

                  <p className="text-[15px] font-medium text-gray-500">
                    {isCancelledState
                      ? "Sipariş iptal edilmeyi bekliyor"
                      : "No items added"}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-6 p-4 rounded-2xl bg-[#dddddd] shrink-0 dark:bg-[#2d2d2d] md:p-5 lg:p-6">
              {tableOrders.length > 0 && (
                <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Tax 10%</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-baseline justify-between text-black dark:text-white">
                      <span className="text-xl">Total</span>
                      <span className="text-2xl font-bold tracking-tight">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {!isQuickOrder && isSentSynced && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        Payment Method
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => setActiveMethod(id)}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border ${
                              activeMethod === id
                                ? "border-transparent bg-[#121212] text-white dark:bg-white dark:text-black"
                                : "border-black/10 bg-transparent text-gray-400 dark:border-white/10"
                            }`}
                          >
                            <Icon size={20} />
                            <span className="text-[9px] font-bold">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clear button */}
              {showClearButton && (
                <button
                  onClick={handleClearTable}
                  disabled={isPending}
                  className="w-full py-4 rounded-2xl text-lg font-bold transition-all bg-[#e5e7eb] text-[#121212] hover:bg-[#d9dce1] disabled:opacity-50 dark:bg-[#3a3a3a] dark:text-white dark:hover:bg-[#4a4a4a]"
                >
                  {clearTable.isPending ? "Temizleniyor..." : "Temizle"}
                </button>
              )}

              {/* Main action button */}
              <button
                onClick={handleMainAction}
                disabled={isPending || (isQuickOrder ? !hasOrders : isAvailable)}
                className={`w-full py-4 rounded-2xl text-lg font-bold transition-all disabled:opacity-50 ${
                  isQuickOrder
                    ? hasOrders
                      ? primaryButtonClass
                      : "cursor-not-allowed border border-white/5 bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]"
                    : isAvailable
                    ? "cursor-not-allowed border border-white/5 bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]"
                    : primaryButtonClass
                }`}
              >
                {primaryButtonLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}