"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useAddOrderToTable, useDeleteOrderItem, useUpdateOrderItem } from "@/hooks/useTables";
import { useUISettings } from "@/contexts/UISettingsContext";

// Pastel Color Palette
const COLOR_PALETTE = ["#d4f0d4", "#d4d4f0", "#f0d4f0", "#d4eaf0", "#f0e6d4", "#f0d4eb", "#e8f0d4", "#f0d4d4"];

export default function ProductGrid({
  selectedCategory,
  searchTerm,
  activeAction,
  setActiveAction,
  setEditingProduct,
  setIsMenuModalOpen,
  selectedProducts,
  setSelectedProducts,
  selectedTable,
  posMode = false,
}) {
  // Data
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const { ordersViewMode } = useUISettings();

  // Table Mutations
  const addOrderToTable = useAddOrderToTable();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();

  // View Mode
  const isListMode = ordersViewMode === "list";

  // Category Colors
  const categoryColorMap = useMemo(() => {
    const colorMap = {};
    categories.forEach((category, index) => {
      colorMap[category._id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });
    return colorMap;
  }, [categories]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryId = typeof product.categoryId === "object" ? product.categoryId?._id : product.categoryId;
      const categoryMatch = selectedCategory ? categoryId === selectedCategory : true;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Table Order Map
  const tableOrderMap = useMemo(() => {
    const orderMap = new Map();

    if (!posMode || !selectedTable?.orders) return orderMap;

    selectedTable.orders.forEach((order) => {
      const productId = typeof order.productId === "object" ? order.productId?._id : order.productId;
      if (productId) orderMap.set(productId, order);
    });

    return orderMap;
  }, [posMode, selectedTable]);

  // Select Product
  const handleSelect = (product) => {
    if (!setSelectedProducts) return;

    setSelectedProducts((prev) => {
      const isExisting = prev.some((item) => item._id === product._id);
      if (isExisting) return prev.filter((item) => item._id !== product._id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Add Product In POS
  const handlePosAdd = async (product) => {
    if (!selectedTable?._id) return;

    const existingOrder = tableOrderMap.get(product._id);

    try {
      if (existingOrder) {
        await updateOrderItem.mutateAsync({
          tableId: selectedTable._id,
          orderId: existingOrder._id,
          quantity: existingOrder.quantity + 1,
        });
      } else {
        await addOrderToTable.mutateAsync({
          tableId: selectedTable._id,
          productId: product._id,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("POS add order error:", error);
    }
  };

  // Decrease Product In POS
  const handlePosDecrease = async (productId) => {
    if (!selectedTable?._id) return;

    const existingOrder = tableOrderMap.get(productId);
    if (!existingOrder) return;

    try {
      const nextQty = existingOrder.quantity - 1;

      if (nextQty <= 0) {
        await deleteOrderItem.mutateAsync({
          tableId: selectedTable._id,
          orderId: existingOrder._id,
        });
      } else {
        await updateOrderItem.mutateAsync({
          tableId: selectedTable._id,
          orderId: existingOrder._id,
          quantity: nextQty,
        });
      }
    } catch (error) {
      console.error("POS decrease order error:", error);
    }
  };

  // Increase Product In POS
  const handlePosIncrease = async (productId) => {
    if (!selectedTable?._id) return;

    const existingOrder = tableOrderMap.get(productId);
    if (!existingOrder) return;

    try {
      await updateOrderItem.mutateAsync({
        tableId: selectedTable._id,
        orderId: existingOrder._id,
        quantity: existingOrder.quantity + 1,
      });
    } catch (error) {
      console.error("POS increase order error:", error);
    }
  };

  // Pending State
  const isPosPending = addOrderToTable.isPending || deleteOrderItem.isPending || updateOrderItem.isPending;

  return (
    <div className={isListMode ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-2 gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"}>
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
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/5 dark:bg-white/5" />

            {isListMode ? (
              <>
                <div className="min-w-0 flex-1">
                  <div className="mb-3 h-2 w-18 rounded-full bg-black/5 dark:bg-white/5" />
                  <div className="mb-2 h-4 w-28 rounded-lg bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-14 rounded-full bg-black/5 dark:bg-white/5" />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-8 w-8 rounded-[10px] bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-4 rounded bg-black/5 dark:bg-white/5" />
                  <div className="h-8 w-8 rounded-[10px] bg-black/5 dark:bg-white/5" />
                </div>
              </>
            ) : (
              <>
                <div className="mb-5 h-2 w-16 rounded-full bg-black/5 dark:bg-white/5" />

                <div className="mt-2">
                  <div className="mb-2 h-4 w-24 rounded-lg bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-12 rounded-full bg-black/5 dark:bg-white/5" />
                </div>

                <span />
              </>
            )}
          </div>
        ))
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const categoryId = typeof product.categoryId === "object" ? product.categoryId?._id : product.categoryId;
          const color = categoryColorMap[categoryId] || "#dddddd";
          const category = categories.find((item) => item._id === categoryId);

          const posOrder = posMode ? tableOrderMap.get(product._id) : null;
          const posQuantity = posOrder?.quantity || 0;

          const isSelected = posMode
            ? posQuantity > 0
            : selectedProducts?.some((item) => item._id === product._id) ?? false;

          return (
            <div
              key={product._id}
              onClick={() => {
                if (posMode) {
                  handlePosAdd(product);
                } else if (setSelectedProducts) {
                  handleSelect(product);
                }
              }}
              className={`relative cursor-pointer ${isPosPending ? "pointer-events-none" : ""}`}
            >
              {/* Delete Badge */}
              {activeAction === "delete-product" && (
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteProduct.mutate(product._id);
                  }}
                  className={`absolute z-10 flex cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 ${
                    isListMode ? "-top-2 -right-2 h-6 w-6" : "-top-3 -right-3 h-8 w-8"
                  }`}
                >
                  <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                </div>
              )}

              {/* Edit Badge */}
              {activeAction === "edit-product" && (
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditingProduct?.(product);
                    setActiveAction?.("edit-product");

                    if (window.innerWidth < 1024) {
                      setIsMenuModalOpen?.(false);
                    }
                  }}
                  className={`absolute z-10 flex cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white hover:scale-110 ${
                    isListMode ? "-top-2 -right-2 h-6 w-6" : "-top-3 -right-3 h-8 w-8"
                  }`}
                >
                  <Icons.Pencil size={isListMode ? 12 : 16} />
                </div>
              )}

              {/* Product Card */}
              <div
                style={{ backgroundColor: isSelected ? color : undefined }}
                className={`relative text-[#121212] ${
                  isListMode
                    ? "flex min-h-22 items-center gap-4 overflow-hidden rounded-2xl px-4 py-3 pl-6 md:px-5 md:py-3.5 md:pl-7"
                    : "flex min-h-38 flex-col overflow-hidden rounded-2xl p-4 pl-7 md:p-5 md:pl-8 lg:p-6 lg:pl-9"
                } ${!isSelected ? "bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white" : ""}`}
              >
                <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: color }} />

                {isListMode ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 truncate text-[8px] font-bold uppercase tracking-widest opacity-30">
                        CATEGORY - {category?.name?.toUpperCase() || "CATEGORY"}
                      </div>

                      <h4 className="line-clamp-2 text-[14px] font-bold leading-tight md:text-[15px]">{product.name}</h4>
                      <p className="mt-1 text-[11px] font-bold opacity-50 md:text-xs">${product.price.toFixed(2)}</p>
                    </div>

                    {posMode ? (
                      isSelected ? (
                        <div className="flex shrink-0 items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePosDecrease(product._id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            −
                          </button>

                          <span className="w-4 text-center text-sm font-bold">{posQuantity}</span>

                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePosIncrease(product._id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="h-8 w-17 shrink-0" />
                      )
                    ) : setSelectedProducts && isSelected ? (
                      <div className="flex shrink-0 items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev
                                .map((item) => (item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item))
                                .filter((item) => item.quantity > 0)
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          −
                        </button>

                        <span className="w-4 text-center text-sm font-bold">
                          {selectedProducts?.find((item) => item._id === product._id)?.quantity || 0}
                        </span>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="h-8 w-17 shrink-0" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                      CATEGORY - {category?.name?.toUpperCase() || "CATEGORY"}
                    </div>

                    <div className="mb-auto">
                      <h4 className="text-[15px] font-bold leading-tight">{product.name}</h4>
                      <p className="mt-1 text-xs font-bold opacity-50">${product.price.toFixed(2)}</p>
                    </div>

                    {posMode ? (
                      isSelected ? (
                        <div className="flex items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePosDecrease(product._id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            −
                          </button>

                          <span className="w-4 text-center text-sm font-bold">{posQuantity}</span>

                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handlePosIncrease(product._id);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="h-8" />
                      )
                    ) : setSelectedProducts && isSelected ? (
                      <div className="flex items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev
                                .map((item) => (item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item))
                                .filter((item) => item.quantity > 0)
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          −
                        </button>

                        <span className="w-4 text-center text-sm font-bold">
                          {selectedProducts?.find((item) => item._id === product._id)?.quantity || 0}
                        </span>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="h-8" />
                    )}
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
              <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30">SİSTEM</div>
              <h4 className="text-[14px] font-bold leading-tight md:text-[15px]">{index === 0 ? "Ürün Bulunamadı" : "—"}</h4>
            </div>

            <span className="h-8 w-17 shrink-0" />
          </div>
        ))
      ) : (
        <div className="relative flex min-h-38 flex-col justify-between overflow-hidden rounded-2xl bg-[#dddddd] p-4 pl-7 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-30">SİSTEM</div>

          <div className="mt-2">
            <h4 className="text-[15px] font-bold leading-tight">Ürün Bulunamadı</h4>
          </div>

          <span />
          <span />
        </div>
      )}
    </div>
  );
}