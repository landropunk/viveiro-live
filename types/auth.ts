/**
 * Tipos relacionados con autenticación y JWT
 */

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface VerifyTokenResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}
