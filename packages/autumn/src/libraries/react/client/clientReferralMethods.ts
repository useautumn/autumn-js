import {
  AutumnPromise,
  CreateReferralCodeResult,
  RedeemReferralCodeResult,
} from "../../../sdk";
import { toSnakeCase } from "../utils/toSnakeCase";
import { AutumnClient } from "./ReactAutumnClient";
import {
  CreateReferralCodeParams,
  RedeemReferralCodeParams,
} from "./types/clientReferralTypes";

export async function createCode(
  this: AutumnClient,
  params: CreateReferralCodeParams
): AutumnPromise<CreateReferralCodeResult> {
  let snakeParams = toSnakeCase(params);
  const res = await this.post("/api/autumn/referrals/code", snakeParams);
  return res;
}

export async function redeemCode(
  this: AutumnClient,
  params: RedeemReferralCodeParams
): AutumnPromise<RedeemReferralCodeResult> {
  let snakeParams = toSnakeCase(params);
  const res = await this.post("/api/autumn/referrals/redeem", snakeParams);
  return res;
}
