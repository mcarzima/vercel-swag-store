import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your Vercel Swag Store cart.",
  openGraph: {
    title: "Your Cart | Vercel Swag Store",
    description: "Review the items in your Vercel Swag Store cart.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vercel Swag Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Cart | Vercel Swag Store",
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
