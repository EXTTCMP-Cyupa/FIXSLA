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

  useEffect(() => {
    if (!form.catalogoIncidenteId && catalogos.length > 0) {
      setForm((current) => ({ ...current, catalogoIncidenteId: catalogos[0].id }));
    }
  }, [catalogos, form.catalogoIncidenteId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ ...form, titulo: '', descripcion: '' });
  };

  return (
    <form className="stack rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none" onSubmit={handleSubmit}>
      <div className="page-title">
        <h2 className="text-slate-900 dark:text-slate-50">Registrar incidente</h2>
        <p className="text-slate-600 dark:text-slate-400">El catálogo define la prioridad automática del ticket.</p>
      </div>
      <label className="field text-slate-900 dark:text-slate-50">
        Título
        <input className="text-slate-900 dark:text-slate-50" value={form.titulo} onChange={(event) => setForm({ ...form, titulo: event.target.value })} required />
      </label>
      <label className="field text-slate-900 dark:text-slate-50">
        Descripción
        <textarea className="text-slate-900 dark:text-slate-50" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} required />
      </label>
      <label className="field text-slate-900 dark:text-slate-50">
        Catálogo
        <select className="text-slate-900 dark:text-slate-50" value={form.catalogoIncidenteId} onChange={(event) => setForm({ ...form, catalogoIncidenteId: event.target.value })}>
          {catalogos.map((catalogo) => (
            <option key={catalogo.id} value={catalogo.id}>
              {catalogo.nombre} · {catalogo.prioridadPorDefecto}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" label={loading ? 'Guardando...' : 'Crear ticket'} disabled={loading} />
    </form>
  );
}
