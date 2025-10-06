import type { BetterFetchOption } from "@better-fetch/fetch";
import type { BetterAuthClientPlugin } from "better-auth/client";
import type {
    CreateRoleRequest,
    GetUserRolesResponse,
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
            session: {
                get: (data: { roleId: string }, fetchOptions?: BetterFetchOption) =>
                    $fetch("/get-session", {  // Changed from "/user-sessions" to "/get-session"
                        query: data,
                        ...fetchOptions,
                    }),
            },
        }),
    } satisfies BetterAuthClientPlugin;
};