import { Inter, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import TanstackProvider from "@/providers/TanstackProvider";
import { UISettingsProvider } from "@/contexts/UISettingsContext";
import Header from "@/components/Header";
import GlobalUI from "@/components/GlobalUI";
import "./globals.css";

// Font Definitions
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page Metadata
export const metadata = {
  title: "ReziPOS",
  description: "Restaurant Management System",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();

  const initialTheme = cookieStore.get("app-theme")?.value || "system";
  const initialLanguage = cookieStore.get("app-language")?.value || "tr";
  const initialOrdersViewMode =
    cookieStore.get("orders-view-mode")?.value || "grid";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=document.cookie.match(/(?:^|; )app-theme=([^;]+)/);s=s?decodeURIComponent(s[1]):'system';if(s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>

      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <TanstackProvider>
          <UISettingsProvider
            initialTheme={initialTheme}
            initialLanguage={initialLanguage}
            initialOrdersViewMode={initialOrdersViewMode}
          >
            <GlobalUI />
            <Header />
            <div className="flex flex-col flex-1 min-h-screen bg-[#f3f3f3] dark:bg-[#111315]">
              {children}
            </div>
          </UISettingsProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}