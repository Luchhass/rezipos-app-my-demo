"use client";

import { useMemo, useRef } from "react";
import { Users } from "lucide-react";

const COL_W = 120;

// Block Color By Status
function getBlockColor(status) {
  if (status === "ARRIVED") return "bg-[#f3e5ab] text-[#1a1c1e]";
  if (status === "COMPLETED") return "bg-[#c7e8e1] text-[#1a1c1e]";
  return "bg-[#dddddd] text-[#121212]";
}

// Convert HH:MM To Pixel Position
function toPixels(start, end, startHour) {
  const parseTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return (hour < startHour ? hour + 24 : hour) + minute / 60;
  };

  return {
    left: (parseTime(start) - startHour) * COL_W,
    width: (parseTime(end) - parseTime(start)) * COL_W,
  };
}

// Group Reservations By Date, Floor And Table
function groupReservations(reservations) {
  return reservations.reduce((accumulator, reservation) => {
    const key = `${reservation.assignment.date}-${reservation.assignment.floor}-${reservation.assignment.tableId}`;
    if (!accumulator[key]) accumulator[key] = [];
    accumulator[key].push(reservation);
    return accumulator;
  }, {});
}

export default function ReservationTimeline({ selectedDate, activeFloor, tables, reservations, startHour, endHour }) {
  // Drag Scroll Refs
  const gridRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  // Hour Range
  const totalHours = endHour < startHour ? endHour + 24 - startHour : endHour - startHour;
  const hours = Array.from({ length: totalHours + 1 }, (_, index) => (startHour + index) % 24);

  // Grouped Reservations
  const groupedReservations = useMemo(() => groupReservations(reservations), [reservations]);

  // Visible Tables
  const visibleTables = useMemo(
    () => (activeFloor ? tables.filter((table) => table.floor === activeFloor) : tables),
    [tables, activeFloor]
  );

  // Drag Handlers
  const handleMouseDown = (event) => {
    isDragging.current = true;
    dragStart.current = {
      x: event.pageX,
      y: event.pageY,
      scrollLeft: gridRef.current.scrollLeft,
      scrollTop: gridRef.current.scrollTop,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    gridRef.current.scrollLeft = dragStart.current.scrollLeft - (event.pageX - dragStart.current.x);
    gridRef.current.scrollTop = dragStart.current.scrollTop - (event.pageY - dragStart.current.y);
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#dddddd] dark:border-[#2d2d2d]">
      <div
        ref={gridRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="h-full w-full cursor-grab overflow-auto active:cursor-grabbing"
      >
        <div className="inline-flex min-w-full flex-col">
          {/* Hour Header */}
          <div className="sticky top-0 z-20 flex">
            <div className="sticky left-0 z-30 h-14 w-20 shrink-0 border-r border-b border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:w-24 lg:w-28" />

            {hours.map((hour) => (
              <div
                key={hour}
                style={{ width: COL_W }}
                className="flex h-14 shrink-0 items-center justify-center border-r border-b border-[#dddddd] bg-[#f3f3f3] text-xs font-bold text-[#121212] dark:border-[#2d2d2d] dark:bg-[#111315] dark:text-white"
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {visibleTables.map((table, index) => {
            const floorKey = activeFloor || table.floor;
            const reservationsForTable = groupedReservations[`${selectedDate}-${floorKey}-${table.id}`] || [];

            return (
              <div key={table.id} className="flex">
                {/* Table Label */}
                <div
                  className={`sticky left-0 z-10 flex w-20 shrink-0 items-center justify-center border-r border-[#dddddd] bg-[#f3f3f3] text-sm font-bold text-[#121212] dark:border-[#2d2d2d] dark:bg-[#111315] dark:text-white md:w-24 lg:w-28 ${
                    index === visibleTables.length - 1 ? "" : "border-b"
                  }`}
                >
                  {table.id}
                </div>

                {/* Timeline Track */}
                <div
                  style={{ width: (totalHours + 1) * COL_W }}
                  className={`relative h-20 bg-[#f3f3f3] dark:bg-[#111315] md:h-24 lg:h-26 ${
                    index === visibleTables.length - 1 ? "" : "border-b border-[#dddddd]/50 dark:border-[#2d2d2d]/50"
                  }`}
                >
                  {/* Hour Dividers */}
                  {hours.map((_, hourIndex) => (
                    <div
                      key={hourIndex}
                      style={{ left: (hourIndex + 1) * COL_W }}
                      className="absolute top-0 bottom-0 border-r border-black/5 dark:border-white/5"
                    />
                  ))}

                  {/* Reservation Blocks */}
                  {reservationsForTable.map((reservation) => {
                    const { left, width } = toPixels(
                      reservation.assignment.startTime,
                      reservation.assignment.endTime,
                      startHour
                    );

                    return (
                      <div
                        key={reservation.uid}
                        style={{ left, width }}
                        className={`absolute top-1.5 bottom-1.5 flex flex-col justify-between rounded-2xl px-3 py-2 md:top-2 md:bottom-2 ${getBlockColor(
                          reservation.status
                        )}`}
                      >
                        <span className="truncate text-[13px] font-bold leading-tight">{reservation.customer.fullName}</span>

                        <div className="flex items-center gap-1 text-[12px] font-bold opacity-60">
                          <Users size={12} />
                          {reservation.assignment.partySize}
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