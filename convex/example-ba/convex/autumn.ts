import { api, components } from "./_generated/api";
import { Autumn } from "@atmn-hq/convex";

export const autumn = new Autumn(components.autumn, {
  identify: async (ctx: any) => {
    try {
      const user: any = await ctx.runQuery(api.auth.getCurrentUser as any, {});
      console.log("Autumn identify - User meta", user?.userId, user?.name, user?.email);
      
      if (!user || !user.userId) {
        console.log("Autumn identify - No user found or missing userId");
        return null;
      }
      
      return {
        customerId: user.userId,
        customerData: {
          name: user.name || "Unknown User",
          email: user.email || "unknown@example.com",
        },
      };
    } catch (error) {
      console.error("Autumn identify - Error getting user:", error);
      return null;
    }
  },
  apiKey: process.env.AUTUMN_SECRET_KEY ?? "",
});