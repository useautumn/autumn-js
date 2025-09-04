import type {
	AutumnPromise,
	BillingPortalResult,
	CancelResult,
	CheckResult,
	QueryResult,
	SetupPaymentResult,
	TrackResult,
} from "@sdk";
import type { AttachResult, CheckoutResult } from "@sdk/general/attachTypes";
import { toSnakeCase } from "../utils/toSnakeCase";
import type { AutumnClient } from "./ReactAutumnClient";

import type { AttachParams, CheckoutParams } from "./types/clientAttachTypes";
import type {
	CancelParams,
	CheckParams,
	OpenBillingPortalParams,
	QueryParams,
	SetupPaymentParams,
	TrackParams,
} from "./types/clientGenTypes";

export async function checkoutMethod(
	this: AutumnClient,
	params: CheckoutParams,
): AutumnPromise<CheckoutResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(`${this.prefix}/checkout`, !this.camelCase ? snakeParams : params);
	return res;
}

export async function attachMethod(
	this: AutumnClient,
	params: AttachParams,
): AutumnPromise<AttachResult> {
	const snakeParams = toSnakeCase(params, ["checkoutSessionparams"]);

	const res = await this.post(`${this.prefix}/attach`, !this.camelCase ? snakeParams : params);
	return res;
}
export async function setupPaymentMethod(
	this: AutumnClient,
	params: SetupPaymentParams,
): AutumnPromise<SetupPaymentResult> {
	const snakeParams = toSnakeCase(params, ["checkoutSessionParams"]);

	const res = await this.post(`${this.prefix}/setup_payment`, (!this.camelCase ? snakeParams : params) as Record<string, unknown>);
	return res;
}

export async function cancelMethod(
	this: AutumnClient,
	params: CancelParams,
): AutumnPromise<CancelResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(`${this.prefix}/cancel`, !this.camelCase ? snakeParams : params);
	return res;
}

export async function checkMethod(
	this: AutumnClient,
	params: CheckParams,
): AutumnPromise<CheckResult> {
	// Remove dialog from params
	const noDialogParams = {
		...params,
		dialog: undefined,
	};
	const snakeParams = toSnakeCase(noDialogParams);

	const res = await this.post(`${this.prefix}/check`, !this.camelCase ? snakeParams : noDialogParams);
	return res;
}

export async function trackMethod(
	this: AutumnClient,
	params: TrackParams,
): AutumnPromise<TrackResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(`${this.prefix}/track`, !this.camelCase ? snakeParams : params);
	return res;
}

export async function openBillingPortalMethod(
	this: AutumnClient,
	params?: OpenBillingPortalParams,
): AutumnPromise<BillingPortalResult> {
	const snakeParams = toSnakeCase(params || {});

	const res = await this.post(`${this.prefix}/billing_portal`, (!this.camelCase ? snakeParams : (params || {})) as Record<string, unknown>);
	return res;
}

export async function queryMethod(
	this: AutumnClient,
	params: QueryParams,
): AutumnPromise<QueryResult> {
	const snakeParams = toSnakeCase(params);
	const res = await this.post(`${this.prefix}/query`, !this.camelCase ? snakeParams : params);
	return res;
}
