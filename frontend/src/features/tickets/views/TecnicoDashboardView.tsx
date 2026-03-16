import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CircleDot, Clock3, Loader2, ShieldCheck } from 'lucide-react';
import { authService } from '../../auth/authService';
import { ticketService } from '../services/ticketService';
import { userService } from '../../users/services/userService';
import { useTheme } from '../../../core/hooks/useTheme';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { StatCard } from '../components/StatCard';
import type { Ticket } from '../../../core/models/ticket';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { User } from '../../../core/models/user';

interface TecnicoDashboardViewProps {
  onLogout: () => void;
}

export function TecnicoDashboardView({ onLogout }: TecnicoDashboardViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allActiveTickets, setAllActiveTickets] = useState<Ticket[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [myTech, setMyTech] = useState<User | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [nuevos, enProceso, pendientes, allCatalogos, techs] = await Promise.all([
        ticketService.list({ estado: 'NUEVO' }),
        ticketService.list({ estado: 'EN_PROCESO' }),
        ticketService.list({ estado: 'PENDIENTE' }),
        ticketService.listCatalogos(),
        userService.list({ rol: 'TECNICO' }),
      ]);

      const tech = techs.find((t) => t.username === session?.username) ?? null;
      setMyTech(tech);
      setCatalogos(allCatalogos);
      setAllActiveTickets([...nuevos, ...enProceso, ...pendientes]);
    } catch {
      setError('No fue posible cargar el dashboard técnico.');
    } finally {
      setLoading(false);
    }
  }, [session?.username]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const accessibleCatalogIds = useMemo(() => {
    const directCatalogIds = myTech?.catalogoIds ?? [];
    if (directCatalogIds.length > 0) {
      return directCatalogIds;
    }

    if (!myTech?.area) {
      return [];
    }

    return catalogos
      .filter((catalogo) => catalogo.nombre.toLowerCase() === myTech.area.toLowerCase())
      .map((catalogo) => catalogo.id);
  }, [catalogos, myTech?.area, myTech?.catalogoIds]);

  const visibleTickets = useMemo(() => {
    if (accessibleCatalogIds.length > 0) {
      const allowed = new Set(accessibleCatalogIds);
      return allActiveTickets.filter((ticket) => allowed.has(ticket.catalogoIncidenteId));
    }

    if (myTech?.id) {
      return allActiveTickets.filter((ticket) => ticket.tecnicoAsignadoId === myTech.id);
    }

    return [];
  }, [accessibleCatalogIds, allActiveTickets, myTech?.id]);

  const assignedToMe = useMemo(
    () => visibleTickets.filter((ticket) => myTech?.id && ticket.tecnicoAsignadoId === myTech.id),
    [myTech?.id, visibleTickets],
  );

  const unassignedNew = useMemo(
    () => visibleTickets.filter((ticket) => ticket.estado === 'NUEVO' && !ticket.tecnicoAsignadoId),
    [visibleTickets],
  );

  const overdueAssigned = useMemo(
    () => assignedToMe.filter((ticket) => new Date(ticket.resolucionLimite).getTime() < Date.now()),
    [assignedToMe],
  );

  const catalogSummary = useMemo(() => {
    const allowed = new Set(accessibleCatalogIds);
    return catalogos
      .filter((catalogo) => allowed.has(catalogo.id))
      .map((catalogo) => {
        const catalogTickets = visibleTickets.filter((ticket) => ticket.catalogoIncidenteId === catalogo.id);
        const myAssigned = catalogTickets.filter((ticket) => ticket.tecnicoAsignadoId === myTech?.id).length;
        const newQueue = catalogTickets.filter((ticket) => ticket.estado === 'NUEVO' && !ticket.tecnicoAsignadoId).length;
        return {
          id: catalogo.id,
          nombre: catalogo.nombre,
          activos: catalogTickets.length,
          asignadosAMi: myAssigned,
          nuevosSinAsignar: newQueue,
        };
      })
      .sort((a, b) => b.activos - a.activos);
  }, [accessibleCatalogIds, catalogos, myTech?.id, visibleTickets]);

  const urgentAssigned = useMemo(
    () => [...assignedToMe].sort((a, b) => new Date(a.resolucionLimite).getTime() - new Date(b.resolucionLimite).getTime()).slice(0, 5),
    [assignedToMe],
  );

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Dashboard Técnico"
      subtitle="Resumen de carga operativa, cola por atender y catálogos bajo tu alcance."
      showNewTicketButton={false}
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Asignados A Mí"
          value={assignedToMe.length}
          icon={ShieldCheck}
          accentClass="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
        />
        <StatCard
          label="Mis Nuevos"
          value={assignedToMe.filter((t) => t.estado === 'NUEVO').length}
          icon={CircleDot}
          accentClass="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
        />
        <StatCard
          label="Mis En Proceso"
          value={assignedToMe.filter((t) => t.estado === 'EN_PROCESO').length}
          icon={Loader2}
          accentClass="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
        />
        <StatCard
          label="Mis Pendientes"
          value={assignedToMe.filter((t) => t.estado === 'PENDIENTE').length}
          icon={Clock3}
          accentClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
        />
        <StatCard
          label="Nuevos Sin Asignar"
          value={unassignedNew.length}
          icon={AlertTriangle}
          accentClass="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
        />
      </section>

      <section className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-[18px] font-semibold">Catálogos que Puedes Atender</h3>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Recargar
          </button>
        </div>
        {loading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando métricas...</div>
        ) : catalogSummary.length === 0 ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Aún no tienes catálogos asignados.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="text-[12px] uppercase text-slate-500">
                  <th className="px-2 py-2">Catálogo</th>
                  <th className="px-2 py-2">Activos</th>
                  <th className="px-2 py-2">Asignados A Mí</th>
                  <th className="px-2 py-2">Nuevos Sin Asignar</th>
                </tr>
              </thead>
              <tbody>
                {catalogSummary.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-2 py-2 font-semibold">{row.nombre}</td>
                    <td className="px-2 py-2">{row.activos}</td>
                    <td className="px-2 py-2">{row.asignadosAMi}</td>
                    <td className="px-2 py-2">{row.nuevosSinAsignar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <h4 className="text-[16px] font-semibold">Mis Tickets Más Urgentes</h4>
          {urgentAssigned.length === 0 ? (
            <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">No tienes tickets asignados en este momento.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-[13px]">
              {urgentAssigned.map((ticket) => (
                <li key={ticket.id} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800">
                  <Link to={`/mis-tickets?ticketId=${ticket.id}`} className="block rounded-md outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-700">
                    <div className="font-semibold">{ticket.codigo} - {ticket.titulo}</div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {ticket.estado} | Vence: {new Date(ticket.resolucionLimite).toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <h4 className="text-[16px] font-semibold">Alertas SLA</h4>
          <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
            Tickets asignados vencidos: <span className="font-semibold text-rose-600 dark:text-rose-300">{overdueAssigned.length}</span>
          </p>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            Revisa primero los tickets vencidos o con menor fecha de resolución para evitar incumplimientos de SLA.
          </p>
        </article>
      </section>
    </DashboardLayout>
  );
}
