export interface Ubicacion {
  id: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateUbicacionPayload {
  nombre: string;
  descripcion?: string;
}

export interface UpdateUbicacionPayload {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}
