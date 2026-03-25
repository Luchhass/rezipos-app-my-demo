"use client";

import { useRef, useMemo } from "react";
import { Users } from "lucide-react";

const COL_W = 120;

// Reservation Block Color By Status
function blockColor(status) {
  if (status === "ARRIVED") return "bg-[#f3e5ab] text-[#1a1c1e]";
  if (status === "COMPLETED") return "bg-[#c7e8e1] text-[#1a1c1e]";
  return "bg-[#dddddd] text-[#121212]";
}

// Convert HH:MM To Pixel Position
function toPixels(start, end, startHour) {
  const parse = (t) => {
    const [h, m] = t.split(":").map(Number);
    return (h < startHour ? h + 24 : h) + m / 60;
  };
  return {
    left: (parse(start) - startHour) * COL_W,
    width: (parse(end) - parse(start)) * COL_W,
  };
}

// Group Reservations By Date-Floor-TableId
function groupReservations(reservations) {
  return reservations.reduce((acc, r) => {
    const k = `${r.assignment.date}-${r.assignment.floor}-${r.assignment.tableId}`;
    if (!acc[k]) acc[k] = [];
    acc[k].push(r);
    return acc;
  }, {});
}

// Reservation Timeline Grid
export default function ReservationTimeline({ selectedDate, activeFloor, tables, reservations, startHour, endHour }) {
  // Grid Drag Refs
  const gridRef = useRef(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, sl: 0, st: 0 });
 
  // Hour Range Calculation
  const totalHours = endHour < startHour ? endHour + 24 - startHour : endHour - startHour;
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => (startHour + i) % 24);
 
  // Grouped Reservations Lookup
  const grouped = useMemo(() => groupReservations(reservations), [reservations]);
 
  // Visible Tables By Active Floor
  const visibleTables = useMemo(
    () => (activeFloor ? tables.filter((t) => t.floor === activeFloor) : tables),
    [tables, activeFloor]
  );
 
  // 2D Grid Drag Handlers
  const onGridDown = (e) => {
    dragging.current = true;
    dragStart.current = { x: e.pageX, y: e.pageY, sl: gridRef.current.scrollLeft, st: gridRef.current.scrollTop };
  };
  const onGridMove = (e) => {
    if (!dragging.current) return;
    gridRef.current.scrollLeft = dragStart.current.sl - (e.pageX - dragStart.current.x);
    gridRef.current.scrollTop = dragStart.current.st - (e.pageY - dragStart.current.y);
  };
  const onGridUp = () => (dragging.current = false);
 
  return (
    <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-[#dddddd] dark:border-[#2d2d2d]">
      <div ref={gridRef} onMouseDown={onGridDown} onMouseMove={onGridMove} onMouseUp={onGridUp} onMouseLeave={onGridUp} className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing">
        <div className="inline-flex flex-col min-w-full">
          {/* Hour Header */}
          <div className="flex sticky top-0 z-20">
            <div className="sticky left-0 z-30 w-20 h-14 shrink-0 border-r border-b border-[#dddddd] dark:border-[#2d2d2d] bg-[#f3f3f3] dark:bg-[#111315] md:w-24 lg:w-28" />
            {hours.map((h) => (
              <div key={h} style={{ width: COL_W }} className="shrink-0 flex items-center justify-center h-14 border-r border-b border-[#dddddd] bg-[#f3f3f3] text-xs font-bold text-[#121212] dark:border-[#2d2d2d] dark:bg-[#111315] dark:text-white">
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {visibleTables.map((tableObj, idx) => {
            const floorKey = activeFloor || tableObj.floor;
            const resos = grouped[`${selectedDate}-${floorKey}-${tableObj.id}`] || [];

            return (
              <div key={tableObj.id} className="flex">
                {/* Table Label */}
                <div className={`sticky left-0 z-10 w-20 shrink-0 flex items-center justify-center border-r bg-[#f3f3f3] dark:bg-[#111315] border-[#dddddd] text-sm font-bold text-[#121212] dark:border-[#2d2d2d] md:w-24 lg:w-28 ${idx === visibleTables.length - 1 ? "" : "border-b"}`}>
                  {tableObj.id}
                </div>

                {/* Timeline Track */}
                <div
                  className={`relative h-20 md:h-24 lg:h-26 bg-[#f3f3f3] dark:bg-[#111315] ${idx === visibleTables.length - 1 ? "" : "border-b border-[#dddddd]/50 dark:border-[#2d2d2d]/50"}`}
                  style={{ width: (totalHours + 1) * COL_W }}
                >
                  {/* Hour Dividers */}
                  {hours.map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 border-r border-black/5 dark:border-white/5" style={{ left: (i + 1) * COL_W }} />
                  ))}

                  {/* Reservation Blocks */}
                  {resos.map((r) => {
                    const { left, width } = toPixels(r.assignment.startTime, r.assignment.endTime, startHour);
                    return (
                      <div key={r.uid} className={`absolute top-1.5 bottom-1.5 rounded-2xl flex flex-col justify-between px-3 py-2 md:top-2 md:bottom-2 ${blockColor(r.status)}`} style={{ left, width }}>
                        <span className="truncate text-[13px] font-bold leading-tight">{r.customer.fullName}</span>
                        <div className="flex items-center gap-1 text-[12px] font-bold opacity-60">
                          <Users size={12} /> {r.assignment.partySize}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
