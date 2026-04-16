import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 uses WASM modules that must stay in Node.js runtime (not bundled)
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "cloudinary",
    "bcryptjs",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
