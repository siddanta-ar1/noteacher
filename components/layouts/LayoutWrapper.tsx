"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { isImmersiveRoute } from "@/config/routes";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

/**
 * Client-side layout wrapper that conditionally renders the sidebar
 * based on the current route. This allows the root layout to remain
 * a server component for proper metadata support.
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname();
    const isImmersive = isImmersiveRoute(pathname);

    return (
        <div className="flex min-h-screen">
            {!isImmersive && <Sidebar />}
            <main className={`flex-1 ${isImmersive ? "w-full" : "overflow-y-auto"}`}>
                {children}
            </main>
        </div>
    );
}
