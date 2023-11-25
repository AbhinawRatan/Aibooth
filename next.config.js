/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Enables React's Strict Mode for development, which helps with identifying potential problems
  
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // You can modify the webpack config here
  
      return config;
    },
  
    // Additional configuration options can be added here as needed
  }
  
  module.exports = nextConfig;
  