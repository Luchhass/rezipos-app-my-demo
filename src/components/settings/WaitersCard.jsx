"use client";

import { useState } from "react";
import * as Icons from "lucide-react";

const WAITERS = [
  { id: 1, name: "Ahmet Kaya", role: "Garson", status: "active", color: "#a5b4fc", textColor: "white" },
  { id: 2, name: "Merve Yıldız", role: "Baş Garson", status: "active", color: "#bbf7d0", textColor: "#1a5c1a" },
  { id: 3, name: "Can Demir", role: "Garson", status: "off", color: "#fde68a", textColor: "#78450a" },
  { id: 4, name: "Elif Şahin", role: "Garson", status: "active", color: "#f0d4f0", textColor: "#5c1a5c" },
  { id: 5, name: "Burak Tunç", role: "Garson", status: "active", color: "#d4eaf0", textColor: "#0a3c5c" },
];

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function WaitersCard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-72 lg:h-full min-h-0 overflow-hidden flex flex-col gap-4 md:gap-6 lg:gap-8 p-4 md:p-5 lg:p-6 border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <h2 className="text-[26px] md:text-[29px] lg:text-[32px] tracking-tighter font-black leading-none text-[#121212] dark:text-white">
          {showForm ? "Yeni Garson" : "Garsonlar"}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#a5b4fc] rounded-xl text-white text-[13px] font-black hover:opacity-90 active:scale-95 transition-all"
          >
            <Icons.Plus size={14} strokeWidth={3} />
            Yeni Garson
          </button>
        )}
      </div>

      {/* List */}
      {!showForm && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
          {WAITERS.map((w) => (
            <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-[13px] font-black shrink-0"
                style={{ backgroundColor: w.color, color: w.textColor }}
              >
                {getInitials(w.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] md:text-[15px] font-bold leading-tight text-[#121212] dark:text-white truncate">{w.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-[#121212] dark:text-white mt-0.5">{w.role}</p>
              </div>
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0"
                style={
                  w.status === "active"
                    ? { backgroundColor: "#d4f0d4", color: "#1a5c1a" }
                    : { backgroundColor: "#f0d4d4", color: "#7a1a1a" }
                }
              >
                {w.status === "active" ? "Aktif" : "İzinli"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
          <input
            className="w-full h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white text-[14px] font-bold outline-none placeholder:opacity-40"
            placeholder="Ad Soyad"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white text-[14px] font-bold outline-none placeholder:opacity-40"
              placeholder="Telefon"
            />
            <input
              className="h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white text-[14px] font-bold outline-none placeholder:opacity-40"
              placeholder="Rol"
            />
          </div>
          <input
            type="password"
            className="w-full h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white text-[14px] font-bold outline-none placeholder:opacity-40"
            placeholder="Şifre"
          />
          <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="h-12 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white text-[14px] font-black hover:opacity-80 active:scale-95 transition-all"
            >
              İptal
            </button>
            <button className="h-12 rounded-2xl bg-[#a5b4fc] text-white text-[14px] font-black hover:opacity-90 active:scale-95 transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}