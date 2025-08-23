import {
  GenericActionCtx,
  httpRouter,
} from "convex/server";
import { betterAuthComponent } from "./auth";
import { createAuth } from "../src/lib/auth";
import { autumnHandler } from "autumn-js/convex";
import { action, httpAction } from "./_generated/server";
import { api, components } from "./_generated/api";
import { Autumn } from "@atmn-hq/convex";

const autumn = new Autumn(components.autumn, {
  identify: async (ctx, request) => {
    if (!request) {
      // Fallback to query context for non-HTTP calls
      const user: any = await ctx.runQuery(api.auth.getCurrentUser as any, {});
      if (!user) {
        return null;
      }
      return {
        customerId: user.userId,
        customerData: {
          name: user.name,
          email: user.email,
        },
      };
    }

    // For HTTP requests, use Better Auth session from request
    try {
      const auth = createAuth(ctx as any);
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return null;
      }

      console.log("User from Better Auth session:", session.user.id, session.user.name, session.user.email);
      
      return {
        customerId: session.user.id,
        customerData: {
          name: session.user.name,
          email: session.user.email,
        },
      };
    } catch (error) {
      console.log("Auth error:", error);
      return null;
    }
  },
  apiKey: process.env.AUTUMN_SECRET_KEY ?? "",
});

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth, { cors: true });

autumn.registerRoutes(http, {
  corsOrigin: "http://localhost:5173",
  corsAllowHeadersList: ["Better-Auth-Cookie", "Cookie", "Content-Type", "Authorization", "X-Custom-Header"],
  allowCredentials: true,
  debug: true
});

export const test = action({
  args: {},
  handler: async (ctx) => {
    ctx.auth
  }
});

export default http;
