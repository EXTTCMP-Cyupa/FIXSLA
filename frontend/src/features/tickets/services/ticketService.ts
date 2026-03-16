import { apiClient } from '../../../core/config/api';
import type { TicketAudit } from '../../../core/models/audit';
import type { CatalogoIncidente } from '../../../core/models/catalogo';
import type { CreateTicketPayload, Ticket, TicketStatus, UpdateTicketStatusPayload } from '../../../core/models/ticket';
import type { CreateCatalogoPayload } from '../../../core/models/catalogo';

export const ticketService = {
  async list(filters?: Partial<{ estado: TicketStatus; catalogoIncidenteId: string }>): Promise<Ticket[]> {
    const { data } = await apiClient.get<Ticket[]>('/tickets', { params: filters });
    return data;
  },
  async getById(ticketId: string): Promise<Ticket> {
    const { data } = await apiClient.get<Ticket>(`/tickets/${ticketId}`);
    return data;
  },
  async create(payload: CreateTicketPayload): Promise<Ticket> {
    const { data } = await apiClient.post<Ticket>('/tickets', payload);
    return data;
  },
  async updateStatus(ticketId: string, payload: UpdateTicketStatusPayload): Promise<Ticket> {
    const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/status`, payload);
    return data;
  },
  async assignTechnician(ticketId: string, tecnicoAsignadoId: string): Promise<Ticket> {
    const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/assignee`, { tecnicoAsignadoId });
    return data;
  },
  async updateCatalog(ticketId: string, catalogoIncidenteId: string): Promise<Ticket> {
    const { data } = await apiClient.patch<Ticket>(`/tickets/${ticketId}/catalogo`, { catalogoIncidenteId });
    return data;
  },
  async listAudit(ticketId: string): Promise<TicketAudit[]> {
    const { data } = await apiClient.get<TicketAudit[]>(`/tickets/${ticketId}/auditoria`);
    return data;
  },
  async addWorkNote(ticketId: string, nota: string): Promise<TicketAudit> {
    const { data } = await apiClient.post<TicketAudit>(`/tickets/${ticketId}/notas`, { nota });
    return data;
  },
  async listCatalogos(filters?: Partial<{ soloActivos: boolean }>): Promise<CatalogoIncidente[]> {
    const { data } = await apiClient.get<CatalogoIncidente[]>('/catalogos', {
      params: { soloActivos: true, ...filters },
    });
    return data;
  },
  async createCatalogo(payload: CreateCatalogoPayload): Promise<CatalogoIncidente> {
    const { data } = await apiClient.post<CatalogoIncidente>('/catalogos', payload);
    return data;
  },
};
