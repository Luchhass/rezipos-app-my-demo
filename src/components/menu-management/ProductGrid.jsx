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
  // ================================
  // PRODUCTS + CATEGORIES DATA
  // ================================
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  // ================================
  // POS MUTATIONS
  // Sadece sipariş ekranında kullanılır
  // ================================
  const addOrderToTable = useAddOrderToTable();
  const deleteOrderItem = useDeleteOrderItem();
  const updateOrderItem = useUpdateOrderItem();

  // ================================
  // CATEGORY COLOR MAP
  // Her kategoriye palette içinden renk atanır
  // ================================
  const categoryColorMap = useMemo(() => {
    const map = {};
    categories.forEach((category, index) => {
      map[category._id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });
    return map;
  }, [categories]);

  // ================================
  // FILTERED PRODUCTS
  // Kategori + arama filtresine göre ürün listesi
  // ================================
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

  // ================================
  // POS ORDER MAP
  // selectedTable.orders listesini productId bazlı map'e çevirir
  // Böylece ürün siparişte var mı, quantity kaç kolayca bulunur
  // ================================
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

  // ================================
  // MENU MANAGEMENT MODE SELECTION
  // local selectedProducts mantığı sadece menu / eski local seçim için
  // ================================
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

  // ================================
  // POS MODE - ÜRÜN EKLE / ARTIR
  // Kartın kendisine tıklanınca çalışır
  // Siparişte yoksa ekler, varsa quantity artırır
  // ================================
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

  // ================================
  // POS MODE - AZALT
  // quantity 0 olursa item siparişten silinir
  // ================================
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

  // ================================
  // POS MODE - ARTIR
  // ================================
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

  // ================================
  // POS PENDING STATE
  // Sipariş mutation çalışırken kartlar kısa süreli interaction kapatılır
  // ================================
  const isPosPending =
    addOrderToTable.isPending ||
    deleteOrderItem.isPending ||
    updateOrderItem.isPending;

  return (
    <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <div
            key={i}
            className="relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9"
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-black/5 dark:bg-white/5" />
            <div className="w-16 h-2 rounded-full bg-black/5 dark:bg-white/5 mb-5" />
            <div className="mt-2">
              <div className="w-24 h-4 mb-2 rounded-lg bg-black/5 dark:bg-white/5" />
              <div className="w-12 h-3 rounded-full bg-black/5 dark:bg-white/5" />
            </div>
            <span />
          </div>
        ))
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          // ================================
          // PRODUCT DERIVED VALUES
          // ================================
          const categoryId =
            typeof product.categoryId === "object"
              ? product.categoryId?._id
              : product.categoryId;

          const color = categoryColorMap[categoryId] || "#dddddd";
          const category = categories.find((item) => item._id === categoryId);

          // POS mode'da quantity backend order üzerinden okunur
          const posOrder = posMode ? tableOrderMap.get(product._id) : null;
          const posQuantity = posOrder?.quantity || 0;

          // seçili state:
          // - POS mode -> backend order quantity > 0
          // - normal mode -> local selectedProducts içinde var mı
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
              {/* Delete Badge */}
              {activeAction === "delete-product" && (
                <div
                  className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProduct.mutate(product._id);
                  }}
                >
                  <Icons.Minus size={18} strokeWidth={3} />
                </div>
              )}

              {/* Edit Badge */}
              {activeAction === "edit-product" && (
                <div
                  className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProduct?.(product);
                    setActiveAction?.("edit-product");

                    if (window.innerWidth < 1024) {
                      setIsMenuModalOpen?.(false);
                    }
                  }}
                >
                  <Icons.Pencil size={16} />
                </div>
              )}

              <div
                className={`relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9 text-[#121212] ${
                  !isSelected
                    ? "dark:bg-[#2d2d2d] dark:text-white bg-[#dddddd]"
                    : ""
                }`}
                style={{ backgroundColor: isSelected ? color : undefined }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: color }}
                />

                <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">
                  CATEGORY - {category?.name.toUpperCase() || "CATEGORY"}
                </div>

                <div className="mb-auto">
                  <h4 className="text-[15px] font-bold leading-tight">
                    {product.name}
                  </h4>
                  <p className="mt-1 text-xs font-bold opacity-50">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
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
