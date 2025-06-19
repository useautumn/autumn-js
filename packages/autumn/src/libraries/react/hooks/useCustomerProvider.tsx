import { useState, useCallback, useRef, useEffect } from "react";
import { AutumnClient } from "../client/ReactAutumnClient";
import { Customer, AutumnError, CustomerExpandOption } from "../../../sdk";

export interface UseCustomerParams {
  expand?: CustomerExpandOption[];
}

export interface CustomerState {
  customer: Customer | null;
  isLoading: boolean;
  error: AutumnError | null;
}

export interface CustomerProvider {
  refetch: ({
    params,
    errorOnNotFound,
  }: {
    params?: UseCustomerParams;
    errorOnNotFound?: boolean;
  }) => Promise<void>;
  getState: (params?: UseCustomerParams) => CustomerState;
  refetchFirstTwo: () => Promise<void>;
}

export function useCustomerProvider(client: AutumnClient): CustomerProvider {
  const [stateMap, setStateMap] = useState<Record<string, CustomerState>>({});
  const inProgressFetches = useRef<Record<string, boolean>>({});

  const getQueryKey = (params?: UseCustomerParams) => {
    return JSON.stringify(params || {});
  };

  const getState = (params?: UseCustomerParams) => {
    const queryKey = getQueryKey(params);
    if (!stateMap[queryKey]) {
      return {
        customer: null,
        isLoading: true,
        error: null,
      };
    }

    return stateMap[queryKey];
  };

  const refetch = async ({
    params,
    errorOnNotFound = true,
  }: {
    params?: UseCustomerParams;
    errorOnNotFound?: boolean;
  }) => {
    const queryKey = getQueryKey(params);

    if (inProgressFetches.current[queryKey]) {
      return;
    }

    inProgressFetches.current[queryKey] = true;

    setStateMap((prevState) => ({
      ...prevState,
      [queryKey]: {
        ...(prevState[queryKey] || { customer: null }),
        isLoading: true,
        error: null,
      },
    }));

    const { data, error } = await client.createCustomer({
      expand: params?.expand,
      errorOnNotFound,
    });

    let newState = {
      customer: data,
      isLoading: false,
      error: error,
    };

    setStateMap((prevState) => ({
      ...prevState,
      [queryKey]: newState,
    }));

    inProgressFetches.current[queryKey] = false;
  };

  const refetchFirstTwo = async () => {
    try {
      let batchRefetch = [];
      for (const key of Object.keys(stateMap)) {
        batchRefetch.push(refetch({ params: JSON.parse(key) }));
      }
      await Promise.all(batchRefetch);
    } catch (error) {
      console.error("Failed to refetch customer (useCustomerProvider)");
      console.error(error);
    }
  };

  return {
    // stateMap,
    getState,
    refetch,
    refetchFirstTwo,
  };
}
