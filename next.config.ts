import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Add your Cloudinary domain here
  },
};

export default nextConfig;
