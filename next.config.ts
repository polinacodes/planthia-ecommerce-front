import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // unoptimized: true, //desarrollo, sacar para produccion
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
