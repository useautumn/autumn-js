import { useState } from "react";

import { AutumnError, Entity } from "../../../sdk";
import { GetEntityParams } from "../client/types/clientEntTypes";
import { AutumnClient } from "../client/ReactAutumnClient";

export interface EntityProvider {
  entity: Entity | null;
  isLoading: boolean;
  error: AutumnError | null;
  refetch: (args: {
    entityId?: string;
    params?: GetEntityParams;
  }) => Promise<void>;
  lastParams: GetEntityParams | null;
}

export const useEntityProvider = ({ client }: { client: AutumnClient }) => {
  const [entity, setEntity] = useState<Entity | null>(null);
  const [error, setError] = useState<AutumnError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastParams, setLastParams] = useState<GetEntityParams | null>(null);

  const fetchEntity = async ({
    entityId,
    params,
  }: {
    entityId?: string;
    params?: GetEntityParams;
  }) => {
    if (!entityId) {
      console.warn("(Autumn) No entity ID provided in useEntity hook");
      return;
    }

    setIsLoading(true);
    setLastParams(params || null);

    try {
      const { data, error } = await client.entities.get(entityId, params);

      if (error) {
        setError(error);
        setEntity(null);
      } else {
        setEntity(data);
        setError(null);
      }
    } catch (error: any) {
      setError(
        new AutumnError({
          message: error?.message || "Failed to fetch entity",
          code: "entity_fetch_failed",
        })
      );
    }
    setIsLoading(false);
  };

  return { entity, isLoading, error, refetch: fetchEntity, lastParams };
};
