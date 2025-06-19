import { withAuth } from "../utils/withAuth";
import {
  Autumn,
  AttachParams,
  CustomerData,
  CancelParams,
  CheckParams,
  TrackParams,
  BillingPortalParams,
} from "../../../sdk";
import { addRoute, RouterContext } from "rou3";
import { OpenBillingPortalParams } from "src/libraries/react/client/types/clientGenTypes";
import { BASE_PATH } from "../constants";
const sanitizeBody = (body: any) => {
  let bodyCopy = { ...body };
  delete bodyCopy.customer_id;
  delete bodyCopy.customer_data;
  return bodyCopy;
};

const attachHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    customer_data,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    customer_data?: CustomerData;
    body: AttachParams;
  }) => {
    return await autumn.attach({
      ...sanitizeBody(body),
      customer_id,
      customer_data,
    });
  },
});

const cancelHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    body: CancelParams;
  }) => {
    return await autumn.cancel({
      ...sanitizeBody(body),
      customer_id,
    });
  },
});

const checkHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    customer_data,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    customer_data?: CustomerData;
    body: CheckParams;
  }) => {
    return await autumn.check({
      ...sanitizeBody(body),
      customer_id,
      customer_data,
    });
  },
});

const trackHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    customer_data,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    customer_data?: CustomerData;
    body: TrackParams;
  }) => {
    return await autumn.track({
      ...sanitizeBody(body),
      customer_id,
      customer_data,
    });
  },
});

const openBillingPortalHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    body: BillingPortalParams;
  }) => {
    return await autumn.customers.billingPortal(customer_id, body);
  },
});

const addGenRoutes = (router: RouterContext) => {
  addRoute(router, "POST", `${BASE_PATH}/attach`, {
    handler: attachHandler,
  });
  addRoute(router, "POST", `${BASE_PATH}/cancel`, {
    handler: cancelHandler,
  });
  addRoute(router, "POST", `${BASE_PATH}/check`, {
    handler: checkHandler,
  });
  addRoute(router, "POST", `${BASE_PATH}/track`, {
    handler: trackHandler,
  });
  addRoute(router, "POST", `${BASE_PATH}/billing_portal`, {
    handler: openBillingPortalHandler,
  });
};

export { addGenRoutes };
