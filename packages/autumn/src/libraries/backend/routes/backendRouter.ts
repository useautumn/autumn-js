import { withAuth } from "../utils/withAuth";
import { addGenRoutes } from "./genRoutes";
import { addRoute, createRouter } from "rou3";
import {
  Autumn,
  CreateCustomerParams,
  CustomerData,
  fetchPricingTable,
} from "../../../sdk";
import { BASE_PATH } from "../constants";
import { addEntityRoutes } from "./entityRoutes";
import { addReferralRoutes } from "./referralRoutes";

type RouteData = {
  handler: any;
  requireCustomer?: boolean;
};

const sanitizeCustomerBody = (body: any) => {
  let bodyCopy = { ...body };
  delete bodyCopy.id;
  delete bodyCopy.name;
  delete bodyCopy.email;

  return bodyCopy;
};

const createCustomerHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    customer_data = {},
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    customer_data?: CustomerData;
    body: CreateCustomerParams;
  }) => {
    console.log;
    let res = await autumn.customers.create({
      id: customer_id,
      ...customer_data,
      ...sanitizeCustomerBody(body),
    });

    return res;
  },
});

const getPricingTableHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
  }: {
    autumn: Autumn;
    customer_id: string;
  }) => {
    return await fetchPricingTable({
      instance: autumn,
      params: {
        customer_id: customer_id || undefined,
      },
    });
  },
  requireCustomer: false,
});

export const createRouterWithOptions = ({ autumn }: { autumn: Autumn }) => {
  const router = createRouter<RouteData>();

  addRoute(router, "POST", `${BASE_PATH}/customers`, {
    handler: createCustomerHandler,
  });

  addRoute(router, "GET", `${BASE_PATH}/components/pricing_table`, {
    handler: getPricingTableHandler,
    requireCustomer: false,
  });

  addGenRoutes(router);

  addEntityRoutes(router);

  addReferralRoutes(router);

  // Add /api/autumn prefix to all routes
  return router;
};
