"use client";

import { Mail, Lock, Eye, EyeOff, User, UtensilsCrossed, ShieldCheck, CheckCircle2 } from "lucide-react";
import SubmitButton from "@/components/login/SubmitButton";

export default function DesktopAuthForm({
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
    <div className="hidden min-h-screen items-center justify-center bg-[#f3f3f3] px-8 py-14 dark:bg-[#0a0a0a] lg:flex">
      <div className="flex h-[min(660px,calc(100vh-7rem))] w-full max-w-5xl overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-[#1a1a1a]">
        {/* Branding Panel */}
        <div className="relative flex flex-1 flex-col justify-between bg-linear-to-br from-[#98A2F3] to-[#7a85e8] px-12 py-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <UtensilsCrossed size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">ReziPOS</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl leading-[1.1] font-extrabold tracking-tight">
              The New <br /> Standard in <br /> Management.
            </h1>

            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 text-white/90">
                <div className="rounded-lg bg-white/20 p-2">
                  <ShieldCheck size={20} />
                </div>
                Secure Payment Infrastructure
              </div>

              <div className="flex items-center gap-4 text-white/90">
                <div className="rounded-lg bg-white/20 p-2">
                  <CheckCircle2 size={20} />
                </div>
                Real-time Stock Tracking
              </div>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">ReziPOS v2.0 // Enterprise</p>
        </div>

        {/* Form Panel */}
        <div className="flex flex-[1.1] flex-col items-center justify-center bg-white px-8 py-12 dark:bg-[#1a1a1a]">
          <div className="flex h-full w-full max-w-90 flex-col justify-center gap-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#121212] dark:text-white">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin ? "Sign in to access your dashboard." : "Create your account in seconds."}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username Field */}
              {!isLogin && (
                <div className="flex flex-col gap-1">
                  <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Kullanıcı Adı</label>

                  <div className="group relative">
                    <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                    <input
                      type="text"
                      placeholder="ornek_kullanici"
                      onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                      className="h-15 w-full rounded-2xl border border-transparent bg-[#f8f9fa] pr-6 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#111111] dark:text-white"
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
                  <Mail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                  <input
                    type={isLogin ? "text" : "email"}
                    placeholder="ornek@mail.com"
                    onChange={(event) => setFormData({ ...formData, emailOrUsername: event.target.value })}
                    className="h-15 w-full rounded-2xl border border-transparent bg-[#f8f9fa] pr-6 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#111111] dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Şifre</label>

                <div className="group relative">
                  <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-[#a5b4fc]" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    className="h-15 w-full rounded-2xl border border-transparent bg-[#f8f9fa] pr-12 pl-12 outline-none focus:border-[#98A2F3] dark:bg-[#111111] dark:text-white"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#a5b4fc]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <SubmitButton isPending={isPending} buttonError={buttonError} isLogin={isLogin} />
            </form>

            {/* Auth Toggle */}
            <p className="text-center text-sm text-gray-500">
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