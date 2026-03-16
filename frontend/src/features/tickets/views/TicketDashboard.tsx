import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TicketAudit } from '../../../core/models/audit';
import type { Ticket } from '../../../core/models/ticket';
import type { User } from '../../../core/models/user';
import { authService } from '../../auth/authService';
import { Modal } from '../../../shared/Modal';
import { useTicketState } from '../hooks/useTicketState';
import { useTickets } from '../hooks/useTickets';
import { ticketService } from '../services/ticketService';
import { userService } from '../../users/services/userService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { TicketTable } from '../components/TicketTable';
import { Layers3, CircleDot, Loader2, AlertCircle } from 'lucide-react';

interface TicketDashboardProps {
  onLogout: () => void;
}

export function TicketDashboard({ onLogout }: TicketDashboardProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { tickets, loading, error, metrics, refresh, setTickets } = useTickets();
  const { updateState, updatingId } = useTicketState();
  const session = authService.getSession();
  const canTransition = session?.role === 'TECNICO' || session?.role === 'ADMIN';
  const canAssign = session?.role === 'TECNICO' || session?.role === 'ADMIN';
  const useDetailPage = session?.role === 'TECNICO' || session?.role === 'ADMIN';
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [audits, setAudits] = useState<TicketAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [catalogAreaById, setCatalogAreaById] = useState<Record<string, string>>({});
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string>>({});
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find((ticket) => ticket.id === selectedTicket.id) ?? null;
      setSelectedTicket(updated);
    }
  }, [selectedTicket, tickets]);

  useEffect(() => {
    if (!canAssign) {
      return;
    }

    void userService.list({ rol: 'TECNICO' })
      .then((data) => setTechnicians(data))
      .catch(() => setTechnicians([]));
  }, [canAssign]);

  useEffect(() => {
    void ticketService.listCatalogos()
      .then((catalogos) => {
        const areaMap = Object.fromEntries(catalogos.map((catalogo) => [catalogo.id, catalogo.nombre]));
        setCatalogAreaById(areaMap);
      })
      .catch(() => setCatalogAreaById({}));
  }, []);

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

  const canWriteWorkNote = session?.role === 'TECNICO' || session?.role === 'COLABORADOR';

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
    setTickets((current) => current.map((item) => (item.id === updated.id ? updated : item)));
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
      title="Dashboard de Tickets"
      subtitle="Vista operativa con estados, prioridad, auditoría y reasignación técnica."
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={metrics.total} icon={Layers3} accentClass="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" />
        <StatCard label="Nuevos" value={metrics.nuevos} icon={CircleDot} accentClass="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300" />
        <StatCard label="En Proceso" value={metrics.enProceso} icon={Loader2} accentClass="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300" />
        <StatCard label="Pendientes" value={metrics.pendientes} icon={AlertCircle} accentClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300" />
      </section>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}

      <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-[18px] font-semibold">Tickets</h3>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">Vista operativa con estados, prioridad y acciones.</p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Recargar
          </button>
        </div>

        <TicketTable
          tickets={tickets}
          loading={loading}
          canTransition={canTransition}
          canAssign={canAssign}
          technicians={technicians}
          catalogAreaById={catalogAreaById}
          assigningId={assigningId}
          selectedAssignees={selectedAssignees}
          updatingId={updatingId}
          onOpenDetails={(ticket) => {
            if (useDetailPage) {
              navigate(`/tickets/${ticket.id}`);
              return;
            }
            setSelectedTicket(ticket);
          }}
          onTransition={handleTransition}
          onAssigneeSelection={handleAssigneeSelection}
          onAssign={handleAssign}
        />
      </section>

      <Modal isOpen={Boolean(selectedTicket)} title={selectedTicket?.codigo ?? 'Detalle'} onClose={() => setSelectedTicket(null)}>
        {selectedTicket ? (
          <div className="space-y-3">
            <h4 className="text-[18px] font-semibold text-slate-900 dark:text-slate-50">{selectedTicket.titulo}</h4>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">{selectedTicket.descripcion}</p>
            <div className="text-[12px] text-slate-600 dark:text-slate-400">Resolución límite: {new Date(selectedTicket.resolucionLimite).toLocaleString()}</div>

            {canWriteWorkNote ? (
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <h5 className="mb-2 text-[14px] font-semibold text-slate-900 dark:text-slate-100">Agregar Nota de Trabajo</h5>
                <textarea
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Describe el avance, diagnóstico o acuerdo con el solicitante..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  rows={3}
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
            ) : null}

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
                      <div className="text-[12px] text-slate-500 dark:text-slate-500">{entry.actorUsername} ({entry.actorRol}) - {new Date(entry.fecha).toLocaleString()}</div>
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
