import type { BetterFetchOption } from "@better-fetch/fetch";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type {
    CreateRoleRequest,
    GetUserRolesResponse,
    UpdateRoleRequest,
    UserWithRoles,
} from "./types";

export const userSessionClient = () => {
    return {
        id: "user-sessions",
        $InferServerPlugin: {} as ReturnType<any>,
        pathMethods: {
            "/get-session": "GET",
            "/user-sessions/all": "GET", // Add this if you have an endpoint
        },
        getActions: ($fetch) => ({
            session: {
                // Fetch sessions by roleId
                get: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-sessions", {
                        query: data,
                        ...fetchOptions,
                    }),

                // Fetch all sessions (no roleId required)
                getAll: (fetchOptions?: BetterFetchOption) =>
                    $fetch("/user-sessions", {
                        method: "GET",
                        ...fetchOptions,
                    }),
            },
        }),
    } satisfies BetterAuthClientPlugin;
};