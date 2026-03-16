import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, BarChart3, Settings, ClipboardList } from 'lucide-react';
import type { UserRole } from '../../core/models/auth';
import { ThemeToggle } from './ThemeToggle';
import type { ThemeMode } from '../../core/hooks/useTheme';
import { Button } from '../Button';

interface DashboardLayoutProps extends PropsWithChildren {
  username?: string;
  role?: UserRole;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
  title?: string;
  subtitle?: string;
  showNewTicketButton?: boolean;
}

function buildNavItems(role?: UserRole) {
  if (role === 'TECNICO') {
    return [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard-tecnico' },
      { label: 'Mis Tickets', icon: ClipboardList, to: '/mis-tickets' },
      { label: 'Tickets', icon: Ticket, to: '/tickets' },
      { label: 'Reportes', icon: BarChart3, to: '/reportes' },
      { label: 'Configuración', icon: Settings, to: '/configuracion' },
    ];
  }

  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/tickets' },
    { label: 'Tickets', icon: Ticket, to: '/tickets' },
  ];
  items.push({ label: 'Reportes', icon: BarChart3, to: '/reportes' });
  items.push({ label: 'Configuración', icon: Settings, to: '/configuracion' });
  return items;
}

export function DashboardLayout({
  username,
  role,
  theme,
  onToggleTheme,
  onLogout,
  title = 'Dashboard de Incidentes',
  subtitle = 'Seguimiento operativo en tiempo real.',
  showNewTicketButton = true,
  children,
}: DashboardLayoutProps) {
  const navItems = buildNavItems(role);
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0F172A] dark:text-[#F1F5F9]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 p-4 lg:grid-cols-[260px_1fr] lg:p-6">
        <aside className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-md transition-all duration-200 dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none lg:h-[calc(100vh-3rem)] lg:sticky lg:top-6">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">FixSLA</div>
            <h1 className="mt-1 text-[18px] font-semibold">Incident Control</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] dark:bg-slate-700/60 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-blue-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-5">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-md transition-all duration-200 dark:border-slate-700 dark:bg-[#1E293B] dark:shadow-none">
            <div>
              <h2 className="text-[28px] font-bold leading-tight">{title}</h2>
              <p className="text-[14px] text-slate-600 dark:text-slate-400">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              {showNewTicketButton ? (
                <Link to="/tickets/new">
                  <Button label="Nuevo Ticket" />
                </Link>
              ) : null}
              <div className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-[12px] dark:border-slate-700">
                <div className="font-semibold">{username ?? 'Usuario'}</div>
                <div className="text-slate-600 dark:text-slate-400">{role ?? 'COLABORADOR'}</div>
              </div>
              <Button variant="ghost" label="Salir" onClick={onLogout} />
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
