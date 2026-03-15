import type { Ticket, TicketStatus } from '../../../core/models/ticket';
import type { User } from '../../../core/models/user';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Button } from '../../../shared/Button';

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
  canTransition: boolean;
  canAssign: boolean;
  technicians: User[];
  catalogAreaById: Record<string, string>;
  assigningId: string | null;
  selectedAssignees: Record<string, string>;
  updatingId: string | null;
  onOpenDetails: (ticket: Ticket) => void;
  onTransition: (ticket: Ticket, nextStatus: TicketStatus) => void;
  onAssigneeSelection: (ticketId: string, userId: string) => void;
  onAssign: (ticket: Ticket) => void;
}

const transitions: Record<TicketStatus, TicketStatus[]> = {
  NUEVO: ['EN_PROCESO'],
  EN_PROCESO: ['PENDIENTE', 'RESUELTO'],
  PENDIENTE: ['EN_PROCESO'],
  RESUELTO: [],
  CANCELADO: [],
};

export function TicketTable({
  tickets,
  loading,
  canTransition,
  canAssign,
  technicians,
  catalogAreaById,
  assigningId,
  selectedAssignees,
  updatingId,
  onOpenDetails,
  onTransition,
  onAssigneeSelection,
  onAssign,
}: TicketTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Código</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Título</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Estado</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Prioridad</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Asignado</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Actualizado</th>
              <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[14px] text-slate-600 dark:text-slate-400">
                  Cargando tickets...
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                (() => {
                  const ticketArea = catalogAreaById[ticket.catalogoIncidenteId];
                  const eligibleTechnicians = technicians.filter((tech) =>
                    !ticketArea || tech.area.toLowerCase() === ticketArea.toLowerCase(),
                  );
                  const assignedTech = technicians.find((tech) => tech.id === ticket.tecnicoAsignadoId);
                  return (
                <tr
                  key={ticket.id}
                  className="cursor-pointer border-t border-[#E2E8F0] transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/80"
                  onClick={() => onOpenDetails(ticket)}
                >
                  <td className="px-4 py-3 text-[14px] font-semibold">{ticket.codigo}</td>
                  <td className="px-4 py-3 text-[14px]">{ticket.titulo}</td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.estado} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={ticket.prioridad} /></td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 dark:text-slate-400">
                    {assignedTech ? `${assignedTech.nombre} (${assignedTech.area})` : (ticket.tecnicoAsignadoId ?? 'Sin asignar')}
                  </td>
                  <td className="px-4 py-3 text-[14px] text-slate-600 dark:text-slate-400">{new Date(ticket.actualizadoEn).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                      {canAssign ? (
                        <>
                          <select
                            className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-[12px] text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                            value={selectedAssignees[ticket.id] ?? ticket.tecnicoAsignadoId ?? ''}
                            onChange={(event) => onAssigneeSelection(ticket.id, event.target.value)}
                          >
                            <option value="">Sin asignar</option>
                            {eligibleTechnicians.map((tech) => (
                              <option key={tech.id} value={tech.id}>{tech.nombre} ({tech.area})</option>
                            ))}
                          </select>
                          <Button
                            label="Asignar"
                            variant="secondary"
                            disabled={assigningId === ticket.id}
                            onClick={() => onAssign(ticket)}
                          />
                        </>
                      ) : null}
                      {canTransition && transitions[ticket.estado].length > 0
                        ? transitions[ticket.estado].map((nextStatus) => (
                          <Button
                            key={nextStatus}
                            label={nextStatus.replace('_', ' ')}
                            variant="secondary"
                            disabled={updatingId === ticket.id}
                            onClick={() => onTransition(ticket, nextStatus)}
                          />
                        ))
                        : null}
                      {!canAssign && (!canTransition || transitions[ticket.estado].length === 0) ? (
                        <div className="text-right text-[12px] text-slate-500 dark:text-slate-400">—</div>
                      ) : null}
                    </div>
                  </td>
                </tr>
                  );
                })()
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
