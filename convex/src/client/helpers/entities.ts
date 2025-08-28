import { Autumn } from "autumn-js";
import {
  camelToSnake,
  type CreateEntityArgsType,
  type DeleteEntityArgsType,
  type GetEntityArgsType,
} from "../../types.js";
import { wrapSdkCall } from "./utils.js";

export const create = async (args: CreateEntityArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.entities.create(args.customer_id, camelToSnake(args.entities)));
};

export const discard = async (args: DeleteEntityArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() => autumn.entities.delete(args.customer_id, args.entity_id));
};

export const get = async (args: GetEntityArgsType) => {
  const autumn = new Autumn({
    secretKey: args.apiKey,
  });
  return await wrapSdkCall(() =>
    autumn.entities.get(args.customer_id, args.entity_id, {
      expand: args.expand,
    })
  );
};
