import { v, Infer } from "convex/values";
import { zodToConvex } from "convex-helpers/server/zod";
import {
  // Zod schemas from SDK
  CustomerDataSchema,
  TrackParamsSchema,
  CheckParamsSchema,
  AttachParamsSchema,
  CheckoutParamsSchema,
  CancelParamsSchema,
  QueryParamsSchema,
  EntityDataSchema,
  CreateCustomerParamsSchema,
  BillingPortalParamsSchema,
  CreateReferralCodeParamsSchema,
  RedeemReferralCodeParamsSchema,
  AttachFeatureOptionsSchema,
  // Types from SDK
  type TrackParams,
  type CheckParams,
  type AttachParams,
  type CheckoutParams,
  type CancelParams,
  type QueryParams,
  type CustomerData,
  type CreateCustomerParams,
  type BillingPortalParams,
  type CreateReferralCodeParams,
  type RedeemReferralCodeParams,
  type AttachFeatureOptions,
} from "autumn-js";

// Convert SDK Zod schemas to Convex validators - fallback to manual conversion due to zod version issues
export const CustomerDataConvex = v.object({
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  fingerprint: v.optional(v.string()),
});

export const AttachFeatureOptionsConvex = v.object({
  featureId: v.string(),
  quantity: v.number(),
});

// User-facing args (without auth fields) - using camelCase for user-friendly API
export const UserTrackArgs = v.object({
  featureId: v.optional(v.string()), // Made optional to match SDK
  value: v.optional(v.number()),
  entityId: v.optional(v.string()),
  eventName: v.optional(v.string()),
  idempotencyKey: v.optional(v.string()),
  customerData: v.optional(CustomerDataConvex), // User-facing camelCase
  entityData: v.optional(v.any()), // Added to match SDK
});

export const UserCheckArgs = v.object({
  productId: v.optional(v.string()),
  featureId: v.optional(v.string()),
  requiredBalance: v.optional(v.number()),
  sendEvent: v.optional(v.boolean()),
  withPreview: v.optional(v.boolean()),
  entityId: v.optional(v.string()),
  customerData: v.optional(CustomerDataConvex), // User-facing camelCase
  entityData: v.optional(v.any()), // Added to match SDK
});

export const UserAttachArgs = v.object({
  productId: v.optional(v.string()), // Made optional to match SDK
  productIds: v.optional(v.array(v.string())),
  entityId: v.optional(v.string()),
  options: v.optional(v.array(AttachFeatureOptionsConvex)), // Changed to use proper schema
  freeTrial: v.optional(v.boolean()), // Added to match SDK
  successUrl: v.optional(v.string()),
  metadata: v.optional(v.object({})),
  forceCheckout: v.optional(v.boolean()),
  customerData: v.optional(CustomerDataConvex), // User-facing camelCase
  entityData: v.optional(v.any()), // Added to match SDK
  checkoutSessionParams: v.optional(v.object({})),
  reward: v.optional(v.string()),
  invoice: v.optional(v.boolean()), // Added to match SDK
});

export const UserCheckoutArgs = v.object({
  productId: v.string(),
  entityId: v.optional(v.string()),
  options: v.optional(v.array(AttachFeatureOptionsConvex)), // Changed to use proper schema
  forceCheckout: v.optional(v.boolean()), // Added to match SDK
  invoice: v.optional(v.boolean()), // Added to match SDK
  successUrl: v.optional(v.string()),
  customerData: v.optional(CustomerDataConvex), // User-facing camelCase
  entityData: v.optional(v.any()), // Added to match SDK
  checkoutSessionParams: v.optional(v.object({})),
  reward: v.optional(v.string()),
});

// Full args with auth fields (for internal use) - converted from SDK schemas
export const TrackArgs = v.object({
  customer_id: v.string(),
  feature_id: v.optional(v.string()), // Made optional to match SDK
  value: v.optional(v.number()),
  entity_id: v.optional(v.string()),
  event_name: v.optional(v.string()),
  idempotency_key: v.optional(v.string()),
  customer_data: v.optional(CustomerDataConvex),
  entity_data: v.optional(v.any()),
  apiKey: v.string(),
});

