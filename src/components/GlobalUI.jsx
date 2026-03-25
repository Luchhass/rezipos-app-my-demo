"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function GlobalUI() {
  // Session Expired Modal State
  const [sessionExpired, setSessionExpired] = useState(false);

  // Listen For Session Expired Event
  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener("session-expired", handler);
    return () => window.removeEventListener("session-expired", handler);
  }, []);

  if (!sessionExpired) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center w-full max-w-sm gap-6 p-8 rounded-3xl border border-[#dddddd] bg-[#f3f3f3] text-center dark:border-[#2d2d2d] dark:bg-[#111315]">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10">
          <Clock size={32} className="text-amber-500" />
        </div>

        {/* Message */}
        <div>
          <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Oturumunuz Sonlandı</h3>
          <p className="text-sm opacity-60 text-[#121212] dark:text-white">Güvenliğiniz için oturumunuz sona erdi. Lütfen tekrar giriş yapın.</p>
        </div>

        {/* Redirect To Login */}
        <button onClick={() => { setSessionExpired(false); window.location.href = "/"; }} className="w-full py-4 rounded-2xl font-bold bg-[#121212] text-white hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-black">
          Giriş Yap
        </button>
      </div>
    </div>
  );
}