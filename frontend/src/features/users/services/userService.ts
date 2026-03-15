import { apiClient } from '../../../core/config/api';
import type { CreateUserPayload, User } from '../../../core/models/user';
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
};
