"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Redirect If Already Logged In
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-8 bg-[#a5b4fc]">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20">
          <UtensilsCrossed size={24} className="text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">ReziPOS</h1>
      </div>

      {/* CTA Button */}
      <Link href="/login" className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-[#a5b4fc] bg-white hover:bg-white/90 active:scale-[0.98] transition-all">
        Giriş Yap
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Copyright */}
      <p className="absolute bottom-8 text-white/30 text-xs font-medium tracking-wider">
        © {new Date().getFullYear()} ReziPOS. Tüm hakları saklıdır.
      </p>
    </div>
  );
}