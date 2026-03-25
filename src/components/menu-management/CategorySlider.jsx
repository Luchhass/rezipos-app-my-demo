"use client";

import { useRef, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";

// Pastel Color Palette
const COLOR_PALETTE = ["#d4f0d4", "#d4d4f0", "#f0d4f0", "#d4eaf0", "#f0e6d4", "#f0d4eb", "#e8f0d4", "#f0d4d4"];

// Category Slider
export default function CategorySlider({ selectedCategory, setSelectedCategory, activeAction, setEditingCategory, setIsMenuModalOpen }) {
  // Categories Data
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  // Confirm Delete Modal State
  const [confirmingCategory, setConfirmingCategory] = useState(null);
  // Drag Scroll Refs
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Drag Handlers
  const handleMouseDown = (e) => { isDown.current = true; startX.current = e.pageX - sliderRef.current.offsetLeft; scrollLeft.current = sliderRef.current.scrollLeft; };
  const handleMouseMove = (e) => { if (!isDown.current) return; e.preventDefault(); sliderRef.current.scrollLeft = scrollLeft.current - (e.pageX - sliderRef.current.offsetLeft - startX.current); };
  const stopDragging = () => (isDown.current = false);

  // Category Color Map
  const categoryColorMap = useMemo(() => {
    const map = {};
    categories.forEach((cat, i) => { map[cat._id] = COLOR_PALETTE[i % COLOR_PALETTE.length]; });
    return map;
  }, [categories]);

  return (
    <>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="flex flex-nowrap gap-4 overflow-x-auto -my-4 py-4 cursor-grab active:cursor-grabbing"
      >
        {isLoading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} style={{ backgroundColor: i === 0 ? undefined : COLOR_PALETTE[i % COLOR_PALETTE.length] }} className={`flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 animate-pulse md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6 ${i === 0 ? "bg-[#dddddd] dark:bg-[#2d2d2d]" : ""}`}>
              <span />
              <div className="text-left">
                <div className="w-20 h-4 mb-2 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="w-12 h-3 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          ))
        ) : categories.length > 0 ? (
          <>
            {/* All Categories Button */}
            <button onClick={() => setSelectedCategory(null)} className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none bg-[#dddddd] dark:bg-[#2d2d2d] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
              <span />
              <div className="text-left text-[#121212] dark:text-[#ffffff]">
                <h3 className="text-[14px] font-bold leading-tight">Tümü</h3>
                <p className="text-[10px] font-bold opacity-40">Tüm ürünler</p>
              </div>
            </button>

            {/* Category Cards */}
            {categories.map((cat) => (
              <div key={cat._id} className="relative shrink-0">
                {/* Delete Badge */}
                {activeAction === "delete-category" && (
                  <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setConfirmingCategory(cat); }}>
                    <Icons.Minus size={18} strokeWidth={3} />
                  </div>
                )}
                {/* Edit Badge */}
                {activeAction === "edit-category" && (
                  <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setEditingCategory?.(cat); setIsMenuModalOpen?.(true); }}>
                    <Icons.Pencil size={16} />
                  </div>
                )}
                <button onClick={() => setSelectedCategory(cat._id)} style={{ backgroundColor: categoryColorMap[cat._id] }} className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none text-[#121212] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
                  <span />
                  <div className="text-left">
                    <h3 className="text-[14px] font-bold leading-tight">{cat.name}</h3>
                    <p className="text-[10px] font-bold opacity-40">{cat.productCount} items</p>
                  </div>
                </button>
              </div>
            ))}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
            <div className="mt-auto text-left">
              <h3 className="text-[14px] font-bold leading-tight">Kategori Yok</h3>
              <p className="text-[10px] font-bold opacity-40">Henüz eklenmemiş</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmingCategory(null)}>
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400">
                  <Icons.Trash2 size={22} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">Delete "{confirmingCategory.name}"?</h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">This will permanently delete the category and all products under it. This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setConfirmingCategory(null)} className="flex-1 py-3.5 rounded-2xl font-bold bg-[#dddddd] text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white">Cancel</button>
                <button onClick={() => { deleteCategory.mutate(confirmingCategory._id); setConfirmingCategory(null); }} className="flex-1 py-3.5 rounded-2xl font-bold bg-yellow-400 text-white hover:bg-yellow-500 active:scale-[0.98]">Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}