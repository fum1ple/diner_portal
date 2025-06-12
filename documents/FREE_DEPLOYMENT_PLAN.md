# Diner Portal - 完全無料デプロイ計画書

## 🆓 完全無料構成での実現

### 目標
- **運用コスト**: 完全に0円
- **機能制限**: 最小限に抑制
- **パフォーマンス**: 小規模利用で十分

## 無料プラン構成

### アーキテクチャ
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │    Render       │    │     Turso       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Next.js 14    │    │   Rails 7.1.5   │    │   SQLite/LibSQL │
│    FREE PLAN    │    │   FREE PLAN     │    │   FREE PLAN     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
    Global CDN               US West                Global Edge
   (100GB/月)              (512MB RAM)             (1M reads/月)
```

### 各プラットフォームの無料制限

#### 🟢 Vercel FREE Plan
```yaml
制限:
  - Bandwidth: 100GB/月
  - ビルド時間: 6000分/月
  - 実行時間: 100時間/月
  - チーム: 1名のみ

十分な理由:
  - 個人プロジェクトなら余裕
  - SSG/ISRで軽量化可能
  - CDN効果で高速
```

#### 🟡 Render FREE Plan  
```yaml
制限:
  - RAM: 512MB
  - CPU: 0.1 CPU units
  - アイドル: 15分でスリープ
  - 起動時間: 初回30秒

対策:
  - メモリ最適化
  - Cron jobで定期アクセス（外部）
  - 初回起動の遅延をUXで対応
```

#### 🟢 Turso FREE Plan
```yaml
制限:
  - Reads: 1M/月
  - Writes: 10K/月  
  - Storage: 500MB
  - Locations: 3箇所まで

十分な理由:
  - 小規模アプリなら余裕
  - SQLiteなので高速
  - 世界分散でレスポンス良好
```

## 無料プラン最適化戦略

### 1. Frontend最適化（Vercel）

#### Next.js設定
```javascript
// next.config.js
const nextConfig = {
  // 静的生成を最大化
  output: 'export', // 完全静的サイト
  
  // 画像最適化無効（制限回避）
  images: {
    unoptimized: true
  },
  
  // バンドルサイズ削減
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@tanstack/react-query']
  }
}
```

#### 軽量化施策
```typescript
// 遅延ローディング最大化
const RestaurantDetail = dynamic(() => import('@/components/RestaurantDetail'), {
  loading: () => <Skeleton />,
  ssr: false
})

// 画像CDN最適化
const optimizedImageUrl = (url: string) => 
  `https://images.unsplash.com/${url}?w=800&q=75&auto=format`
```

### 2. Backend最適化（Render）

#### メモリ最適化
```ruby
# config/environments/production.rb
Rails.application.configure do
  # メモリ使用量削減
  config.cache_store = :memory_store, { size: 32.megabytes }
  
  # ログレベル調整
  config.log_level = :warn
  
  # 不要な機能無効化
  config.action_mailer.perform_deliveries = false
  config.active_job.queue_adapter = :inline
end

# Gemfileの最適化
group :production do
  gem 'bootsnap', require: false
  # 不要なgemは除外
end
```

#### スリープ対策
```ruby
# config/initializers/keep_alive.rb
if Rails.env.production?
  Thread.new do
    loop do
      sleep 12.minutes # 15分未満でself-ping
      begin
        Net::HTTP.get(URI("#{ENV['APP_URL']}/health"))
      rescue => e
        Rails.logger.warn "Keep alive failed: #{e.message}"
      end
    end
  end
end
```

### 3. Database最適化（Turso）

#### 効率的なクエリ
```ruby
# モデル最適化
class Restaurant < ApplicationRecord
  # 必要最小限のインデックス
  scope :with_reviews, -> { includes(:reviews).where.not(reviews: { id: nil }) }
  
  # カウンターキャッシュ活用
  has_many :reviews, counter_cache: true
  
  # ページネーション
  scope :paginated, ->(page) { limit(20).offset((page - 1) * 20) }
end

# クエリ最適化
def efficient_search(query)
  Restaurant
    .select(:id, :name, :address, :average_rating, :reviews_count)
    .where("name LIKE ?", "%#{query}%")
    .limit(10)
end
```

## 無料デプロイ手順

### Step 1: Turso無料セットアップ
```bash
# CLI インストール
curl -sSfL https://get.tur.so/install.sh | bash

# アカウント作成（GitHub連携で無料）
turso auth login

# 無料データベース作成
turso db create diner-portal-free

# 無料枠での設定確認
turso db inspect diner-portal-free
# 出力: Rows: 0, Size: 0 B, Reads: 0, Writes: 0
```

### Step 2: Render無料デプロイ
```bash
# Render連携
# 1. render.com でGitHub連携
# 2. リポジトリ選択
# 3. 無料プラン選択

# 設定内容
Service Type: Web Service
Environment: Docker
Plan: Free ($0/month)
Region: Oregon (US West)
```

#### render.yaml設定
```yaml
services:
  - type: web
    name: diner-portal-api
    env: ruby
    plan: free
    buildCommand: bundle install && bundle exec rails assets:precompile
    startCommand: bundle exec rails server -b 0.0.0.0 -p $PORT
    envVars:
      - key: RAILS_ENV
        value: production
      - key: TURSO_DATABASE_URL
        sync: false
      - key: TURSO_AUTH_TOKEN
        sync: false
