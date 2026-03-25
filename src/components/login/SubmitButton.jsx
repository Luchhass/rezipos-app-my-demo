"use client";

import { XCircle } from "lucide-react";

// Submit Button
export default function SubmitButton({ isPending, buttonError, isLogin }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`w-full py-4 h-15 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-60 mt-2 ${buttonError ? "bg-red-500 text-white" : "text-white hover:opacity-90 bg-[#121212] lg:dark:bg-white lg:dark:text-black"}`}
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          {isLogin ? "Giriş yapılıyor..." : "Hesap oluşturuluyor..."}
        </div>
      ) : buttonError ? (
        <div className="flex items-center justify-center gap-2">
          <XCircle size={18} />
          <span className="text-sm truncate">{buttonError}</span>
        </div>
      ) : isLogin ? (
        <span>
          <span className="lg:hidden">Giriş Yap</span>
          <span className="hidden lg:inline">Sign In</span>
        </span>
      ) : (
        <span>
          <span className="lg:hidden">Kayıt Ol</span>
          <span className="hidden lg:inline">Register Now</span>
        </span>
      )}
    </button>
  );
}
