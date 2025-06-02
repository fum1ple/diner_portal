'use client';

import { signIn } from 'next-auth/react';

const LoginPage = () => (
  <div>
    <h1>ログイン</h1>
    <button onClick={() => signIn('google')}>Googleでログイン</button>
  </div>
);

export default LoginPage;
