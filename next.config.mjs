/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  // Désactiver temporairement le mode strict pour éviter les doubles rendus
  swcMinify: true,  // Utiliser SWC pour minimiser les fichiers
  images: {
    domains: ['localhost'],  // Autoriser l'utilisation d'images locales si besoin
  },
};

export default nextConfig;
