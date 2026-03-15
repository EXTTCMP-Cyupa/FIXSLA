import type { Ticket, TicketStatus } from '../../../core/models/ticket';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Button } from '../../../shared/Button';

interface TicketCardProps {
  ticket: Ticket;
  disabled?: boolean;
  canTransition?: boolean;
  onTransition: (status: TicketStatus) => void;
}

const availableTransitions: Record<Ticket['estado'], TicketStatus[]> = {
  NUEVO: ['EN_PROCESO', 'CANCELADO'],
  EN_PROCESO: ['PENDIENTE', 'RESUELTO', 'CANCELADO'],
  PENDIENTE: ['EN_PROCESO', 'CANCELADO'],
  RESUELTO: [],
  CANCELADO: [],
};

export function TicketCard({ ticket, disabled, canTransition = true, onTransition }: TicketCardProps) {
  return (
    <article className="stack rounded-xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong className="text-slate-900 dark:text-slate-50">{ticket.codigo}</strong>
          <div className="text-sm text-slate-600 dark:text-slate-400">{ticket.titulo}</div>
        </div>
        <StatusBadge status={ticket.estado} />
      </div>
      <p className="m-0 text-slate-900 dark:text-slate-50">{ticket.descripcion}</p>
      <div className="row">
        <PriorityBadge priority={ticket.prioridad} />
        <span className="text-sm text-slate-600 dark:text-slate-400">Solicitante: {ticket.solicitanteId}</span>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Primera respuesta límite: {new Date(ticket.primeraRespuestaLimite).toLocaleString()}
      </div>
      {canTransition ? (
        <div className="row">
          {availableTransitions[ticket.estado].map((nextStatus) => (
            <Button
              key={nextStatus}
              label={nextStatus.replace('_', ' ')}
              variant="secondary"
              disabled={disabled}
              onClick={() => onTransition(nextStatus)}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
