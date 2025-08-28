
import { Autumn } from "autumn-js";
import { 
  type CreateReferralCodeArgsType, 
  type RedeemReferralCodeArgsType,
} from "../../types.js";
import { wrapSdkCall } from "./utils.js";

export const createCode = async (args: CreateReferralCodeArgsType) => {
    const autumn = new Autumn({
      secretKey: args.apiKey,
    });
    return await wrapSdkCall(() =>
      autumn.referrals.createCode({
        customer_id: args.customer_id,
        program_id: args.program_id,
      })
    );
};

export const redeemCode = async (args: RedeemReferralCodeArgsType) => {
    const autumn = new Autumn({
      secretKey: args.apiKey,
    });
    return await wrapSdkCall(() =>
      autumn.referrals.redeemCode({
        customer_id: args.customer_id,
        code: args.code,
      })
    );
};