import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { autumn } from "./autumn";

// Simple counter functions that the App.tsx expects
export const count = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // This could integrate with Autumn for tracking views/usage
    return 0; // Simple implementation for now
  },
});

export const billingPortal = action({
  args: {},
  handler: async (ctx, args) => {
    // This could integrate with Autumn for tracking button 
    return await autumn.customers.billingPortal(ctx);
  },
});
