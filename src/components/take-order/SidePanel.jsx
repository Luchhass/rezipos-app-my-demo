"use client";

import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { useAddOrderToTable, useDeleteOrderItem, useResetTable, useSendOrder, useUpdateOrderItem } from "@/hooks/useTables";

// Payment Method Options
const PAYMENT_METHODS = [
  { id: "cash", label: "CASH", icon: Icons.Banknote },
  { id: "card", label: "CARD", icon: Icons.CreditCard },
  { id: "qr",   label: "QR",   icon: Icons.QrCode },
];

export default function TakeOrderSidePanel({ selectedProducts, setSelectedProducts, selectedTable, setSelectedTable, step, setStep, isTakeOrderModalOpen, setIsTakeOrderModalOpen, wasOccupied, setWasOccupied }) {
  // Order Mutations
  const addOrder = useAddOrderToTable();
  const sendOrder = useSendOrder();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();
  const resetTable = useResetTable();

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // Payment Method State
  const [activeMethod, setActiveMethod] = useState("cash");

  // Derived Occupancy
  const isOccupied = selectedTable?.orders && selectedTable.orders.length > 0;

  // Cart Totals
  const subtotal = selectedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Combined Pending State
  const isPending = addOrder.isPending || sendOrder.isPending || deleteOrderItem.isPending || updateOrderItem.isPending || resetTable.isPending;

  // Button Label
  const buttonLabel = isPending ? "İşleniyor..." : !wasOccupied ? "Siparişi Oluştur" : selectedProducts.length === 0 ? "Siparişi İptal Et" : "Siparişi Güncelle";

  // Auto Close Edit Mode On Empty Cart
  useEffect(() => {
    if (selectedProducts.length === 0 && isEditing) setIsEditing(false);
  }, [selectedProducts, isEditing]);

  // Send Order Handler
  const handleSendOrder = async () => {
    try {
      if (!wasOccupied) {
        for (const item of selectedProducts) {
          await addOrder.mutateAsync({ tableId: selectedTable._id, productId: item._id, quantity: item.quantity });
        }
        await sendOrder.mutateAsync(selectedTable._id);
      } else if (selectedProducts.length === 0) {
        await resetTable.mutateAsync(selectedTable._id);
      } else {
        const originalOrders = selectedTable.orders.filter((o) => o.productId && typeof o.productId === "object");
        for (const original of originalOrders) {
          const current = selectedProducts.find((p) => p.orderId === original._id);
          if (!current) {
            await deleteOrderItem.mutateAsync({ tableId: selectedTable._id, orderId: original._id });
          } else if (current.quantity !== original.quantity) {
            await updateOrderItem.mutateAsync({ tableId: selectedTable._id, orderId: original._id, quantity: current.quantity });
          }
        }
        const newItems = selectedProducts.filter((p) => !p.orderId);
        for (const item of newItems) {
          await addOrder.mutateAsync({ tableId: selectedTable._id, productId: item._id, quantity: item.quantity });
        }
        await sendOrder.mutateAsync(selectedTable._id);
      }
      setSelectedProducts([]);
      setIsTakeOrderModalOpen(false);
      setStep(0);
    } catch (err) {
      console.error("Send order error:", err);
    }
  };

  return (
    <div className={`fixed top-26.25 right-0 z-30 flex flex-col w-full h-[calc(100dvh-105px)] gap-8 py-6 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:w-100 lg:h-screen lg:translate-x-0 lg:py-10 ${isTakeOrderModalOpen ? "translate-x-0" : "translate-x-full"}`}>

      {step === 0 ? (
        // Empty State - No Table Selected
        <div className="flex flex-col flex-1 items-center justify-center space-y-6 text-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d]">
            <Icons.LayoutGrid size={40} className="opacity-20 text-[#121212] dark:text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#121212] dark:text-white">Masa Seçiniz</h3>
            <p className="mx-auto max-w-50 text-sm text-gray-500">Sipariş oluşturmaya başlamak için lütfen soldan bir masa seçin.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-8 min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Mobile Close Button */}
              <button onClick={() => setIsTakeOrderModalOpen(!isTakeOrderModalOpen)} className="p-3 rounded-full bg-[#dddddd] hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527] lg:hidden">
                <Icons.ArrowLeft size={20} className="opacity-60 text-[#121212] dark:text-[#ffffff]" />
              </button>
              <div className="flex flex-col">
                <h2 className="text-[25px] tracking-tight text-[#121212] dark:text-[#ffffff] md:text-[28px] lg:text-[31px]">Masa {selectedTable?.tableNumber}</h2>
                <span className="text-[11px] font-medium opacity-50 text-[#121212] dark:text-[#ffffff] md:text-[14px] lg:text-[16px]">Leslie K.</span>
              </div>
            </div>

            {/* Edit Mode Toggle */}
            <button onClick={() => setIsEditing(!isEditing)} className={`p-3.5 rounded-full ${isEditing ? "bg-red-500 text-white" : "bg-[#dddddd] hover:bg-[#cccccc] dark:bg-[#2d2d2d] dark:hover:bg-[#252527]"}`}>
              {isEditing
                ? <Icons.X size={16} />
                : <Icons.Pencil size={16} className="opacity-60 text-[#121212] dark:text-[#ffffff]" />}
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex flex-col flex-1 gap-3 overflow-y-auto min-h-0">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between p-4 rounded-2xl bg-[#dddddd] animate-in fade-in dark:bg-[#2d2d2d]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-6 h-6">
                      {isEditing ? (
                        // Delete Item Button
                        <button onClick={() => setSelectedProducts((prev) => prev.filter((p) => p._id !== item._id))} className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-90">
                          <Icons.X size={12} strokeWidth={3} />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-[10px] font-bold">{index + 1}</div>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-[14px] font-bold text-[#121212] dark:text-[#ffffff] md:text-[17px]">{item.name}</p>
                      <span className="text-xs font-medium opacity-50 text-[#121212] dark:text-[#ffffff]">x{item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm text-[#121212] dark:text-[#ffffff]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              // Empty Cart State
              <div className="flex flex-col flex-1 items-center justify-center space-y-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full border border-white/5 bg-[#1c1c1e] opacity-40">
                  <Icons.Utensils size={32} strokeWidth={1.5} className="text-gray-400" />
                </div>
                <p className="text-[15px] font-medium text-gray-500">No items added</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-6 p-4 rounded-2xl bg-[#dddddd] shrink-0 dark:bg-[#2d2d2d] md:p-5 lg:p-6">
            {/* Totals And Payment */}
            {wasOccupied && selectedProducts.length > 0 && (
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
                    <span className="text-2xl font-bold tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => setActiveMethod(id)} className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl border ${activeMethod === id ? "border-transparent bg-[#121212] text-white dark:bg-white dark:text-black" : "border-black/10 bg-transparent text-gray-400 dark:border-white/10"}`}>
                        <Icon size={20} />
                        <span className="text-[9px] font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleSendOrder}
              disabled={isPending || (!wasOccupied && selectedProducts.length === 0)}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${!wasOccupied && selectedProducts.length === 0 ? "cursor-not-allowed border border-white/5 bg-[#c8c8c8] text-gray-700 dark:bg-[#222222]" : "bg-white text-black hover:bg-[#cccccc] disabled:opacity-50"}`}
            >
              {!wasOccupied && selectedProducts.length === 0 ? "Place Order" : buttonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}