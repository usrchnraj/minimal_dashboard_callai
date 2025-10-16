/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vercel/CI builds won’t fail on lint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
