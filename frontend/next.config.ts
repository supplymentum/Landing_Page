import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Imágenes servidas desde Supabase Storage (bucket cms-media)
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@docs": path.join(__dirname, "../docs"),
    },
  },
};

export default nextConfig;
