import type { AutumnClient } from "./ReactAutumnClient";
import type {
  ReferralCreateCodeParams,
  ReferralRedeemCodeParams,
} from "@/clientTypes";
import { Autumn } from "@sdk";

export async function createCode(
  this: AutumnClient,
  params: ReferralCreateCodeParams
): Promise<Autumn.Referrals.ReferralCreateCodeResponse> {
  const res = await this.post(`${this.prefix}/referrals/code`, params);
  return res;
}

export async function redeemCode(
  this: AutumnClient,
  params: ReferralRedeemCodeParams
): Promise<Autumn.Referrals.ReferralRedeemCodeResponse> {
  const res = await this.post(`${this.prefix}/referrals/redeem`, params);
  return res;
}
