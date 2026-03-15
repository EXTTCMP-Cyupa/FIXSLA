import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { LoginView } from './features/auth/LoginView';
import { TicketDashboard } from './features/tickets/views/TicketDashboard';
import { CreateTicketPage } from './features/tickets/views/CreateTicketPage';
import { authService } from './features/auth/authService';
import { ReportesView } from './features/reports/views/ReportesView';
import { ConfiguracionView } from './features/users/views/ConfiguracionView';

function App() {
  const [token, setToken] = useState<string | null>(authService.getToken());

  const isAuthenticated = useMemo(() => Boolean(token), [token]);
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
            path="/tickets/new"
            element={isAuthenticated ? <CreateTicketPage /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/tickets' : '/login'} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
