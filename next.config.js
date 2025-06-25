/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['images.microcms-assets.io'],
    unoptimized: true,
  },
}

module.exports = nextConfig