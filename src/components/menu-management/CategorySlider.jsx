"use client";

import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useUISettings } from "@/contexts/UISettingsContext";

// Pastel Color Palette
const COLOR_PALETTE = ["#d4f0d4", "#d4d4f0", "#f0d4f0", "#d4eaf0", "#f0e6d4", "#f0d4eb", "#e8f0d4", "#f0d4d4"];

export default function CategorySlider({
  selectedCategory,
  setSelectedCategory,
  activeAction,
  setEditingCategory,
  setIsMenuModalOpen,
}) {
  // Category Data
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const { ordersViewMode } = useUISettings();

  // Delete Modal State
  const [confirmingCategory, setConfirmingCategory] = useState(null);

  // Drag Scroll Refs
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // Drag Handlers
  const handleMouseDown = (event) => {
    isDragging.current = true;
    dragStart.current = {
      x: event.pageX - sliderRef.current.offsetLeft,
      scrollLeft: sliderRef.current.scrollLeft,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    event.preventDefault();
    sliderRef.current.scrollLeft =
      dragStart.current.scrollLeft - (event.pageX - sliderRef.current.offsetLeft - dragStart.current.x);
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  // Category Colors
  const categoryColorMap = useMemo(() => {
    const colorMap = {};
    categories.forEach((category, index) => {
      colorMap[category._id] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });
    return colorMap;
  }, [categories]);

  // View Mode
  const isListMode = ordersViewMode === "list";

  // Skeleton Content
  const renderSkeletonContent = () =>
    isListMode ? (
      <div className="w-full text-left">
        <div className="h-4 w-24 rounded-lg bg-black/10 dark:bg-white/10" />
        <div className="mt-2 h-3 w-14 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    ) : (
      <>
        <span />
        <div className="text-left">
          <div className="mb-2 h-4 w-20 rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </>
    );

  return (
    <>
      {/* Category Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={
          isListMode
            ? "grid auto-cols-max grid-flow-col grid-rows-2 gap-4 overflow-x-auto cursor-grab active:cursor-grabbing pt-2"
            : "flex flex-nowrap gap-4 overflow-x-auto cursor-grab active:cursor-grabbing pt-2"
        }
      >
        {isLoading ? (
          <>
            {/* All Categories Skeleton */}
            <div
              className={`shrink-0 animate-pulse rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] ${
                isListMode
                  ? "flex h-15 w-40 flex-col justify-center px-4 py-3 md:h-16 md:w-44 lg:h-17 lg:w-48"
                  : "flex h-32.5 w-40 flex-col justify-between p-4 md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
              }`}
            >
              {renderSkeletonContent()}
            </div>

            {[...Array(isListMode ? 11 : 9)].map((_, index) => (
              <div
                key={index}
                style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
                className={`shrink-0 animate-pulse rounded-2xl ${
                  isListMode
                    ? "flex h-15 w-40 flex-col justify-center px-4 py-3 md:h-16 md:w-44 lg:h-17 lg:w-48"
                    : "flex h-32.5 w-40 flex-col justify-between p-4 md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
                }`}
              >
                {renderSkeletonContent()}
              </div>
            ))}
          </>
        ) : categories.length > 0 ? (
          <>
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={
                isListMode
                  ? "flex h-15 w-40 shrink-0 flex-col justify-center rounded-2xl bg-[#dddddd] px-4 py-3 text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white md:h-16 md:w-44 lg:h-17 lg:w-48"
                  : "flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
              }
            >
              {isListMode ? (
                <div className="w-full text-left">
                  <h3 className="truncate text-[13px] font-bold leading-tight">Tümü</h3>
                  <p className="mt-1 text-[10px] leading-none font-bold opacity-40">Tüm ürünler</p>
                </div>
              ) : (
                <>
                  <span />
                  <div className="text-left">
                    <h3 className="text-[14px] font-bold leading-tight">Tümü</h3>
                    <p className="text-[10px] font-bold opacity-40">Tüm ürünler</p>
                  </div>
                </>
              )}
            </button>

            {/* Category Cards */}
            {categories.map((category) => (
              <div key={category._id} className="relative shrink-0">
                {/* Delete Badge */}
                {activeAction === "delete-category" && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      setConfirmingCategory(category);
                    }}
                    className={`absolute z-10 flex cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 ${
                      isListMode ? "-top-2 -right-2 h-6 w-6" : "-top-3 -right-3 h-8 w-8"
                    }`}
                  >
                    <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                  </div>
                )}

                {/* Edit Badge */}
                {activeAction === "edit-category" && (
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingCategory?.(category);
                      setIsMenuModalOpen?.(true);
                    }}
                    className={`absolute z-10 flex cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white hover:scale-110 ${
                      isListMode ? "-top-2 -right-2 h-6 w-6" : "-top-3 -right-3 h-8 w-8"
                    }`}
                  >
                    <Icons.Pencil size={isListMode ? 12 : 16} />
                  </div>
                )}

                <button
                  onClick={() => setSelectedCategory(category._id)}
                  style={{ backgroundColor: categoryColorMap[category._id] }}
                  className={
                    isListMode
                      ? "flex h-15 w-40 shrink-0 flex-col justify-center rounded-2xl px-4 py-3 text-[#121212] outline-none md:h-16 md:w-44 lg:h-17 lg:w-48"
                      : "flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl p-4 text-[#121212] outline-none md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
                  }
                >
                  {isListMode ? (
                    <div className="w-full text-left">
                      <h3 className="truncate text-[13px] font-bold leading-tight">{category.name}</h3>
                      <p className="mt-1 text-[10px] leading-none font-bold opacity-40">{category.productCount} items</p>
                    </div>
                  ) : (
                    <>
                      <span />
                      <div className="text-left">
                        <h3 className="text-[14px] font-bold leading-tight">{category.name}</h3>
                        <p className="text-[10px] font-bold opacity-40">{category.productCount} items</p>
                      </div>
                    </>
                  )}
                </button>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Empty State */}
            <div
              className={
                isListMode
                  ? "flex h-15 w-40 shrink-0 flex-col justify-center rounded-2xl bg-[#dddddd] px-4 py-3 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:h-16 md:w-44 lg:h-17 lg:w-48"
                  : "flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
              }
            >
              {isListMode ? (
                <div className="w-full text-left">
                  <h3 className="truncate text-[13px] font-bold leading-tight">Kategori Yok</h3>
                  <p className="mt-1 text-[10px] leading-none font-bold opacity-40">Henüz eklenmemiş</p>
                </div>
              ) : (
                <>
                  <span />
                  <div className="text-left">
                    <h3 className="text-[14px] font-bold leading-tight">Kategori Yok</h3>
                    <p className="text-[10px] font-bold opacity-40">Henüz eklenmemiş</p>
                  </div>
                </>
              )}
            </div>

            {isListMode && (
              <>
                <div className="flex h-15 w-40 shrink-0 flex-col justify-center rounded-2xl bg-[#dddddd] px-4 py-3 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:h-16 md:w-44 lg:h-17 lg:w-48">
                  <div className="w-full text-left">
                    <h3 className="truncate text-[13px] font-bold leading-tight">—</h3>
                    <p className="mt-1 text-[10px] leading-none font-bold opacity-40">Boş alan</p>
                  </div>
                </div>

                <div className="flex h-15 w-40 shrink-0 flex-col justify-center rounded-2xl bg-[#dddddd] px-4 py-3 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:h-16 md:w-44 lg:h-17 lg:w-48">
                  <div className="w-full text-left">
                    <h3 className="truncate text-[13px] font-bold leading-tight">—</h3>
                    <p className="mt-1 text-[10px] leading-none font-bold opacity-40">Boş alan</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingCategory && (
        <div onClick={() => setConfirmingCategory(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]"
          >
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              {/* Warning Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                  <Icons.Trash2 size={22} className="text-white" />
                </div>
              </div>

              {/* Modal Text */}
              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Delete "{confirmingCategory.name}"?</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">
                  This will permanently delete the category and all products under it. This action cannot be undone.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setConfirmingCategory(null)}
                  className="flex-1 rounded-2xl bg-[#dddddd] py-3.5 font-bold text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deleteCategory.mutate(confirmingCategory._id);
                    setConfirmingCategory(null);
                  }}
                  className="flex-1 rounded-2xl bg-yellow-400 py-3.5 font-bold text-white hover:bg-yellow-500 active:scale-[0.98]"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}