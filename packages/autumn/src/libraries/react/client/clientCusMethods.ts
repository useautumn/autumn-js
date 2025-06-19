import { AutumnClient, OmitCustomerType } from "./ReactAutumnClient";
import { CreateCustomerParams, Customer } from "../../../sdk";
import { AutumnPromise } from "../../../sdk/response";

export const createCustomerMethod = async ({
  client,
  params,
}: {
  client: AutumnClient;
  params: Omit<CreateCustomerParams, OmitCustomerType>;
}): AutumnPromise<Customer> => {
  let result = await client.post("/api/autumn/customers", params);
  return result;
};
