import type { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  storeId?: string | null;
}

export type AppVariables = {
  user: AuthUser;
};
