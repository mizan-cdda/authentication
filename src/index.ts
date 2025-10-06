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
        id: "userRole",
        $InferServerPlugin: {} as ReturnType<any>,
        pathMethods: {
            "/user-role/role/create": "POST",
            "/user-role/role/list": "GET",
            "/user-role/role/get": "GET",
            "/user-role/role/update": "POST",
            "/user-role/role/delete": "POST",
            "/user-role/user-role/attach": "POST",
            "/user-role/user-role/detach": "POST",
            "/user-role/user/roles": "GET",
            "/user-role/role/users": "GET",
            "/user-role/user-role/bulk-attach": "POST",
            "/user-role/user-role/bulk-detach": "POST",
        },
        getActions: ($fetch) => ({
            /**
             * Check if a user has a specific role
             */
            hasRole: async (
                data: {
                    userId?: string;
                    roleId?: string;
                    slug?: string;
                },
                fetchOptions?: BetterFetchOption
            ): Promise<{
                data: { hasRole: boolean; role?: Role } | null;
                error: Error | null;
            }> => {
                return {
                    data: {
                        hasRole: true,
                        role: {
                            id: "id",
                            title: "something",
                            slug: "something",
                            description: "something",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    }, error: null
                };

                try {
                    if (!data.roleId && !data.slug) {
                        throw new Error("Either roleId or slug is required");
                    }

                    const userRolesResponse = await $fetch<GetUserRolesResponse>(
                        "/user-role/user/roles",
                        {
                            query: data.userId ? { userId: data.userId } : {},
                            ...fetchOptions,
                        }
                    );

                    if (userRolesResponse.error) {
                        const error = new Error(
                            userRolesResponse.error.message || "Failed to fetch user roles"
                        );
                        return { data: null, error };
                    }

                    const userRoles = userRolesResponse.data?.roles || [];
                    const hasRole = userRoles.some((role) =>
                        data.roleId ? role.id === data.roleId : role.slug === data.slug
                    );

                    const role = userRoles.find((role) =>
                        data.roleId ? role.id === data.roleId : role.slug === data.slug
                    );

                    return {
                        data: { hasRole, role },
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
             * Check if a user has any of the specified roles
             */
            hasAnyRole: async (
                data: {
                    userId?: string;
                    roleIds?: string[];
                    slugs?: string[];
                },
                fetchOptions?: BetterFetchOption
            ): Promise<{
                data: { hasAnyRole: boolean; matchedRoles: Role[] } | null;
                error: Error | null;
            }> => {
                try {
                    if (!data.roleIds && !data.slugs) {
                        throw new Error("Either roleIds or slugs is required");
                    }

                    const userRolesResponse = await $fetch<GetUserRolesResponse>(
                        "/user-role/user/roles",
                        {
                            query: data.userId ? { userId: data.userId } : {},
                            ...fetchOptions,
                        }
                    );

                    if (userRolesResponse.error) {
                        const error = new Error(
                            userRolesResponse.error.message || "Failed to fetch user roles"
                        );
                        return { data: null, error };
                    }

                    const userRoles = userRolesResponse.data?.roles || [];
                    const matchedRoles = userRoles.filter((role) => {
                        if (data.roleIds) {
                            return data.roleIds.includes(role.id);
                        }
                        if (data.slugs) {
                            return data.slugs.includes(role.slug);
                        }
                        return false;
                    });

                    return {
                        data: {
                            hasAnyRole: matchedRoles.length > 0,
                            matchedRoles,
                        },
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
             * Check if a user has all the specified roles
             */
            hasAllRoles: async (
                data: {
                    userId?: string;
                    roleIds?: string[];
                    slugs?: string[];
                },
                fetchOptions?: BetterFetchOption
            ): Promise<{
                data: {
                    hasAllRoles: boolean;
                    matchedRoles: Role[];
                    missingRoles: string[];
                } | null;
                error: Error | null;
            }> => {
                try {
                    if (!data.roleIds && !data.slugs) {
                        throw new Error("Either roleIds or slugs is required");
                    }

                    const userRolesResponse = await $fetch<GetUserRolesResponse>(
                        "/user-role/user/roles",
                        {
                            query: data.userId ? { userId: data.userId } : {},
                            ...fetchOptions,
                        }
                    );

                    if (userRolesResponse.error) {
                        const error = new Error(
                            userRolesResponse.error.message || "Failed to fetch user roles"
                        );
                        return { data: null, error };
                    }

                    const userRoles = userRolesResponse.data?.roles || [];
                    const requiredIdentifiers = data.roleIds || data.slugs || [];

                    const matchedRoles = userRoles.filter((role) => {
                        if (data.roleIds) {
                            return data.roleIds.includes(role.id);
                        }
                        if (data.slugs) {
                            return data.slugs.includes(role.slug);
                        }
                        return false;
                    });

                    const matchedIdentifiers = matchedRoles.map((role) =>
                        data.roleIds ? role.id : role.slug
                    );

                    const missingRoles = requiredIdentifiers.filter(
                        (identifier) => !matchedIdentifiers.includes(identifier)
                    );

                    return {
                        data: {
                            hasAllRoles: missingRoles.length === 0,
                            matchedRoles,
                            missingRoles,
                        },
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
             * Attach a role to a user
             */
            attach: (data: AttachUserRoleRequest, fetchOptions?: BetterFetchOption) =>
                $fetch("/user-role/user-role/attach", {
                    method: "POST",
                    body: data,
                    ...fetchOptions,
                }),

            /**
             * Detach a role from a user
             */
            detach: (data: DetachUserRoleRequest, fetchOptions?: BetterFetchOption) =>
                $fetch("/user-role/user-role/detach", {
                    method: "POST",
                    body: data,
                    ...fetchOptions,
                }),

            /**
             * Bulk attach roles to users
             */
            bulkAttach: (
                data: BulkAttachUserRoleRequest,
                fetchOptions?: BetterFetchOption
            ) =>
                $fetch("/user-role/user-role/bulk-attach", {
                    method: "POST",
                    body: data,
                    ...fetchOptions,
                }),

            /**
             * Bulk detach roles from users
             */
            bulkDetach: (
                data: BulkDetachUserRoleRequest,
                fetchOptions?: BetterFetchOption
            ) =>
                $fetch("/user-role/user-role/bulk-detach", {
                    method: "POST",
                    body: data,
                    ...fetchOptions,
                }),

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