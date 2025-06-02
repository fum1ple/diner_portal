'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const { user, isLoading, isAuthenticated, hasJwtToken, isJwtValid, isRefreshing } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      sessionStatus: status,
      sessionExists: !!session,
      sessionKeys: session ? Object.keys(session) : [],
      jwtTokenExists: !!session?.jwtToken,
      refreshTokenExists: !!session?.refreshToken,
      userExists: !!user,
      isAuthenticated,
      hasToken,
      isValid,
      isRefreshing,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    console.log('Debug Info:', info);
  }, [session, status, user, isAuthenticated, hasToken, isValid, isRefreshing]);

  const parseJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { error: `Invalid JWT format: expected 3 parts, got ${parts.length}` };
      }
      
      // Base64URLデコード（パディングを追加）
      let base64 = parts[1];
      // Base64URL to Base64 conversion
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      
      // パディングを追加
      while (base64.length % 4) {
        base64 += '=';
      }
      
      console.log('JWT Parts:', {
        header: parts[0].substring(0, 20) + '...',
        payload: parts[1].substring(0, 20) + '...',
        signature: parts[2].substring(0, 20) + '...',
        base64Payload: base64.substring(0, 20) + '...'
      });
      
      const payload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return {
        payload,
        isExpired: payload.exp <= currentTime,
        timeRemaining: payload.exp - currentTime,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        parts: parts.length
      };
    } catch (e: any) {
      console.error('JWT Parse Error:', e);
      return { 
        error: e.message,
        tokenPreview: token.substring(0, 50) + '...',
        tokenLength: token.length
      };
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">セッション・認証デバッグ情報</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>セッション情報</h5>
            </div>
            <div className="card-body">
              <div className="small">
                <strong>Status:</strong> {status}<br/>
                <strong>Session Exists:</strong> {session ? 'Yes' : 'No'}<br/>
                <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}<br/>
                <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}<br/>
              </div>
              
              {session && (
                <div className="mt-3">
                  <strong>Session Keys:</strong>
                  <ul className="small">
                    {Object.keys(session).map(key => (
                      <li key={key}>{key}: {typeof (session as any)[key]}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>JWT トークン情報</h5>
            </div>
            <div className="card-body">
              <div className="small">
                <strong>Has Token:</strong> {hasToken ? 'Yes' : 'No'}<br/>
                <strong>Is Valid:</strong> {isValid ? 'Yes' : 'No'}<br/>
                <strong>Is Refreshing:</strong> {isRefreshing ? 'Yes' : 'No'}<br/>
                <strong>Refresh Token Exists:</strong> {session?.refreshToken ? 'Yes' : 'No'}<br/>
              </div>

              {session?.jwtToken && (
                <div className="mt-3">
                  <strong>JWT Details:</strong>
                  <div className="small mt-2" style={{wordBreak: 'break-all'}}>
                    <div>Token: {session.jwtToken.substring(0, 50)}...</div>
                    {(() => {
                      const parsed = parseJWT(session.jwtToken);
                      if (parsed?.error) {
                        return <div className="text-danger">Parse Error: {parsed.error}</div>;
                      }
                      if (parsed) {
                        return (
                          <div className="mt-2">
                            <div>User ID: {parsed.payload?.user_id}</div>
                            <div>Email: {parsed.payload?.email}</div>
                            <div>Expires: {parsed.expiresAt}</div>
                            <div>Is Expired: {parsed.isExpired ? 'Yes' : 'No'}</div>
                            <div>Time Remaining: {parsed.timeRemaining}s</div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              {session?.refreshToken && (
                <div className="mt-3">
                  <strong>Refresh Token:</strong>
                  <div className="small mt-1" style={{wordBreak: 'break-all'}}>
                    {session.refreshToken.substring(0, 50)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Debug JSON</h5>
            </div>
            <div className="card-body">
              <pre className="small">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
