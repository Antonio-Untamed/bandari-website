import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FloatingWhatsApp, SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: {
    default: "Bandari Auto Imports — Order, track and clear vehicles for Kenya",
    template: "%s · Bandari Auto Imports",
  },
  description:
    "Import vehicles from Japan, the UK and the UAE into Kenya. Transparent landed costs, live shipment tracking to Mombasa, and a shared wall of client engagements.",
  keywords: [
    "car import Kenya",
    "import vehicle Mombasa",
    "track shipment Kenya",
    "landed cost calculator Kenya",
    "Japan used cars Kenya",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
