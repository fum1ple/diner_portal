import dynamic from 'next/dynamic';

// useEffectを使わずにクライアントサイドでのみレンダリング
const DynamicSignInClient = dynamic(() => import('./SignInClient'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div>読み込み中...</div>
    </div>
  )
});

const SignIn = () => {
  return <DynamicSignInClient />;
};

export default SignIn;