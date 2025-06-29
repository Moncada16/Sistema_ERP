import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // O si prefieres la configuración más simple (menos segura):
    // domains: ['res.cloudinary.com'],
  },
  // Otras configuraciones que puedas tener...
}

export default nextConfig;
