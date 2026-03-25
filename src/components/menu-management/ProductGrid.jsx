"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";

// Pastel Color Palette
const COLOR_PALETTE = ["#d4f0d4", "#d4d4f0", "#f0d4f0", "#d4eaf0", "#f0e6d4", "#f0d4eb", "#e8f0d4", "#f0d4d4"];

// Product Grid
export default function ProductGrid({ selectedCategory, searchTerm, activeAction, setActiveAction, setEditingProduct, setIsMenuModalOpen, selectedProducts, setSelectedProducts }) {
  // Products And Categories Data
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map = {};
    categories.forEach((cat, i) => { map[cat._id] = COLOR_PALETTE[i % COLOR_PALETTE.length]; });
    return map;
  }, [categories]);

  // Filtered Products By Category And Search
  const filteredProducts = useMemo(() => products.filter((p) => {
    const catId = typeof p.categoryId === "object" ? p.categoryId?._id : p.categoryId;
    const categoryMatch = selectedCategory ? catId === selectedCategory : true;
    const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  }), [products, selectedCategory, searchTerm]);

  // Toggle Product Selection
  const handleSelect = (product) => {
    if (!setSelectedProducts) return;
    setSelectedProducts((prev) => {
      const isExisting = prev.some((item) => item._id === product._id);
      if (isExisting) return prev.filter((item) => item._id !== product._id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="grid gap-3 grid-cols-2 md:gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl bg-[#dddddd] animate-pulse dark:bg-[#2d2d2d] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
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
          const catId = typeof product.categoryId === "object" ? product.categoryId?._id : product.categoryId;
          const color = categoryColorMap[catId] || "#dddddd";
          const category = categories.find((c) => c._id === catId);
          const isSelected = selectedProducts?.some((p) => p._id === product._id) ?? false;

          return (
            <div key={product._id} onClick={() => setSelectedProducts && handleSelect(product)} className="relative cursor-pointer">
              {/* Delete Badge */}
              {activeAction === "delete-product" && (
                <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); deleteProduct.mutate(product._id); }}>
                  <Icons.Minus size={18} strokeWidth={3} />
                </div>
              )}
              {/* Edit Badge */}
              {activeAction === "edit-product" && (
                <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setEditingProduct?.(product); setActiveAction?.("edit-product"); if (window.innerWidth < 1024) setIsMenuModalOpen?.(false); }}>
                  <Icons.Pencil size={16} />
                </div>
              )}

              <div
                className={`relative flex flex-col overflow-hidden min-h-38 p-4 pl-7 rounded-2xl md:p-5 md:pl-8 lg:p-6 lg:pl-9 text-[#121212] ${!isSelected ? "dark:bg-[#2d2d2d] dark:text-white bg-[#dddddd]" : ""}`}
                style={{ backgroundColor: isSelected ? color : undefined }}
              >
                <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: color }} />
                <div className="mb-5 text-[8px] font-bold uppercase tracking-widest opacity-30">CATEGORY - {category?.name.toUpperCase() || "CATEGORY"}</div>
                <div className="mb-auto">
                  <h4 className="text-[15px] font-bold leading-tight">{product.name}</h4>
                  <p className="mt-1 text-xs font-bold opacity-50">${product.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                {setSelectedProducts && isSelected && (
                  <div className="flex items-center justify-end gap-2 text-black animate-in fade-in zoom-in duration-200">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0)); }} className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90">−</button>
                    <span className="w-4 text-sm font-bold text-center">{selectedProducts?.find((p) => p._id === product._id)?.quantity || 0}</span>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedProducts((prev) => prev.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)); }} className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-black transition-all active:scale-90">+</button>
                  </div>
                )}
                {!isSelected && <span className="h-8" />}
              </div>
            </div>
          );
        })
      ) : (
        // Empty State
        <div className="relative flex flex-col justify-between overflow-hidden min-h-38 p-4 pl-7 rounded-2xl opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:p-5 md:pl-8 lg:p-6 lg:pl-9">
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