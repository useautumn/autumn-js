import { CustomerExpandEnum } from "@sdk";
import type {
  AuthContext,
  BetterAuthPlugin,
  EndpointContext,
  Middleware,
} from "better-auth";
import { getSessionFromCtx, sessionMiddleware } from "better-auth/api";
import { createAuthEndpoint, type Organization } from "better-auth/plugins";
import {
  APIError,
  createEndpoint,
  type EndpointOptions,
  type Method,
  type Status,
} from "better-call";
import { findRoute } from "rou3";
import type { ZodSchema } from "zod/v4";
import { z } from "zod/v4";
import {
  AttachParamsSchema,
  CheckoutParamsSchema,
} from "@/client/types/clientAttachTypes";
import { CreateEntityParamsSchema } from "@/client/types/clientEntTypes";
import {
  CancelParamsSchema,
  CheckParamsSchema,
  OpenBillingPortalParamsSchema,
  TrackParamsSchema,
} from "@/client/types/clientGenTypes";
import {
  CreateReferralCodeParamsSchema,
  RedeemReferralCodeParamsSchema,
} from "@/client/types/clientReferralTypes";
import { toSnakeCase } from "@/utils/toSnakeCase";
import { Autumn } from "../../sdk/client";
import { createRouterWithOptions } from "./routes/backendRouter";
import type { AuthResult } from "./utils/AuthFunction";
import {
  identityMiddleware,
  organizationMiddleware,
} from "./utils/betterAuth/middlewares";
import type { AutumnOptions } from "./utils/betterAuth/types";
import { secretKeyCheck } from "./utils/secretKeyCheck";

const router = createRouterWithOptions();

const betterAuthPathMap: Record<string, string> = {
	// "create-customer": "customers",
	// "customers/get": "customers",
	checkout: "checkout",
	attach: "attach",
	check: "check",
	track: "track",
	cancel: "cancel",
	"referrals/redeem-code": "referrals/redeem",
	"referrals/create-code": "referrals/code",
	"open-billing-portal": "billing_portal",
	// "products/list": "products",
};

const handleReq = async ({
	ctx,
	options,
	method,
	session,
}: {
	ctx: EndpointContext<string, EndpointOptions, AuthContext>;
	options?: AutumnOptions;
	method: string;
	session?: unknown;
}) => {
	const { found, error: resError } = secretKeyCheck();

	if (!found && !options?.secretKey) {
		throw new APIError((resError?.statusCode as Status) ?? "BAD_REQUEST", {
			message: resError?.message ?? "Unknown error",
			code: resError?.code ?? "unknown_error",
		});
	}

	const client = new Autumn({
		url: options?.url,
		secretKey: options?.secretKey,
	});

	let searchParams: Record<string, string> = {};
	try {
		const req = ctx.request as Request;
		const url = new URL(req.url);
		searchParams = Object.fromEntries(url.searchParams);
	} catch (_) {}

	const rest = ctx.path.split("/autumn/")[1];
	const pathname = `/api/autumn/${betterAuthPathMap[rest] || rest}`;

	const match = findRoute(router, method, pathname);

	if (!match) {
		return ctx.json({ error: "Not found" }, { status: 404 });
	}

	const { data } = match;
	const { handler } = data;

	// const body = toSnakeCase(ctx.body, ["checkoutSessionParams"]);
	const body = ctx.body;
	const params = ctx.params;
	const finalSession = session || ctx.context.session;
	let identify: unknown;

	if (options?.identify) {
		identify = () => ctx.context.autumnIdentity as AuthResult;
	} else {
		identify = () => {
			if (!finalSession) {
				return;
			}

			if (!options?.enableOrganizations || !ctx.context?.activeOrganization?.id) {
				return {
					customerId: finalSession.user.id,
					customerData: {
						email: finalSession.user.email,
						name: finalSession.user.name,
					},
				};
			} else if (ctx.context?.activeOrganization?.id) {
        const organization = ctx.context.activeOrganization;
        const ownerEmail = ctx.context.activeOrganizationEmail;
        return {
          customerId: organization?.id,
          customerData: {
            email: ownerEmail,
            name: organization?.name ?? "",
          },
        };
      }
		};
	}

	const result = await handler({
		autumn: client,
		body: toSnakeCase(body),
		path: pathname,
		getCustomer: identify,
		pathParams: params,
		searchParams,
	});

	if (result.statusCode >= 400) {
		throw new APIError(result.statusCode, {
			message: result.body.message ?? "Unknown error",
			code: result.body.code ?? "unknown_error",
		});
	}

	return ctx.json(result.body, { status: result.statusCode });
};

// Endpoint configuration type
interface EndpointConfig {
	key: string;
	path: string;
	method: Method;
	body?: ZodSchema;
	metadata?: Record<string, unknown>;
	useAuth?: boolean;
	customHandler?: (
		ctx: EndpointContext<string, EndpointOptions, AuthContext>,
		options?: AutumnOptions,
	) => Promise<any>;
}

