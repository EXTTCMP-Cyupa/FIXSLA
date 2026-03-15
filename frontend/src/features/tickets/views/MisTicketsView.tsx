import { useCallback, useEffect, useState } from 'react';
import type { TicketAudit } from '../../../core/models/audit';
import type { Ticket } from '../../../core/models/ticket';
import type { User } from '../../../core/models/user';
import { authService } from '../../auth/authService';
import { Modal } from '../../../shared/Modal';
import { useTicketState } from '../hooks/useTicketState';
import { ticketService } from '../services/ticketService';
import { userService } from '../../users/services/userService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { TicketTable } from '../components/TicketTable';
import { CircleDot, Loader2, AlertCircle } from 'lucide-react';

interface MisTicketsViewProps {
  onLogout: () => void;
}

export function MisTicketsView({ onLogout }: MisTicketsViewProps) {
  const { theme, toggleTheme } = useTheme();
  const { updateState, updatingId } = useTicketState();
  const session = authService.getSession();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [catalogAreaById, setCatalogAreaById] = useState<Record<string, string>>({});
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string>>({});
  const [assigningId, setAssigningId] = useState<string | null>(null);
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
      const [allTechs, catalogos] = await Promise.all([
        userService.list({ rol: 'TECNICO' }),
        ticketService.listCatalogos(),
      ]);
      const myTech = allTechs.find((t) => t.username === session?.username);
      const directCatalogIds = myTech?.catalogoIds ?? [];
      const areaBasedCatalogIds = myTech?.area
        ? catalogos
            .filter((c) => c.nombre.toLowerCase() === myTech.area.toLowerCase())
            .map((c) => c.id)
        : [];
      const catalogIds = directCatalogIds.length > 0 ? directCatalogIds : areaBasedCatalogIds;

      if (catalogIds.length === 0) {
        // Fallback for older API responses without catalogoIds: show assigned active tickets.
        const [nuevos, enProceso, pendientes] = await Promise.all([
          ticketService.list({ estado: 'NUEVO' }),
          ticketService.list({ estado: 'EN_PROCESO' }),
          ticketService.list({ estado: 'PENDIENTE' }),
        ]);
        const active = [...nuevos, ...enProceso, ...pendientes];
        setTickets(myTech ? active.filter((t) => t.tecnicoAsignadoId === myTech.id) : active);
        return;
      }

      const results = await Promise.all(
        catalogIds.flatMap((catalogoIncidenteId) => [
          ticketService.list({ estado: 'NUEVO', catalogoIncidenteId }),
          ticketService.list({ estado: 'EN_PROCESO', catalogoIncidenteId }),
          ticketService.list({ estado: 'PENDIENTE', catalogoIncidenteId }),
        ]),
      );

      const seen = new Set<string>();
      const unique: Ticket[] = [];
      for (const t of results.flat()) {
        if (!seen.has(t.id)) { seen.add(t.id); unique.push(t); }
      }
      setTickets(unique);
    } catch {
      setError('No fue posible cargar los tickets.');
    } finally {
      setLoading(false);
    }
  }, [session?.username]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    void userService.list({ rol: 'TECNICO' })
      .then((data) => setTechnicians(data))
      .catch(() => setTechnicians([]));
  }, []);

  useEffect(() => {
    void ticketService.listCatalogos()
      .then((catalogos) => {
        const areaMap = Object.fromEntries(catalogos.map((c) => [c.id, c.nombre]));
        setCatalogAreaById(areaMap);
      })
      .catch(() => setCatalogAreaById({}));
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find((t) => t.id === selectedTicket.id) ?? null;
      setSelectedTicket(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

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
      setNoteError('No fue posible agregar la nota. Verifica permisos o el contenido.');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleTransition = async (ticket: Ticket, nextStatus: Ticket['estado']) => {
    const updated = await updateState(ticket, nextStatus);
    // Keep ticket in list if still in NUEVO/EN_PROCESO/PENDIENTE, remove otherwise
    const visibleStates: Ticket['estado'][] = ['NUEVO', 'EN_PROCESO', 'PENDIENTE'];
    if (visibleStates.includes(updated.estado)) {
      setTickets((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedTicket?.id === updated.id) {
        setSelectedTicket(updated);
      }
    } else {
      setTickets((current) => current.filter((item) => item.id !== updated.id));
      if (selectedTicket?.id === updated.id) {
        setSelectedTicket(null);
      }
    }
  };

  const handleAssigneeSelection = (ticketId: string, userId: string) => {
    setSelectedAssignees((current) => ({ ...current, [ticketId]: userId }));
  };

  const handleAssign = async (ticket: Ticket) => {
    const selectedUserId = selectedAssignees[ticket.id];
    if (!selectedUserId) {
      return;
    }
    try {
      setAssigningId(ticket.id);
      const updated = await ticketService.assignTechnician(ticket.id, selectedUserId);
      setTickets((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedTicket?.id === updated.id) {
        setSelectedTicket(updated);
      }
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Mis Tickets"
      subtitle="Tickets activos: Nuevos, En Proceso y Pendientes."
      showNewTicketButton={false}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Nuevos"
          value={tickets.filter((t) => t.estado === 'NUEVO').length}
          icon={CircleDot}
          accentClass="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
        />
        <StatCard
          label="En Proceso"
          value={tickets.filter((t) => t.estado === 'EN_PROCESO').length}
          icon={Loader2}
          accentClass="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
        />
        <StatCard
          label="Pendientes"
          value={tickets.filter((t) => t.estado === 'PENDIENTE').length}
          icon={AlertCircle}
          accentClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
        />
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-[18px] font-semibold">Mis Tickets</h3>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">
              Nuevo, En Proceso y Pendiente — usa las acciones para avanzar el estado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadTickets()}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Recargar
          </button>
        </div>

        <TicketTable
          tickets={tickets}
          loading={loading}
          canTransition={true}
          canAssign={true}
          technicians={technicians}
          catalogAreaById={catalogAreaById}
          assigningId={assigningId}
          selectedAssignees={selectedAssignees}
          updatingId={updatingId}
          onOpenDetails={setSelectedTicket}
          onTransition={handleTransition}
          onAssigneeSelection={handleAssigneeSelection}
          onAssign={handleAssign}
        />
      </section>

      <Modal
        isOpen={Boolean(selectedTicket)}
        title={selectedTicket?.codigo ?? 'Detalle'}
        onClose={() => setSelectedTicket(null)}
      >
        {selectedTicket ? (
          <div className="space-y-3">
            <h4 className="text-[18px] font-semibold text-slate-900 dark:text-slate-50">{selectedTicket.titulo}</h4>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">{selectedTicket.descripcion}</p>
            <div className="text-[12px] text-slate-600 dark:text-slate-400">
              Resolución límite: {new Date(selectedTicket.resolucionLimite).toLocaleString()}
            </div>

            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <h5 className="mb-2 text-[14px] font-semibold text-slate-900 dark:text-slate-100">Agregar Nota de Trabajo</h5>
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Describe el avance, diagnóstico o acuerdo con el solicitante..."
                value={noteText}
                rows={3}
                onChange={(event) => setNoteText(event.target.value)}
              />
              {noteError ? (
                <div className="mt-2 text-[12px] text-red-600 dark:text-red-300">{noteError}</div>
              ) : null}
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
              <h5 className="mb-2 text-[14px] font-semibold text-slate-900 dark:text-slate-100">Auditoría</h5>
              {auditLoading ? (
                <div className="text-[13px] text-slate-600 dark:text-slate-400">Cargando auditoría...</div>
              ) : audits.length === 0 ? (
                <div className="text-[13px] text-slate-600 dark:text-slate-400">Sin eventos registrados.</div>
              ) : (
                <ul className="space-y-2 text-[13px]">
                  {audits.map((entry) => (
                    <li key={entry.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                      <div className="font-semibold">{entry.accion.replace('_', ' ')}</div>
                      <div className="text-slate-600 dark:text-slate-400">{entry.detalle}</div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-500">
                        {entry.actorUsername} ({entry.actorRol}) — {new Date(entry.fecha).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
}
