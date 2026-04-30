import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = "Official Vercel merchandise. Premium developer apparel, accessories, and gear for builders who ship.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vercel-swag-store.vercel.app"),
  title: {
    default: "Vercel Swag Store",
    template: "%s | Vercel Swag Store",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Vercel Swag Store",
    title: "Vercel Swag Store",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Swag Store",
    description,
    images: ["/og-image.png"],
  },
  other: {
    generator: "vswag-cert-v3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="generator" content="vswag-cert-v3" />
        <meta name="theme-color" content="#171719" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
