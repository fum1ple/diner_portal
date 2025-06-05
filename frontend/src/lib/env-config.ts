// 環境変数の検証とセットアップユーティリティ

interface EnvironmentConfig {
  NEXTAUTH_URL?: string;
  NEXTAUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NEXT_PUBLIC_BACKEND_URL?: string;
  BACKEND_INTERNAL_URL?: string;
  NODE_ENV?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class EnvironmentValidator {
  private static requiredForProduction = [
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_BACKEND_URL'
  ];

  private static requiredForDevelopment = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  /**
   * 環境変数を検証する
   */
  static validate(): ValidationResult {
    const env = process.env as EnvironmentConfig;
    const errors: string[] = [];
    const warnings: string[] = [];
    const isProduction = env.NODE_ENV === 'production';

    // 必須環境変数のチェック
    const requiredVars = isProduction 
      ? this.requiredForProduction 
      : this.requiredForDevelopment;

    for (const varName of requiredVars) {
      if (!env[varName as keyof EnvironmentConfig]) {
        errors.push(`環境変数 ${varName} が設定されていません`);
      }
    }

    // NEXTAUTHセキュリティチェック
    if (env.NEXTAUTH_SECRET && env.NEXTAUTH_SECRET.length < 32) {
      errors.push('NEXTAUTH_SECRET は32文字以上である必要があります');
    }

    // 開発環境特有の警告
    if (!isProduction) {
      if (!env.NEXTAUTH_URL) {
        warnings.push('NEXTAUTH_URL が設定されていません（自動設定されます）');
      }
      if (!env.BACKEND_INTERNAL_URL) {
        warnings.push('BACKEND_INTERNAL_URL が設定されていません（デフォルト値を使用します）');
      }
    }

    // プロダクション環境特有のチェック
    if (isProduction) {
      if (!env.NEXTAUTH_URL) {
        errors.push('プロダクション環境では NEXTAUTH_URL の明示的な設定が必要です');
      }
      if (!env.NEXT_PUBLIC_BACKEND_URL) {
        errors.push('プロダクション環境では NEXT_PUBLIC_BACKEND_URL の設定が必要です');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 検証結果をコンソールに出力する
   */
  static logValidationResult(): void {
    const result = this.validate();
    
    if (result.errors.length > 0) {
      console.error('❌ 環境変数エラー:');
      result.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ 環境変数警告:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  }

  /**
   * 必要な環境変数が設定されているかチェックし、設定されていない場合は例外を投げる
   */
  static validateOrThrow(): void {
    const result = this.validate();
    
    if (!result.isValid) {
      throw new Error(
        `環境変数の設定に問題があります:\n${result.errors.join('\n')}`
      );
    }
  }
}

/**
 * 安全な環境変数取得
 */
export const getEnvVar = (
  key: keyof EnvironmentConfig, 
  defaultValue?: string
): string => {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
  
  return value || defaultValue || '';
};

/**
 * 設定値の取得（環境変数またはデフォルト値）
 */
export const config = {
  // NextAuth設定
  nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:4000'),
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  
  // Google OAuth設定  
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  
  // バックエンドURL設定
  backendUrl: getEnvVar('NEXT_PUBLIC_BACKEND_URL', 'http://localhost:3000'),
  backendInternalUrl: getEnvVar('BACKEND_INTERNAL_URL', 'http://backend:3000'),
  
  // 環境設定
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  nodeEnv: getEnvVar('NODE_ENV', 'development')
} as const;
