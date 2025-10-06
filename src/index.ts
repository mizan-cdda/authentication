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
            session: {
                // Change "/user-sessions" to "/get-session"
                get: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/get-session", {  // ← Changed this
                        query: data,
                        ...fetchOptions,
                    }),

                getAll: (fetchOptions?: BetterFetchOption) =>
                    $fetch("/get-session", {  // ← Changed this
                        method: "GET",
                        ...fetchOptions,
                    }),
            },
        }),
    } satisfies BetterAuthClientPlugin;
};