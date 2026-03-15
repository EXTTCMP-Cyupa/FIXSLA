import { FormEvent, useEffect, useState } from 'react';
import { authService } from '../../auth/authService';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { useTheme } from '../../../core/hooks/useTheme';
import { userService } from '../services/userService';
import type { CreateUserPayload, User } from '../../../core/models/user';
import { Button } from '../../../shared/Button';

interface ConfiguracionViewProps {
  onLogout: () => void;
}

const initialForm: CreateUserPayload = {
  username: '',
  nombre: '',
  rol: 'COLABORADOR',
  area: '',
};

export function ConfiguracionView({ onLogout }: ConfiguracionViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  const [saving, setSaving] = useState(false);

  const canManageUsers = session?.role === 'ADMIN';

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.list();
      setUsers(data);
    } catch {
      setError('No fue posible cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageUsers) {
      setError('Solo un administrador puede registrar usuarios.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const created = await userService.create(form);
      setUsers((current) => [created, ...current]);
      setForm(initialForm);
    } catch {
      setError('No fue posible registrar el usuario.');
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
      title="Configuración"
      subtitle="Gestión de usuarios y áreas operativas."
      showNewTicketButton={false}
    >
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <h3 className="text-[16px] font-semibold">Registrar Usuario</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">Disponible solo para administradores.</p>

          <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
            <label className="field text-[13px]">
              Username
              <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
            </label>
            <label className="field text-[13px]">
              Nombre
              <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
            </label>
            <label className="field text-[13px]">
              Rol
              <select value={form.rol} onChange={(event) => setForm({ ...form, rol: event.target.value as CreateUserPayload['rol'] })}>
                <option value="COLABORADOR">Colaborador</option>
                <option value="TECNICO">Técnico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
            <label className="field text-[13px]">
              Área
              <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
            </label>

            {error ? <div className="text-[13px] text-red-600 dark:text-red-300">{error}</div> : null}
            <Button label={saving ? 'Registrando...' : 'Registrar usuario'} type="submit" disabled={saving || !canManageUsers} />
          </form>
        </article>

        <article className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Usuarios</h3>
            <button
              type="button"
              onClick={() => void loadUsers()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Recargar
            </button>
          </div>
          {loading ? (
            <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando usuarios...</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="text-[12px] uppercase text-slate-500">
                    <th className="px-2 py-2">Username</th>
                    <th className="px-2 py-2">Nombre</th>
                    <th className="px-2 py-2">Rol</th>
                    <th className="px-2 py-2">Área</th>
                    <th className="px-2 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 text-[13px] dark:border-slate-700">
                      <td className="px-2 py-2">{user.username}</td>
                      <td className="px-2 py-2">{user.nombre}</td>
                      <td className="px-2 py-2">{user.rol}</td>
                      <td className="px-2 py-2">{user.area}</td>
                      <td className="px-2 py-2">{user.activo ? 'Activo' : 'Inactivo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </DashboardLayout>
  );
}
