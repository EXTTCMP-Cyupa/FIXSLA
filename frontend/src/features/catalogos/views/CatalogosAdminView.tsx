import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../../auth/authService';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { useTheme } from '../../../core/hooks/useTheme';
import { CreateCatalogoForm } from '../../tickets/components/CreateCatalogoForm';
import { ticketService } from '../../tickets/services/ticketService';
import type { CatalogoIncidente } from '../../../core/models/catalogo';

interface CatalogosAdminViewProps {
  onLogout: () => void;
}

export function CatalogosAdminView({ onLogout }: CatalogosAdminViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();

  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [onlyActive, setOnlyActive] = useState(false);

  const canManageCatalogos = session?.role === 'ADMIN';

  const loadCatalogos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.listCatalogos({ soloActivos: onlyActive });
      setCatalogos(data);
    } catch {
      setError('No fue posible cargar catálogos.');
    } finally {
      setLoading(false);
    }
  }, [onlyActive]);

  useEffect(() => {
    void loadCatalogos();
  }, [loadCatalogos]);

  const sortedCatalogos = useMemo(
    () => [...catalogos].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })),
    [catalogos],
  );

  const handleCreateCatalogo = async (payload: { nombre: string; descripcion: string; prioridadPorDefecto: 'ALTA' | 'MEDIA' | 'BAJA' }) => {
    try {
      setSaving(true);
      setMessage(null);
      setError(null);
      await ticketService.createCatalogo(payload);
      setMessage('Catálogo creado correctamente.');
      await loadCatalogos();
    } catch {
      setError('No fue posible crear el catálogo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Catálogos"
      subtitle="Administra los tipos de incidentes y su prioridad por defecto."
      showNewTicketButton={false}
    >
      {canManageCatalogos ? (
        <CreateCatalogoForm loading={saving} onSubmit={handleCreateCatalogo} />
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          Solo un administrador puede crear catálogos.
        </div>
      )}

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <section className="space-y-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[18px] font-semibold">Catálogos Existentes</h3>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">Listado de catálogos registrados en la plataforma.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(event) => setOnlyActive(event.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              Solo activos
            </label>
            <button
              type="button"
              onClick={() => void loadCatalogos()}
              className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Recargar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando catálogos...</div>
        ) : sortedCatalogos.length === 0 ? (
          <div className="text-[14px] text-slate-600 dark:text-slate-400">No hay catálogos registrados.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-[12px] uppercase text-slate-500">
                  <th className="px-2 py-2">Nombre</th>
                  <th className="px-2 py-2">Descripción</th>
                  <th className="px-2 py-2">Prioridad</th>
                  <th className="px-2 py-2">Estado</th>
                  <th className="px-2 py-2">Creado</th>
                </tr>
              </thead>
              <tbody>
                {sortedCatalogos.map((catalogo) => (
                  <tr key={catalogo.id} className="border-t border-slate-200 text-[13px] dark:border-slate-700">
                    <td className="px-2 py-2 font-semibold">{catalogo.nombre}</td>
                    <td className="px-2 py-2">{catalogo.descripcion ?? '—'}</td>
                    <td className="px-2 py-2">{catalogo.prioridadPorDefecto}</td>
                    <td className="px-2 py-2">{catalogo.activo ? 'Activo' : 'Inactivo'}</td>
                    <td className="px-2 py-2">{new Date(catalogo.creadoEn).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
