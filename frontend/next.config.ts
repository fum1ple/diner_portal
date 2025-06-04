import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  // コンパイル最適化設定
  experimental: {
    // 増分静的再生成の設定
    optimizePackageImports: ['bootstrap', '@popperjs/core'],
    // TypeScriptのインクリメンタルビルドを有効化
    typedRoutes: false, // 大きなプロジェクトでは無効化
  },
  
  // 開発時のパフォーマンス向上
  compiler: {
    // styled-componentsサポート（必要に応じて）
    styledComponents: true,
    // 本番環境でのコンソールログ削除
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // webpack設定の最適化
  webpack: (config, { dev }) => {
    if (dev) {
      // 開発時のみキャッシュを有効化
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // 開発時のソースマップを軽量化
      config.devtool = 'eval-cheap-module-source-map';
    }
    
    return config;
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
  
  // 出力設定
  output: 'standalone',
  
  // 静的最適化の設定
  trailingSlash: false,
  
  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
