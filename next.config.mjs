/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/tickets',
            permanent: true, // This makes the redirect a 308 permanent redirect
          },
        ]
      },
};

export default nextConfig;
