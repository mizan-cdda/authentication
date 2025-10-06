
import type { BetterAuthPlugin } from "better-auth";

export interface YourPluginOptions {
    // Define your plugin options here
    enabled?: boolean;
}

export const yourPlugin = (options: YourPluginOptions = {}): BetterAuthPlugin => {
    return {
        id: "your-plugin-name",
        init(ctx) {
            // Plugin initialization logic
            // You can use ctx and options here if needed, but do not return anything
        },
    };
};