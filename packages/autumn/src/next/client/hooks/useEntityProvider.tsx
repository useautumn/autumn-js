import useSWR from "swr";
import { GetEntityParams } from "../../../libraries/react/client/types/clientEntTypes";
import { getEntityAction } from "../../../next/server/cusActions";
import { useAutumnContext } from "../AutumnContext";

export const useEntityProvider = (
  entityId?: string,
  params?: GetEntityParams
) => {
  const { encryptedCustomerId } = useAutumnContext();
  const queryKey = ["entity", entityId, params?.expand];

  const fetchEntity = async () => {
    if (!entityId) {
      return null;
    }

    const { data, error } = await getEntityAction({
      encryptedCustomerId,
      entityId,
      params,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(queryKey, fetchEntity, {
    fallbackData: null,
    onErrorRetry: (error, key, config) => {
      if (error.code == "entity_not_found") {
        return false;
      }

      return true;
    },
  });

  if (!entityId) {
    return {
      entity: null,
      isLoading: false,
      error: null,
      refetch: mutate,
    };
  }

  return {
    entity: error ? null : data,
    isLoading,
    error,
    refetch: mutate,
  };
};
