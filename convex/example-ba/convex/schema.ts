import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    // Better Auth requires a users table
    users: defineTable({
      // Add any additional user fields you need here
      // The Better Auth component handles the core auth fields
    }),
  },
);
