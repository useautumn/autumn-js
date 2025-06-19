import { CustomerData } from "src/sdk";
import { decryptData } from "../../../utils/encryptUtils";
import { handleAuthProvider } from "./handleAuthProvider";
import { getAuthPlugin } from "./authPlugin";

const noCustomerIdError = () => {
  return {
    data: null,
    error: {
      message: "Customer ID is required",
      code: "no_customer_id",
    },
  };
};

export const withAuth = <
  T extends {
    customerId?: string;
    customerData?: CustomerData;
    authProvider?: string;
  }
>({
  fn,
  withCustomerData = false,
  requireCustomer = true,
}: {
  fn: (args: T) => Promise<any>;
  withCustomerData?: boolean;
  requireCustomer?: boolean;
}) => {
  return async (
    args: Omit<T, "customerId"> & { encryptedCustomerId?: string },
    request?: Request
  ) => {
    let customerId = null;
    let customerData = args.customerData || undefined;

    const authConfig = getAuthPlugin();

    if (authConfig?.provider) {
      let result = await handleAuthProvider({
        authPlugin: authConfig,
        withCustomerData: withCustomerData,
      });

      customerId = result?.customerId;
      customerData = result?.customerData || undefined;
    } else {
      let encryptedCustomerId = args.encryptedCustomerId;

      customerId = encryptedCustomerId
        ? decryptData(encryptedCustomerId)
        : null;
    }

    if (!customerId && requireCustomer) {
      return noCustomerIdError();
    }

    return fn({ ...args, customerId, customerData } as T);
  };
};
