import type { Session, User } from "better-auth";

// Better Auth Adapter interface for type safety
export interface BetterAuthAdapter {
  findOne<T = DatabaseRole | DatabaseUserRole>(options: {
    model: string;
    where: Array<{
      field: string;
      value: string | number | boolean;
      operator?: string;
    }>;
  }): Promise<T | null>;

  findMany<T = DatabaseRole | DatabaseUserRole>(options: {
    model: string;
    where?: Array<{ field: string; value: string | number | boolean }>;
    limit?: number;
    offset?: number;
    sortBy?: { field: string; direction: "asc" | "desc" };
  }): Promise<T[]>;

  create<T = DatabaseRole | DatabaseUserRole>(options: {
    model: string;
    data: Partial<T>;
  }): Promise<T>;

  update<T = DatabaseRole | DatabaseUserRole>(options: {
    model: string;
    where: Array<{ field: string; value: string | number | boolean }>;
    update: Partial<T>;
  }): Promise<T | null>;

  delete(options: {
    model: string;
    where: Array<{ field: string; value: string | number | boolean }>;
  }): Promise<void>;

  deleteMany(options: {
    model: string;
    where: Array<{ field: string; value: string | number | boolean }>;
  }): Promise<number>;

  count(options: {
    model: string;
    where?: Array<{ field: string; value: string | number | boolean }>;
  }): Promise<number>;
}

// Core Interfaces
export interface Role {
  id: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  role?: Role;
}

export interface UserRoleOptions {
  maxRolesPerUser?: number;
  defaultRoles?: Array<{
    title: string;
    description?: string;
  }>;
  slugGenerator?: (title: string) => string;
}

// Request Types
export interface CreateRoleRequest {
  title: string;
  description?: string;
}

export interface UpdateRoleRequest {
  id: string;
  title?: string;
  description?: string;
}

export interface AttachUserRoleRequest {
  userId: string;
  roleId: string;
}

export interface DetachUserRoleRequest {
  userId: string;
  roleId: string;
}

export interface BulkAttachUserRoleRequest {
  userIds: string[];
  roleIds: string[];
}

export interface BulkDetachUserRoleRequest {
  userIds: string[];
  roleIds: string[];
}

// Extended Types for Advanced Features
export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  image?: string;
  roles: Role[];
  roleCount: number;
}

export interface RoleWithUsers {
  id: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  users: Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
    assignedAt: Date;
  }>;
  userCount: number;
}

export interface UserRoleContext {
  session: Session;
  user: User;
  body?: Record<string, string | number | boolean | string[]>;
  query?: Record<string, string>;
}

// Response Types for API endpoints
export interface BaseResponse {
  success: boolean;
}

export interface CreateRoleResponse extends BaseResponse {
  role: Role;
}

