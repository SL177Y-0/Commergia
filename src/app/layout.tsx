import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/commerce/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "../../commergia.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Commergia | Multi-Channel Commerce",
  description: "Commergia by SL177Y",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Commergia | Multi-Channel Commerce",
    description: "Commergia by SL177Y",
    url: siteConfig.url,
    images: [siteConfig.ogImage],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[radial-gradient(circle_at_top,_#f4f4f5,_#ffffff_45%)] text-gray-900 antialiased`}>
        <Providers>
          <Toaster />
          <AnnouncementBar />
          <Header />
          <Breadcrumbs />
          <main className="mx-auto w-full max-w-7xl px-4 md:px-6">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
