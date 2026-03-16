import { FormEvent, useEffect, useState } from 'react';
import { authService } from '../../auth/authService';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { useTheme } from '../../../core/hooks/useTheme';
import { userService } from '../services/userService';
import { ticketService } from '../../tickets/services/ticketService';
import type { CreateUserPayload, UpdateUserPayload, User } from '../../../core/models/user';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import { Button } from '../../../shared/Button';

interface ConfiguracionViewProps {
  onLogout: () => void;
}

interface UserFormState extends CreateUserPayload {
  activo: boolean;
}

const initialForm: UserFormState = {
  username: '',
  nombre: '',
  rol: 'COLABORADOR',
  area: '',
  catalogoIds: [],
  activo: true,
};

export function ConfiguracionView({ onLogout }: ConfiguracionViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);

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
    void ticketService.listCatalogos()
      .then((data) => setCatalogos(data))
      .catch(() => setCatalogos([]));
  }, []);

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setForm({
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
      area: user.area,
      catalogoIds: user.catalogoIds,
      activo: user.activo,
    });
    setSelectedCatalogIds(user.catalogoIds ?? []);
  };

  const resetForm = () => {
    setEditingUserId(null);
    setForm(initialForm);
    setSelectedCatalogIds([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageUsers) {
      setError('Solo un administrador puede registrar usuarios.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      if (editingUserId) {
        const payload: UpdateUserPayload = {
          nombre: form.nombre,
          rol: form.rol,
          area: form.area,
          activo: form.activo,
          catalogoIds: form.rol === 'TECNICO' ? selectedCatalogIds : [],
        };
        const updated = await userService.update(editingUserId, payload);
        setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        const payload: CreateUserPayload = {
          username: form.username,
          nombre: form.nombre,
          rol: form.rol,
          area: form.area,
          catalogoIds: form.rol === 'TECNICO' ? selectedCatalogIds : [],
        };
        const created = await userService.create(payload);
        setUsers((current) => [created, ...current]);
      }
      resetForm();
    } catch {
      setError(editingUserId ? 'No fue posible actualizar el usuario.' : 'No fue posible registrar el usuario.');
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
          <h3 className="text-[16px] font-semibold">{editingUserId ? 'Editar Usuario' : 'Registrar Usuario'}</h3>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">Disponible solo para administradores.</p>

          <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
            <label className="field text-[13px]">
              Username
              <input
                value={form.username}
                disabled={Boolean(editingUserId)}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </label>
            <label className="field text-[13px]">
              Nombre
              <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
            </label>
            <label className="field text-[13px]">
              Rol
              <select
                value={form.rol}
                onChange={(event) => {
                  const newRol = event.target.value as CreateUserPayload['rol'];
                  setForm({ ...form, rol: newRol, catalogoIds: [] });
                  setSelectedCatalogIds([]);
                }}
              >
                <option value="COLABORADOR">Colaborador</option>
                <option value="TECNICO">Técnico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
            <label className="field text-[13px]">
              Área
              <input
                value={form.area}
                placeholder="Ej: Soporte TI, Recursos Humanos…"
                onChange={(event) => setForm({ ...form, area: event.target.value })}
              />
            </label>
            <label className="field text-[13px]">
              Estado
              <select
                value={form.activo ? 'ACTIVO' : 'INACTIVO'}
                onChange={(event) => setForm({ ...form, activo: event.target.value === 'ACTIVO' })}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </label>
            {form.rol === 'TECNICO' && (
              <div className="space-y-1">
                <span className="text-[13px] font-medium">Catálogos que puede atender</span>
                {catalogos.length === 0 ? (
                  <p className="text-[12px] text-slate-500">No hay catálogos creados aún.</p>
                ) : (
                  <div className="mt-1 space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-600">
                    {catalogos.map((cat) => (
                      <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[13px] hover:bg-slate-50 dark:hover:bg-slate-700">
                        <input
                          type="checkbox"
                          checked={selectedCatalogIds.includes(cat.id)}
                          onChange={(event) => {
                            setSelectedCatalogIds(event.target.checked
                              ? [...selectedCatalogIds, cat.id]
                              : selectedCatalogIds.filter((id) => id !== cat.id));
                          }}
                          className="h-4 w-4 rounded accent-blue-600"
                        />
                        {cat.nombre}
                      </label>
                    ))}
                  </div>
                )}
                {selectedCatalogIds.length === 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">Selecciona al menos un catálogo.</p>
                )}
              </div>
            )}

            {error ? <div className="text-[13px] text-red-600 dark:text-red-300">{error}</div> : null}
            <div className="flex gap-2">
              <Button
                label={saving ? (editingUserId ? 'Guardando...' : 'Registrando...') : (editingUserId ? 'Guardar cambios' : 'Registrar usuario')}
                type="submit"
                disabled={saving || !canManageUsers}
              />
              {editingUserId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
              )}
            </div>
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
                    {canManageUsers ? <th className="px-2 py-2">Acciones</th> : null}
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
                      {canManageUsers ? (
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => startEditing(user)}
                            className="rounded border border-blue-300 px-2 py-1 text-[12px] font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-500/40 dark:text-blue-300 dark:hover:bg-blue-500/10"
                          >
                            Editar
                          </button>
                        </td>
                      ) : null}
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