export const CheckArgs = v.object({
  customer_id: v.string(),
  product_id: v.optional(v.string()),
  feature_id: v.optional(v.string()),
  required_balance: v.optional(v.number()),
  send_event: v.optional(v.boolean()),
  with_preview: v.optional(v.boolean()),
  entity_id: v.optional(v.string()),
  customer_data: v.optional(CustomerDataConvex),
  entity_data: v.optional(v.any()),
  apiKey: v.string(),
});

export const AttachArgs = v.object({
  customer_id: v.string(),
  product_id: v.optional(v.string()),
  product_ids: v.optional(v.array(v.string())),
  entity_id: v.optional(v.string()),
  options: v.optional(v.array(AttachFeatureOptionsConvex)),
  free_trial: v.optional(v.boolean()),
  success_url: v.optional(v.string()),
  metadata: v.optional(v.object({})),
  force_checkout: v.optional(v.boolean()),
  customer_data: v.optional(CustomerDataConvex),
  entity_data: v.optional(v.any()),
  checkout_session_params: v.optional(v.object({})),
  reward: v.optional(v.string()),
  invoice: v.optional(v.boolean()),
  apiKey: v.string(),
});

export const CheckoutArgs = v.object({
  customer_id: v.string(),
  product_id: v.string(),
  entity_id: v.optional(v.string()),
  options: v.optional(v.array(AttachFeatureOptionsConvex)),
  force_checkout: v.optional(v.boolean()),
  invoice: v.optional(v.boolean()),
  success_url: v.optional(v.string()),
  customer_data: v.optional(CustomerDataConvex),
  entity_data: v.optional(v.any()),
  checkout_session_params: v.optional(v.object({})),
  reward: v.optional(v.string()),
  apiKey: v.string(),
});

