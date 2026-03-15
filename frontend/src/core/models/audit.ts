import type { UserRole } from './auth';

export type TicketAuditAction =
  | 'CREADO'
  | 'ESTADO_ACTUALIZADO'
  | 'ASIGNACION_ACTUALIZADA'
  | 'COMENTARIO';

export interface TicketAudit {
  id: string;
  ticketId: string;
  accion: TicketAuditAction;
  detalle: string;
  actorUsername: string;
  actorRol: UserRole;
  fecha: string;
}
