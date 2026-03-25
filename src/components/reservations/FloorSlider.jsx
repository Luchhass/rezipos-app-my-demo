"use client";

import { useRef } from "react";

// Floor Slider Drag Scroll
export default function FloorSlider({ floors, tables, activeFloor, setActiveFloor }) {
  const floorRef = useRef(null);
  const floorDragging = useRef(false);
  const floorDragStart = useRef({ x: 0, sl: 0 });

  // Horizontal Drag Handlers
  const onFloorDown = (e) => {
    floorDragging.current = true;
    floorDragStart.current = { x: e.pageX, sl: floorRef.current.scrollLeft };
  };
  const onFloorMove = (e) => {
    if (!floorDragging.current) return;
    floorRef.current.scrollLeft = floorDragStart.current.sl - (e.pageX - floorDragStart.current.x);
  };
  const onFloorUp = () => (floorDragging.current = false);

  return (
    <div ref={floorRef} onMouseDown={onFloorDown} onMouseMove={onFloorMove} onMouseUp={onFloorUp} onMouseLeave={onFloorUp} className="flex gap-4 overflow-x-auto -my-4 py-4 shrink-0 cursor-grab active:cursor-grabbing">
      {/* All Floors Button */}
      <button
        onClick={() => setActiveFloor(null)}
        className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6"
      >
        <span />
        <div className="text-left">
          <h3 className="text-[14px] font-bold leading-tight text-[#121212] dark:text-white">Tümü</h3>
          <p className="text-[10px] font-bold opacity-40 text-[#121212] dark:text-white">Tüm masalar</p>
        </div>
      </button>

      {/* Floor Cards */}
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => setActiveFloor(floor)}
          className="flex flex-col justify-between w-40 h-32.5 p-4 rounded-2xl shrink-0 bg-[#fef3b0] text-[#121212] md:w-42.5 md:h-34 md:p-5 lg:w-45 lg:h-38 lg:p-6"
        >
          <span />
          <div className="text-left">
            <h3 className="text-[14px] font-bold leading-tight capitalize">{floor.toLowerCase()}</h3>
            <p className="text-[10px] font-bold opacity-40">{tables.filter((t) => t.floor === floor).length} Masa</p>
          </div>
        </button>
      ))}
    </div>
  );
}