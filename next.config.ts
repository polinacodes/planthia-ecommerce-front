import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Calidades permitidas (las tarjetas de la home piden 90 para que las fotos se vean nítidas)
    qualities: [75, 90],
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
