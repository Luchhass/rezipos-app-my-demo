import { Inter, Geist_Mono } from "next/font/google";
import TanstackProvider from "@/providers/TanstackProvider";
import Header from "@/components/Header";
import GlobalUI from "@/components/GlobalUI";
import "./globals.css";

// Font Definitions
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Page Metadata
export const metadata = {
  title: "ReziPOS",
  description: "Restaurant Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var s=localStorage.getItem('app-theme')||'system';if(s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');})();`
        }} />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <TanstackProvider>
          {/* Global UI Elements */}
          <GlobalUI />
          <Header />
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-h-screen bg-[#f3f3f3] dark:bg-[#111315]">
            {children}
          </div>
        </TanstackProvider>
      </body>
    </html>
  );
}