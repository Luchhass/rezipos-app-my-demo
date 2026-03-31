"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import data from "@/data/reservations.json";
import FloorSlider from "@/components/reservations/FloorSlider";
import ReservationTimeline from "@/components/reservations/ReservationTimeline";
import { redirect } from "next/navigation";

export default function ReservationPage() {
  // redirect("/take-order");
  
  // Restaurant Config
  const { restaurantConfig, reservations } = data;
  const { layout, operatingHours } = restaurantConfig;
  const { tables, floors } = layout;
  const { open: startHour, close: endHour } = operatingHours;

  // Available Dates
  const availableDates = useMemo(
    () => Array.from(new Set(reservations.map((reservation) => reservation.assignment.date))).sort(),
    [reservations]
  );

  // Filter State
  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "");
  const [activeFloor, setActiveFloor] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const dateRef = useRef(null);

  // Format Date For Display
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Close Dropdown On Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-26 flex h-screen select-none flex-col gap-8 overflow-hidden bg-[#f3f3f3] px-8 py-6 dark:bg-[#111315] md:mt-0 md:ml-70 md:py-8 lg:py-10">
      {/* Header */}
      <header className="relative flex h-14.5 shrink-0 justify-between gap-4">
        {/* Date Picker */}
        <div ref={dateRef} className="relative flex-1 md:w-50 md:flex-none">
          <button onClick={() => setIsDateOpen(!isDateOpen)} className="flex h-14.5 w-full items-center overflow-hidden rounded-2xl">
            <div className="flex h-full w-14 items-center justify-center border-r border-white/20 bg-[#a5b4fc]">
              <Calendar size={20} className="text-white" />
            </div>

            <div className="flex h-full flex-1 items-center bg-[#dddddd] px-5 text-gray-400 hover:text-gray-600 dark:bg-[#2d2d2d]">
              <span className="text-sm font-bold">{formatDate(selectedDate)}</span>
              <ChevronDown size={16} className={`ml-auto transition-transform ${isDateOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Date Dropdown */}
          {isDateOpen && (
            <div className="absolute top-[110%] left-0 z-50 animate-in fade-in zoom-in duration-200">
              <div className="w-48 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
                <div className="bg-[#a5b4fc] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">Date</div>

                <div className="max-h-60 overflow-y-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setIsDateOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-bold ${date === selectedDate ? "text-[#98A2F3]" : "opacity-60"}`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <span className="flex-1 md:w-50 md:flex-none" />
      </header>

      {/* Floor Slider */}
      <FloorSlider floors={floors} tables={tables} activeFloor={activeFloor} setActiveFloor={setActiveFloor} />

      {/* Divider */}
      <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Reservation Timeline */}
      <ReservationTimeline
        selectedDate={selectedDate}
        activeFloor={activeFloor}
        tables={tables}
        reservations={reservations}
        startHour={startHour}
        endHour={endHour}
      />
    </div>
  );
}