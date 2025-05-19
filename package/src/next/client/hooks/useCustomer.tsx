import { AutumnError } from "../../../sdk";
import { Customer, CustomerData } from "../../../sdk";

import { useEffect, useState } from "react";
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

export const useCustomer = (options?: UseCustomerProps) => {
  let finalOptions = defaultOptions;

  if (options) {
    finalOptions = { ...defaultOptions, ...options };
  }
  const { autoCreate } = finalOptions;

  const {
    encryptedCustomerId: contextEncryptedCustomerId,
    customerData: contextCustomerData,
    customer,
    setCustomer,
  } = useAutumnContext();

  const encryptedCustomerId =
    finalOptions.encryptedCustomerId || contextEncryptedCustomerId;

  const customerData = finalOptions.customerData || contextCustomerData;
  const errorOnNotFound = finalOptions.errorOnNotFound;

  const [error, setError] = useState<AutumnClientError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCustomer = async () => {
    setIsLoading(true);

    let returnData: Customer | null = null;
    try {
      let data: Customer | null = null;
      let error: AutumnError | null = null;

      if (autoCreate) {
        const result = await getOrCreateCustomer({
          encryptedCustomerId,
          customerData,
          params: {
            expand: finalOptions.expand,
          },
        });

        data = result.data;
        error = result.error;
      } else {
        const result = await getCustomer({
          encryptedCustomerId,
          params: {
            expand: finalOptions.expand,
          },
        });
        data = result.data;
        error = result.error;
      }

      if (error) {
        if (error && error?.code == "no_customer_id" && !errorOnNotFound) {
        } else {
          setError(toClientError(error));
        }
      } else {
        setCustomer(data);
        setError(null);
      }

      returnData = data;
    } catch (error) {
      setError(toClientError(error));
    }

    setIsLoading(false);
    return returnData;
  };

  const refetch = async () => {
    await fetchCustomer();
  };

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

  useEffect(() => {
    fetchCustomer();
  }, [encryptedCustomerId]);

  return {
    customer,
    isLoading,
    error,
    refetch,
    createEntity,
    deleteEntity: (entityId: string) =>
      deleteEntity({ encryptedCustomerId, entityId }),
    generateReferralCode,
    redeemReferralCode,
  };
};
