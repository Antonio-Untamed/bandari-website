import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker/VPS images opt into the standalone server. Cloudflare OpenNext
  // cannot consume `output: "standalone"`, so it stays off unless asked.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
