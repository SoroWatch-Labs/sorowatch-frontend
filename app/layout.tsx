import "./globals.css";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { themeInitScript } from "@/lib/theme";

export const metadata = {
  title: "SoroWatch",
  description: "AI-agent risk monitoring for Soroban contracts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the init script adds the "dark" class to
    // <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
