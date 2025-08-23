import { ConvexHttpClient } from "convex/browser";
import {
	AutumnError,
	CreateCustomerParams,
	CustomerData,
	AutumnPromise,
	Product,
} from "../../../sdk";
import { IAutumnClient } from "./ReactAutumnClient";

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

export interface ConvexAutumnClientConfig {
	convexApi: any; // The exported autumn.api() object from Convex
	convexUrl: string; // The Convex deployment URL
	customerData?: CustomerData;
	headers?: Record<string, string>;
	getBearerToken?: () => Promise<string | null>;
}

export class ConvexAutumnClient implements IAutumnClient {
	protected readonly convexApi: any;
	protected readonly convexClient: ConvexHttpClient;
	public readonly customerData?: CustomerData;
	public readonly headers?: Record<string, string>;
	public readonly backendUrl?: string = undefined;
	public readonly prefix: string = "/api/convex";
	public readonly getBearerToken?: () => Promise<string | null>;

	// Stub implementations for HTTP-specific methods that the interface requires
	async detectCors() {
		return {
			valid: true,
			includeCredentials: false as boolean | undefined,
		};
	}

	async shouldIncludeCredentials(): Promise<boolean> {
		return false;
	}

	async getHeaders() {
		return { "Content-Type": "application/json" };
	}

	async handleFetch() {
		throw new Error("HTTP methods not supported in Convex mode");
	}

	async post() {
		throw new Error("HTTP methods not supported in Convex mode");
	}

	async get() {
		throw new Error("HTTP methods not supported in Convex mode");
	}

	async delete() {
		throw new Error("HTTP methods not supported in Convex mode");
	}

	constructor({
		convexApi,
		convexUrl,
		customerData,
		headers,
		getBearerToken,
	}: ConvexAutumnClientConfig) {
		this.convexApi = convexApi;
		this.convexClient = new ConvexHttpClient(convexUrl);
		this.getBearerToken = getBearerToken;
		this.customerData = customerData;
		this.headers = headers;
	}

	async createCustomer(
		params: Omit<CreateCustomerParams, "id" | "data"> & {
			errorOnNotFound?: boolean;
		}
	) {
		try {
			// Get customer identity first
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}

			const result = await this.convexClient.action(
				this.convexApi.fetchCustomer
			);

			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	}

	async getPricingTable() {
		// For Convex, we'll need to implement this differently
		// For now, return a placeholder
		return {
			data: null,
			error: new AutumnError({
				message: "getPricingTable not yet implemented for Convex",
				code: "not_implemented",
			}),
		};
	}

	// Core methods that wrap Convex actions
	attach = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}

			// Filter out frontend-only parameters
			const { dialog, ...backendArgs } = args;

			const result = await this.convexClient.action(
				this.convexApi.attach,
				backendArgs
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	checkout = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}

			// Filter out frontend-only parameters
			const { dialog, ...backendArgs } = args;

			const result = await this.convexClient.action(
				this.convexApi.checkout,
				backendArgs
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	cancel = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.cancel,
				args
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	check = async (args: any) => {
		try {
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.check,
				args
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	track = async (args: any) => {
		try {
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.track,
				args
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	openBillingPortal = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.billingPortal,
				{ ...args, openInNewTab: undefined }
			);

			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	setupPayment = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.setupPayment,
				args
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	query = async (args: any) => {
		try {
			// Set auth token for the request - backend will extract identity
			if (this.getBearerToken) {
				this.convexClient.setAuth((await this.getBearerToken()) ?? "");
			}
			const result = await this.convexClient.action(
				this.convexApi.query,
				args
			);
			return result;
		} catch (error: any) {
			return {
				data: null,
				error: new AutumnError({
					message: error.message,
					code: "convex_action_failed",
				}),
			};
		}
	};

	entities = {
		create: async (args: any) => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}

				// Check if args is an array or single entity
				if (Array.isArray(args)) {
					// Multiple entities - use createEntities method
					const entityArgs = { entities: args };
					const result = await this.convexClient.action(
						this.convexApi.createEntities,
						entityArgs
					);
					return result;
				} else {
					// Single entity - use createEntity method directly (no entities wrapper)
					const result = await this.convexClient.action(
						this.convexApi.createEntity,
						args
					);
					return result;
				}
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},

		get: async (args: any) => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}
				const result = await this.convexClient.action(
					this.convexApi.getEntity,
					args
				);
				return result;
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},

		delete: async (args: any) => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}
				const result = await this.convexClient.action(
					this.convexApi.deleteEntity,
					args
				);
				return result;
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},
	};

	referrals = {
		createCode: async (args: any) => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}
				const result = await this.convexClient.action(
					this.convexApi.createReferralCode,
					args
				);
				return result;
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},

		redeemCode: async (args: any) => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}
				const result = await this.convexClient.action(
					this.convexApi.redeemReferralCode,
					args
				);
				return result;
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},
	};

	products = {
		list: async (): AutumnPromise<{ list: Product[] }> => {
			try {
				// Set auth token for the request - backend will extract identity
				if (this.getBearerToken) {
					this.convexClient.setAuth(
						(await this.getBearerToken()) ?? ""
					);
				}
				const result = await this.convexClient.action(
					this.convexApi.listProducts,
					{}
				);
				return result;
			} catch (error: any) {
				return {
					data: null,
					error: new AutumnError({
						message: error.message,
						code: "convex_action_failed",
					}),
				};
			}
		},
	};
}
