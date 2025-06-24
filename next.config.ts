import type { NextConfig } from "next";

const { version } = require('./package.json');

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    version,
  },
  serverRuntimeConfig: {
    version,
  }
};

export default nextConfig;
