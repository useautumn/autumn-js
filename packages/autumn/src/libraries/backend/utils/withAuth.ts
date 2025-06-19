import { Autumn, CustomerData } from "../../../sdk";
import { toBackendError, toBackendRes } from "./backendRes";
import { AuthResult } from "./AuthFunction";

// 1. Takes in
export const withAuth = <T extends {}>({
  fn,
  requireCustomer = true,
}: {
  fn: (args: {
    body: any;
    autumn: Autumn;
    customer_id: string;
    customer_data?: CustomerData;
    pathParams?: Record<string, string>;
    searchParams?: Record<string, string>;
  }) => Promise<any>;
  requireCustomer?: boolean;
}) => {
  return async ({
    autumn,
    body,
    path,
    getCustomer,
    pathParams,
    searchParams,
  }: {
    autumn: Autumn;
    body: any;
    path: string;
    getCustomer: () => AuthResult;
    pathParams?: Record<string, string>;
    searchParams?: Record<string, string>;
  }) => {
    let authResult = await getCustomer();
    let customerId = authResult?.customerId;

    if (!customerId && requireCustomer) {
      if (body?.errorOnNotFound === false) {
        return toBackendError({
          path,
          message: "No customer ID found",
          code: "no_customer_id",
          statusCode: 202,
        });
      } else {
        return toBackendError({
          path,
          message: "No customer ID found",
          code: "no_customer_id",
          statusCode: 401,
        });
      }
    }

    let cusData = authResult?.customerData || body?.customer_data;

    try {
      let res = await fn({
        body,
        autumn,
        customer_id: customerId!,
        customer_data: cusData,
        pathParams,
        searchParams,
      });

      return toBackendRes({ res });
    } catch (error: any) {
      return toBackendError({
        path,
        message: error.message || "unknown error",
        code: "internal_error",
      });
    }
  };
};
