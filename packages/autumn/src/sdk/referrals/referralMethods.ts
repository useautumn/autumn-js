import { Autumn } from "../client";
import { staticWrapper } from "../utils";
import {
  CreateReferralCodeParams,
  RedeemReferralCodeParams,
} from "./referralTypes";

export const referralMethods = (instance?: Autumn) => {
  return {
    createCode: (params: CreateReferralCodeParams) =>
      staticWrapper(createReferralCode, instance, { params }),
    redeemCode: (params: RedeemReferralCodeParams) =>
      staticWrapper(redeemReferralCode, instance, { params }),
  };
};

export const createReferralCode = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params: CreateReferralCodeParams;
}) => {
  return instance.post("/referrals/code", params);
};

export const redeemReferralCode = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params: RedeemReferralCodeParams;
}) => {
  return instance.post("/referrals/redeem", params);
};
