"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import {
  useAddOrderToTable,
  useDeleteOrderItem,
  useUpdateOrderItem,
} from "@/hooks/useTables";
import { useUISettings } from "@/contexts/UISettingsContext";

// Pastel Color Palette
const COLOR_PALETTE = [
  "#d4f0d4",
  "#d4d4f0",
  "#f0d4f0",
  "#d4eaf0",
  "#f0e6d4",
  "#f0d4eb",
  "#e8f0d4",
  "#f0d4d4",
];

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
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const { ordersViewMode } = useUISettings();

  const addOrderToTable = useAddOrderToTable();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();

  const isListMode = ordersViewMode === "list";

  const categoryColorMap = useMemo(() => {
    const map = {};
    categories.forEach((category, index) => {
      map[category._id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryId =
        typeof product.categoryId === "object"
          ? product.categoryId?._id
          : product.categoryId;

      const categoryMatch = selectedCategory
        ? categoryId === selectedCategory
        : true;

      const searchMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchTerm]);

  const tableOrderMap = useMemo(() => {
    const map = new Map();

    if (!posMode || !selectedTable?.orders) return map;

    selectedTable.orders.forEach((order) => {
      const productId =
        typeof order.productId === "object"
          ? order.productId?._id
          : order.productId;

      if (productId) {
        map.set(productId, order);
      }
    });

    return map;
  }, [posMode, selectedTable]);

  const handleSelect = (product) => {
    if (!setSelectedProducts) return;

    setSelectedProducts((prev) => {
      const isExisting = prev.some((item) => item._id === product._id);

      if (isExisting) {
        return prev.filter((item) => item._id !== product._id);
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

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
    } catch (err) {
      console.error("POS add order error:", err);
    }
  };

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
    } catch (err) {
      console.error("POS decrease order error:", err);
    }
  };

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
    } catch (err) {
      console.error("POS increase order error:", err);
    }
  };

  const isPosPending =
    addOrderToTable.isPending ||
    deleteOrderItem.isPending ||
    updateOrderItem.isPending;

  const wrapperClassName = isListMode
    ? "grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
    : "grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]";

  const cardClassName = isListMode
    ? "relative flex items-center gap-4 overflow-hidden min-h-22 px-4 py-3 pl-6 rounded-2xl text-[#121212] md:px-5 md:py-3.5 md:pl-7"
    : "relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9 text-[#121212]";

  const inactiveCardClassName =
    "dark:bg-[#2d2d2d] dark:text-white bg-[#dddddd]";

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
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/5 dark:bg-white/5" />

            {isListMode ? (
              <>
                <div className="flex-1 min-w-0">
                  <div className="w-18 h-2 rounded-full bg-black/5 dark:bg-white/5 mb-3" />
                  <div className="w-28 h-4 rounded-lg bg-black/5 dark:bg-white/5 mb-2" />
                  <div className="w-14 h-3 rounded-full bg-black/5 dark:bg-white/5" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-[10px] bg-black/5 dark:bg-white/5" />
                  <div className="w-4 h-4 rounded bg-black/5 dark:bg-white/5" />
                  <div className="w-8 h-8 rounded-[10px] bg-black/5 dark:bg-white/5" />
                </div>
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
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const categoryId =
            typeof product.categoryId === "object"
              ? product.categoryId?._id
              : product.categoryId;

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
              className={`relative cursor-pointer ${
                isPosPending ? "pointer-events-none" : ""
              }`}
            >
              {activeAction === "delete-product" && (
                <div
                  className={`absolute z-10 flex items-center justify-center rounded-full bg-red-500 text-white cursor-pointer hover:scale-110 ${
                    isListMode ? "-top-2 -right-2 w-6 h-6" : "-top-3 -right-3 w-8 h-8"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProduct.mutate(product._id);
                  }}
                >
                  <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                </div>
              )}

              {activeAction === "edit-product" && (
                <div
                  className={`absolute z-10 flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer hover:scale-110 ${
                    isListMode ? "-top-2 -right-2 w-6 h-6" : "-top-3 -right-3 w-8 h-8"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProduct?.(product);
                    setActiveAction?.("edit-product");

                    if (window.innerWidth < 1024) {
                      setIsMenuModalOpen?.(false);
                    }
                  }}
                >
                  <Icons.Pencil size={isListMode ? 12 : 16} />
                </div>
              )}

              <div
                className={`${cardClassName} ${!isSelected ? inactiveCardClassName : ""}`}
                style={{ backgroundColor: isSelected ? color : undefined }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: color }}
                />

                {isListMode ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30 truncate">
                        CATEGORY - {category?.name?.toUpperCase() || "CATEGORY"}
                      </div>

                      <h4 className="text-[14px] md:text-[15px] font-bold leading-tight line-clamp-2">
                        {product.name}
                      </h4>

                      <p className="mt-1 text-[11px] md:text-xs font-bold opacity-50">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {posMode ? (
                      isSelected ? (
                        <div className="flex items-center justify-end gap-2 text-black shrink-0 animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePosDecrease(product._id);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            −
                          </button>

                          <span className="w-4 text-sm font-bold text-center">
                            {posQuantity}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePosIncrease(product._id);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="w-17 h-8 shrink-0" />
                      )
                    ) : setSelectedProducts && isSelected ? (
                      <div className="flex items-center justify-end gap-2 text-black shrink-0 animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev
                                .map((item) =>
                                  item._id === product._id
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                                )
                                .filter((item) => item.quantity > 0)
                            );
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          −
                        </button>

                        <span className="w-4 text-sm font-bold text-center">
                          {selectedProducts?.find((item) => item._id === product._id)?.quantity || 0}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev.map((item) =>
                                item._id === product._id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item
                              )
                            );
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="w-17 h-8 shrink-0" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                      CATEGORY - {category?.name?.toUpperCase() || "CATEGORY"}
                    </div>

                    <div className="mb-auto">
                      <h4 className="text-[15px] font-bold leading-tight">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-xs font-bold opacity-50">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {posMode ? (
                      isSelected ? (
                        <div className="flex items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePosDecrease(product._id);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                          >
                            −
                          </button>

                          <span className="w-4 text-sm font-bold text-center">
                            {posQuantity}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePosIncrease(product._id);
                            }}
                            className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev
                                .map((item) =>
                                  item._id === product._id
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                                )
                                .filter((item) => item.quantity > 0)
                            );
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
                        >
                          −
                        </button>

                        <span className="w-4 text-sm font-bold text-center">
                          {selectedProducts?.find((item) => item._id === product._id)?.quantity || 0}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducts((prev) =>
                              prev.map((item) =>
                                item._id === product._id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item
                              )
                            );
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90"
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
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative flex items-center gap-4 overflow-hidden min-h-22 px-4 py-3 pl-6 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:px-5 md:py-3.5 md:pl-7"
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[8px] font-bold uppercase tracking-widest opacity-30">
                SİSTEM
              </div>
              <h4 className="text-[14px] md:text-[15px] font-bold leading-tight">
                {i === 0 ? "Ürün Bulunamadı" : "—"}
              </h4>
            </div>
            <span className="w-17 h-8 shrink-0" />
          </div>
        ))
      ) : (
        <div className="relative flex flex-col justify-between overflow-hidden min-h-38 p-4 pl-7 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:p-5 md:pl-8 lg:p-6 lg:pl-9">
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/10 dark:bg-white/10" />
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-30">
            SİSTEM
          </div>
          <div className="mt-2">
            <h4 className="text-[15px] font-bold leading-tight">
              Ürün Bulunamadı
            </h4>
          </div>
          <span />
          <span />
        </div>
      )}
    </div>
  );
}