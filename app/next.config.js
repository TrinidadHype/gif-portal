/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["i.giphy.com", "media3.giphy.com", "media4.giphy.com"],
  },
};

module.exports = nextConfig;
