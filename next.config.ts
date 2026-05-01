import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    products: {
      stale: 300,
      revalidate: 900,
      expire: 3600,
    },
    stock: {
      stale: 60,
      revalidate: 300,
      expire: 600,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
