/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'vz-03ab8796-bb5.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'byraven.b-cdn.net',
      },
    ],
  },
}

export default nextConfig
