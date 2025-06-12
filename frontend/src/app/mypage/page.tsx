import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* --- ヘッダー --- */}
          <div className="p-8 border-b text-center">
            <h2 className="text-4xl font-extrabold text-[#26a69a] tracking-wide">マイページ</h2>
          </div>

          <div className="p-8 space-y-8">
            {/* --- アバターと基本情報 --- */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="プロフィール画像"
                    width={100}
                    height={100}
                    className="rounded-full shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-[#4db6ac] to-[#66bb6a] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-extrabold text-4xl">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">{user?.name || 'ユーザー名未設定'}</h3>
                <p className="text-gray-500 text-sm mt-1">{user?.email || ''}</p>
              </div>
            </div>

            {/* --- いいね・投稿数 --- */}
            <div className="flex flex-row justify-center items-center gap-6 pt-4">
              <div className="flex flex-col items-center bg-gradient-to-br from-[#a5d6a7] to-[#4db6ac] rounded-xl shadow px-6 py-6 min-w-[120px] min-h-[100px]">
                <span className="mb-2">
                  {/* いいねマーク SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="32" height="32"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </span>
                <span className="text-lg font-bold text-white">いいねしたお店</span>
                <span className="text-2xl font-extrabold text-white drop-shadow-lg mt-1">0</span>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-br from-[#b2dfdb] to-[#388e3c] rounded-xl shadow px-6 py-6 min-w-[120px] min-h-[100px]">
                <span className="mb-2">
                  {/* 鉛筆マーク SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="32" height="32"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </span>
                <span className="text-lg font-bold text-white">投稿したお店</span>
                <span className="text-2xl font-extrabold text-white drop-shadow-lg mt-1">0</span>
              </div>
            </div>
          </div>
        </div>
        {/* --- 認証状態 --- */}
        <div className="text-center mt-8">
          <span className="inline-block px-6 py-3 rounded-full text-lg font-extrabold tracking-wide shadow-lg border-4 bg-[#66bb6a]/20 text-[#388e3c] border-[#66bb6a]">
            認証状態: 有効
          </span>
        </div>
      </div>
    </div>
  );
}