import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Autumn } from "@atmn-hq/convex";

// Simple counter functions that the App.tsx expects
export const count = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // This could integrate with Autumn for tracking views/usage
    return 0; // Simple implementation for now
  },
});

export const addOne = mutation({
  args: {},
  handler: async (ctx, args) => {
    // This could integrate with Autumn for tracking button clicks
    return 1; // Simple implementation for now
  },
});
