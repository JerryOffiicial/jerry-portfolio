import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Modern One-Page Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.variable} ${dm_sans.variable} antialiased`}>
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
