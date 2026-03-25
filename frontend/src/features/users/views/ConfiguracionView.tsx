import { FormEvent, useEffect, useState } from 'react';
import { authService } from '../../auth/authService';
import { DashboardLayout } from '../../../shared/components/DashboardLayout';
import { useTheme } from '../../../core/hooks/useTheme';
import { userService } from '../services/userService';
import { ticketService } from '../../tickets/services/ticketService';
import { ubicacionService } from '../../ubicaciones/services/ubicacionService';
import type { CreateUserPayload, UpdateUserPayload, User } from '../../../core/models/user';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { CreateUbicacionPayload, Ubicacion, UpdateUbicacionPayload } from '../../../core/models/ubicacion';
import { Button } from '../../../shared/Button';

interface ConfiguracionViewProps {
  onLogout: () => void;
}

interface UserFormState extends CreateUserPayload {
  activo: boolean;
}

const initialUserForm: UserFormState = {
  username: '',
  nombre: '',
  rol: 'COLABORADOR',
  area: '',
  numeroContacto: '',
  catalogoIds: [],
  activo: true,
};

const initialUbicacionForm: CreateUbicacionPayload = {
  nombre: '',
  descripcion: '',
};

export function ConfiguracionView({ onLogout }: ConfiguracionViewProps) {
  const session = authService.getSession();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = session?.role === 'ADMIN';
  const isColaborador = session?.role === 'COLABORADOR';

  const [myProfile, setMyProfile] = useState<User | null>(null);
  const [contacto, setContacto] = useState('');
  const [savingContacto, setSavingContacto] = useState(false);
  const [contactoMsg, setContactoMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(initialUserForm);
  const [savingUser, setSavingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionForm, setUbicacionForm] = useState<CreateUbicacionPayload>(initialUbicacionForm);
  const [editingUbicacionId, setEditingUbicacionId] = useState<string | null>(null);
  const [savingUbicacion, setSavingUbicacion] = useState(false);
  const [ubicacionError, setUbicacionError] = useState<string | null>(null);

  useEffect(() => {
    void userService
      .getMe()
      .then((user) => {
        setMyProfile(user);
        setContacto(user.numeroContacto ?? '');
      })
      .catch(() => {});

    if (!isColaborador) {
      setUsersLoading(true);
      void userService
        .list()
        .then((data) => setUsers(data))
        .catch(() => setUsersError('No fue posible cargar usuarios.'))
        .finally(() => setUsersLoading(false));

      void ticketService
        .listCatalogos()
        .then((data) => setCatalogos(data))
        .catch(() => setCatalogos([]));
    }

    if (isAdmin) {
      void ubicacionService
        .list()
        .then((data) => setUbicaciones(data))
        .catch(() => setUbicaciones([]));
    }
  }, [isAdmin, isColaborador]);

  const handleSaveContacto = async () => {
    try {
      setSavingContacto(true);
      setContactoMsg(null);
      const updated = await userService.updateMyContact(contacto.trim() || null);
      setMyProfile(updated);
      setContacto(updated.numeroContacto ?? '');
      setContactoMsg({ type: 'ok', text: 'Número guardado correctamente.' });
    } catch {
      setContactoMsg({ type: 'err', text: 'No fue posible guardar el número.' });
    } finally {
      setSavingContacto(false);
    }
  };

  const reloadUsers = () => {
    setUsersLoading(true);
    setUsersError(null);
    void userService
      .list()
      .then((data) => setUsers(data))
      .catch(() => setUsersError('No fue posible cargar usuarios.'))
      .finally(() => setUsersLoading(false));
  };

  const startEditingUser = (user: User) => {
    setEditingUserId(user.id);
    setForm({
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
      area: user.area,
      numeroContacto: user.numeroContacto ?? '',
      catalogoIds: user.catalogoIds ?? [],
      activo: user.activo,
    });
    setSelectedCatalogIds(user.catalogoIds ?? []);
    setFormError(null);
  };

  const resetUserForm = () => {
    setEditingUserId(null);
    setForm(initialUserForm);
    setSelectedCatalogIds([]);
    setFormError(null);
  };

  const handleUserSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingUser(true);
      setFormError(null);

      if (editingUserId) {
        const payload: UpdateUserPayload = {
          nombre: form.nombre,
          rol: form.rol,
          area: form.area,
          numeroContacto: form.numeroContacto?.trim() || null,
          activo: form.activo,
          catalogoIds: form.rol === 'TECNICO' ? selectedCatalogIds : [],
        };
        const updated = await userService.update(editingUserId, payload);
        setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
      } else {
        const payload: CreateUserPayload = {
          username: form.username,
          nombre: form.nombre,
          rol: form.rol,
          area: form.area,
          numeroContacto: form.numeroContacto?.trim() || undefined,
          catalogoIds: form.rol === 'TECNICO' ? selectedCatalogIds : [],
        };
        const created = await userService.create(payload);
        setUsers((current) => [created, ...current]);
      }

      resetUserForm();
    } catch {
      setFormError(editingUserId ? 'No fue posible actualizar el usuario.' : 'No fue posible registrar el usuario.');
    } finally {
      setSavingUser(false);
    }
  };

  const startEditingUbicacion = (ubicacion: Ubicacion) => {
    setEditingUbicacionId(ubicacion.id);
    setUbicacionForm({
      nombre: ubicacion.nombre,
      descripcion: ubicacion.descripcion ?? '',
    });
    setUbicacionError(null);
  };

  const resetUbicacionForm = () => {
    setEditingUbicacionId(null);
    setUbicacionForm(initialUbicacionForm);
    setUbicacionError(null);
  };

  const handleUbicacionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingUbicacion(true);
      setUbicacionError(null);

      if (editingUbicacionId) {
        const current = ubicaciones.find((item) => item.id === editingUbicacionId);
        const payload: UpdateUbicacionPayload = {
          nombre: ubicacionForm.nombre,
          descripcion: ubicacionForm.descripcion,
          activo: current?.activo ?? true,
        };
        const updated = await ubicacionService.update(editingUbicacionId, payload);
        setUbicaciones((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await ubicacionService.create(ubicacionForm);
        setUbicaciones((items) => [...items, created]);
      }

      resetUbicacionForm();
    } catch {
      setUbicacionError(editingUbicacionId ? 'No fue posible actualizar la ubicación.' : 'No fue posible crear la ubicación.');
    } finally {
      setSavingUbicacion(false);
    }
  };

  const toggleUbicacionActivo = async (ubicacion: Ubicacion) => {
    try {
      const updated = await ubicacionService.update(ubicacion.id, {
        nombre: ubicacion.nombre,
        descripcion: ubicacion.descripcion ?? undefined,
        activo: !ubicacion.activo,
      });
      setUbicaciones((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      setUbicacionError('No fue posible actualizar el estado de la ubicación.');
    }
  };

  const cardClassName = 'rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md dark:border-slate-700 dark:bg-[#1E293B]';

  return (
    <DashboardLayout
      username={session?.username}
      role={session?.role}
      theme={theme}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      title="Configuración"
      subtitle={isColaborador ? 'Tu perfil y tu número de contacto.' : 'Gestión de usuarios, ubicaciones y datos de contacto.'}
      showNewTicketButton={false}
    >
      <div className="space-y-6">
        <article className={cardClassName}>
          <h3 className="mb-3 text-[16px] font-semibold">Mi perfil</h3>
          <div className="grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Username</span>
              <p className="font-medium">{myProfile?.username ?? session?.username ?? '—'}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Nombre</span>
              <p className="font-medium">{myProfile?.nombre ?? '—'}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Rol</span>
              <p className="font-medium">{myProfile?.rol ?? session?.role ?? '—'}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Área</span>
              <p className="font-medium">{myProfile?.area ?? '—'}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="field flex-1 text-[13px]">
              Número de contacto
              <input
                type="tel"
                value={contacto}
                placeholder="Ej: +504 9999-9999"
                onChange={(event) => setContacto(event.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => void handleSaveContacto()}
              disabled={savingContacto}
              className="h-10 rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {savingContacto ? 'Guardando...' : 'Guardar contacto'}
            </button>
          </div>

          {contactoMsg ? (
            <p className={`mt-2 text-[12px] ${contactoMsg.type === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {contactoMsg.text}
            </p>
          ) : null}
        </article>

        {!isColaborador ? (
          <section className={`grid grid-cols-1 gap-4 ${isAdmin ? 'xl:grid-cols-[380px_1fr]' : ''}`}>
            {isAdmin ? (
              <article className={cardClassName}>
                <h3 className="text-[16px] font-semibold">{editingUserId ? 'Editar usuario' : 'Registrar usuario'}</h3>
                <p className="mb-3 text-[13px] text-slate-600 dark:text-slate-400">Solo disponible para administradores.</p>

                <form className="space-y-3" onSubmit={handleUserSubmit}>
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
                        const nextRole = event.target.value as CreateUserPayload['rol'];
                        setForm({ ...form, rol: nextRole, catalogoIds: [] });
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
                    <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
                  </label>

                  <label className="field text-[13px]">
                    Número de contacto
                    <input
                      type="tel"
                      value={form.numeroContacto ?? ''}
                      onChange={(event) => setForm({ ...form, numeroContacto: event.target.value })}
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

                  {form.rol === 'TECNICO' ? (
                    <div className="space-y-1">
                      <span className="text-[13px] font-medium">Catálogos que puede atender</span>
                      {catalogos.length === 0 ? (
                        <p className="text-[12px] text-slate-500">No hay catálogos creados aún.</p>
                      ) : (
                        <div className="mt-1 space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-600">
                          {catalogos.map((catalogo) => (
                            <label key={catalogo.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[13px] hover:bg-slate-50 dark:hover:bg-slate-700">
                              <input
                                type="checkbox"
                                checked={selectedCatalogIds.includes(catalogo.id)}
                                onChange={(event) => {
                                  setSelectedCatalogIds(
                                    event.target.checked
                                      ? [...selectedCatalogIds, catalogo.id]
                                      : selectedCatalogIds.filter((id) => id !== catalogo.id),
                                  );
                                }}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                              {catalogo.nombre}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {formError ? <div className="text-[13px] text-red-600 dark:text-red-300">{formError}</div> : null}

                  <div className="flex gap-2">
                    <Button
                      label={savingUser ? (editingUserId ? 'Guardando...' : 'Registrando...') : editingUserId ? 'Guardar cambios' : 'Registrar usuario'}
                      type="submit"
                      disabled={savingUser}
                    />
                    {editingUserId ? (
                      <button
                        type="button"
                        onClick={resetUserForm}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Cancelar
                      </button>
                    ) : null}
                  </div>
                </form>
              </article>
            ) : null}

            <article className={cardClassName}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-semibold">Usuarios</h3>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={reloadUsers}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Recargar
                  </button>
                ) : null}
              </div>

              {usersLoading ? (
                <div className="text-[14px] text-slate-600 dark:text-slate-400">Cargando usuarios...</div>
              ) : usersError ? (
                <div className="text-[13px] text-red-600 dark:text-red-300">{usersError}</div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full min-w-[620px] text-left">
                    <thead>
                      <tr className="text-[12px] uppercase text-slate-500">
                        <th className="px-2 py-2">Username</th>
                        <th className="px-2 py-2">Nombre</th>
                        <th className="px-2 py-2">Rol</th>
                        <th className="px-2 py-2">Área</th>
                        <th className="px-2 py-2">Contacto</th>
                        <th className="px-2 py-2">Estado</th>
                        {isAdmin ? <th className="px-2 py-2">Acciones</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-slate-200 text-[13px] dark:border-slate-700">
                          <td className="px-2 py-2">{user.username}</td>
                          <td className="px-2 py-2">{user.nombre}</td>
                          <td className="px-2 py-2">{user.rol}</td>
                          <td className="px-2 py-2">{user.area}</td>
                          <td className="px-2 py-2">{user.numeroContacto ?? '—'}</td>
                          <td className="px-2 py-2">{user.activo ? 'Activo' : 'Inactivo'}</td>
                          {isAdmin ? (
                            <td className="px-2 py-2">
                              <button
                                type="button"
                                onClick={() => startEditingUser(user)}
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
        ) : null}

        {isAdmin ? (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
            <article className={cardClassName}>
              <h3 className="text-[16px] font-semibold">{editingUbicacionId ? 'Editar ubicación' : 'Nueva ubicación'}</h3>
              <p className="mb-3 text-[13px] text-slate-600 dark:text-slate-400">Estas ubicaciones aparecerán al crear un ticket.</p>

              <form className="space-y-3" onSubmit={handleUbicacionSubmit}>
                <label className="field text-[13px]">
                  Nombre
                  <input
                    required
                    value={ubicacionForm.nombre}
                    onChange={(event) => setUbicacionForm({ ...ubicacionForm, nombre: event.target.value })}
                  />
                </label>

                <label className="field text-[13px]">
                  Descripción
                  <input
                    value={ubicacionForm.descripcion ?? ''}
                    onChange={(event) => setUbicacionForm({ ...ubicacionForm, descripcion: event.target.value })}
                  />
                </label>

                {ubicacionError ? <div className="text-[13px] text-red-600 dark:text-red-300">{ubicacionError}</div> : null}

                <div className="flex gap-2">
                  <Button
                    label={savingUbicacion ? 'Guardando...' : editingUbicacionId ? 'Guardar cambios' : 'Crear ubicación'}
                    type="submit"
                    disabled={savingUbicacion}
                  />
                  {editingUbicacionId ? (
                    <button
                      type="button"
                      onClick={resetUbicacionForm}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                  ) : null}
                </div>
              </form>
            </article>

            <article className={cardClassName}>
              <h3 className="mb-3 text-[16px] font-semibold">Ubicaciones</h3>
              <div className="overflow-auto">
                <table className="w-full min-w-[420px] text-left">
                  <thead>
                    <tr className="text-[12px] uppercase text-slate-500">
                      <th className="px-2 py-2">Nombre</th>
                      <th className="px-2 py-2">Descripción</th>
                      <th className="px-2 py-2">Estado</th>
                      <th className="px-2 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ubicaciones.map((ubicacion) => (
                      <tr key={ubicacion.id} className="border-t border-slate-200 text-[13px] dark:border-slate-700">
                        <td className="px-2 py-2 font-medium">{ubicacion.nombre}</td>
                        <td className="px-2 py-2 text-slate-500">{ubicacion.descripcion ?? '—'}</td>
                        <td className="px-2 py-2">{ubicacion.activo ? 'Activa' : 'Inactiva'}</td>
                        <td className="px-2 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingUbicacion(ubicacion)}
                              className="rounded border border-blue-300 px-2 py-1 text-[12px] font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-500/40 dark:text-blue-300 dark:hover:bg-blue-500/10"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void toggleUbicacionActivo(ubicacion)}
                              className="rounded border border-slate-300 px-2 py-1 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              {ubicacion.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {ubicaciones.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-2 py-4 text-center text-[13px] text-slate-500">
                          No hay ubicaciones registradas.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </DashboardLayout>
  );
}