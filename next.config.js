const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Force single Yjs instance to prevent "Yjs was already imported" warning
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: path.resolve(__dirname, "node_modules/yjs"),
    };
    return config;
  },
};

module.exports = nextConfig;
