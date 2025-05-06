import LoginIcon from './icons/LoginIcon'

export default function Home() {
  return (
    <div>
      {/* HERO セクション */}
      <section className="py-5 bg-gradient" style={{ background: 'linear-gradient(to bottom, #e0f7fa, #ffffff)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge rounded-pill bg-info bg-opacity-25 text-info fw-semibold mb-3 py-2 px-3">社内限定サービス</span>
              <h1 className="display-4 fw-bold mb-3">
                社内の<span className="text-primary">おすすめレストラン</span> を共有しよう
              </h1>
              <p className="lead mb-4">
                TOKIEATSは、社員同士でおすすめのレストランを共有し、評価できる社内専用のプラットフォームです。新しいランチスポットを探したり、特別な会食の場所を見つけたりするのに役立ちます。
              </p>
              <a href="/restaurants" className="btn btn-primary btn-lg rounded-pill px-4">レストランを探す</a>
            </div>
            <div className="col-lg-6 d-flex justify-content-center mt-4 mt-lg-0">
              <div className="bg-light rounded shadow-sm p-5 text-center text-muted" style={{ width: '480px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                [画像エリア]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 人気のレストラン セクション */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill bg-info bg-opacity-25 text-info fw-semibold mb-2 py-2 px-3">人気のレストラン</span>
            <h2 className="display-5 fw-bold mb-2">みんなのおすすめ</h2>
            <p className="text-muted">
              社員からの評価が高いおすすめのレストランをチェックしましょう
            </p>
          </div>

          <div className="row g-4">
            {[
              { name: '寿司匠', badge: '寿司', rating: 4.8, reviews: 24, loc: '東京都中央区' },
              { name: 'イタリアーノ', badge: 'イタリアン', rating: 4.6, reviews: 18, loc: '東京都渋谷区' },
              { name: '焼肉 和牛', badge: '焼肉', rating: 4.7, reviews: 32, loc: '東京都新宿区' },
            ].map((r, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 rounded-4 shadow-sm position-relative">
                  <div className="bg-light rounded-top-4" style={{ height: '180px' }}></div>
                  <span className="position-absolute top-0 end-0 badge bg-primary m-3 rounded-pill px-3 py-2">{r.badge}</span>
                  <div className="card-body p-4">
                    <h3 className="fs-5 fw-bold">{r.name}</h3>
                    <div className="d-flex align-items-center my-2">
                      <span className="text-warning me-2">
                        {'★'.repeat(Math.floor(r.rating)) + '☆'}
                      </span>
                      <span className="text-secondary small">
                        {r.rating}（{r.reviews}件のレビュー）
                      </span>
                    </div>
                    <p className="card-text text-muted small mb-3">📍 {r.loc}</p>
                    <a href={`/restaurants/${i+1}`} className="btn btn-outline-primary w-100 rounded-pill">
                      詳細を見る
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最近追加されたレストラン セクション */}
      <section className="py-5 bg-light bg-opacity-50">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill bg-info bg-opacity-25 text-info fw-semibold mb-2 py-2 px-3">新着情報</span>
            <h2 className="display-5 fw-bold mb-2">最近追加されたレストラン</h2>
            <p className="text-muted">
              同僚が最近発見した新しいレストランをチェックしましょう
            </p>
          </div>

          <div className="row g-4">
            {['ラーメン一番', 'カフェ モーニング', 'タイ料理 バンコク', 'フレンチ ビストロ'].map((name, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 rounded-4 shadow-sm">
                  <div className="bg-light rounded-top-4" style={{ height: '160px' }}></div>
                  <div className="card-body p-3">
                    <h3 className="fs-5 fw-bold">{name}</h3>
                    <p className="card-text text-muted small">{name.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ログインCTA セクション */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-info bg-opacity-25 text-info fw-semibold mb-3 py-2 px-3">もっと活用するには</span>
              <h2 className="display-5 fw-bold mb-3">
                ログインして、おすすめのレストランを共有しましょう
              </h2>
              <p className="text-muted mb-4">
                ログインすると、新しいレストランの追加やレビューの投稿ができるようになります。<br />
                あなたの発見や感想を同僚と共有して、より豊かなランチタイムを実現しましょう。
              </p>
              <a href="/login" className="btn btn-outline-primary rounded-pill d-inline-flex align-items-center px-4 py-2">
                <LoginIcon className="me-2" />
                ログイン
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
