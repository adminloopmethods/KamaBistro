// layout.tsx
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";
import Header from "./_Components/layout/Header";
import Sidebar from "./_Components/layout/Sidebar";
// import {ThemeProvider} from "@/Context/ThemeContext";
import {Provider} from "@/Context/EditorContext";
import {Poppins} from "next/font/google";
import {ThemeProvider} from "@/components/ui/theme-provider";
import FloatingNavbar from "./_Components/layout/FloatingNavbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // pick only weights you need
  variable: "--font-poppins",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAMA CMS Dashboard",
  description: "Modern content management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-20`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider>
            <div className="min-h-screen flex flex-col px-4 pb-4 relative">
              <Header brand="KAMA" />
              <div className="flex flex-1 gap-4 mt-4">
                {/* <Sidebar /> */}
                <main className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 overflow-hidden ">
                  {children}
                </main>
              </div>

              {/* Floating Navbar positioned at bottom center */}
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <FloatingNavbar />
              </div>
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
