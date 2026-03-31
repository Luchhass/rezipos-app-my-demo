"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/hooks/useAuth";
import MobileAuthForm from "@/components/login/MobileAuthForm";
import DesktopAuthForm from "@/components/login/DesktopAuthForm";

export default function AuthPage() {
  // Router and Auth Mutations
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();

  // Form Mode
  const [isLogin, setIsLogin] = useState(true);

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    username: "",
    emailOrUsername: "",
    password: "",
  });

  // Feedback State
  const [successModal, setSuccessModal] = useState(null);
  const [buttonError, setButtonError] = useState(null);

  // Combined Pending State
  const isPending = login.isPending || register.isPending;

  // Redirect If Token Exists
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Reset Feedback On Mode Change
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
        {
          ...(isEmail ? { email: formData.emailOrUsername } : { username: formData.emailOrUsername }),
          password: formData.password,
        },
        {
          onSuccess: () => {
            setSuccessModal("login");
            setTimeout(() => router.push("/dashboard"), 3000);
          },
          onError: (err) => {
            setButtonError(err?.response?.data?.message || "Kullanıcı adı/e-posta veya şifre hatalı.");
            setTimeout(() => setButtonError(null), 3000);
          },
        }
      );

      return;
    }

    register.mutate(
      {
        username: formData.username,
        email: formData.emailOrUsername,
        password: formData.password,
      },
      {
        onSuccess: () => {
          setSuccessModal("register");
        },
        onError: (err) => {
          setButtonError(err?.response?.data?.message || "Bir hata oluştu, lütfen tekrar deneyin.");
          setTimeout(() => setButtonError(null), 3000);
        },
      }
    );
  };

  // Shared Form Props
  const formProps = {
    isLogin,
    setIsLogin,
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    handleSubmit,
    isPending,
    buttonError,
  };

  return (
    <>
      {/* Login Success Modal */}
      {successModal === "login" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            {/* Modal Content */}
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              {/* Success Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#98A2F3]/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a5b4fc]">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
              </div>

              {/* Success Text */}
              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Giriş başarılı!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Dashboard&apos;a yönlendiriliyorsunuz.</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="h-full origin-left bg-[#a5b4fc]" style={{ animation: "shrink 3s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Register Success Modal */}
      {successModal === "register" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            {/* Modal Content */}
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              {/* Success Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d4f0d4]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#166534]">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
              </div>

              {/* Success Text */}
              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Hesap oluşturuldu!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Artık giriş yapabilirsiniz.</p>
              </div>

              {/* Primary Action */}
              <button
                onClick={() => {
                  setSuccessModal(null);
                  setIsLogin(true);
                }}
                className="w-full rounded-2xl bg-[#121212] py-3.5 font-bold text-white hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-black"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Forms */}
      <MobileAuthForm {...formProps} />
      <DesktopAuthForm {...formProps} />
    </>
  );
}