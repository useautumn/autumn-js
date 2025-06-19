import { addRoute, RouterContext } from "rou3";
import {
  Autumn,
  CreateReferralCodeParams,
  RedeemReferralCodeParams,
} from "../../../sdk";
import { withAuth } from "../utils/withAuth";
import { BASE_PATH } from "../constants";

const createReferralCodeHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    body: CreateReferralCodeParams;
  }) => {
    return await autumn.referrals.createCode({
      ...body,
      customer_id,
    });
  },
});

const redeemReferralCodeHandler = withAuth({
  fn: async ({
    autumn,
    customer_id,
    body,
  }: {
    autumn: Autumn;
    customer_id: string;
    body: RedeemReferralCodeParams;
  }) => {
    return await autumn.referrals.redeemCode({
      ...body,
      customer_id,
    });
  },
});

export const addReferralRoutes = async (router: RouterContext) => {
  addRoute(router, "POST", `${BASE_PATH}/referrals/code`, {
    handler: createReferralCodeHandler,
  });

  addRoute(router, "POST", `${BASE_PATH}/referrals/redeem`, {
    handler: redeemReferralCodeHandler,
  });
};
