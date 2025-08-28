import { Autumn } from "../client";
import {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  BillingPortalParams,
  BillingPortalResult,
  GetCustomerParams,
  UpdateBalancesParams,
  UpdateBalancesResult,
  DeleteCustomerParams,
} from "./cusTypes";
import { staticWrapper } from "../utils";
import { AutumnPromise } from "../response";
import { AutumnError } from "../error";

export const customerMethods = (instance?: Autumn) => {
  return {
    get: (id: string, params?: GetCustomerParams) =>
      staticWrapper(getCustomer, instance, { id, params }),
    create: (params?: CreateCustomerParams) =>
      staticWrapper(createCustomer, instance, { params }),
    update: (id: string, params: UpdateCustomerParams) =>
      staticWrapper(updateCustomer, instance, { id, params }),
    delete: (id: string, params?: DeleteCustomerParams) => staticWrapper(deleteCustomer, instance, { id, params }),

    billingPortal: (id: string, params?: BillingPortalParams) =>
      staticWrapper(billingPortal, instance, { id, params }),

    updateBalances: (id: string, params: UpdateBalancesParams) =>
      staticWrapper(updateBalances, instance, { id, params }),
  };
};

export const getExpandStr = (expand?: string[]) => {
  if (!expand) {
    return "";
  }
  return `expand=${expand.join(",")}`;
};

export const getCustomer = async ({
  instance,
  id,
  params,
}: {
  instance: Autumn;
  id: string;
  params?: GetCustomerParams;
}): AutumnPromise<Customer> => {
  if (!id) {
    return {
      data: null,
      error: new AutumnError({
        message: "Customer ID is required",
        code: "CUSTOMER_ID_REQUIRED",
      }),
    };
  }

  return instance.get(`/customers/${id}?${getExpandStr(params?.expand)}`);
};

export const createCustomer = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params?: CreateCustomerParams;
}): AutumnPromise<Customer> => {
  return instance.post(`/customers?${getExpandStr(params?.expand)}`, params);
};

export const updateCustomer = async ({
  instance,
  id,
  params,
}: {
  instance: Autumn;
  id: string;
  params: UpdateCustomerParams;
}): AutumnPromise<Customer> => {
  return instance.post(`/customers/${id}`, params);
};

export const deleteCustomer = async ({
  instance,
  id,
  params,
}: {
  instance: Autumn;
  id: string;
  params?: DeleteCustomerParams;
}): AutumnPromise<Customer> => {
  return instance.delete(`/customers/${id}${params?.delete_in_stripe ? "?delete_in_stripe=true" : ""}`);
};

export const billingPortal = async ({
  instance,
  id,
  params,
}: {
  instance: Autumn;
  id: string;
  params?: BillingPortalParams;
}): AutumnPromise<BillingPortalResult> => {
  return instance.post(`/customers/${id}/billing_portal`, params);
};

export const updateBalances = async ({
  instance,
  id,
  params,
}: {
  instance: Autumn;
  id: string;
  params: UpdateBalancesParams;
}): AutumnPromise<UpdateBalancesResult> => {
  return instance.post(`/customers/${id}/balances`, {
    balances: Array.isArray(params) ? params : [params],
  });
};
