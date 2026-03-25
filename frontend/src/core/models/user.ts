import type { UserRole } from './auth';

export interface User {
  id: string;
  username: string;
  nombre: string;
  rol: UserRole;
  area: string;
  numeroContacto?: string | null;
  catalogoIds: string[];
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateUserPayload {
  username: string;
  nombre: string;
  rol: UserRole;
  area: string;
  numeroContacto?: string;
  catalogoIds?: string[];
}

export interface UpdateUserPayload {
  nombre: string;
  rol: UserRole;
  area: string;
  numeroContacto?: string | null;
  activo: boolean;
  catalogoIds?: string[];
}
