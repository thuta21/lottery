/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        fs: false,
      };
    }

    // Fix for 'ws' package warnings
    config.externals.push('bufferutil', 'utf-8-validate');

    return config;
  },
};

module.exports = nextConfig;
