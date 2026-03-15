import type { AuthSession, LoginPayload } from '../../core/models/auth';
import axios from 'axios';
import { API_BASE_URL } from '../../core/config/env';

const TOKEN_KEY = 'fixsla_access_token';
const SESSION_KEY = 'fixsla_session';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const { data } = await axios.post<AuthSession>(`${API_BASE_URL}/auth/login`, payload);
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return data;
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
