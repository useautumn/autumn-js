import { api } from "./_generated/api";
import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Example function for getting the current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return null;
    }
    
    // Check if we already have a user record for this Clerk user
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (user) {
      return {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
      };
    } else return null;
  },
});

export const getCurrentUserInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    console.log("Identity in internal query:", identity);

    if (!identity) {
      return null;
    }
    
    // Check if we already have a user record for this Clerk user
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();

    if (user) {
      return {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
      };
    } else return null;
  },
});

// Helper function to get user ID for authenticated requests
export const getCurrentUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return identity.subject;
  },
});

// Create or update user when they sign up
export const createUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { name, email });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      userId,
      name,
      email,
    });
  },
});