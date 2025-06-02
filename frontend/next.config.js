/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // CSS処理設定
  compiler: {
    // styled-componentsサポート（必要に応じて）
    styledComponents: true,
  },
  // TypeScript設定
  typescript: {
    // 型チェックエラーでビルドを止めない（開発時のみ）
    ignoreBuildErrors: false,
  },
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
