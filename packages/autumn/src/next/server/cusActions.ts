import { CreateEntityParams } from "../../sdk/customers/entities/entTypes";
import {
  Autumn,
  CreateCustomerParams,
  CustomerData,
  GetCustomerParams,
} from "../../sdk";
import { withAuth } from "./auth/withAuth";
import { toServerResponse } from "./utils";
import { GetEntityParams } from "../../libraries/react/client/types/clientEntTypes";

export const createAutumnClient = (publishableKey?: string) => {
  return new Autumn({
    publishableKey,
  });
};

export const getOrCreateCustomer = withAuth({
  fn: async ({
    customerId,
    customerData,
    params,
  }: {
    customerId: string;
    customerData?: CustomerData;
    params?: CreateCustomerParams;
  }) => {
    const autumn = createAutumnClient();

    const result = await autumn.customers.create({
      id: customerId,
      ...customerData,
      ...params,
    });

    return toServerResponse(result);
  },
  withCustomerData: true,
});

export const getCustomer = withAuth({
  fn: async ({
    customerId,
    params,
  }: {
    customerId: string;
    params?: GetCustomerParams;
  }) => {
    const autumn = createAutumnClient();
    const result = await autumn.customers.get(customerId, params);
    return toServerResponse(result);
  },
});

export const getEntityAction = withAuth({
  fn: async ({
    customerId,
    entityId,
    params,
  }: {
    customerId: string;
    entityId: string;
    params?: GetEntityParams;
  }) => {
    const autumn = createAutumnClient();
    const result = await autumn.entities.get(
      customerId,
      entityId,
      params as any
    );

    return toServerResponse(result);
  },
});

export const createEntityAction = withAuth({
  fn: async ({
    customerId,
    entity,
  }: {
    customerId: string;
    entity: CreateEntityParams | CreateEntityParams[];
  }) => {
    const autumn = createAutumnClient();
    const result = await autumn.entities.create(customerId, entity);
    return toServerResponse(result);
  },
});

export const deleteEntityAction = withAuth({
  fn: async ({
    customerId,
    entityId,
  }: {
    customerId: string;
    entityId: string;
  }) => {
    const autumn = createAutumnClient();
    const result = await autumn.entities.delete(customerId, entityId);
    return toServerResponse(result);
  },
});
