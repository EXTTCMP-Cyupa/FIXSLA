import { FormEvent, useEffect, useState } from 'react';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { CreateTicketPayload } from '../../../core/models/ticket';
import { Button } from '../../../shared/Button';

interface CreateTicketFormProps {
  catalogos: CatalogoIncidente[];
  loading?: boolean;
  onSubmit: (payload: CreateTicketPayload) => Promise<void>;
}

export function CreateTicketForm({ catalogos, loading, onSubmit }: CreateTicketFormProps) {
  const [form, setForm] = useState<CreateTicketPayload>({
    titulo: '',
    descripcion: '',
    solicitanteId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    catalogoIncidenteId: '',
  });

  const selectedCatalog = catalogos.find((catalogo) => catalogo.id === form.catalogoIncidenteId);

  useEffect(() => {
    if (!form.catalogoIncidenteId && catalogos.length > 0) {
      setForm((current) => ({ ...current, catalogoIncidenteId: catalogos[0].id }));
    }
  }, [catalogos, form.catalogoIncidenteId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((current) => ({ ...current, titulo: '', descripcion: '' }));
  };

  const priorityClasses = (priority: CatalogoIncidente['prioridadPorDefecto']) => {
    if (priority === 'ALTA') {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
    }
    if (priority === 'MEDIA') {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
    }
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
  };

  return (
    <form className="stack rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none" onSubmit={handleSubmit}>
      <div className="page-title">
        <h2 className="text-slate-900 dark:text-slate-50">Registrar incidente</h2>
        <p className="text-slate-600 dark:text-slate-400">Primero selecciona el catálogo y luego completa el detalle del ticket.</p>
      </div>

      <section className="space-y-3">
        <div className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">1. Selecciona un catálogo</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {catalogos.map((catalogo) => {
            const isSelected = form.catalogoIncidenteId === catalogo.id;
            return (
              <button
                key={catalogo.id}
                type="button"
                onClick={() => setForm((current) => ({ ...current, catalogoIncidenteId: catalogo.id }))}
                className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-500/50 dark:hover:bg-slate-700/60'
                }`}
                aria-pressed={isSelected}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <strong className="text-[15px] text-slate-900 dark:text-slate-50">{catalogo.nombre}</strong>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${priorityClasses(catalogo.prioridadPorDefecto)}`}>
                    {catalogo.prioridadPorDefecto}
                  </span>
                </div>
                <p className="text-[13px] text-slate-600 dark:text-slate-400">{catalogo.descripcion || 'Sin descripción.'}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] text-slate-600 dark:border-slate-600 dark:text-slate-300">
        {selectedCatalog
          ? `Catálogo seleccionado: ${selectedCatalog.nombre} (prioridad ${selectedCatalog.prioridadPorDefecto})`
          : 'Selecciona un catálogo para continuar.'}
      </div>

      <label className="field text-slate-900 dark:text-slate-50">
        <span className="text-[14px] font-semibold">2. Título</span>
        Título
        <input
          className="text-slate-900 dark:text-slate-50"
          value={form.titulo}
          onChange={(event) => setForm({ ...form, titulo: event.target.value })}
          required
          disabled={!form.catalogoIncidenteId}
        />
      </label>

      <label className="field text-slate-900 dark:text-slate-50">
        <span className="text-[14px] font-semibold">3. Descripción</span>
        Descripción
        <textarea
          className="text-slate-900 dark:text-slate-50"
          value={form.descripcion}
          onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
          required
          disabled={!form.catalogoIncidenteId}
        />
      </label>

      <Button
        type="submit"
        label={loading ? 'Guardando...' : 'Crear ticket'}
        disabled={loading || !form.catalogoIncidenteId}
      />
    </form>
  );
}
