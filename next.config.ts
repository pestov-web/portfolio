import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/config/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
