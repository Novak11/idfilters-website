import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CallButton } from "@/components/CallButton";

const siteUrl = process.env.SITE_URL ?? "https://www.idfilters.rs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ID Filters",
    template: "%s | ID Filters",
  },
  description:
    "Proizvodnja i prodaja filtera za vazduh za civilnu i industrijsku klimatizaciju i ventilaciju.",
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "/",
    siteName: "ID Filters",
    title: "ID Filters",
    description:
      "Proizvodnja i prodaja filtera za vazduh za civilnu i industrijsku klimatizaciju i ventilaciju.",
  },
  icons: {
    icon: "/wp-content/uploads/2014/03/favicon2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground font-sans antialiased`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CallButton phoneNumber="0621235412" />
      </body>
    </html>
  );
}
