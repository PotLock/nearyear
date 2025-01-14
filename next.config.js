/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.near.social',
      },
      {
        protocol: 'https',
        hostname: 'another-domain.com',
      },
      {
        protocol: 'https',
        hostname: 'i.near.social',
      },
      {
        protocol: 'https',
        hostname: 'robohash.org',
      },
    ],
  },
};

module.exports = nextConfig;
