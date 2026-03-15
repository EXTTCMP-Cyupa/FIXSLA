import { FormEvent, useState } from 'react';
import type { TicketPriority } from '../../../core/models/ticket';
import { Button } from '../../../shared/Button';

interface CreateCatalogoFormProps {
  loading?: boolean;
  onSubmit: (payload: { nombre: string; descripcion: string; prioridadPorDefecto: TicketPriority }) => Promise<void>;
}

export function CreateCatalogoForm({ loading, onSubmit }: CreateCatalogoFormProps) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    prioridadPorDefecto: 'MEDIA' as TicketPriority,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ nombre: '', descripcion: '', prioridadPorDefecto: 'MEDIA' });
  };

  return (
    <form className="stack rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none" onSubmit={handleSubmit}>
      <div className="page-title">
        <h2 className="text-slate-900 dark:text-slate-50">Administrar catálogo</h2>
        <p className="text-slate-600 dark:text-slate-400">Solo administrador puede registrar nuevas tipificaciones.</p>
      </div>
      <label className="field text-slate-900 dark:text-slate-50">
        Nombre
        <input className="text-slate-900 dark:text-slate-50" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
      </label>
      <label className="field text-slate-900 dark:text-slate-50">
        Descripción
        <textarea className="text-slate-900 dark:text-slate-50" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} required />
      </label>
      <label className="field text-slate-900 dark:text-slate-50">
        Prioridad por defecto
        <select
          className="text-slate-900 dark:text-slate-50"
          value={form.prioridadPorDefecto}
          onChange={(event) => setForm({ ...form, prioridadPorDefecto: event.target.value as TicketPriority })}
        >
          <option value="ALTA">ALTA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="BAJA">BAJA</option>
        </select>
      </label>
      <Button type="submit" label={loading ? 'Guardando...' : 'Crear catálogo'} disabled={loading} />
    </form>
  );
}
