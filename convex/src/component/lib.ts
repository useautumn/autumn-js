import { v } from "convex/values";
import {
  mutation,
  query,
  action,
  internalAction,
} from "./_generated/server.js";
import { Autumn } from "autumn-js";
import {
  camelToSnake,
  type TrackArgsType,
  type AttachArgsType,
  type CheckArgsType,
  type CheckoutArgsType,
  type GetCustomerArgsType,
  type UpdateCustomerArgsType,
  type DeleteCustomerArgsType,
  type BillingPortalArgsType,
  type GetProductArgsType,
  type ListProductsArgsType,
  type CreateReferralCodeArgsType,
  type RedeemReferralCodeArgsType,
  type UsageArgsType,
  type QueryArgsType,
  type CancelArgsType,
  type SetupPaymentArgsType,
  type CreateEntityArgsType,
  type DeleteEntityArgsType,
  type GetEntityArgsType,
  type FetchCustomerArgsType,
} from "../types.js";

export const add = mutation({
  args: {
    name: v.string(),
    count: v.number(),
    shards: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const shard = Math.floor(Math.random() * (args.shards ?? 1));
    const counter = await ctx.db
      .query("counters")
      .withIndex("name", (q) => q.eq("name", args.name).eq("shard", shard))
      .unique();
    if (counter) {
      await ctx.db.patch(counter._id, {
        value: counter.value + args.count,
      });
    } else {
      await ctx.db.insert("counters", {
        name: args.name,
        value: args.count,
        shard,
      });
    }
  },
});

export const count = query({
  args: { name: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    const counters = await ctx.db
      .query("counters")
      .withIndex("name", (q) => q.eq("name", args.name))
      .collect();
    return counters.reduce((sum, counter) => sum + counter.value, 0);
  },
});

export const fetchCustomer = async (args: FetchCustomerArgsType) => {
    const autumn = new Autumn({
      secretKey: args.apiKey,
    });
    const customer = await autumn.customers.create({
      id: args.customer_id,
      email: args.customer_data?.email,
      name: args.customer_data?.name,
      expand: args.expand,
    });
    return customer;
};

export const track = async (args: TrackArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  
  let res = await autumn.track(camelToSnake(args));
  return res;
};

export const attach = async (args: AttachArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.attach(camelToSnake(args));
  return res;
};

export const check = async (args: CheckArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.check(camelToSnake(args));
  return res;
};

export const checkout = async (args: CheckoutArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.checkout(camelToSnake(args));
  return res;
};

export const usage = async (args: UsageArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.usage(camelToSnake(args));
  return res;
};

export const autumnQuery = async (args: QueryArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.query(camelToSnake(args));
  return res;
};

export const cancel = async (args: CancelArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.cancel(camelToSnake(args));
  return res;
};

export const setupPayment = async (args: SetupPaymentArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.setupPayment(camelToSnake(args));
  return res;
};

export const listProducts = async (args: ListProductsArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  let res = await autumn.products.list(camelToSnake(args));
  return res;
};
