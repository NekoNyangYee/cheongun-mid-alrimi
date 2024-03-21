const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 기존 Next.js 설정
};

module.exports = withPWA(nextConfig);