export interface GetRolesResponse extends BaseResponse {
  roles: Role[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface GetRoleResponse extends BaseResponse {
  role: Role;
}

export interface UpdateRoleResponse extends BaseResponse {
  role: Role;
}

export interface DeleteRoleResponse extends BaseResponse {
  message: string;
}

export interface AttachUserRoleResponse extends BaseResponse {
  userRole: UserRole;
  message: string;
}

export interface DetachUserRoleResponse extends BaseResponse {
  message: string;
}

export interface GetUserRolesResponse extends BaseResponse {
  roles: Role[];
  userRoles: UserRole[];
}

export interface GetRoleUsersResponse extends BaseResponse {
  role: RoleWithUsers;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Bulk Operation Response Types
export interface BulkOperationSummary {
  totalCreated: number;
  totalSkipped: number;
}

export interface BulkDetachSummary {
  totalDeleted: number;
  totalNotFound: number;
}

export interface BulkAttachUserRoleResponse extends BaseResponse {
  created: Array<{
    id: string;
    userId: string;
    roleId: string;
    assignedAt: Date;
  }>;
  skipped: Array<{
    userId: string;
    roleId: string;
    reason: string;
  }>;
  summary: BulkOperationSummary;
}

export interface BulkDetachUserRoleResponse extends BaseResponse {
  deleted: Array<{
    userId: string;
    roleId: string;
  }>;
  notFound: Array<{
    userId: string;
    roleId: string;
  }>;
  summary: BulkDetachSummary;
}

// Database Schema Types
export interface DatabaseRole {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DatabaseUserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date | string;
}

// Validation Result Types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationErrors {
  title?: string[];
  description?: string[];
  userIds?: string[];
  roleIds?: string[];
}

// Permission and Authorization Types
export interface RolePermission {
  roleId: string;
  permission: string;
  resource: string;
}

export interface UserPermissions {
  userId: string;
  permissions: Array<{
    permission: string;
    resource: string;
    roleId: string;
    roleName: string;
  }>;
}

// Query and Filter Types
export interface RoleListQuery {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortDirection?: "asc" | "desc";
}

export interface UserRoleListQuery {
  userId?: string;
  includeRoleDetails?: boolean;
  limit?: number;
  offset?: number;
}

export interface RoleUsersQuery {
  roleId: string;
  limit?: number;
  offset?: number;
  includeUserDetails?: boolean;
}

// Error Types
export interface UserRoleError extends Error {
  code: string;
  details?: Record<string, string | number | boolean>;
}

export interface APIErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, string | number | boolean>;
  };
}

// Utility Types for Better Type Safety
export type NonEmptyArray<T> = [T, ...T[]];

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Event Types (for future extensions)
export interface RoleCreatedEvent {
  type: "role.created";
  role: Role;
  userId: string;
  timestamp: Date;
}

export interface RoleUpdatedEvent {
  type: "role.updated";
  role: Role;
  previousRole: Role;
  userId: string;
  timestamp: Date;
}

export interface RoleDeletedEvent {
  type: "role.deleted";
  roleId: string;
  userId: string;
  timestamp: Date;
}

export interface UserRoleAttachedEvent {
  type: "userRole.attached";
  userRole: UserRole;
  attachedBy: string;
  timestamp: Date;
}

export interface UserRoleDetachedEvent {
  type: "userRole.detached";
  userId: string;
  roleId: string;
  detachedBy: string;
  timestamp: Date;
}

export type UserRoleEvent =
  | RoleCreatedEvent
  | RoleUpdatedEvent
  | RoleDeletedEvent
  | UserRoleAttachedEvent
  | UserRoleDetachedEvent;

// Configuration Types
export interface UserRolePluginConfig {
  tableName?: {
    role?: string;
    userRole?: string;
  };
  permissions?: {
    createRole?: string[];
    updateRole?: string[];
    deleteRole?: string[];
    attachRole?: string[];
    detachRole?: string[];
    viewRoles?: string[];
  };
  events?: {
    enabled?: boolean;
    handlers?: Partial<
      Record<
        UserRoleEvent["type"],
        (event: UserRoleEvent) => void | Promise<void>
      >
    >;
  };
}

// Type Guards
export const isRole = (obj: unknown): obj is Role => {
  if (!obj || typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.slug === "string" &&
    o.createdAt instanceof Date &&
    o.updatedAt instanceof Date &&
    (o.description === undefined || typeof o.description === "string")
  );
};

export const isUserRole = (obj: unknown): obj is UserRole => {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.userId === "string" &&
    typeof o.roleId === "string" &&
    o.assignedAt instanceof Date &&
    (o.role === undefined || isRole(o.role))
  );
};

export const isDatabaseRole = (obj: unknown): obj is DatabaseRole => {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.slug === "string" &&
    (typeof o.description === "string" || o.description === null) &&
    (o.createdAt instanceof Date || typeof o.createdAt === "string") &&
    (o.updatedAt instanceof Date || typeof o.updatedAt === "string")
  );
};

export const isDatabaseUserRole = (obj: unknown): obj is DatabaseUserRole => {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.userId === "string" &&
    typeof o.roleId === "string" &&
    (o.assignedAt instanceof Date || typeof o.assignedAt === "string")
  );
};