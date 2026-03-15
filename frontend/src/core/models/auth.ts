export interface LoginPayload {
  username: string;
  password: string;
  role?: string;
}

export type UserRole = 'COLABORADOR' | 'TECNICO' | 'ADMIN';

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  role: UserRole;
}
