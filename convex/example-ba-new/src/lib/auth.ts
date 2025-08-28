import { convexAdapter } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { betterAuthComponent } from "../../convex/auth";
import { type GenericCtx } from "../../convex/_generated/server";

// You'll want to replace this with an environment variable
const siteUrl = "http://localhost:5173";

export const createAuth = (ctx: GenericCtx) =>
  // Configure your Better Auth instance here
  betterAuth({
    trustedOrigins: [
      siteUrl,
      process.env.CONVEX_SITE_URL || "https://majestic-giraffe-9.convex.site",
    ],
    database: convexAdapter(ctx, betterAuthComponent),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    plugins: [
      convex(),

      crossDomain({
        siteUrl,
      }),
    ],
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: "majestic-giraffe-9.convex.site", 
      },
      useSecureCookies: false, 
    },
  });
