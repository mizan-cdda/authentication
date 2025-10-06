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
        getActions: ($fetch) => ({
            // Remove the nested 'session' object - flatten it!
            getSession: (data?: { roleId?: string }, fetchOptions?: BetterFetchOption) =>
                $fetch("/get-session", {
                    method: "GET",
                    query: data,
                    ...fetchOptions,
                }),

            getAllSessions: (fetchOptions?: BetterFetchOption) =>
                $fetch("/get-session", {
                    method: "GET",
                    ...fetchOptions,
                }),
        }),
    } satisfies BetterAuthClientPlugin;
};