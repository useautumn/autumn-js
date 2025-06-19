import { GetEntityParams } from "../../../sdk/customers/entities/entTypes";
import { useEntityProvider } from "./useEntityProvider";

export const useEntity = (entityId?: string, params?: GetEntityParams) => {
  return useEntityProvider(entityId, params);
  // const {
  //   encryptedCustomerId,
  //   entityId: contextEntityId,
  //   entity,
  //   setEntity,
  // } = useAutumnContext();

  // const finalEntityId = entityId || contextEntityId;
  // const [error, setError] = useState<AutumnClientError | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // const fetchEntity = async () => {
  //   if (!finalEntityId) {
  //     console.warn("(Autumn) No entity ID provided in useEntity hook");
  //     return;
  //   }

  //   const start = performance.now();

  //   console.log("Fetch entity start");

  //   setIsLoading(true);

  //   let returnData: Entity | null = null;
  //   try {
  //     let data: Entity | null = null;
  //     let error: AutumnError | null = null;

  //     const result = await getEntityAction({
  //       encryptedCustomerId,
  //       entityId: finalEntityId,
  //       params,
  //     });

  //     data = result.data;
  //     error = result.error;

  //     if (error) {
  //       setError(toClientError(error, false));
  //     } else {
  //       setEntity(data);
  //       setError(null);
  //     }
  //     returnData = data;
  //   } catch (error) {
  //     setError(toClientError(error));
  //   }
  //   setIsLoading(false);

  //   console.log("Fetch entity end");
  //   console.log("Time taken", performance.now() - start);

  //   return returnData;
  // };

  // const refetch = async () => {
  //   await fetchEntity();
  // };

  // useEffect(() => {
  //   fetchEntity();
  // }, [encryptedCustomerId, finalEntityId]);

  // return { entity, isLoading, error, refetch };
};
