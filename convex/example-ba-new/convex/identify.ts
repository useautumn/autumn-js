import { action, internalAction } from "./_generated/server";

export const identify = action({
  args: {},
  handler: async (ctx, args) => {
    let user = await ctx.auth.getUserIdentity();

    if (!user) {
      return null;
    }

    console.log("User:", user.subject, user.tokenIdentifier, user.name, user.email);

    return {
      customerId: user.subject as string,
      customerData: {
        name: user.name as string,
        email: user.email as string,
      },
    };
  },
});
