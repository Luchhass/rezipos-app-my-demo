"use client";

import { Mail, Lock, Eye, EyeOff, User, UtensilsCrossed, ShieldCheck, CheckCircle2 } from "lucide-react";
import SubmitButton from "@/components/login/SubmitButton";

// Desktop Input Class
const inputClass = "w-full h-15 pl-12 pr-6 rounded-2xl border border-transparent bg-[#f8f9fa] outline-none focus:border-[#98A2F3] dark:bg-[#111111] dark:text-white";

// Desktop Label Class
const labelClass = "pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400";

// Desktop Auth Form
export default function DesktopAuthForm({ isLogin, setIsLogin, formData, setFormData, showPassword, setShowPassword, handleSubmit, isPending, buttonError }) {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen py-14 px-8 bg-[#f3f3f3] dark:bg-[#0a0a0a]">
      <div className="flex overflow-hidden w-full max-w-5xl rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-[#1a1a1a] lg:h-[min(660px,calc(100vh-7rem))]">
        {/* Branding Panel */}
        <div className="relative flex flex-col justify-between flex-1 py-12 px-12 bg-linear-to-br from-[#98A2F3] to-[#7a85e8] text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md">
              <UtensilsCrossed size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">ReziPOS</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              The New <br /> Standard in <br /> Management.
            </h1>
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 text-white/90">
                <div className="p-2 rounded-lg bg-white/20"><ShieldCheck size={20} /></div>
                Secure Payment Infrastructure
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="p-2 rounded-lg bg-white/20"><CheckCircle2 size={20} /></div>
                Real-time Stock Tracking
              </div>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">ReziPOS v2.0 // Enterprise</p>
        </div>

        {/* Form Panel */}
        <div className="flex flex-[1.1] flex-col items-center justify-center py-12 px-8 bg-white dark:bg-[#1a1a1a]">
          <div className="flex flex-col w-full max-w-90 h-full justify-center gap-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#121212] dark:text-white">{isLogin ? "Welcome Back" : "Get Started"}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{isLogin ? "Sign in to access your dashboard." : "Create your account in seconds."}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username Field (register only) */}
              {!isLogin && (
                <div className="flex flex-col gap-1">
                  <label className={labelClass}>Kullanıcı Adı</label>
                  <div className="relative group">
                    <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                    <input type="text" placeholder="ornek_kullanici" className={inputClass} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                  </div>
                </div>
              )}

              {/* Email / Username Field */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>{isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}</label>
                <div className="relative group">
                  <Mail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                  <input type={isLogin ? "text" : "email"} placeholder="ornek@mail.com" className={inputClass} onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })} required />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Şifre</label>
                <div className="relative group">
                  <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-gray-400 hover:text-[#a5b4fc]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <SubmitButton isPending={isPending} buttonError={buttonError} isLogin={isLogin} />
            </form>

            {/* Toggle Login/Register */}
            <p className="text-sm text-center text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#a5b4fc] hover:underline">
                {isLogin ? "Register Now" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
