import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, CircleDot, ClipboardList, Clock3 } from 'lucide-react';
import type { Ticket } from '../../../core/models/ticket';
import { authService } from '../../auth/authService';
import { ticketService } from '../services/ticketService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatCard } from '../components/StatCard';

interface ColaboradorDashboardViewProps {
  onLogout: () => void;
}

export function ColaboradorDashboardView({ onLogout }: ColaboradorDashboardViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nuevos, enProceso, pendientes] = await Promise.all([
        ticketService.list({ estado: 'NUEVO' }),
        ticketService.list({ estado: 'EN_PROCESO' }),
        ticketService.list({ estado: 'PENDIENTE' }),
      ]);
      setTickets([...nuevos, ...enProceso, ...pendientes]);
    } catch {
      setError('No fue posible cargar el dashboard de colaborador.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const urgentTickets = useMemo(
    () => [...tickets].sort((a, b) => new Date(a.resolucionLimite).getTime() - new Date(b.resolucionLimite).getTime()).slice(0, 5),
    [tickets],
  );

  const dueSoonCount = useMemo(
    () => tickets.filter((t) => new Date(t.resolucionLimite).getTime() - Date.now() <= 24 * 60 * 60 * 1000).length,
    [tickets],
  );

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Dashboard Colaborador"
      subtitle="Resumen de tus incidentes activos y alertas para seguimiento oportuno."
      showNewTicketButton={true}
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mis Activos" value={tickets.length} icon={ClipboardList} accentClass="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" />
        <StatCard label="Nuevos" value={tickets.filter((t) => t.estado === 'NUEVO').length} icon={CircleDot} accentClass="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300" />
        <StatCard label="Pendientes" value={tickets.filter((t) => t.estado === 'PENDIENTE').length} icon={Clock3} accentClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300" />
        <StatCard label="Vencen En 24h" value={dueSoonCount} icon={BellRing} accentClass="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300" />
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[18px] font-semibold">Seguimiento Prioritario</h3>
          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Recargar
          </button>
        </div>
        {loading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando resumen...</div>
        ) : urgentTickets.length === 0 ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">No tienes incidentes activos.</div>
        ) : (
          <ul className="space-y-2 text-[13px]">
            {urgentTickets.map((ticket) => (
              <li key={ticket.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                <Link to={`/mis-incidentes?ticketId=${ticket.id}`} className="block rounded-md outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-700">
                  <div className="font-semibold">{ticket.codigo} - {ticket.titulo}</div>
                  <div className="text-slate-600 dark:text-slate-400">{ticket.estado} | Vence: {new Date(ticket.resolucionLimite).toLocaleString()}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </DashboardLayout>
  );
}
