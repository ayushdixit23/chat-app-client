import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode:false,
  images: {
    domains: ["d317fpcin2orjd.cloudfront.net", "lh3.googleusercontent.com","cdn.jsdelivr.net"],
  },
};

export default nextConfig;
