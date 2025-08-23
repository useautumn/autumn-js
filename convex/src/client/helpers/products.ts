import { Autumn } from "autumn-js";
import {
  type GetProductArgsType,
  type ListProductsArgsType,
} from "../../types.js";
import { wrapSdkCall } from "./utils.js";

export const get = async (args: GetProductArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.products.get(args.product_id));
};

export const list = async (args: ListProductsArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.products.list({
      customer_id: args.customer_id,
    })
  );
};
