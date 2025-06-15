export interface TokenPayload {
  userId: number;
  companyId: number;
  email: string;
  role: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserData {
  userId: number;
  companyId: number;
  email: string;
  role: string;
}
