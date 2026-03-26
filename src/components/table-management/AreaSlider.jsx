"use client";

import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useAreas, useDeleteArea } from "@/hooks/useAreas";
import { useTables } from "@/hooks/useTables";

// Quick Order Area Name
const QUICK_ORDER_AREA_NAME = "Hızlı Sipariş";

export default function AreaSlider({ selectedArea, setSelectedArea, activeAction }) {
  // Area Data
  const { data: areas = [], isLoading } = useAreas();
  const { data: tables = [] } = useTables();
  const deleteArea = useDeleteArea();

  // Delete Modal State
  const [confirmingArea, setConfirmingArea] = useState(null);

  // Drag Scroll Refs
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Drag Handlers
  const handleMouseDown = (event) => {
    isDown.current = true;
    startX.current = event.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (event) => {
    if (!isDown.current) return;
    event.preventDefault();
    sliderRef.current.scrollLeft = scrollLeft.current - (event.pageX - sliderRef.current.offsetLeft - startX.current);
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  // Visible Areas
  const visibleAreas = areas.filter((area) => area.name !== QUICK_ORDER_AREA_NAME);

  return (
    <>
      {/* Area Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="flex cursor-grab flex-nowrap gap-4 overflow-x-auto active:cursor-grabbing"
      >
        {isLoading ? (
          <>
            {/* All Areas Skeleton */}
            <div className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 animate-pulse dark:bg-[#2d2d2d] md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6">
              <span />
              <div className="text-left">
                <div className="mb-2 h-4 w-20 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-12 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
            </div>

            {/* Area Skeletons */}
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#f4efc4] p-4 animate-pulse md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
              >
                <span />
                <div className="text-left">
                  <div className="mb-2 h-4 w-20 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-12 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </>
        ) : visibleAreas.length > 0 ? (
          <>
            {/* All Areas Button */}
            <button
              onClick={() => setSelectedArea(null)}
              className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-left outline-none dark:bg-[#2d2d2d] md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
            >
              <span />
              <div className="text-[#121212] dark:text-white">
                <h3 className="text-[14px] font-bold leading-tight">Tümü</h3>
                <p className="text-[10px] font-bold opacity-40">Tüm masalar</p>
              </div>
            </button>

            {/* Area Cards */}
            {visibleAreas.map((area) => {
              const areaTableCount = tables?.filter((table) => (table.areaId?._id || table.areaId) === area._id).length || 0;

              return (
                <div key={area._id} className="relative shrink-0">
                  {/* Delete Badge */}
                  {activeAction === "delete-area" && (
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        setConfirmingArea(area);
                      }}
                      className="absolute -top-3 -right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:scale-110"
                    >
                      <Icons.Minus size={18} strokeWidth={3} />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (activeAction !== "delete-area") setSelectedArea(area._id);
                    }}
                    className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#fef3b0] p-4 text-[#121212] outline-none md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
                  >
                    <span />
                    <div className="text-left">
                      <h3 className="text-[14px] font-bold leading-tight">{area.name}</h3>
                      <p className="text-[10px] font-bold opacity-40">{areaTableCount} Masa</p>
                    </div>
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          /* Empty State */
          <div className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] opacity-50 dark:bg-[#2d2d2d] dark:text-white md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6">
            <div className="mt-auto text-left">
              <h3 className="text-[14px] font-bold leading-tight">Alan Yok</h3>
              <p className="text-[10px] font-bold opacity-40">Henüz eklenmemiş</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingArea && (
        <div onClick={() => setConfirmingArea(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
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
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Delete "{confirmingArea.name}"?</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">
                  This will permanently delete the area and all tables under it. This action cannot be undone.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setConfirmingArea(null)}
                  className="flex-1 rounded-2xl bg-[#dddddd] py-3.5 font-bold text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deleteArea.mutate(confirmingArea._id);
                    setConfirmingArea(null);
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