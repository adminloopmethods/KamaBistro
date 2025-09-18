import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "example.com",          // your placeholder domain
      "media.istockphoto.com" // add istockphoto here
    ],
  },
};

export default nextConfig;

