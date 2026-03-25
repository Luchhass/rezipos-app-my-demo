"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { useUISettings } from "@/contexts/UISettingsContext";

export default function SettingsPage() {
  const { theme, setTheme, language, setLanguage, ordersViewMode, setOrdersViewMode } =
    useUISettings();

  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [members, setMembers] = useState([
    { id: 1, name: "Ahmet Kaya", role: "Kaptan" },
    { id: 2, name: "Merve Yıldız", role: "Servis" },
    { id: 3, name: "Can Demir", role: "Mutfak" },
  ]);

  const { logout } = useLogout();

  function addMember() {
    if (!newName.trim()) return;

    setMembers((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), role: newRole.trim() || "—" },
    ]);

    setNewName("");
    setNewRole("");
    setIsAddMemberModalOpen(false);
  }

  function handleLogout() {
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    setTimeout(() => logout(), 3000);
  }

  const THEME_OPTIONS = [
    { id: "light", label: "Açık", icon: Icons.Sun },
    { id: "dark", label: "Koyu", icon: Icons.Moon },
    { id: "system", label: "Otomatik", icon: Icons.Monitor },
  ];

  const LANG_OPTIONS = [
    { id: "tr", label: "Türkçe", flag: "🇹🇷" },
    { id: "en", label: "English", flag: "🇬🇧" },
  ];

  const ORDER_VIEW_OPTIONS = [
    { id: "grid", label: "Grid", icon: Icons.LayoutGrid },
    { id: "list", label: "List", icon: Icons.List },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 mt-26 md:mt-0 md:ml-70 px-8 py-6 md:px-8 md:py-8 lg:px-8 lg:py-10 select-none lg:max-w-160">
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
              Tema
            </h2>
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              Uygulamanın görsel renk tonunu belirler. Koyu tema göz
              yorgunluğunu azaltırken açık tema gün içi kullanıma daha uygundur.
            </p>
          </div>

          <div className="flex h-14 rounded-2xl overflow-hidden bg-[#dddddd] dark:bg-[#2d2d2d]">
            {THEME_OPTIONS.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-1 items-center justify-center gap-2.5 h-full font-bold text-[13px] transition-all ${
                    active
                      ? "bg-[#a5b4fc] text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
              Dil
            </h2>
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              Arayüzdeki tüm metinlerin, menülerin ve bildirimlerin hangi dilde
              gösterileceğini belirler.
            </p>
          </div>

          <div className="flex gap-3">
            {LANG_OPTIONS.map((l) => {
              const active = language === l.id;

              return (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`flex flex-col items-start gap-3 flex-1 px-5 py-4 rounded-2xl font-bold transition-all text-left border-2 ${
                    active
                      ? "border-[#a5b4fc] bg-[#a5b4fc]/10 dark:bg-[#a5b4fc]/10 text-[#121212] dark:text-white"
                      : "border-transparent bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white opacity-50 hover:opacity-75"
                  }`}
                >
                  <span className="text-2xl leading-none">{l.flag}</span>
                  <span className="text-[15px]">{l.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
              Sipariş Görünümü
            </h2>
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              Sipariş geçmişi ve ilgili kart listelerinin varsayılan görünümünü belirler.
            </p>
          </div>

          <div className="flex h-14 rounded-2xl overflow-hidden bg-[#dddddd] dark:bg-[#2d2d2d]">
            {ORDER_VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = ordersViewMode === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setOrdersViewMode(option.id)}
                  className={`flex flex-1 items-center justify-center gap-2.5 h-full font-bold text-[13px] transition-all ${
                    active
                      ? "bg-[#a5b4fc] text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
              Bildirimler
            </h2>
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              Yeni siparişler, mutfak uyarıları ve masa talepleri gibi anlık
              olaylarda bildirim alıp almayacağınızı yönetir.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <Icons.Bell
                  size={18}
                  className="text-[#121212] dark:text-white opacity-40"
                />
                <div>
                  <p className="text-[14px] font-bold text-[#121212] dark:text-white leading-none">
                    Anlık bildirimler
                  </p>
                  <p className="text-[11px] font-bold opacity-40 text-[#121212] dark:text-white mt-0.5">
                    {notifications ? "Yeni olaylarda anında haberdar ol" : "Bildirimler sessiz"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotifications((v) => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                  notifications ? "bg-[#a5b4fc]" : "bg-black/10 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.75 w-4.5 h-4.5 rounded-full bg-white transition-all duration-200 shadow-sm ${
                    notifications ? "left-6.5" : "left-0.75"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <Icons.RefreshCw
                  size={18}
                  className="text-[#121212] dark:text-white opacity-40"
                />
                <div>
                  <p className="text-[14px] font-bold text-[#121212] dark:text-white leading-none">
                    Otomatik güncelleme
                  </p>
                  <p className="text-[11px] font-bold opacity-40 text-[#121212] dark:text-white mt-0.5">
                    {autoUpdate
                      ? "Güncellemeler arka planda indirilir"
                      : "Güncellemeleri manuel onayla"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAutoUpdate((v) => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                  autoUpdate ? "bg-[#a5b4fc]" : "bg-black/10 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.75 w-4.5 h-4.5 rounded-full bg-white transition-all duration-200 shadow-sm ${
                    autoUpdate ? "left-6.5" : "left-0.75"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <section className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
                Ekip
              </h2>
              <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Uygulamaya erişimi olan çalışanları ve rollerini görüntüleyin,
                yeni üye ekleyin.
              </p>
            </div>

            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="shrink-0 mt-1 flex items-center justify-center w-12 h-12 rounded-2xl border border-[#a5b4fc] text-[#a5b4fc] hover:bg-[#a5b4fc]/10 active:scale-95 transition-all"
            >
              <Icons.Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#a5b4fc]/20 text-[#a5b4fc] text-[13px] font-black shrink-0">
                  {m.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#121212] dark:text-white leading-none">
                    {m.name}
                  </p>
                  <p className="text-[11px] font-bold opacity-40 text-[#121212] dark:text-white mt-0.5">
                    {m.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] font-black tracking-tighter leading-none text-[#121212] dark:text-white">
              Oturum
            </h2>
            <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
              Aktif oturumunuzu güvenli şekilde sonlandırır. Tekrar giriş yapana
              kadar uygulamaya erişilemez.
            </p>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="mr-auto flex items-center justify-center gap-2 p-4 px-8 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-[0.98] transition-all"
          >
            <Icons.LogOut size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Çıkış Yap
            </span>
          </button>
        </section>
      </div>

      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="overflow-hidden w-full max-w-sm rounded-2xl bg-white dark:bg-[#1a1a1a] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-400/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400">
                  <Icons.LogOut size={22} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Oturumu Kapat
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Hesabınızdan çıkış yapılacak. Tekrar giriş yapana kadar
                  uygulamaya erişilemez.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-[#dddddd] text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  İptal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-red-400 text-white hover:bg-red-500 active:scale-[0.98]"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white dark:bg-[#1a1a1a] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-400/20">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400">
                  <Icons.LogOut size={22} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Çıkış yapılıyor
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Giriş sayfasına yönlendiriliyorsunuz...
                </p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-red-400 origin-left"
                style={{ animation: "shrink 3s linear forwards" }}
              />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {isAddMemberModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsAddMemberModalOpen(false)}
        >
          <div
            className="overflow-hidden w-full max-w-sm rounded-2xl bg-white dark:bg-[#1a1a1a] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#121212] dark:text-white">
                  Yeni Üye
                </h3>

                <button
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icons.X size={20} />
                </button>
              </div>

              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="İsim soyisim"
                className="w-full h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white outline-none text-[14px] font-bold placeholder:opacity-40"
              />

              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Görev (ör. Servis, Mutfak)"
                className="w-full h-12 px-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-white outline-none text-[14px] font-bold placeholder:opacity-40"
              />

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-[#dddddd] text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  İptal
                </button>

                <button
                  onClick={addMember}
                  className="flex-1 py-3.5 rounded-2xl font-bold bg-[#a5b4fc] text-white hover:opacity-90 active:scale-[0.98]"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}