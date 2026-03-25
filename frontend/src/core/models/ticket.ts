export type TicketStatus = 'NUEVO' | 'EN_PROCESO' | 'PENDIENTE' | 'RESUELTO' | 'CANCELADO';
export type TicketPriority = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Ticket {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  solicitanteId: string;
  tecnicoAsignadoId?: string | null;
  catalogoIncidenteId: string;
  ubicacionId?: string | null;
  numeroContacto?: string | null;
  estado: TicketStatus;
  prioridad: TicketPriority;
  creadoEn: string;
  actualizadoEn: string;
  primeraRespuestaLimite: string;
  resolucionLimite: string;
  pendienteDesde?: string | null;
  slaPausadoSegundos: number;
}

export interface CreateTicketPayload {
  codigo?: string;
  titulo: string;
  descripcion: string;
  solicitanteId: string;
  catalogoIncidenteId: string;
  ubicacionId?: string;
  numeroContacto?: string;
}

export interface UpdateTicketStatusPayload {
  nextStatus: TicketStatus;
  tecnicoAsignadoId?: string;
}
