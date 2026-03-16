import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { LoginView } from './features/auth/LoginView';
import { TicketDashboard } from './features/tickets/views/TicketDashboard';
import { CreateTicketPage } from './features/tickets/views/CreateTicketPage';
import { MisTicketsView } from './features/tickets/views/MisTicketsView';
import { TecnicoDashboardView } from './features/tickets/views/TecnicoDashboardView';
import { authService } from './features/auth/authService';
import { ReportesView } from './features/reports/views/ReportesView';
import { ConfiguracionView } from './features/users/views/ConfiguracionView';

function App() {
  const [token, setToken] = useState<string | null>(authService.getToken());
  const session = authService.getSession();

  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  const defaultAuthenticatedPath = session?.role === 'TECNICO' ? '/dashboard-tecnico' : '/tickets';
  const handleLogout = () => {
    authService.clear();
    setToken(null);
  };

  return (
    <div className="app-shell bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="layout">
        <Routes>
          <Route
            path="/login"
            element={<LoginView onAuthenticated={(value) => setToken(value)} />}
          />
          <Route
            path="/dashboard-tecnico"
            element={isAuthenticated ? <TecnicoDashboardView onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/tickets"
            element={isAuthenticated ? <TicketDashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/reportes"
            element={isAuthenticated ? <ReportesView onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/configuracion"
            element={isAuthenticated ? <ConfiguracionView onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/mis-tickets"
            element={isAuthenticated ? <MisTicketsView onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/tickets/new"
            element={isAuthenticated ? <CreateTicketPage /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? defaultAuthenticatedPath : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
