"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { useUISettings } from "@/contexts/UISettingsContext";

export default function SettingsPage() {
  // UI Settings
  const { theme, setTheme, language, setLanguage, ordersViewMode, setOrdersViewMode } = useUISettings();

  // Local State
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

  // Auth Action
  const { logout } = useLogout();

  // Settings Options
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

  // Add Team Member
  function addMember() {
    if (!newName.trim()) return;

    setMembers((prev) => [...prev, { id: Date.now(), name: newName.trim(), role: newRole.trim() || "—" }]);
    setNewName("");
    setNewRole("");
    setIsAddMemberModalOpen(false);
  }

  // Handle Logout
  function handleLogout() {
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    setTimeout(() => logout(), 3000);
  }

  return (
    <>
      {/* Page Content */}
      <div className="mt-26 flex max-w-160 select-none flex-col gap-4 px-8 py-6 md:mt-0 md:ml-70 md:gap-6 md:py-8 lg:gap-8 lg:py-10">
        {/* Theme */}
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] leading-none font-black tracking-tighter text-[#121212] dark:text-white">Tema</h2>
            <p className="mt-2 text-[13px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
              Uygulamanın görsel renk tonunu belirler. Koyu tema göz yorgunluğunu azaltırken açık tema gün içi kullanıma daha uygundur.
            </p>
          </div>

          <div className="flex h-14 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = theme === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={`flex h-full flex-1 items-center justify-center gap-2.5 text-[13px] font-bold transition-all ${
                    active ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Order View */}
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] leading-none font-black tracking-tighter text-[#121212] dark:text-white">Sipariş Görünümü</h2>
            <p className="mt-2 text-[13px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
              Sipariş geçmişi ve ilgili kart listelerinin varsayılan görünümünü belirler.
            </p>
          </div>

          <div className="flex h-14 overflow-hidden rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d]">
            {ORDER_VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = ordersViewMode === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setOrdersViewMode(option.id)}
                  className={`flex h-full flex-1 items-center justify-center gap-2.5 text-[13px] font-bold transition-all ${
                    active ? "bg-[#a5b4fc] text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Notifications */}
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] leading-none font-black tracking-tighter text-[#121212] dark:text-white">Bildirimler</h2>
            <p className="mt-2 text-[13px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
              Yeni siparişler, mutfak uyarıları ve masa talepleri gibi anlık olaylarda bildirim alıp almayacağınızı yönetir.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-[#dddddd] px-5 py-4 dark:bg-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <Icons.Bell size={18} className="text-[#121212] opacity-40 dark:text-white" />

                <div>
                  <p className="text-[14px] leading-none font-bold text-[#121212] dark:text-white">Anlık bildirimler</p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#121212] opacity-40 dark:text-white">
                    {notifications ? "Yeni olaylarda anında haberdar ol" : "Bildirimler sessiz"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotifications((value) => !value)}
                className={`relative h-6 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                  notifications ? "bg-[#a5b4fc]" : "bg-black/10 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    notifications ? "left-6.5" : "left-0.75"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-[#dddddd] px-5 py-4 dark:bg-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <Icons.RefreshCw size={18} className="text-[#121212] opacity-40 dark:text-white" />

                <div>
                  <p className="text-[14px] leading-none font-bold text-[#121212] dark:text-white">Otomatik güncelleme</p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#121212] opacity-40 dark:text-white">
                    {autoUpdate ? "Güncellemeler arka planda indirilir" : "Güncellemeleri manuel onayla"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAutoUpdate((value) => !value)}
                className={`relative h-6 w-12 shrink-0 rounded-full transition-colors duration-200 ${
                  autoUpdate ? "bg-[#a5b4fc]" : "bg-black/10 dark:bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.75 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    autoUpdate ? "left-6.5" : "left-0.75"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Team */}
        <section className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[32px] leading-none font-black tracking-tighter text-[#121212] dark:text-white">Ekip</h2>
              <p className="mt-2 text-[13px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
                Uygulamaya erişimi olan çalışanları ve rollerini görüntüleyin, yeni üye ekleyin.
              </p>
            </div>

            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#a5b4fc] text-[#a5b4fc] transition-all hover:bg-[#a5b4fc]/10 active:scale-95"
            >
              <Icons.Plus size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 rounded-2xl bg-[#dddddd] px-5 py-4 dark:bg-[#2d2d2d]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#a5b4fc]/20 text-[13px] font-black text-[#a5b4fc]">
                  {member.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="flex-1">
                  <p className="text-[14px] leading-none font-bold text-[#121212] dark:text-white">{member.name}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#121212] opacity-40 dark:text-white">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Session */}
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-[32px] leading-none font-black tracking-tighter text-[#121212] dark:text-white">Oturum</h2>
            <p className="mt-2 text-[13px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
              Aktif oturumunuzu güvenli şekilde sonlandırır. Tekrar giriş yapana kadar uygulamaya erişilemez.
            </p>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="mr-auto flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 px-8 text-red-500 transition-all hover:bg-red-500/20 active:scale-[0.98]"
          >
            <Icons.LogOut size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Çıkış Yap</span>
          </button>
        </section>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div
          onClick={() => setIsLogoutModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]"
          >
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400">
                  <Icons.LogOut size={22} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Oturumu Kapat</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">
                  Hesabınızdan çıkış yapılacak. Tekrar giriş yapana kadar uygulamaya erişilemez.
                </p>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 rounded-2xl bg-[#dddddd] py-3.5 font-bold text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  İptal
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-2xl bg-red-400 py-3.5 font-bold text-white hover:bg-red-500 active:scale-[0.98]"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logging Out Modal */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400">
                  <Icons.LogOut size={22} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Çıkış yapılıyor</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Giriş sayfasına yönlendiriliyorsunuz...</p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="h-full origin-left bg-red-400" style={{ animation: "shrink 3s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div
          onClick={() => setIsAddMemberModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]"
          >
            <div className="flex flex-col gap-4 p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#121212] dark:text-white">Yeni Üye</h3>

                <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <Icons.X size={20} />
                </button>
              </div>

              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="İsim soyisim"
                className="h-12 w-full rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
              />

              <input
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
                placeholder="Görev (ör. Servis, Mutfak)"
                className="h-12 w-full rounded-2xl bg-[#dddddd] px-4 text-[14px] font-bold text-[#121212] outline-none placeholder:opacity-40 dark:bg-[#2d2d2d] dark:text-white"
              />

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="flex-1 rounded-2xl bg-[#dddddd] py-3.5 font-bold text-[#121212] hover:opacity-80 dark:bg-[#2d2d2d] dark:text-white"
                >
                  İptal
                </button>

                <button
                  onClick={addMember}
                  className="flex-1 rounded-2xl bg-[#a5b4fc] py-3.5 font-bold text-white hover:opacity-90 active:scale-[0.98]"
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