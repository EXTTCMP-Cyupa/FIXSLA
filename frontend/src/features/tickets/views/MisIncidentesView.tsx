import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Ticket } from '../../../core/models/ticket';
import type { TicketAudit } from '../../../core/models/audit';
import type { User } from '../../../core/models/user';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import { authService } from '../../auth/authService';
import { ticketService } from '../services/ticketService';
import { userService } from '../../users/services/userService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Modal } from '../../../shared/Modal';

interface MisIncidentesViewProps {
  onLogout: () => void;
}

export function MisIncidentesView({ onLogout }: MisIncidentesViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewedStorageKey = `fixsla.reviewed.incidentes.${session?.username ?? 'anon'}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [lastWorkNoteByTicket, setLastWorkNoteByTicket] = useState<Record<string, string>>({});
  const [reviewedUpdates, setReviewedUpdates] = useState<Record<string, string>>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [audits, setAudits] = useState<TicketAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nuevos, enProceso, pendientes, techs, catalogList] = await Promise.all([
        ticketService.list({ estado: 'NUEVO' }),
        ticketService.list({ estado: 'EN_PROCESO' }),
        ticketService.list({ estado: 'PENDIENTE' }),
        userService.list({ rol: 'TECNICO' }).catch(() => []),
        ticketService.listCatalogos(),
      ]);
      const activeTickets = [...nuevos, ...enProceso, ...pendientes];
      setTickets(activeTickets);
      setTechnicians(techs);
      setCatalogos(catalogList);

      const auditResponses = await Promise.all(
        activeTickets.map(async (ticket) => {
          try {
            const audit = await ticketService.listAudit(ticket.id);
            const latestWorkNote = audit
              .filter((entry) => entry.accion === 'COMENTARIO')
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
            return [ticket.id, latestWorkNote?.fecha ?? ''] as const;
          } catch {
            return [ticket.id, ''] as const;
          }
        }),
      );
      setLastWorkNoteByTicket(Object.fromEntries(auditResponses));
    } catch {
      setError('No fue posible cargar tus incidentes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(reviewedStorageKey);
      setReviewedUpdates(raw ? JSON.parse(raw) as Record<string, string> : {});
    } catch {
      setReviewedUpdates({});
    }
  }, [reviewedStorageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(reviewedStorageKey, JSON.stringify(reviewedUpdates));
    } catch {
      // ignore storage failures
    }
  }, [reviewedStorageKey, reviewedUpdates]);

  const markAsReviewed = (ticket: Ticket) => {
    setReviewedUpdates((current) => ({ ...current, [ticket.id]: ticket.actualizadoEn }));
  };

  const openTicket = (ticket: Ticket) => {
    markAsReviewed(ticket);
    setSelectedTicket(ticket);
  };

  useEffect(() => {
    const targetTicketId = searchParams.get('ticketId');
    if (!targetTicketId || tickets.length === 0) {
      return;
    }

    const target = tickets.find((t) => t.id === targetTicketId);
    if (!target) {
      return;
    }

    openTicket(target);
    const next = new URLSearchParams(searchParams);
    next.delete('ticketId');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, tickets]);

  useEffect(() => {
    if (!selectedTicket) {
      setAudits([]);
      setNoteText('');
      setNoteError(null);
      return;
    }

    setAuditLoading(true);
    void ticketService.listAudit(selectedTicket.id)
      .then((data) => setAudits(data))
      .catch(() => setAudits([]))
      .finally(() => setAuditLoading(false));
  }, [selectedTicket]);

  const sortedTickets = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime()),
    [tickets],
  );

  const selectedTechnicianName = useMemo(() => {
    if (!selectedTicket?.tecnicoAsignadoId) {
      return 'Sin asignar';
    }
    const tech = technicians.find((t) => t.id === selectedTicket.tecnicoAsignadoId);
    return tech ? `${tech.nombre} (${tech.username})` : selectedTicket.tecnicoAsignadoId;
  }, [selectedTicket?.tecnicoAsignadoId, technicians]);

  const selectedCatalogName = useMemo(() => {
    if (!selectedTicket) {
      return '-';
    }
    const catalogo = catalogos.find((c) => c.id === selectedTicket.catalogoIncidenteId);
    return catalogo?.nombre ?? selectedTicket.catalogoIncidenteId;
  }, [catalogos, selectedTicket]);

  const handleAddWorkNote = async () => {
    if (!selectedTicket || !noteText.trim()) {
      return;
    }
    try {
      setNoteLoading(true);
      setNoteError(null);
      await ticketService.addWorkNote(selectedTicket.id, noteText.trim());
      const refreshed = await ticketService.listAudit(selectedTicket.id);
      setAudits(refreshed);
      setNoteText('');
    } catch {
      setNoteError('No fue posible agregar la nota.');
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Mis Incidentes"
      subtitle="Solo incidentes activos creados por ti (NUEVO, EN PROCESO, PENDIENTE)."
      showNewTicketButton={true}
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-[18px] font-semibold">Incidentes Activos</h3>
          <button
            type="button"
            onClick={() => void loadTickets()}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Recargar
          </button>
        </div>

        {loading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando incidentes...</div>
        ) : sortedTickets.length === 0 ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">No tienes incidentes activos.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="text-[12px] uppercase text-slate-500">
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Título</th>
                  <th className="px-3 py-2">Fecha Creación</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Prioridad</th>
                  <th className="px-3 py-2">Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => openTicket(ticket)}
                    className="cursor-pointer border-t border-slate-200 text-[13px] hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-3 py-2 font-semibold">{ticket.codigo}</td>
                    <td className="px-3 py-2">{ticket.titulo}</td>
                    <td className="px-3 py-2">{new Date(ticket.creadoEn).toLocaleString()}</td>
                    <td className="px-3 py-2"><StatusBadge status={ticket.estado} /></td>
                    <td className="px-3 py-2"><PriorityBadge priority={ticket.prioridad} /></td>
                    <td className="px-3 py-2">{lastWorkNoteByTicket[ticket.id] ? new Date(lastWorkNoteByTicket[ticket.id]).toLocaleString() : 'Sin notas'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedTicket)} title={selectedTicket?.codigo ?? 'Detalle'} onClose={() => setSelectedTicket(null)}>
        {selectedTicket ? (
          <div className="space-y-3">
            <div>
              <h4 className="text-[18px] font-semibold text-slate-900 dark:text-slate-50">{selectedTicket.titulo}</h4>
              <p className="mt-1 text-[14px] text-slate-600 dark:text-slate-400">{selectedTicket.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3 text-[13px] dark:border-slate-700 md:grid-cols-2">
              <div>
                <div className="text-[11px] uppercase text-slate-500">Estado</div>
                <div className="mt-1"><StatusBadge status={selectedTicket.estado} /></div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-500">Prioridad</div>
                <div className="mt-1"><PriorityBadge priority={selectedTicket.prioridad} /></div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-500">Técnico Asignado</div>
                <div className="mt-1 font-medium">{selectedTechnicianName}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-500">Catálogo</div>
                <div className="mt-1 font-medium">{selectedCatalogName}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-500">Fecha Inicio</div>
                <div className="mt-1 font-medium">{new Date(selectedTicket.creadoEn).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-slate-500">Fecha Cierre</div>
                <div className="mt-1 font-medium">No cerrada</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.25fr]">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <h5 className="mb-2 text-[14px] font-semibold text-slate-900 dark:text-slate-100">Agregar Nota de Trabajo</h5>
                <textarea
                  className="h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Describe avance o información relevante..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                />
                {noteError ? <div className="mt-2 text-[12px] text-red-600 dark:text-red-300">{noteError}</div> : null}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleAddWorkNote()}
                    disabled={noteLoading || !noteText.trim()}
                    className="rounded-lg border border-blue-500 bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-400 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    {noteLoading ? 'Guardando...' : 'Agregar Nota'}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <h5 className="mb-2 text-[14px] font-semibold text-slate-900 dark:text-slate-100">Historial y Notas</h5>
                {auditLoading ? (
                  <div className="text-[13px] text-slate-600 dark:text-slate-400">Cargando auditoría...</div>
                ) : audits.length === 0 ? (
                  <div className="text-[13px] text-slate-600 dark:text-slate-400">Sin eventos registrados.</div>
                ) : (
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 text-[13px]">
                    {audits.map((entry) => (
                      <li key={entry.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                        <div className="font-semibold">{entry.accion.replace('_', ' ')}</div>
                        <div className="break-words text-slate-600 dark:text-slate-400">{entry.detalle}</div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-500">{entry.actorUsername} ({entry.actorRol}) - {new Date(entry.fecha).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <section className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Ver Todos Los Tickets
        </button>
      </section>
    </DashboardLayout>
  );
}
