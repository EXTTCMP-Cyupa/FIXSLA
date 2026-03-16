import { apiClient } from '../../../core/config/api';
import type { CreateUserPayload, UpdateUserPayload, User } from '../../../core/models/user';
import type { UserRole } from '../../../core/models/auth';

export const userService = {
  async list(filters?: Partial<{ rol: UserRole; area: string }>): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/usuarios', { params: filters });
    return data;
  },
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/usuarios', payload);
    return data;
  },
  async update(userId: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await apiClient.patch<User>(`/usuarios/${userId}`, payload);
    return data;
  },
};
