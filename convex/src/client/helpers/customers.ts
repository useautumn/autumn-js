import { Autumn } from "autumn-js";
import { wrapSdkCall } from "./utils.js";
import {
  type GetCustomerArgsType,
  type CreateCustomerArgsType,
  type UpdateCustomerArgsType,
  type DeleteCustomerArgsType,
  type BillingPortalArgsType,
} from "../../types.js";

export const get = async (args: GetCustomerArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.customers.get(args.customer_id, {
      expand: args.expand,
    })
  );
};

export const create = async (args: CreateCustomerArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.customers.create({
      id: args.customer_id,
      name: args.name,
      email: args.email,
    })
  );
};

export const update = async (args: UpdateCustomerArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.customers.update(args.customer_id, {
      name: args.name,
      email: args.email,
    })
  );
};

export const discard = async (args: DeleteCustomerArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.customers.delete(args.customer_id));
};

export const billingPortal = async (args: BillingPortalArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.customers.billingPortal(args.customer_id, {
      return_url: args.return_url,
    })
  );
};
