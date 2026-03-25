"use client";

import { useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useAreas, useDeleteArea } from "@/hooks/useAreas";
import { useTables } from "@/hooks/useTables";
import { useUISettings } from "@/contexts/UISettingsContext";

// Mevcut pastel sarı tonu
const AREA_COLOR = "#fef3b0";

export default function AreaSlider({
  selectedArea,
  setSelectedArea,
  activeAction,
}) {
  const { data: areas = [], isLoading } = useAreas();
  const { data: tables = [] } = useTables();
  const deleteArea = useDeleteArea();
  const { ordersViewMode } = useUISettings();

  const [confirmingArea, setConfirmingArea] = useState(null);

  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    sliderRef.current.scrollLeft =
      scrollLeft.current -
      (e.pageX - sliderRef.current.offsetLeft - startX.current);
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  const areaTableCountMap = useMemo(() => {
    const map = {};

    tables.forEach((table) => {
      const areaId =
        typeof table.areaId === "object" ? table.areaId?._id : table.areaId;

      if (!areaId) return;
      map[areaId] = (map[areaId] || 0) + 1;
    });

    return map;
  }, [tables]);

  const isListMode = ordersViewMode === "list";

  const wrapperClassName = isListMode
    ? "grid grid-rows-2 grid-flow-col auto-cols-max gap-3 overflow-x-auto -my-4 py-4 cursor-grab active:cursor-grabbing"
    : "flex flex-nowrap gap-4 overflow-x-auto -my-4 py-4 cursor-grab active:cursor-grabbing";

  const baseCardClassName = isListMode
    ? "flex flex-col justify-center w-40 h-15 px-4 py-3 rounded-2xl shrink-0 outline-none text-[#121212] md:w-44 md:h-16 lg:w-48 lg:h-17"
    : "flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none text-[#121212] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6";

  const allCardClassName = isListMode
    ? "flex flex-col justify-center w-40 h-15 px-4 py-3 rounded-2xl shrink-0 outline-none bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white md:w-44 md:h-16 lg:w-48 lg:h-17"
    : "flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 outline-none bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6";

  const skeletonCardClassName = isListMode
    ? "flex flex-col justify-center w-40 h-15 px-4 py-3 rounded-2xl shrink-0 animate-pulse md:w-44 md:h-16 lg:w-48 lg:h-17"
    : "flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 animate-pulse md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6";

  const emptyCardClassName = isListMode
    ? "flex flex-col justify-center w-40 h-15 px-4 py-3 rounded-2xl shrink-0 opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:w-44 md:h-16 lg:w-48 lg:h-17"
    : "flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 opacity-50 bg-[#dddddd] text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6";

  const titleClassName = isListMode
    ? "text-[13px] font-bold leading-tight truncate"
    : "text-[14px] font-bold leading-tight";

  const subtitleClassName = isListMode
    ? "text-[10px] font-bold opacity-40 leading-none mt-1"
    : "text-[10px] font-bold opacity-40";

  const renderSkeletonContent = () => {
    if (isListMode) {
      return (
        <div className="text-left w-full">
          <div className="w-24 h-4 rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="w-14 h-3 mt-2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      );
    }

    return (
      <>
        <span />
        <div className="text-left">
          <div className="w-20 h-4 mb-2 rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="w-12 h-3 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </>
    );
  };

  return (
    <>
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={wrapperClassName}
      >
        {isLoading ? (
          <>
            <div className={`${skeletonCardClassName} bg-[#dddddd] dark:bg-[#2d2d2d]`}>
              {renderSkeletonContent()}
            </div>

            {[...Array(isListMode ? 11 : 9)].map((_, i) => (
              <div
                key={i}
                style={{ backgroundColor: AREA_COLOR }}
                className={skeletonCardClassName}
              >
                {renderSkeletonContent()}
              </div>
            ))}
          </>
        ) : areas.length > 0 ? (
          <>
            <button
              onClick={() => setSelectedArea(null)}
              className={allCardClassName}
            >
              {isListMode ? (
                <div className="text-left w-full">
                  <h3 className={titleClassName}>Tümü</h3>
                  <p className={subtitleClassName}>Tüm masalar</p>
                </div>
              ) : (
                <>
                  <span />
                  <div className="text-left">
                    <h3 className={titleClassName}>Tümü</h3>
                    <p className={subtitleClassName}>Tüm masalar</p>
                  </div>
                </>
              )}
            </button>

            {areas.map((area) => (
              <div key={area._id} className="relative shrink-0">
                {activeAction === "delete-area" && (
                  <div
                    className={`absolute z-10 flex items-center justify-center rounded-full bg-red-500 text-white cursor-pointer hover:scale-110 ${
                      isListMode
                        ? "-top-2 -right-2 w-6 h-6"
                        : "-top-3 -right-3 w-8 h-8"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingArea(area);
                    }}
                  >
                    <Icons.Minus size={isListMode ? 14 : 18} strokeWidth={3} />
                  </div>
                )}

                <button
                  onClick={() => {
                    if (activeAction !== "delete-area") {
                      setSelectedArea(area._id);
                    }
                  }}
                  style={{ backgroundColor: AREA_COLOR }}
                  className={baseCardClassName}
                >
                  {isListMode ? (
                    <div className="text-left w-full">
                      <h3 className={titleClassName}>{area.name}</h3>
                      <p className={subtitleClassName}>
                        {areaTableCountMap[area._id] || 0} Masa
                      </p>
                    </div>
                  ) : (
                    <>
                      <span />
                      <div className="text-left">
                        <h3 className={titleClassName}>{area.name}</h3>
                        <p className={subtitleClassName}>
                          {areaTableCountMap[area._id] || 0} Masa
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={emptyCardClassName}>
              {isListMode ? (
                <div className="text-left w-full">
                  <h3 className={titleClassName}>Alan Yok</h3>
                  <p className={subtitleClassName}>Henüz eklenmemiş</p>
                </div>
              ) : (
                <>
                  <span />
                  <div className="text-left">
                    <h3 className={titleClassName}>Alan Yok</h3>
                    <p className={subtitleClassName}>Henüz eklenmemiş</p>
                  </div>
                </>
              )}
            </div>

            {isListMode && (
              <>
                <div className={emptyCardClassName}>
                  <div className="text-left w-full">
                    <h3 className={titleClassName}>—</h3>
                    <p className={subtitleClassName}>Boş alan</p>
                  </div>
                </div>
                <div className={emptyCardClassName}>
                  <div className="text-left w-full">
                    <h3 className={titleClassName}>—</h3>
                    <p className={subtitleClassName}>Boş alan</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {confirmingArea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmingArea(null)}
        >
          <div
            className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400">
                  <Icons.Trash2 size={22} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Delete "{confirmingArea.name}"?
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  This will permanently delete the area and all tables under it. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmingArea(null)}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-[#dddddd] text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteArea.mutate(confirmingArea._id);
                    setConfirmingArea(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-yellow-400 text-white hover:bg-yellow-500 active:scale-[0.98]"
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