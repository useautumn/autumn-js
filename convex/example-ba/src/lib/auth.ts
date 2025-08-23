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
    trustedOrigins: [siteUrl, process.env.CONVEX_SITE_URL || "https://majestic-giraffe-9.convex.site"],
    database: convexAdapter(ctx, betterAuthComponent),

    // Simple non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      // The Convex plugin is required
      convex(),

      // The cross domain plugin is required for client side frameworks
      crossDomain({
        siteUrl,
      }),
    ],
    // Configure cross-subdomain cookies for cross-origin requests
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: "majestic-giraffe-9.convex.site", // Allow cookies across convex.site subdomains
      },
      useSecureCookies: false, // Ensure cookies are secure for HTTPS
    },
  });