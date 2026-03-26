"use client";

import { useRef } from "react";

export default function FloorSlider({ floors, tables, activeFloor, setActiveFloor }) {
  // Drag Scroll Refs
  const floorRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // Drag Handlers
  const handleMouseDown = (event) => {
    isDragging.current = true;
    dragStart.current = { x: event.pageX, scrollLeft: floorRef.current.scrollLeft };
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    floorRef.current.scrollLeft = dragStart.current.scrollLeft - (event.pageX - dragStart.current.x);
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={floorRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      className="flex shrink-0 cursor-grab flex-nowrap gap-4 overflow-x-auto active:cursor-grabbing"
    >
      {/* All Floors Button */}
      <button
        onClick={() => setActiveFloor(null)}
        className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 dark:bg-[#2d2d2d] md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
      >
        <span />
        <div className="text-left">
          <h3 className="text-[14px] font-bold leading-tight text-[#121212] dark:text-white">Tümü</h3>
          <p className="text-[10px] font-bold text-[#121212] opacity-40 dark:text-white">Tüm masalar</p>
        </div>
      </button>

      {/* Floor Cards */}
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => setActiveFloor(floor)}
          className="flex h-32.5 w-40 shrink-0 flex-col justify-between rounded-2xl bg-[#fef3b0] p-4 text-[#121212] md:h-34 md:w-42.5 md:p-5 lg:h-38 lg:w-45 lg:p-6"
        >
          <span />
          <div className="text-left">
            <h3 className="text-[14px] font-bold leading-tight capitalize">{floor.toLowerCase()}</h3>
            <p className="text-[10px] font-bold opacity-40">{tables.filter((table) => table.floor === floor).length} Masa</p>
          </div>
        </button>
      ))}
    </div>
  );
}