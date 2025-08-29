import { createAuthEndpoint, createAuthMiddleware, InferOrganization, Organization } from "better-auth/plugins";
import {
  Session,
  type AuthContext,
  type BetterAuthClientPlugin,
  type BetterAuthPlugin,
  type EndpointContext,
} from "better-auth";
import { APIError, createEndpoint } from "better-call";
import { createRouterWithOptions } from "./routes/backendRouter";
import { secretKeyCheck } from "./utils/secretKeyCheck";
import { BillingPortalParamsSchema, CustomerExpandEnum } from "@sdk";
import { Autumn } from "../../sdk/client";
import { findRoute } from "rou3";
import { getSessionFromCtx, sessionMiddleware } from "better-auth/api";
import { z } from "zod/v4";
import { AutumnOptions } from "./utils/betterAuth/types";
import {
  TrackParamsSchema,
  CancelParamsSchema,
  CheckParamsSchema,
} from "@sdk/general/genTypes";
import {
  CreateReferralCodeParamsSchema,
  RedeemReferralCodeParamsSchema,
} from "@sdk/referrals/referralTypes";
import {
  AttachParamsSchema,
  CheckoutParamsSchema,
} from "@sdk/general/attachTypes";
import { CreateEntityParamsSchema, GetEntityParamsSchema } from "@/client/types/clientEntTypes";
import { organizationMiddleware, identityMiddleware } from "./utils/betterAuth/middlewares";

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
  ctx: EndpointContext<any, any, AuthContext>;
  options?: AutumnOptions;
  method: string;
  session?: any;
}) => {
  let { found, error: resError } = secretKeyCheck();

  if (!found && !options?.secretKey) {
    throw new APIError(resError!.statusCode as any, {
      message: resError!.message,
      code: resError!.code,
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
  } catch (error) {}

  const rest = ctx.path.split("/autumn/")[1];
  const pathname = `/api/autumn/${betterAuthPathMap[rest] || rest}`;

  const match = findRoute(router, method, pathname);

  if (!match) {
    return ctx.json({ error: "Not found" }, { status: 404 });
  }

  const { data, params: pathParams } = match;
  const { handler } = data;

  // const body = toSnakeCase(ctx.body, ["checkoutSessionParams"]);
  const body = ctx.body;
  const params = ctx.params;
  const finalSession = session || ctx.context.session;
  let identify: any;

  if (options?.identify) {
    identify = () => options.identify?.({
      session: finalSession,
      organization: {
        ...(ctx.context as any).activeOrganization,
        ownerEmail: (ctx.context as any).activeOrganizationEmail,
      },
    });
  } else {
    identify = () => {
      if (!finalSession) {
        return;
      }
      return {
        customerId: finalSession.user.id,
        customerData: {
          email: finalSession.user.email,
          name: finalSession.user.name,
        },
      };
    };
  }

  const result = await handler({
    autumn: client,
    body,
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

export const autumn = (options?: AutumnOptions) => {
  return {
    id: "autumn",
    endpoints: {
      identifyOrg: createEndpoint(
        "/autumn/identify-org",
        {
          method: "GET",
          use: [
            sessionMiddleware,
            organizationMiddleware,
            identityMiddleware(options),
          ],
        },
        async (ctx) => {
          const session = await getSessionFromCtx(ctx as any);
          const org = (ctx.context as any).activeOrganization;
          return ctx.json({
            orgId: org?.id,
            identity: (ctx.context as any).autumnIdentity,
            session,
            org,
          });
        }
      ),
      createCustomer: createEndpoint(
        "/autumn/customers",
        {
          method: "POST",
          use: [
            sessionMiddleware,
            organizationMiddleware,
            identityMiddleware(options),
          ],
          body: z.object({
            errorOnNotFound: z.boolean().optional(),
            expand: z.array(CustomerExpandEnum).optional(),
          }),
          metadata: {
            isAction: false,
          },
        },
        async (ctx) => {
          const session = await getSessionFromCtx(ctx as any);

          return await handleReq({ ctx, options, method: "POST", session });
        }
      ),
      listProducts: createAuthEndpoint(
        "/autumn/products",
        {
          method: "GET",
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => {
          const session = await getSessionFromCtx(ctx);
          return await handleReq({ ctx, options, method: "GET", session });
        }
      ),
      checkout: createAuthEndpoint(
        "/autumn/checkout",
        {
          method: "POST",
          body: CheckoutParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => handleReq({ ctx, options, method: "POST" })
      ),
      attach: createAuthEndpoint(
        "/autumn/attach",
        {
          method: "POST",
          body: AttachParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => handleReq({ ctx, options, method: "POST" })
      ),

      check: createAuthEndpoint(
        "/autumn/check",
        {
          method: "POST",
          body: CheckParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => handleReq({ ctx, options, method: "POST" })
      ),
      track: createAuthEndpoint(
        "/autumn/track",
        {
          method: "POST",
          body: TrackParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => handleReq({ ctx, options, method: "POST" })
      ),
      cancel: createAuthEndpoint(
        "/autumn/cancel",
        {
          method: "POST",
          body: CancelParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => {
          return await handleReq({ ctx, options, method: "POST" });
        }
      ),
      createReferralCode: createAuthEndpoint(
        "/autumn/referrals/create-code",
        {
          method: "POST",
          body: CreateReferralCodeParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware],
        },
        async (ctx) => {
          return await handleReq({ ctx, options, method: "POST" });
        }
      ),
      redeemReferralCode: createAuthEndpoint(
        "/autumn/referrals/redeem-code",
        {
          method: "POST",
          body: RedeemReferralCodeParamsSchema.omit({
            customer_id: true,
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => {
          return await handleReq({ ctx, options, method: "POST" });
        }
      ),

      billingPortal: createAuthEndpoint(
        "/autumn/billing_portal",
        {
          method: "POST",
          body: BillingPortalParamsSchema,
          metadata: {
            isAction: false,
          },
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => await handleReq({ ctx, options, method: "POST" })
      ),

      createEntity: createAuthEndpoint(
        "/autumn/entities",
        {
          method: "POST",
          body: CreateEntityParamsSchema.omit({
            featureId: true,
          }).extend({
            feature_id: z.string(),
          }),
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => {
          return await handleReq({ ctx, options, method: "POST" });
        }
      ),

      getEntity: createAuthEndpoint(
        "/autumn/entities/:entityId",
        {
          method: "GET",
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)]
        },
        async (ctx) => await handleReq({ ctx, options, method: "GET" })
      ),

      deleteEntity: createAuthEndpoint(
        "/autumn/entities/:entityId",
        {
          method: "DELETE",
          use: [sessionMiddleware, organizationMiddleware, identityMiddleware(options)],
        },
        async (ctx) => await handleReq({ ctx, options, method: "DELETE" })
      ),
    },
  } satisfies BetterAuthPlugin;
};