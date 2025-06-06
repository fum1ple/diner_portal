import Image from 'next/image'
import { LogIn } from 'lucide-react'

const Home = () => (
  <>
    {/* HERO セクション */}
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="lg:w-1/2">
            <div className="inline-block rounded-full bg-blue-100 text-blue-600 font-semibold mb-6 py-2 px-4 text-sm">
              社内限定サービス
            </div>
            <h1 className="text-5xl font-bold mb-6">
              社内の<span className="text-primary">おすすめレストラン</span>を共有しよう
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              TOKIEATSは、社員同士でおすすめのレストランを共有し、評価できる社内専用のプラットフォームです。新しいランチスポットを探したり、特別な会食の場所を見つけたりするのに役立ちます。
            </p>
            <a 
              href="/restaurants" 
              className="inline-block bg-primary text-white font-medium py-3 px-8 rounded-full hover:bg-primary/90 transition-colors"
            >
              レストランを探す
            </a>
          </div>
          <div className="lg:w-1/2 hidden lg:flex justify-center mt-8 lg:mt-0">
            <Image
              src="/TOKIEATS-logo.png"
              alt="TOKIEATS イメージ"
              width={300}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>    </section>

    {/* 人気のレストラン セクション */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-blue-100 text-blue-600 font-semibold mb-4 py-2 px-4 text-sm">
            人気のレストラン
          </div>
          <h2 className="text-4xl font-bold mb-4">みんなのおすすめ</h2>
          <p className="text-gray-600 text-lg">
            社員からの評価が高いおすすめのレストランをチェックしましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: '寿司匠', badge: '寿司', rating: 4.8, reviews: 24, loc: '東京都中央区' },
            { name: 'イタリアーノ', badge: 'イタリアン', rating: 4.6, reviews: 18, loc: '東京都渋谷区' },
            { name: '焼肉 和牛', badge: '焼肉', rating: 4.7, reviews: 32, loc: '東京都新宿区' },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src="/TOKIEATS-logo.png"
                  alt={`${r.name}の画像`}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {r.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{r.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-2">
                    {'★'.repeat(Math.floor(r.rating))}
                    {r.rating % 1 > 0 ? '☆' : ''}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {r.rating}（{r.reviews}件のレビュー）
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">📍 {r.loc}</p>
                <a 
                  href={`/restaurants/${i+1}`} 
                  className="block w-full text-center border border-primary text-primary py-2 px-4 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  詳細を見る
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 最近追加されたレストラン セクション */}
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-green-100 text-green-600 font-semibold mb-4 py-2 px-4 text-sm">
            新着情報
          </div>
          <h2 className="text-4xl font-bold mb-4">最近追加されたレストラン</h2>
          <p className="text-gray-600 text-lg">
            同僚が最近発見した新しいレストランをチェックしましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['ラーメン一番', 'カフェ モーニング', 'タイ料理 バンコク', 'フレンチ ビストロ'].map((name, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100">
                <Image
                  src="/TOKIEATS-logo.png"
                  alt={`${name}の画像`}
                  width={300}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{name}</h3>
                <p className="text-gray-600 text-sm">{name.split(' ')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ログインCTA セクション */}
    <section className="py-20 bg-white text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block rounded-full bg-purple-100 text-purple-600 font-semibold mb-6 py-2 px-4 text-sm">
            もっと活用するには
          </div>
          <h2 className="text-4xl font-bold mb-6">
            ログインして、おすすめのレストランを共有しましょう
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            ログインすると、新しいレストランの追加やレビューの投稿ができるようになります。<br />
            あなたの発見や感想を同僚と共有して、より豊かなランチタイムを実現しましょう。
          </p>
          <a 
            href="/auth/signin" 
            className="inline-flex items-center gap-2 border border-primary text-primary py-3 px-6 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            <LogIn className="w-5 h-5" />
            ログイン
          </a>
        </div>
      </div>
    </section>
  </>
);

export default Home;
