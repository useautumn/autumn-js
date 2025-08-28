import { api, components, internal } from "./_generated/api";
import { Autumn } from "@atmn-hq/convex";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GenericActionCtx } from "convex/server";

export const autumn = new Autumn(components.autumn, {
  identify: async (ctx: any) => {
    let user = await ctx.auth.getUserIdentity();
    console.log("User:", user);
    if (!user) {
      return null;
    }
  
    return {
      customerId: user.subject as string,
      customerData: {
        name: user.name as string,
        email: user.email as string,
      },
    };
  },
  apiKey: process.env.AUTUMN_SECRET_KEY ?? "",
});

export const {
  track,
  cancel,
  setupPayment,
  query,
  attach,
  check,
  checkout,
  createEntity,
  deleteEntity,
  getEntity,
  usage,
  listProducts,
  getCustomer,
  getProduct,
  fetchCustomer,
  redeemReferralCode,
  createReferralCode,
  createEntities,
  billingPortal
} = autumn.api();