export const CancelArgs = v.object({
  customer_id: v.string(),
  product_id: v.string(),
  entity_id: v.optional(v.string()),
  cancel_immediately: v.optional(v.boolean()),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

export const QueryArgs = v.object({
  customer_id: v.string(),
  feature_id: v.union(v.string(), v.array(v.string())),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

export const UsageArgs = v.object({
  customer_id: v.string(),
  feature_id: v.string(),
  value: v.number(),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

export const SetupPaymentArgs = v.object({
  customer_id: v.string(),
  success_url: v.optional(v.string()),
  checkout_session_params: v.optional(v.object({})),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

// Entity management - fallback to manual conversion
export const EntityDataConvex = v.object({
  name: v.optional(v.string()),
  feature_id: v.string(),
  id: v.optional(v.string()),
});

// User-facing entity creation args (camelCase for user-friendly API)
export const UserCreateEntityArgs = v.object({
  entities: v.union(
    v.object({
      name: v.optional(v.string()),
      featureId: v.string(),
      id: v.optional(v.string()),
    }),
    v.array(
      v.object({
        name: v.optional(v.string()),
        featureId: v.string(),
        id: v.optional(v.string()),
      })
    )
  ),
});

// Alternative single entity creation args for convenience
export const UserCreateSingleEntityArgs = v.object({
  name: v.optional(v.string()),
  featureId: v.string(),
  id: v.optional(v.string()),
});

export const CreateEntityArgs = v.object({
  customer_id: v.string(),
  entities: v.union(EntityDataConvex, v.array(EntityDataConvex)),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

export const DeleteEntityArgs = v.object({
  customer_id: v.string(),
  entity_id: v.string(),
  apiKey: v.string(),
});

export const UserGetEntityArgs = v.object({
  entity_id: v.string(),
  expand: v.optional(v.array(v.literal("invoices"))),
});

export const GetEntityArgs = v.object({
  customer_id: v.string(),
  entity_id: v.string(),
  expand: v.optional(v.array(v.literal("invoices"))),
  customer_data: v.optional(CustomerDataConvex),
  apiKey: v.string(),
});

export const ExpandArgs = v.optional(
  v.array(
    v.union(
      v.literal("invoices"),
      v.literal("rewards"),
      v.literal("trials_used"),
      v.literal("entities"),
      v.literal("referrals")
    )
  )
)

// Customer management
export const GetCustomerArgs = v.object({
  customer_id: v.string(),
  expand: ExpandArgs,
  apiKey: v.string(),
});

export const CreateCustomerArgs = v.object({
  customer_id: v.string(),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  apiKey: v.string(),
  expand: ExpandArgs,
});

export const UpdateCustomerArgs = v.object({
  customer_id: v.string(),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  apiKey: v.string(),
});

export const DeleteCustomerArgs = v.object({
  customer_id: v.string(),
  apiKey: v.string(),
});

export const BillingPortalArgs = v.object({
  customer_id: v.string(),
  return_url: v.optional(v.string()),
  apiKey: v.string(),
});

// Product management
export const GetProductArgs = v.object({
  product_id: v.string(),
  apiKey: v.string(),
});

export const ListProductsArgs = v.object({
  customer_id: v.optional(v.string()),
  apiKey: v.string(),
});

// Referral management
export const CreateReferralCodeArgs = v.object({
  customer_id: v.string(),
  program_id: v.string(),
  apiKey: v.string(),
});

export const RedeemReferralCodeArgs = v.object({
  customer_id: v.string(),
  code: v.string(),
  apiKey: v.string(),
});

// Customer fetching (for backwards compatibility)
export const UserFetchCustomerArgs = v.object({
  expand: v.optional(
    v.array(
      v.union(
        v.literal("invoices"),
        v.literal("rewards"),
        v.literal("trials_used"),
        v.literal("entities"),
        v.literal("referrals")
      )
    )
  ),
});

export const FetchCustomerArgs = v.object({
  customer_id: v.string(),
  customer_data: v.optional(CustomerDataConvex),
  expand: v.optional(
    v.array(
      v.union(
        v.literal("invoices"),
        v.literal("rewards"),
        v.literal("trials_used"),
        v.literal("entities"),
        v.literal("referrals")
      )
    )
  ),
  apiKey: v.string(),
});

// Type exports
export type TrackArgsType = Infer<typeof TrackArgs>;
export type CheckArgsType = Infer<typeof CheckArgs>;
export type AttachArgsType = Infer<typeof AttachArgs>;
export type CheckoutArgsType = Infer<typeof CheckoutArgs>;
export type CancelArgsType = Infer<typeof CancelArgs>;
export type QueryArgsType = Infer<typeof QueryArgs>;
export type UsageArgsType = Infer<typeof UsageArgs>;
export type SetupPaymentArgsType = Infer<typeof SetupPaymentArgs>;

export type UserCreateEntityArgsType = Infer<typeof UserCreateEntityArgs>;
export type UserCreateSingleEntityArgsType = Infer<typeof UserCreateSingleEntityArgs>;
export type CreateEntityArgsType = Infer<typeof CreateEntityArgs>;
export type DeleteEntityArgsType = Infer<typeof DeleteEntityArgs>;
export type UserGetEntityArgsType = Infer<typeof UserGetEntityArgs>;
export type GetEntityArgsType = Infer<typeof GetEntityArgs>;

export type GetCustomerArgsType = Infer<typeof GetCustomerArgs>;
export type CreateCustomerArgsType = Infer<typeof CreateCustomerArgs>;
export type UpdateCustomerArgsType = Infer<typeof UpdateCustomerArgs>;
export type DeleteCustomerArgsType = Infer<typeof DeleteCustomerArgs>;
export type BillingPortalArgsType = Infer<typeof BillingPortalArgs>;

export type GetProductArgsType = Infer<typeof GetProductArgs>;
export type ListProductsArgsType = Infer<typeof ListProductsArgs>;

export type CreateReferralCodeArgsType = Infer<typeof CreateReferralCodeArgs>;
export type RedeemReferralCodeArgsType = Infer<typeof RedeemReferralCodeArgs>;

export type FetchCustomerArgsType = Infer<typeof FetchCustomerArgs>;
export type UserFetchCustomerArgsType = Infer<typeof UserFetchCustomerArgs>;

// Utility function for converting camelCase to snake_case (still needed for API calls)
export function camelToSnake<T>(input: T): any {
  if (Array.isArray(input)) {
    return input.map((item) => camelToSnake(item));
  }
  if (input !== null && typeof input === "object") {
    const result: Record<string, any> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        result[snakeKey] = camelToSnake((input as any)[key]);
      }
    }
    return result;
  }
  return input;
}