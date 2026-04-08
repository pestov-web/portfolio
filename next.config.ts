import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/config/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Яндекс аватары
      { hostname: "avatars.yandex.net" },
      // GitHub аватары
      { hostname: "avatars.githubusercontent.com" },
      // Google аватары
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
