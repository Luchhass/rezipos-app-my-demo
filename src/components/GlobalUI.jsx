"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function GlobalUI() {
  // Session Expired State
  const [sessionExpired, setSessionExpired] = useState(false);

  // Listen For Session Expired Event
  useEffect(() => {
    const handleSessionExpired = () => setSessionExpired(true);

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
  }, []);

  if (!sessionExpired) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">
      {/* Modal */}
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-[#dddddd] bg-[#f3f3f3] p-8 text-center dark:border-[#2d2d2d] dark:bg-[#111315]">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
          <Clock size={32} className="text-amber-500" />
        </div>

        {/* Message */}
        <div>
          <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Oturumunuz Sonlandı</h3>
          <p className="text-sm text-[#121212] opacity-60 dark:text-white">Güvenliğiniz için oturumunuz sona erdi. Lütfen tekrar giriş yapın.</p>
        </div>

        {/* Login Button */}
        <button
          onClick={() => {
            setSessionExpired(false);
            window.location.href = "/";
          }}
          className="w-full rounded-2xl bg-[#121212] py-4 font-bold text-white hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-black"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}