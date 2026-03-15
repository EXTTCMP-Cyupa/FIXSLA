import type { UserRole } from './auth';

export interface User {
  id: string;
  username: string;
  nombre: string;
  rol: UserRole;
  area: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateUserPayload {
  username: string;
  nombre: string;
  rol: UserRole;
  area: string;
}
