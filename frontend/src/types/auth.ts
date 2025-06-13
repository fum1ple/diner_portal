// Authentication related types

export interface User {
  id: number;
  email: string;
  name?: string;
  google_id?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  success: boolean;
}