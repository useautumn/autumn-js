import type {
	AutumnPromise,
	CreateReferralCodeResult,
	RedeemReferralCodeResult,
} from "../../../sdk";
import { toSnakeCase } from "../utils/toSnakeCase";
import type { AutumnClient } from "./ReactAutumnClient";
import type {
	CreateReferralCodeParams,
	RedeemReferralCodeParams,
} from "./types/clientReferralTypes";

export async function createCode(
	this: AutumnClient,
	params: CreateReferralCodeParams,
): AutumnPromise<CreateReferralCodeResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(
		`${this.prefix}/referrals/code`,
		!this.camelCase ? snakeParams : params,
	);
	return res;
}

export async function redeemCode(
	this: AutumnClient,
	params: RedeemReferralCodeParams,
): AutumnPromise<RedeemReferralCodeResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(
		`${this.prefix}/referrals/redeem`,
		!this.camelCase ? snakeParams : params,
	);
	return res;
}
