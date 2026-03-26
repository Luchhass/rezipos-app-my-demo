"use client";

import { XCircle } from "lucide-react";

export default function SubmitButton({ isPending, buttonError, isLogin }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`mt-2 h-15 w-full rounded-2xl py-4 text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-60 ${
        buttonError ? "bg-red-500 text-white" : "bg-[#121212] text-white hover:opacity-90 lg:dark:bg-white lg:dark:text-black"
      }`}
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {isLogin ? "Giriş yapılıyor..." : "Hesap oluşturuluyor..."}
        </div>
      ) : buttonError ? (
        <div className="flex items-center justify-center gap-2">
          <XCircle size={18} />
          <span className="truncate text-sm">{buttonError}</span>
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