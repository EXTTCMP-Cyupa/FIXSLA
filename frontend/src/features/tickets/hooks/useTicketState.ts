import { useState } from 'react';
import type { Ticket, TicketStatus } from '../../../core/models/ticket';
import { ticketService } from '../services/ticketService';

export function useTicketState() {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateState = async (ticket: Ticket, nextStatus: TicketStatus): Promise<Ticket> => {
    setUpdatingId(ticket.id);
    try {
      return await ticketService.updateStatus(ticket.id, {
        nextStatus,
        tecnicoAsignadoId: ticket.tecnicoAsignadoId ?? '99999999-9999-9999-9999-999999999999',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    updatingId,
    updateState,
  };
}
