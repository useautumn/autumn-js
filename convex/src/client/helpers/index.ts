import { Autumn } from "autumn-js";
import { wrapSdkCall } from "./utils.js";
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
} from "../../types.js";

export const fetchCustomer = async (args: FetchCustomerArgsType) => {
    const autumn = new Autumn({
      secretKey: args.apiKey,
    });
    return await wrapSdkCall(() =>
      autumn.customers.create({
        id: args.customer_id,
        email: args.customer_data?.email || undefined,
        name: args.customer_data?.name || undefined,
        expand: args.expand,
      })
    );
};

export const track = async (args: TrackArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  console.log("Inside lib.ts track", args.customer_id);
  return await wrapSdkCall(() => autumn.track(camelToSnake(args)));
};

export const attach = async (args: AttachArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.attach(camelToSnake(args)));
};

export const check = async (args: CheckArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.check(camelToSnake(args)));
};

export const checkout = async (args: CheckoutArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.checkout(camelToSnake(args)));
};

export const usage = async (args: UsageArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.usage(camelToSnake(args)));
};

export const autumnQuery = async (args: QueryArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.query(camelToSnake(args)));
};

export const cancel = async (args: CancelArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.cancel(camelToSnake(args)));
};

export const setupPayment = async (args: SetupPaymentArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.setupPayment(camelToSnake(args)));
};

export const listProducts = async (args: ListProductsArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.products.list(camelToSnake(args)));
};

export * as customers from "./customers.js";
export * as entities from "./entities.js";
export * as products from "./products.js";
export * as referrals from "./referrals.js";