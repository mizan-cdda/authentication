import type { BetterFetchOption } from "@better-fetch/fetch";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type {
    AttachUserRoleRequest,
    BulkAttachUserRoleRequest,
    BulkDetachUserRoleRequest,
    CreateRoleRequest,
    DetachUserRoleRequest,
    GetUserRolesResponse,
    Role,
    UpdateRoleRequest,
    UserWithRoles,
} from "./types";

export const userRoleClient = () => {
    return {
        id: "user-sessions",
        $InferServerPlugin: {} as ReturnType<any>,
        pathMethods: {
            "/get-session": "GET",
        },
        getActions: ($fetch) => ({

            /**
             * Role management methods
             */
            session: {
                get: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-sessions", {
                        query: data,
                        ...fetchOptions,
                    }),
            },
            /**
             * Role management methods
             */
            role: {
                create: (data: CreateRoleRequest, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/role/create", {
                        method: "POST",
                        body: data,
                        ...fetchOptions,
                    }),

                list: (
                    data?: { limit?: number; offset?: number },
                    fetchOptions?: BetterFetchOption
                ) =>
                    $fetch("/user-role/role/list", {
                        query: data,
                        ...fetchOptions,
                    }),

                get: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/role/get", {
                        query: data,
                        ...fetchOptions,
                    }),

                update: (data: UpdateRoleRequest, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/role/update", {
                        method: "POST",
                        body: data,
                        ...fetchOptions,
                    }),

                delete: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/role/delete", {
                        method: "POST",
                        body: data,
                        ...fetchOptions,
                    }),

                users: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/role/users", {
                        query: data,
                        ...fetchOptions,
                    }),
            },

            /**
             * User role management
             */
            user: {
                roles: (data?: { userId?: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-role/user/roles", {
                        query: data,
                        ...fetchOptions,
                    }),
            },

            /**
             * Get user with their roles
             */
            getUserWithRoles: async (
                data: { userId?: string },
                fetchOptions?: BetterFetchOption
            ): Promise<{ data: UserWithRoles | null; error: Error | null }> => {
                try {
                    const userRolesResponse = await $fetch<GetUserRolesResponse>(
                        "/user-role/user/roles",
                        {
                            query: data.userId ? { userId: data.userId } : {},
                            ...fetchOptions,
                        }
                    );

                    if (userRolesResponse.error) {
                        const error = new Error(
                            userRolesResponse.error.message || "Failed to get user roles"
                        );
                        return { data: null, error };
                    }

                    // Note: This is a simplified implementation
                    // In a real scenario, you'd also fetch user details
                    const userWithRoles: UserWithRoles = {
                        id: data.userId || "current-user",
                        name: "User", // This would come from user data
                        email: "user@example.com", // This would come from user data
                        roles: userRolesResponse.data?.roles || [],
                        roleCount: userRolesResponse.data?.roles?.length || 0,
                    };

                    return {
                        data: userWithRoles,
                        error: null,
                    };
                } catch (error) {
                    return {
                        data: null,
                        error: error instanceof Error ? error : new Error(String(error)),
                    };
                }
            },

            /**
             * Validate role permissions (client-side validation)
             */
            validateRoleData: (data: {
                title?: string;
                description?: string;
            }): { isValid: boolean; errors: string[] } => {
                const errors: string[] = [];

                if (data.title !== undefined) {
                    if (!data.title || typeof data.title !== "string") {
                        errors.push("Title is required and must be a string");
                    } else if (data.title.trim().length === 0) {
                        errors.push("Title cannot be empty");
                    } else if (data.title.length > 100) {
                        errors.push("Title cannot exceed 100 characters");
                    }
                }

                if (data.description !== undefined && data.description) {
                    if (typeof data.description !== "string") {
                        errors.push("Description must be a string");
                    } else if (data.description.length > 500) {
                        errors.push("Description cannot exceed 500 characters");
                    }
                }

                return {
                    isValid: errors.length === 0,
                    errors,
                };
            },
        }),
    } satisfies BetterAuthClientPlugin;
};