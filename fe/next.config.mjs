/** @type {import('next').NextConfig} */
const nextConfig = {
    // Bỏ qua lỗi ESLint lúc build
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Bỏ qua lỗi TypeScript lúc build
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;