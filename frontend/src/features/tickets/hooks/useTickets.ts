import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Ticket } from '../../../core/models/ticket';
import { ticketService } from '../services/ticketService';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.list();
      setTickets(data);
    } catch {
      setError('No fue posible cargar los tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const metrics = useMemo(() => ({
    total: tickets.length,
    nuevos: tickets.filter((ticket) => ticket.estado === 'NUEVO').length,
    enProceso: tickets.filter((ticket) => ticket.estado === 'EN_PROCESO').length,
    pendientes: tickets.filter((ticket) => ticket.estado === 'PENDIENTE').length,
  }), [tickets]);

  return {
    tickets,
    loading,
    error,
    metrics,
    refresh: loadTickets,
    setTickets,
  };
}
