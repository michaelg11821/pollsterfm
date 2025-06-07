import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import type { NextConfig } from "next";

const supabaseUrl = new URL(process.env.SUPABASE_URL!);

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/public/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: supabaseUrl.hostname,
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
