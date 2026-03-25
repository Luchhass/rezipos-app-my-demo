"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import data from "@/data/reservations.json";
import FloorSlider from "@/components/reservations/FloorSlider";
import ReservationTimeline from "@/components/reservations/ReservationTimeline";

export default function ReservationPage() {
  // Restaurant Config Destructuring
  const { restaurantConfig, reservations } = data;
  const { layout, operatingHours } = restaurantConfig;
  const { tables, floors } = layout;
  const { open: startHour, close: endHour } = operatingHours;

  // Available Dates From Reservations
  const availableDates = useMemo(
    () => Array.from(new Set(reservations.map((r) => r.assignment.date))).sort(),
    [reservations]
  );

  // Selected Date State
  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "");
  // Active Floor State
  const [activeFloor, setActiveFloor] = useState(null);
  // Date Dropdown State
  const [isDateOpen, setIsDateOpen] = useState(false);
  const dateRef = useRef(null);

  // Format Date For Display
  const fmtDate = (d) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
  };

  // Close Date Dropdown On Outside Click
  useEffect(() => {
    const h = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setIsDateOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="flex flex-col gap-8 overflow-hidden select-none h-screen mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 bg-[#f3f3f3] dark:bg-[#111315]">
      {/* Header */}
      <header className="h-14.5 shrink-0 flex justify-between gap-4 relative">
        {/* Date Picker */}
        <div className="relative flex-1 md:flex-none md:w-50" ref={dateRef}>
          <button onClick={() => setIsDateOpen(!isDateOpen)} className="w-full flex items-center h-14.5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-center w-14 h-full bg-[#a5b4fc] border-r border-white/20">
              <Calendar size={20} className="text-white" />
            </div>
            <div className="flex-1 flex items-center h-full px-5 bg-[#dddddd] dark:bg-[#2d2d2d] text-gray-400 hover:text-gray-600">
              <span className="text-sm font-bold">{fmtDate(selectedDate)}</span>
              <ChevronDown size={16} className={`ml-auto transition-transform ${isDateOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Date Dropdown */}
          {isDateOpen && (
            <div className="absolute top-[110%] left-0 z-50 animate-in fade-in zoom-in duration-200">
              <div className="w-48 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">Date</div>
                <div className="max-h-60 overflow-y-auto">
                  {availableDates.map((d) => (
                    <button key={d} onClick={() => { setSelectedDate(d); setIsDateOpen(false); }} className={`w-full px-4 py-2 text-left text-xs font-bold ${d === selectedDate ? "text-[#98A2F3]" : "opacity-60"}`}>
                      {fmtDate(d)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="flex-1 md:flex-none md:w-50" />
      </header>

      <FloorSlider floors={floors} tables={tables} activeFloor={activeFloor} setActiveFloor={setActiveFloor} />

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      <ReservationTimeline selectedDate={selectedDate} activeFloor={activeFloor} tables={tables} reservations={reservations} startHour={startHour} endHour={endHour} />
    </div>
  );
}