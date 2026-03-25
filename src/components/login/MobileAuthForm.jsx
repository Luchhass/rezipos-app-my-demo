"use client";

import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import SubmitButton from "@/components/login/SubmitButton";

// Mobile Input Class
const inputClass = "w-full h-15 pl-12 pr-6 rounded-2xl border border-transparent bg-white outline-none focus:border-[#98A2F3] dark:bg-[#2d2d2d] dark:text-white";

// Mobile Label Class
const labelClass = "pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400";

// Mobile Auth Form
export default function MobileAuthForm({ isLogin, setIsLogin, formData, setFormData, showPassword, setShowPassword, handleSubmit, isPending, buttonError }) {
  return (
    <div className="relative flex flex-col min-h-dvh bg-[#a5b4fc] lg:hidden">
      <div className="flex flex-col justify-end flex-1 px-8 pb-10">
        <p className="text-white/70 text-lg font-medium mb-1">{isLogin ? "Hoş geldiniz," : "Merhaba,"}</p>
        <h1 className="text-white text-4xl font-black leading-tight">{isLogin ? "Giriş Yap!" : "Kayıt Ol!"}</h1>
      </div>

      <div className="flex flex-col px-8 pt-10 pb-10 rounded-t-3xl bg-[#f3f3f3] dark:bg-[#111315]" style={{ minHeight: "75dvh" }}>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-4">
            {/* Username Field (register only) */}
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Kullanıcı Adı</label>
                <div className="relative group">
                  <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                  <input type="text" placeholder="ornek_kullanici" className={inputClass} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                </div>
              </div>
            )}

            {/* Email / Username Field */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>{isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}</label>
              <div className="relative group">
                <Mail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                <input type={isLogin ? "text" : "email"} placeholder="ornek@mail.com" className={inputClass} onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })} required />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Şifre</label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-4 right-4 text-gray-400 hover:text-[#98A2F3]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <SubmitButton isPending={isPending} buttonError={buttonError} isLogin={isLogin} />

          {/* Toggle Login/Register */}
          <p className="text-sm text-center text-gray-500">
            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#a5b4fc] hover:underline">
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
