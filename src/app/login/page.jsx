"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/hooks/useAuth";
import MobileAuthForm from "@/components/login/MobileAuthForm";
import DesktopAuthForm from "@/components/login/DesktopAuthForm";

export default function AuthPage() {
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();

  // Login / Register Toggle
  const [isLogin, setIsLogin] = useState(true);
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  // Form Fields
  const [formData, setFormData] = useState({ username: "", emailOrUsername: "", password: "" });
  // Success Modal State
  const [successModal, setSuccessModal] = useState(null);
  // Button Error State
  const [buttonError, setButtonError] = useState(null);
  // Combined Pending State
  const isPending = login.isPending || register.isPending;

  // Redirect If Token Exists
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Clear Errors On Mode Switch
  useEffect(() => {
    setButtonError(null);
    setSuccessModal(null);
  }, [isLogin]);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonError(null);

    if (isLogin) {
      const isEmail = formData.emailOrUsername.includes("@");
      login.mutate(
        { ...(isEmail ? { email: formData.emailOrUsername } : { username: formData.emailOrUsername }), password: formData.password },
        {
          onSuccess: () => { setSuccessModal("login"); setTimeout(() => router.push("/dashboard"), 3000); },
          onError: (err) => {
            setButtonError(err?.response?.data?.message || "Kullanıcı adı/e-posta veya şifre hatalı.");
            setTimeout(() => setButtonError(null), 3000);
          },
        }
      );
    } else {
      register.mutate(
        { username: formData.username, email: formData.emailOrUsername, password: formData.password },
        {
          onSuccess: () => { setSuccessModal("register"); },
          onError: (err) => {
            setButtonError(err?.response?.data?.message || "Bir hata oluştu, lütfen tekrar deneyin.");
            setTimeout(() => setButtonError(null), 3000);
          },
        }
      );
    }
  };

  // Shared Form Props
  const formProps = { isLogin, setIsLogin, formData, setFormData, showPassword, setShowPassword, handleSubmit, isPending, buttonError };

  return (
    <>
      {/* Success Login Modal */}
      {successModal === "login" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#98A2F3]/10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#a5b4fc]">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">Giriş başarılı!</h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">Dashboard'a yönlendiriliyorsunuz.</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="h-full bg-[#a5b4fc] origin-left" style={{ animation: "shrink 3s linear forwards" }} />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Success Register Modal */}
      {successModal === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#d4f0d4]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#166534]">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">Hesap oluşturuldu!</h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">Artık giriş yapabilirsiniz.</p>
              </div>
              <button onClick={() => { setSuccessModal(null); setIsLogin(true); }} className="w-full py-3.5 rounded-2xl font-bold bg-[#121212] text-white hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-black">
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileAuthForm {...formProps} />
      <DesktopAuthForm {...formProps} />
    </>
  );
}