import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.getyourguide.com',
      },
      {
        protocol: 'https',
        hostname: 'himalayantrekkers.com',
      },
      {
        protocol: 'https',
        hostname: 'api.himalayantrekkers.com',
      },
      {
        protocol: 'https',
        hostname: 'photo.ntb.gov.np',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
