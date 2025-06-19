import { useAutumnContext } from "../AutumnContext";
import { GetEntityParams } from "../client/types/clientEntTypes";
import { useEffect } from "react";

import { compareParams } from "../utils/compareParams";
export const useEntity = (entityId: string, params?: GetEntityParams) => {
  const { entityProvider } = useAutumnContext();

  const {
    entity,
    isLoading,
    error,
    refetch: refetchEntity,
    lastParams,
  } = entityProvider;

  useEffect(() => {
    if (entityId !== entity?.id || !compareParams(params, lastParams)) {
      refetchEntity({ entityId, params });
    }
  }, [entityId]);

  return {
    entity,
    isLoading: isLoading && !entity,
    error,
    refetch: async (params: GetEntityParams) => {
      await refetchEntity({ entityId, params });
    },
  };
};