// Function to create endpoint configurations (to access options parameter)
const createEndpointConfigs = (options?: AutumnOptions): EndpointConfig[] => [
	{
		key: "identifyOrg",
		path: "/autumn/identify-org",
		method: "GET",
		useAuth: false,
		customHandler: async (ctx) => {
			const session = await getSessionFromCtx(
				ctx as Parameters<typeof getSessionFromCtx>[0],
			);
			const org = (
				ctx.context as unknown as { activeOrganization: Organization }
			).activeOrganization;
			return ctx.json({
				orgId: org?.id,
				identity: (ctx.context as unknown as { autumnIdentity: AuthResult })
					.autumnIdentity,
				session,
				org,
			});
		},
	},
	{
		key: "createCustomer",
		path: "/autumn/customers",
		method: "POST",
		useAuth: false,
		body: z.object({
			errorOnNotFound: z.boolean().optional(),
			expand: z.array(CustomerExpandEnum).optional(),
		}),
		metadata: {
			isAction: false,
		},
		customHandler: async (ctx) => {
			const session = await getSessionFromCtx(
				ctx as Parameters<typeof getSessionFromCtx>[0],
			);
			return await handleReq({ ctx, options, method: "POST", session });
		},
	},
	{
		key: "listProducts",
		path: "/autumn/products",
		method: "GET",
		useAuth: true,
		customHandler: async (ctx) => {
			const session = await getSessionFromCtx(
				ctx as Parameters<typeof getSessionFromCtx>[0],
			);
			return await handleReq({ ctx, options, method: "GET", session });
		},
	},
	{
		key: "checkout",
		path: "/autumn/checkout",
		method: "POST",
		body: CheckoutParamsSchema,
		useAuth: true,
	},
	{
		key: "attach",
		path: "/autumn/attach",
		method: "POST",
		body: AttachParamsSchema,
		useAuth: true,
	},
	{
		key: "check",
		path: "/autumn/check",
		method: "POST",
		body: CheckParamsSchema,
		useAuth: true,
	},
	{
		key: "track",
		path: "/autumn/track",
		method: "POST",
		body: TrackParamsSchema,
		useAuth: true,
	},
	{
		key: "cancel",
		path: "/autumn/cancel",
		method: "POST",
		body: CancelParamsSchema,
		useAuth: true,
	},
	{
		key: "createReferralCode",
		path: "/autumn/referrals/code",
		method: "POST",
		body: CreateReferralCodeParamsSchema,
		useAuth: true,
	},
	{
		key: "redeemReferralCode",
		path: "/autumn/referrals/redeem",
		method: "POST",
		body: RedeemReferralCodeParamsSchema,
		useAuth: true,
	},
	{
		key: "billingPortal",
		path: "/autumn/billing_portal",
		method: "POST",
		body: OpenBillingPortalParamsSchema,
		useAuth: true,
		metadata: {
			isAction: false,
		},
	},
	{
		key: "createEntity",
		path: "/autumn/entities",
		method: "POST",
		body: CreateEntityParamsSchema,
		useAuth: true,
	},
	{
		key: "getEntity",
		path: "/autumn/entities/:entityId",
		method: "GET",
		useAuth: true,
	},
	{
		key: "deleteEntity",
		path: "/autumn/entities/:entityId",
		method: "DELETE",
		useAuth: true,
	},
];

export const autumn = (options?: AutumnOptions) => {
	// Get endpoint configurations with options in scope
	const endpointConfigs = createEndpointConfigs(options);

	// Helper function to create default handler
	const createDefaultHandler =
		(method: string) =>
		async (ctx: EndpointContext<string, EndpointOptions, AuthContext>) => {
			return await handleReq({ ctx, options, method });
		};

	// Generate endpoints dynamically
	const endpoints = endpointConfigs.reduce(
		(acc, config) => {
			const endpointOptions: {
				method: Method;
				use: Middleware[];
				body?: ZodSchema;
				metadata?: Record<string, unknown>;
			} = {
				method: config.method,
				use: [
					sessionMiddleware,
					organizationMiddleware(options),
					identityMiddleware(options),
				],
				body:
					config.body !== undefined || config.body !== null
						? config.body
						: undefined,
				metadata:
					config.metadata !== undefined || config.metadata !== null
						? config.metadata
						: undefined,
			};

			// Create endpoint using appropriate function
			const endpointCreator = config.useAuth
				? createAuthEndpoint
				: createEndpoint;
			acc[config.key] = endpointCreator(
				config.path,
				endpointOptions,
				config.customHandler || createDefaultHandler(config.method),
			);

			return acc;
		},
		{} as Record<
			string,
			ReturnType<typeof createAuthEndpoint> | ReturnType<typeof createEndpoint>
		>,
	);

	return {
		id: "autumn",
		endpoints,
	} satisfies BetterAuthPlugin;
};
