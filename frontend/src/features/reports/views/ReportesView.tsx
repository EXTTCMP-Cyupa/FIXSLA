import { useEffect, useMemo, useState } from 'react';
import { authService } from '../../auth/authService';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { useTheme } from '../../../core/hooks/useTheme';
import { useTickets } from '../../tickets/hooks/useTickets';
import { ticketService } from '../../tickets/services/ticketService';
import type { TicketAudit } from '../../../core/models/audit';
import type { Ticket } from '../../../core/models/ticket';

interface ReportesViewProps {
  onLogout: () => void;
}

export function ReportesView({ onLogout }: ReportesViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();
  const { tickets, loading, error } = useTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [audit, setAudit] = useState<TicketAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    if (!selectedTicketId) {
      return;
    }

    setAuditLoading(true);
    void ticketService.listAudit(selectedTicketId)
      .then((rows) => setAudit(rows))
      .catch(() => setAudit([]))
      .finally(() => setAuditLoading(false));
  }, [selectedTicketId]);

  const metrics = useMemo(() => {
    const now = Date.now();
    const abiertos = tickets.filter((ticket) => ticket.estado !== 'RESUELTO' && ticket.estado !== 'CANCELADO').length;
    const resueltos = tickets.filter((ticket) => ticket.estado === 'RESUELTO').length;
    const vencidos = tickets.filter((ticket) => new Date(ticket.resolucionLimite).getTime() < now && ticket.estado !== 'RESUELTO' && ticket.estado !== 'CANCELADO').length;

    return { abiertos, resueltos, vencidos };
  }, [tickets]);

  const selectedTicket: Ticket | undefined = tickets.find((ticket) => ticket.id === selectedTicketId);

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Reportes Operativos"
      subtitle="Indicadores de carga, cumplimiento SLA y trazabilidad por ticket."
      showNewTicketButton={false}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <p className="text-[12px] uppercase tracking-wide text-slate-500">Abiertos</p>
          <strong className="text-[28px]">{metrics.abiertos}</strong>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <p className="text-[12px] uppercase tracking-wide text-slate-500">Resueltos</p>
          <strong className="text-[28px]">{metrics.resueltos}</strong>
        </article>
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <p className="text-[12px] uppercase tracking-wide text-slate-500">SLA vencido</p>
          <strong className="text-[28px]">{metrics.vencidos}</strong>
        </article>
      </section>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}

      <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[13px] text-slate-600 dark:text-slate-300">Ticket para auditoría</label>
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] dark:border-slate-600 dark:bg-slate-800"
            value={selectedTicketId}
            onChange={(event) => setSelectedTicketId(event.target.value)}
          >
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>{ticket.codigo} - {ticket.titulo}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando tickets...</div>
        ) : auditLoading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando eventos de auditoría...</div>
        ) : (
          <div className="space-y-2">
            {selectedTicket ? (
              <p className="text-[13px] text-slate-600 dark:text-slate-400">Eventos de {selectedTicket.codigo}</p>
            ) : null}
            {audit.length === 0 ? (
              <div className="text-[14px] text-slate-600 dark:text-slate-400">No hay eventos registrados.</div>
            ) : (
              audit.map((entry) => (
                <article key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-[13px] font-semibold">{entry.accion.replace('_', ' ')}</p>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400">{entry.detalle}</p>
                  <p className="text-[12px] text-slate-500">{entry.actorUsername} ({entry.actorRol}) - {new Date(entry.fecha).toLocaleString()}</p>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