```

### Step 3: Vercel無料デプロイ
```bash
# Vercel CLI
npm i -g vercel

# プロジェクトデプロイ
cd frontend
vercel --prod

# 無料プランの確認
vercel teams list
# 出力: Personal Account (Hobby Plan)
```

#### vercel.json設定
```json
{
  "version": 2,
  "name": "diner-portal",
  "github": {
    "enabled": true
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-app.onrender.com"
  },
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=1024"
    }
  }
}
```

## 制限事項と対処法

### ⚠️ 主な制限

#### Render（15分スリープ）
```typescript
// フロントエンドでローディング対応
const useApiWithRetry = () => {
  const [isWakingUp, setIsWakingUp] = useState(false)
  
  const fetchWithRetry = async (url: string) => {
    try {
      const response = await fetch(url, { timeout: 5000 })
      return response
    } catch (error) {
      // サーバースリープと判断
      setIsWakingUp(true)
      await new Promise(resolve => setTimeout(resolve, 30000))
      return fetch(url) // リトライ
    }
  }
}
```

#### Turso（制限監視）
```ruby
# app/models/concerns/usage_tracker.rb
module UsageTracker
  extend ActiveSupport::Concern
  
  included do
    after_find :track_read
    after_create :track_write
    after_update :track_write
  end
  
  private
  
  def track_read
    Rails.cache.increment('turso_reads', 1)
  end
  
  def track_write  
    Rails.cache.increment('turso_writes', 1)
  end
end
```

### 🔧 パフォーマンス最適化

#### 1. キャッシュ戦略
```ruby
# Redis代替でメモリキャッシュ
class CacheService
  CACHE = ActiveSupport::Cache::MemoryStore.new(size: 50.megabytes)
  
  def self.fetch(key, expires_in: 1.hour, &block)
    CACHE.fetch(key, expires_in: expires_in, &block)
  end
end

# 使用例
def popular_restaurants
  CacheService.fetch('popular_restaurants', expires_in: 6.hours) do
    Restaurant.where('average_rating > ?', 4.0).limit(10)
  end
end
```

#### 2. 静的生成最大化
```typescript
// pages/restaurants/[id].tsx
export async function getStaticPaths() {
  // 人気店のみ事前生成
  const popular = await fetch('/api/restaurants/popular')
  const paths = popular.map(r => ({ params: { id: r.id.toString() } }))
  
  return {
    paths,
    fallback: 'blocking' // その他はISR
  }
}

export async function getStaticProps({ params }) {
  return {
    props: { restaurant: await getRestaurant(params.id) },
    revalidate: 3600 // 1時間キャッシュ
  }
}
```

## 監視・アラート（無料）

### GitHub Actions監視
```yaml
# .github/workflows/health-check.yml
name: Health Check
on:
  schedule:
    - cron: '*/10 * * * *' # 10分毎

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" ${{ secrets.API_URL }}/health)
          if [ $response != "200" ]; then
            echo "API is down: $response"
            exit 1
          fi
      
      - name: Check Frontend
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" ${{ secrets.FRONTEND_URL }})
          if [ $response != "200" ]; then
            echo "Frontend is down: $response"
            exit 1
          fi
```

### 使用量監視（Turso）
```ruby
# lib/tasks/usage_monitor.rake
namespace :turso do
  desc 'Check Turso usage'
  task usage: :environment do
    reads = Rails.cache.read('turso_reads') || 0
    writes = Rails.cache.read('turso_writes') || 0
    
    puts "Turso Usage:"
    puts "Reads: #{reads}/1,000,000 (#{(reads/10000.0).round(1)}%)"
    puts "Writes: #{writes}/10,000 (#{(writes/100.0).round(1)}%)"
    
    # 80%超過でアラート
    if reads > 800_000 || writes > 8_000
      puts "⚠️  WARNING: Approaching free tier limits!"
    end
  end
end
```

## コスト完全0円での運用期間

### 予想利用可能期間
```
小規模利用（10-50 DAU）:
- Vercel: 無制限
- Render: 無制限（スリープあり）
- Turso: 6-12ヶ月

中規模利用（100-200 DAU）:
- Vercel: 無制限
- Render: 無制限（スリープあり） 
- Turso: 2-4ヶ月

大規模化時の移行:
- Render → Railway有料 (月¥2,800)
- Turso → 有料 (月¥500-2,000)
```

## 実装スケジュール（2週間）

### Week 1: セットアップ
- **Day 1-2**: Turso無料アカウント + データベース作成
- **Day 3-4**: Rails PostgreSQL → SQLite変換
- **Day 5-7**: ローカルテスト + 最適化

### Week 2: デプロイ
- **Day 8-10**: Render無料デプロイ + 設定
- **Day 11-12**: Vercel無料デプロイ + 連携
- **Day 13-14**: 動作確認 + 監視設定

## まとめ

✅ **完全無料で運用可能**  
✅ **小規模利用なら十分な性能**  
✅ **スケールアップ時の移行も容易**  
⚠️ **15分スリープは初回アクセス時のみ影響**  
⚠️ **Commercial use時はVercel利用規約要確認**

無料プランでも本格的なWebアプリケーションとして十分機能します。ユーザーが増加してきたタイミングで段階的に有料プランに移行することが可能です。

---

*2025年6月時点の無料プラン情報です。各サービスの利用規約変更にご注意ください。*