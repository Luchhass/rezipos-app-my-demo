"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function LandingPage() {
  // Router
  const router = useRouter();

  // Redirect If Already Logged In
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-[#a5b4fc] px-8 md:gap-10 lg:gap-12">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <UtensilsCrossed size={24} className="text-white" />
        </div>

        <h1 className="text-4xl font-black tracking-tight text-white">ReziPOS</h1>
      </div>

      {/* CTA Button */}
      <Link
        href="/login"
        className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-[#a5b4fc] transition-all hover:bg-white/90 active:scale-[0.98]"
      >
        Giriş Yap
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Copyright */}
      <p className="absolute bottom-8 text-xs font-medium tracking-wider text-white/30">© {new Date().getFullYear()} ReziPOS. Tüm hakları saklıdır.</p>
    </div>
  );
}