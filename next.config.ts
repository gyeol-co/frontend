import type { NextConfig } from 'next';

/**
 * BE returns absolute URLs pointing at the S3 bucket (default: `gyeol`,
 * ap-southeast-2). Override `NEXT_PUBLIC_S3_HOSTNAME` per environment.
 */
const s3Hostname = process.env.NEXT_PUBLIC_S3_HOSTNAME ?? 'gyeol.s3.ap-southeast-2.amazonaws.com';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `standalone` bundles only the files needed for `node server.js`, cutting
  // the Docker image to ~150MB. Required for the prod container build.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: s3Hostname,
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
