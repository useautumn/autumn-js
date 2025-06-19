import { RouterContext } from "rou3";
import { addRoute } from "rou3";
import {
  Autumn,
  CreateEntityParams,
  CustomerData,
  GetEntityParams,
} from "../../../sdk";
import { withAuth } from "../utils/withAuth";

const createEntityHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    body: CreateEntityParams | CreateEntityParams[];
  }) => {
    return await autumn.entities.create(customer_id, body);
  },
});

const getEntityHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    pathParams,
    searchParams,
  }: {
    autumn: Autumn;
    customer_id: string;
    pathParams?: Record<string, string>;
    searchParams?: Record<string, string>;
  }) => {
    if (!pathParams?.entityId) {
      return {
        statusCode: 400,
        body: {
          error: "no_entity_id",
          message: "Entity ID is required",
        },
      };
    }

    let params: GetEntityParams = {
      expand: searchParams?.expand?.split(",") as "invoices"[],
    };

    let res = await autumn.entities.get(
      customer_id,
      pathParams.entityId,
      params
    );

    return res;
  },
});

const deleteEntityHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    pathParams,
  }: {
    autumn: Autumn;
    customer_id: string;
    pathParams?: Record<string, string>;
  }) => {
    if (!pathParams?.entityId) {
      return {
        statusCode: 400,
        body: {
          error: "no_entity_id",
          message: "Entity ID is required",
        },
      };
    }

    return await autumn.entities.delete(customer_id, pathParams.entityId);
  },
});

export const addEntityRoutes = async (router: RouterContext) => {
  addRoute(router, "POST", "/api/autumn/entities", {
    handler: createEntityHandler,
  });
  addRoute(router, "GET", "/api/autumn/entities/:entityId", {
    handler: getEntityHandler,
  });
  addRoute(router, "DELETE", "/api/autumn/entities/:entityId", {
    handler: deleteEntityHandler,
  });
};
