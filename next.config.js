/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ['ipfs.near.social', 'another-domain.com', 'i.near.social', 'robohash.org'],
  },
};

module.exports = nextConfig;
