export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TaskPriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface JwtPayload {
  id: string;
  email: string;
  is_active: boolean;
  role: UserRole;
}


export const ROLES_KEY = 'roles'

