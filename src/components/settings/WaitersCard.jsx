"use client";

import { useState } from "react";
import * as Icons from "lucide-react";

// Waiter Data
const WAITERS = [
  { id: 1, name: "Ahmet Kaya", role: "Garson", status: "active", color: "#a5b4fc", textColor: "white" },
  { id: 2, name: "Merve Yıldız", role: "Baş Garson", status: "active", color: "#bbf7d0", textColor: "#1a5c1a" },
  { id: 3, name: "Can Demir", role: "Garson", status: "off", color: "#fde68a", textColor: "#78450a" },
  { id: 4, name: "Elif Şahin", role: "Garson", status: "active", color: "#f0d4f0", textColor: "#5c1a5c" },
  { id: 5, name: "Burak Tunç", role: "Garson", status: "active", color: "#d4eaf0", textColor: "#0a3c5c" },
];

// Get Initials
function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function WaitersCard() {
  // Form State
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex h-72 min-h-0 flex-col gap-4 overflow-hidden rounded-2xl border border-[#dddddd] p-4 dark:border-[#2d2d2d] md:gap-6 md:p-5 lg:h-full lg:gap-8 lg:p-6">
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4">
        <h2 className="text-[26px] leading-none font-black tracking-tighter text-[#121212] dark:text-white md:text-[29px] lg:text-[32px]">
          {showForm ? "Yeni Garson" : "Garsonlar"}
        </h2>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-[#a5b4fc] px-4 py-2.5 text-[13px] font-black text-white transition-all hover:opacity-90 active:scale-95"
          >
            <Icons.Plus size={14} strokeWidth={3} />
            Yeni Garson
          </button>
        )}
      </div>

      {/* Waiter List */}
      {!showForm && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {WAITERS.map((waiter) => (
            <div key={waiter.id} className="flex items-center gap-3 rounded-2xl bg-[#dddddd] px-3 py-2.5 dark:bg-[#2d2d2d]">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-black md:h-11 md:w-11 lg:h-12 lg:w-12"
                style={{ backgroundColor: waiter.color, color: waiter.textColor }}
              >
                {getInitials(waiter.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold leading-tight text-[#121212] dark:text-white md:text-[15px]">{waiter.name}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[#121212] opacity-40 dark:text-white">
                  {waiter.role}
                </p>
              </div>

              <span
                className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black"
                style={waiter.status === "active" ? { backgroundColor: "#d4f0d4", color: "#1a5c1a" } : { backgroundColor: "#f0d4d4", color: "#7a1a1a" }}
              >
                {waiter.status === "active" ? "Aktif" : "İzinli"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Waiter Form */}
      {showForm && (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          <input
            placeholder="Ad Soyad"
            className="h-12 w-full rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Telefon"
              className="h-12 rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
            />
            <input
              placeholder="Rol"
              className="h-12 rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
            />
          </div>

          <input
            type="password"
            placeholder="Şifre"
            className="h-12 w-full rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
          />

          {/* Form Actions */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="h-12 rounded-2xl bg-[#dddddd] text-[14px] font-black text-[#121212] transition-all hover:opacity-80 active:scale-95 dark:bg-[#2d2d2d] dark:text-white"
            >
              İptal
            </button>

            <button className="h-12 rounded-2xl bg-[#a5b4fc] text-[14px] font-black text-white transition-all hover:opacity-90 active:scale-95">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}