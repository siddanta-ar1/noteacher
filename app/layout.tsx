// Root Layout with Sidebar Navigation
"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layouts/Sidebar";
import { isImmersiveRoute } from "@/config/routes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isImmersive = isImmersiveRoute(pathname);

  return (
    <html lang="en">
      <body className="selection:bg-navy/10 bg-white">
        <div className="flex min-h-screen">
          {!isImmersive && <Sidebar />}
          <main className={`flex-1 ${isImmersive ? "w-full" : "overflow-y-auto"}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
