// Root Layout - Server Component for proper metadata support
import "./globals.css";
import type { Metadata } from "next";
import { LayoutWrapper } from "@/components/layouts/LayoutWrapper";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "NOTEacher - Elite Teaching, Automated",
    template: "%s | NOTEacher",
  },
  description:
    "Transform static syllabuses into interactive, mystery-driven scrollytelling narratives. Master complex concepts through the eyes of a world-class mentor.",
  keywords: [
    "learning",
    "education",
    "interactive courses",
    "scrollytelling",
    "AI teaching",
  ],
  authors: [{ name: "NOTEacher Labs" }],
  openGraph: {
    title: "NOTEacher - Elite Teaching, Automated",
    description:
      "Join thousands of engineers mastering hardware through interactive scrollytelling.",
    type: "website",
    siteName: "NOTEacher",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOTEacher - Elite Teaching, Automated",
    description:
      "Join thousands of engineers mastering hardware through interactive scrollytelling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Toaster } from "@/components/ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="selection:bg-navy/10 bg-white">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
