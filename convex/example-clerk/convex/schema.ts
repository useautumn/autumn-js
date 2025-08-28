import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    // Users table for storing Clerk user information
    users: defineTable({
      userId: v.string(), // Clerk user ID
      name: v.string(),
      email: v.string(),
    }).index("by_user_id", ["userId"]),
  },
);
