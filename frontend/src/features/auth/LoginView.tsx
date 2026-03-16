import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from './authService';
import { Button } from '../../shared/Button';
import { useTheme } from '../../core/hooks/useTheme';
import { ThemeToggle } from '../../shared/components/ThemeToggle';

interface LoginViewProps {
  onAuthenticated: (token: string) => void;
}

export function LoginView({ onAuthenticated }: LoginViewProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ username: 'colaborador.rrhh', password: '123456', role: 'COLABORADOR' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const session = await authService.login(form);
      onAuthenticated(session.accessToken);
      navigate(session.role === 'TECNICO' ? '/dashboard-tecnico' : '/tickets');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: string } | undefined)?.message ?? 'No fue posible iniciar sesión.')
        : 'No fue posible iniciar sesión.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-2 rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-900 dark:text-slate-50" style={{ alignItems: 'center', minHeight: 'calc(100vh - 48px)' }}>
      <section className="stack">
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <div className="page-title">
          <h1 className="text-slate-900 dark:text-slate-50">FIXSLA Helpdesk</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestión reactiva de incidentes con trazabilidad de SLA y operación ITSM.</p>
        </div>
        <div className="card p-6">
          <div className="stack">
            <strong className="text-slate-900 dark:text-slate-50">Capacidades incluidas</strong>
            <span className="helper-text">• Tickets con flujo de estados</span>
            <span className="helper-text">• Priorización automática por catálogo</span>
            <span className="helper-text">• Base preparada para JWT y WebFlux</span>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <form className="stack" onSubmit={handleSubmit}>
          <div className="page-title">
            <h2 className="text-slate-900 dark:text-slate-50">Acceso seguro</h2>
            <p className="text-slate-600 dark:text-slate-400">Usa un usuario existente: colaborador.rrhh, tecnico.hw, tecnico.sw o admin.</p>
          </div>
          <label className="field text-slate-900 dark:text-slate-50">
            Usuario
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          </label>
          <label className="field text-slate-900 dark:text-slate-50">
            Contraseña
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <label className="field text-slate-900 dark:text-slate-50">
            Rol
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="COLABORADOR">Colaborador</option>
              <option value="TECNICO">Técnico</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          {error ? <span className="text-sm text-red-700 dark:text-red-400">{error}</span> : null}
          <Button label={loading ? 'Ingresando...' : 'Iniciar sesión'} type="submit" disabled={loading} />
        </form>
      </section>
    </div>
  );
}
