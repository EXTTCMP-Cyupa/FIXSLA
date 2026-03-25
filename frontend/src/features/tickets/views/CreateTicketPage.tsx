import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { CreateTicketPayload } from '../../../core/models/ticket';
import { Button } from '../../../shared/Button';
import { CreateTicketForm } from '../components/CreateTicketForm';
import { ticketService } from '../services/ticketService';
import { ubicacionService } from '../../ubicaciones/services/ubicacionService';
import type { Ubicacion } from '../../../core/models/ubicacion';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [catalogos, setCatalogos] = useState<CatalogoIncidente[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ticketService.listCatalogos()
      .then(setCatalogos)
      .catch(() => setError('No fue posible cargar el catálogo de incidentes.'));
    ubicacionService.list()
      .then(setUbicaciones)
      .catch(() => {});
  }, []);

  const handleSubmit = async (payload: CreateTicketPayload) => {
    try {
      setLoading(true);
      setError(null);
      await ticketService.create(payload);
      navigate('/tickets');
    } catch {
      setError('No fue posible crear el ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack rounded-2xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="page-header">
        <div className="page-title">
          <h1 className="text-slate-900 dark:text-slate-50">Nuevo incidente</h1>
          <p className="text-slate-600 dark:text-slate-400">Registro orientado a catálogo con prioridad automática.</p>
        </div>
        <Link to="/tickets">
          <Button label="Volver" variant="secondary" />
        </Link>
      </div>
      {error ? <span className="text-sm text-red-700 dark:text-red-400">{error}</span> : null}
      <CreateTicketForm catalogos={catalogos} ubicaciones={ubicaciones} loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}
