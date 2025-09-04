import { logAuthError } from "@/errorUtils/logAuthError";
import {
	AutumnError,
	type CreateCustomerParams,
	type CustomerData,
	toContainerResult,
} from "../../../sdk";
import { logFetchError } from "../errorUtils/logFetchError";
import { getPricingTableMethod } from "./clientCompMethods";
import { createCustomerMethod } from "./clientCusMethods";
import {
	createEntityMethod,
	deleteEntityMethod,
	getEntityMethod,
} from "./clientEntityMethods";

import {
	attachMethod,
	cancelMethod,
	checkMethod,
	checkoutMethod,
	openBillingPortalMethod,
	queryMethod,
	setupPaymentMethod,
	trackMethod,
} from "./clientGenMethods";
import { listProductsMethod } from "./clientProdMethods";
import { createCode, redeemCode } from "./clientReferralMethods";

export interface ErrorResponse {
	message: string;
	code: string;
}

export type OmitCustomerType =
	| "id"
	| "name"
	| "email"
	| "fingerprint"
	| "customer_id";

export interface AutumnClientConfig {
	backendUrl?: string;
	getBearerToken?: () => Promise<string | null | undefined>;
	customerData?: CustomerData;
	includeCredentials?: boolean;
	betterAuthUrl?: string;
	headers?: Record<string, string>;
}

export class AutumnClient {
	public readonly backendUrl?: string;
	protected readonly getBearerToken?: () => Promise<string | null | undefined>;
	protected readonly customerData?: CustomerData;
	protected includeCredentials?: boolean;
	public readonly prefix: string;
	public readonly camelCase: boolean;
	public readonly headers?: Record<string, string>;
  	public readonly framework?: string;

	constructor({
		backendUrl,
		getBearerToken,
		customerData,
		includeCredentials,
		betterAuthUrl,
		headers,
	}: AutumnClientConfig) {
		this.backendUrl = backendUrl;
		this.getBearerToken = getBearerToken;
		this.customerData = customerData;
		this.includeCredentials = includeCredentials;
		this.prefix = "/api/autumn";
		let camelCase = false;

		if (betterAuthUrl) {
			this.prefix = "/api/auth/autumn";
			this.backendUrl = betterAuthUrl;
			camelCase = true;
		}

		this.headers = headers;

		// Feature-flags for input camelCase:
		if (betterAuthUrl) camelCase = true;
		this.camelCase = camelCase;
	}

	/**
	 * Detects if the backend supports CORS credentials by making an OPTIONS request
	 */
	private async detectCors() {
		if (this.prefix?.includes("/api/auth")) {
			return { valid: true, includeCredentials: true };
		}

		const testEndpoint = `${this.backendUrl}/api/autumn/cors`;

		// Test 1: With credentials
		try {
			await fetch(testEndpoint, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});

			return { valid: true, includeCredentials: true };
		} catch (_) {
			// Test 2: Without credentials
			try {
				await fetch(testEndpoint, {
					method: "POST",
					credentials: "omit",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({}),
				});

				return { valid: true, includeCredentials: false };
			} catch (_) {
				return { valid: false, includeCredentials: undefined };
			}
		}
	}
	/**
	 * Automatically determines whether to include credentials based on CORS detection
	 */
	private async shouldIncludeCredentials(): Promise<boolean> {
		if (this.includeCredentials !== undefined) {
			return this.includeCredentials;
		}

		try {
			const corsResult = await this.detectCors();
			if (corsResult.valid) {
				console.warn(
					`[Autumn] Detected CORS credentials: ${corsResult.includeCredentials}`
				);
				console.warn(
					`[Autumn] To disable this warning, you can set includeCredentials={${
						corsResult.includeCredentials ? "true" : "false"
					}} in <AutumnProvider />`
				);
				this.includeCredentials = corsResult.includeCredentials;
			}

			return corsResult.includeCredentials || false;
		} catch (error: unknown) {
			console.error(
				`[Autumn] Error detecting CORS: ${
					error instanceof Error ? error.message : error
				}`
			);
			return false;
		}
	}

	async getHeaders() {
		let headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (this.getBearerToken) {
			try {
				const token = await this.getBearerToken();
				headers.Authorization = `Bearer ${token}`;
			} catch (_) {
				console.error(`Failed to call getToken() in AutumnProvider`);
			}
		}

		if (this.headers) {
			headers = { ...headers, ...this.headers };
		}

		return headers;
	}

	async handleFetch({
		path,
		method,
		body,
	}: {
		path: string;
		method: string;
		body?: Record<string, unknown> | Record<string, unknown>[];
	}) {
		body =
			method === "POST"
				? {
						...body,
						[this.camelCase ? "customerData" : "customer_data"]: this.customerData || undefined,
				  }
				: undefined;

		const includeCredentials = await this.shouldIncludeCredentials();

		try {
			const response = await fetch(`${this.backendUrl}${path}`, {
				method,
				body: body ? JSON.stringify(body) : undefined,
				headers: await this.getHeaders(),
				credentials: includeCredentials ? "include" : "omit",
			});

			const loggedError = await logAuthError(response);

			return await toContainerResult({
				response,
				logger: console,
				logError: !loggedError,
			});
		} catch (error: unknown) {
			logFetchError({
				method,
				backendUrl: this.backendUrl || "",
				path,
				error,
			});
			return {
				data: null,
				error: new AutumnError({
					message:
						error instanceof Error ? error.message : JSON.stringify(error),
					code: "fetch_failed",
				}),
			};
		}
	}

	async post(path: string, body: Record<string, unknown> | Record<string, unknown>[]) {
		return await this.handleFetch({
			path,
			method: "POST",
			body,
		});
	}

	async get(path: string) {
		return await this.handleFetch({
			path,
			method: "GET",
		});
	}

	async delete(path: string) {
		return await this.handleFetch({
			path,
			method: "DELETE",
		});
	}

	async createCustomer(
		params: Omit<CreateCustomerParams, "id" | "data"> & {
			errorOnNotFound?: boolean;
		}
	) {
		return await createCustomerMethod({
			client: this,
			params,
		});
	}

	async getPricingTable() {
		return await getPricingTableMethod.bind(this)();
	}

	attach = attachMethod.bind(this);
	checkout = checkoutMethod.bind(this);
	cancel = cancelMethod.bind(this);
	check = checkMethod.bind(this);
	track = trackMethod.bind(this);
	openBillingPortal = openBillingPortalMethod.bind(this);
	setupPayment = setupPaymentMethod.bind(this);
	query = queryMethod.bind(this);

	entities = {
		create: createEntityMethod.bind(this),
		get: getEntityMethod.bind(this),
		delete: deleteEntityMethod.bind(this),
	};

	referrals = {
		createCode: createCode.bind(this),
		redeemCode: redeemCode.bind(this),
	};

	products = {
		list: listProductsMethod.bind(this),
	};
}
