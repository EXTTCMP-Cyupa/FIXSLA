import { apiClient } from '../../../core/config/api';
import type { CreateUbicacionPayload, Ubicacion, UpdateUbicacionPayload } from '../../../core/models/ubicacion';

export const ubicacionService = {
  async list(): Promise<Ubicacion[]> {
    const { data } = await apiClient.get<Ubicacion[]>('/ubicaciones');
    return data;
  },
  async create(payload: CreateUbicacionPayload): Promise<Ubicacion> {
    const { data } = await apiClient.post<Ubicacion>('/ubicaciones', payload);
    return data;
  },
  async update(id: string, payload: UpdateUbicacionPayload): Promise<Ubicacion> {
    const { data } = await apiClient.patch<Ubicacion>(`/ubicaciones/${id}`, payload);
    return data;
  },
};
