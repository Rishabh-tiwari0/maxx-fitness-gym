import { Archivo, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { brand } from "@/data/site-data";
import "./globals.css";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontDisplay = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${brand.name} | Membership & Training`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Maxx Fitness Gym - expert coaching, premium equipment, and a training community that shows up.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontBody.variable} ${fontDisplay.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
