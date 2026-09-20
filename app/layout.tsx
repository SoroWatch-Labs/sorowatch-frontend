import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "SoroWatch",
  description: "AI-agent risk monitoring for Soroban contracts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
