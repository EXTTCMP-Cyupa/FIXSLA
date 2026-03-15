import type { TicketPriority } from './ticket';

export interface CatalogoIncidente {
  id: string;
  nombre: string;
  descripcion?: string | null;
  prioridadPorDefecto: TicketPriority;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateCatalogoPayload {
  nombre: string;
  descripcion?: string;
  prioridadPorDefecto: TicketPriority;
}
