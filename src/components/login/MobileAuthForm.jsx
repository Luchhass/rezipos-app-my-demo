"use client";

import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import SubmitButton from "@/components/login/SubmitButton";

export default function MobileAuthForm({
  isLogin,
  setIsLogin,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  handleSubmit,
  isPending,
  buttonError,
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#a5b4fc] lg:hidden">
      {/* Intro */}
      <div className="flex flex-1 flex-col justify-end px-8 pb-10">
        <p className="mb-1 text-lg font-medium text-white/70">{isLogin ? "Hoş geldiniz," : "Merhaba,"}</p>
        <h1 className="text-4xl font-black leading-tight text-white">{isLogin ? "Giriş Yap!" : "Kayıt Ol!"}</h1>
      </div>

      {/* Form Panel */}
      <div className="flex min-h-[75dvh] flex-col rounded-t-3xl bg-[#f3f3f3] px-8 pt-10 pb-10 dark:bg-[#111315]">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Username Field */}
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Kullanıcı Adı</label>

                <div className="group relative">
                  <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                  <input
                    type="text"
                    placeholder="ornek_kullanici"
                    onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                    className="h-15 w-full rounded-2xl border border-transparent bg-white pr-6 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#2d2d2d] dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {isLogin ? "E-posta veya Kullanıcı Adı" : "E-posta"}
              </label>

              <div className="group relative">
                <Mail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                <input
                  type={isLogin ? "text" : "email"}
                  placeholder="ornek@mail.com"
                  onChange={(event) => setFormData({ ...formData, emailOrUsername: event.target.value })}
                  className="h-15 w-full rounded-2xl border border-transparent bg-white pr-6 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#2d2d2d] dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Şifre</label>

              <div className="group relative">
                <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#98A2F3]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="h-15 w-full rounded-2xl border border-transparent bg-white pr-12 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#2d2d2d] dark:text-white"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#98A2F3]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Submit Button */}
          <SubmitButton isPending={isPending} buttonError={buttonError} isLogin={isLogin} />

          {/* Auth Toggle */}
          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-[#a5b4fc] hover:underline"
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}