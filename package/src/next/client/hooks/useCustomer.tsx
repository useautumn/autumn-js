import { AutumnError } from "../../../sdk";
import { Customer, CustomerData } from "../../../sdk";
import { useEffect } from "react";
import useSWR from "swr";
import { useAutumnContext } from "../AutumnContext";
import {
  getOrCreateCustomer,
  getCustomer,
  createEntityAction,
  deleteEntityAction,
} from "../../server/cusActions";
import {
  generateReferralCodeAction,
  redeemReferralCodeAction,
} from "../../server/genActions";
import { CustomerExpandOption } from "../../../sdk/customers/cusEnums";
import { CreateEntityParams } from "./types";
import { CreateEntityParams as ServerCreateEntityParams } from "../../../sdk/customers/entities/entTypes";
import { toClientError, toClientErrorResponse } from "../clientUtils";
import { AutumnClientError } from "../types";

export interface UseCustomerProps {
  expand?: CustomerExpandOption[];
  autoCreate?: boolean;
  encryptedCustomerId?: string;
  customerData?: CustomerData;
  errorOnNotFound?: boolean;
}

const defaultOptions: UseCustomerProps = {
  expand: undefined,
  autoCreate: true,
  encryptedCustomerId: undefined,
  customerData: undefined,
  errorOnNotFound: true,
};

// Delete entity
const deleteEntity = async ({
  encryptedCustomerId,
  entityId,
}: {
  encryptedCustomerId?: string;
  entityId: string;
}) => {
  const result = await deleteEntityAction({
    encryptedCustomerId,
    entityId,
  });

  if (result.error) {
    return toClientErrorResponse(result.error);
  }

  return result;
};

const fetcher = async (
  key: string,
  options: {
    encryptedCustomerId?: string;
    customerData?: CustomerData;
    expand?: CustomerExpandOption[];
    autoCreate: boolean;
    errorOnNotFound: boolean;
  }
) => {
  const {
    encryptedCustomerId,
    customerData,
    expand,
    autoCreate,
    errorOnNotFound,
  } = options;

  if (autoCreate) {
    const result = await getOrCreateCustomer({
      encryptedCustomerId,
      customerData,
      params: { expand },
    });

    if (result.error) {
      if (result.error.code === "no_customer_id" && !errorOnNotFound) {
        return null;
      }
      throw toClientError(result.error);
    }
    return result.data;
  }

  const result = await getCustomer({
    encryptedCustomerId,
    params: { expand },
  });

  if (result.error) {
    if (result.error.code === "no_customer_id" && !errorOnNotFound) {
      return null;
    }
    throw toClientError(result.error);
  }
  return result.data;
};

export const useCustomer = (options?: UseCustomerProps) => {
  let finalOptions = defaultOptions;

  if (options) {
    finalOptions = { ...defaultOptions, ...options };
  }

  const {
    encryptedCustomerId: contextEncryptedCustomerId,
    customerData: contextCustomerData,
    setCustomer,
  } = useAutumnContext();

  const encryptedCustomerId =
    finalOptions.encryptedCustomerId || contextEncryptedCustomerId;
  const customerData = finalOptions.customerData || contextCustomerData;

  const {
    data: customer,
    error,
    isLoading,
    mutate,
  } = useSWR<Customer | null, AutumnClientError>(
    encryptedCustomerId ? ["customer", encryptedCustomerId] : null,
    ([_key, id]: [string, string]) =>
      fetcher(id, {
        encryptedCustomerId: id,
        customerData,
        expand: finalOptions.expand,
        autoCreate: finalOptions.autoCreate ?? true,
        errorOnNotFound: finalOptions.errorOnNotFound ?? true,
      }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  useEffect(() => {
    if (customer) {
      setCustomer(customer);
    }
  }, [customer, setCustomer]);

  const createEntity = async (
    params: CreateEntityParams | CreateEntityParams[]
  ) => {
    let snakeParams: ServerCreateEntityParams[] = [];
    if (Array.isArray(params)) {
      snakeParams = params.map((param) => ({
        ...param,
        feature_id: param.featureId,
      }));
    } else {
      snakeParams = [{ ...params, feature_id: params.featureId }];
    }
    const result = await createEntityAction({
      encryptedCustomerId,
      entity: snakeParams,
    });

    if (result.error) {
      return toClientErrorResponse(result.error);
    }

    await mutate();
    return result;
  };

  const generateReferralCode = async (programId: string) => {
    const result = await generateReferralCodeAction({
      encryptedCustomerId,
      programId,
    });
    if (result.error) {
      return toClientErrorResponse(result.error);
    }
    return result;
  };

  const redeemReferralCode = async (code: string) => {
    const result = await redeemReferralCodeAction({
      code,
      encryptedCustomerId,
    });
    if (result.error) {
      return toClientErrorResponse(result.error);
    }
    return result;
  };

  return {
    customer,
    isLoading,
    error,
    refetch: () => mutate(),
    createEntity,
    deleteEntity: (entityId: string) =>
      deleteEntity({ encryptedCustomerId, entityId }),
    generateReferralCode,
    redeemReferralCode,
  };
};
