"use client";

import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useAreas, useDeleteArea } from "@/hooks/useAreas";
import { useTables } from "@/hooks/useTables";

// Area Slider
export default function AreaSlider({ selectedArea, setSelectedArea, activeAction }) {
  // Areas And Tables Data
  const { data: areas = [], isLoading } = useAreas();
  const { data: tables = [] } = useTables();
  const deleteArea = useDeleteArea();

  // Confirm Delete Modal State
  const [confirmingArea, setConfirmingArea] = useState(null);

  // Drag Scroll Refs
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Drag Handlers
  const handleMouseDown = (e) => { isDown.current = true; startX.current = e.pageX - sliderRef.current.offsetLeft; scrollLeft.current = sliderRef.current.scrollLeft; };
  const handleMouseMove = (e) => { if (!isDown.current) return; e.preventDefault(); sliderRef.current.scrollLeft = scrollLeft.current - (e.pageX - sliderRef.current.offsetLeft - startX.current); };
  const stopDragging = () => (isDown.current = false);

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
          <>
            <div className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 animate-pulse bg-[#dddddd] dark:bg-[#2d2d2d] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
              <span />
              <div className="text-left">
                <div className="w-20 h-4 mb-2 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="w-12 h-3 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
            </div>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 animate-pulse bg-[#f4efc4] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
                <span />
                <div className="text-left">
                  <div className="w-20 h-4 mb-2 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="w-12 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </>
        ) : areas.length > 0 ? (
          <>
            {/* All Areas Button */}
            <button onClick={() => setSelectedArea(null)} className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none bg-[#dddddd] dark:bg-[#2d2d2d] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
              <span />
              <div className="text-left text-[#121212] dark:text-[#ffffff]">
                <h3 className="text-[14px] font-bold leading-tight">Tümü</h3>
                <p className="text-[10px] font-bold opacity-40">Tüm masalar</p>
              </div>
            </button>

            {/* Area Cards */}
            {areas.map((a) => {
              const areaTableCount = tables?.filter((t) => (t.areaId?._id || t.areaId) === a._id).length || 0;
              return (
                <div key={a._id} className="relative shrink-0">
                  {/* Delete Badge */}
                  {activeAction === "delete-area" && (
                    <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setConfirmingArea(a); }}>
                      <Icons.Minus size={18} strokeWidth={3} />
                    </div>
                  )}
                  <button onClick={() => { if (activeAction !== "delete-area") setSelectedArea(a._id); }} className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none bg-[#fef3b0] text-[#121212] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
                    <span />
                    <div className="text-left text-[#121212]">
                      <h3 className="text-[14px] font-bold leading-tight">{a.name}</h3>
                      <p className="text-[10px] font-bold opacity-40">{areaTableCount} Masa</p>
                    </div>
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          // Empty State
          <div className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-[#ffffff] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6">
            <div className="mt-auto text-left">
              <h3 className="text-[14px] font-bold leading-tight">Alan Yok</h3>
              <p className="text-[10px] font-bold opacity-40">Henüz eklenmemiş</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmingArea(null)}>
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400">
                  <Icons.Trash2 size={22} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">Delete "{confirmingArea.name}"?</h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">This will permanently delete the area and all tables under it. This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setConfirmingArea(null)} className="flex-1 py-3.5 rounded-2xl font-bold bg-[#dddddd] text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white">Cancel</button>
                <button onClick={() => { deleteArea.mutate(confirmingArea._id); setConfirmingArea(null); }} className="flex-1 py-3.5 rounded-2xl font-bold bg-yellow-400 text-white hover:bg-yellow-500 active:scale-[0.98]">Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
