import type { ProductItem } from "@sdk/products/prodTypes";
import type { AppEnv } from "../general/genEnums";
import { ProductItemInterval } from "../products/prodEnums";
import {
  CustomerExpandEnum,
  type CustomerExpandOption,
  type ProductStatus,
} from "./cusEnums";
import { z } from "zod/v4";

export const CoreCusFeatureSchema = z.object({
  unlimited: z.boolean().optional(),
  interval: z.enum(ProductItemInterval).optional(),
  balance: z.number().nullish(),
  usage: z.number().optional(),
  included_usage: z.number().optional(),
  next_reset_at: z.number().nullish(),
  overage_allowed: z.boolean().optional(),
  usage_limit: z.number().optional(),

  rollovers: z
    .object({
      balance: z.number(),
      expires_at: z.number(),
    })
    .optional(),

  breakdown: z
    .array(
      z.object({
        interval: z.enum(ProductItemInterval),
        balance: z.number().optional(),
        usage: z.number().optional(),
        included_usage: z.number().optional(),
        next_reset_at: z.number().optional(),
      })
    )
    .optional(),

  credit_schema: z
    .array(
      z.object({
        feature_id: z.string(),
        credit_amount: z.number(),
      })
    )
    .optional(),
});

export type CoreCustomerFeature = z.infer<typeof CoreCusFeatureSchema>;

// export interface CoreCustomerFeature {
//   unlimited?: boolean;
//   interval?: ProductItemInterval | null;
//   balance?: number;
//   usage?: number;
//   included_usage?: number;
//   next_reset_at?: number | null;
//   overage_allowed?: boolean;
//   usage_limit?: number;

//   breakdown?: {
//     interval: ProductItemInterval;
//     balance?: number;
//     usage?: number;
//     included_usage?: number;
//     next_reset_at?: number;
//   }[];

//   credit_schema?: {
//     feature_id: string;
//     credit_amount: number;
//   }[];
// }

export interface CustomerFeature extends CoreCustomerFeature {
  id: string;
  name: string;
  type: "static" | "single_use" | "continuous_use";
}

export interface CustomerProduct {
  id: string;
  name: string | null;
  group: string | null;
  status: ProductStatus;
  started_at: number;
  canceled_at: number | null;
  version: number;

  subscription_ids?: string[] | null;
  current_period_start?: number | null;
  current_period_end?: number | null;

  trial_ends_at?: number;
  entity_id?: string;

  is_add_on: boolean;
  is_default: boolean;

  items: ProductItem[];
}

export interface Customer {
  // Internal fields
  id: string | null;
  created_at: number;
  name: string | null;
  email: string | null;
  fingerprint: string | null;
  stripe_id: string | null;
  env: AppEnv;
  metadata: Record<string, any>;

  products: CustomerProduct[];
  features: Record<string, CustomerFeature>;
  invoices?: CustomerInvoice[];
  payment_method?: any;
}

export const CustomerDataSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  fingerprint: z.string().nullish(),
});

export type CustomerData = z.infer<typeof CustomerDataSchema>;

export interface GetCustomerParams {
  expand?: CustomerExpandOption[];
}

export const CreateCustomerParamsSchema = z.object({
  id: z.string().nullish(),
  email: z.string().nullish(),
  name: z.string().nullish(),
  fingerprint: z.string().nullish(),
  metadata: z.record(z.string(), z.any()).optional(),
  expand: z.array(CustomerExpandEnum).optional(),
});

export type CreateCustomerParams = z.infer<typeof CreateCustomerParamsSchema>;

// export interface CreateCustomerParams {
//   id?: string | null;
//   email?: string | null;
//   name?: string | null;
//   fingerprint?: string | null;
//   metadata?: Record<string, any>;
//   expand?: CustomerExpandOption[];
// }

export interface UpdateCustomerParams {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  fingerprint?: string | null;
}

export const BillingPortalParamsSchema = z.object({
  return_url: z.string().optional(),
});

export type BillingPortalParams = z.infer<typeof BillingPortalParamsSchema>;

export interface BillingPortalResult {
  customer_id: string;
  url: string;
}

export interface CustomerInvoice {
  product_ids: string[];
  stripe_id: string;
  status: string;
  total: number;
  currency: string;
  created_at: number;
  hosted_invoice_url: string;
}

export const UpdateBalancesParamsSchema = z
  .object({
    feature_id: z.string(),
    balance: z.number(),
  })
  .or(
    z.array(
      z.object({
        feature_id: z.string(),
        balance: z.number(),
      })
    )
  );

export type UpdateBalancesParams = z.infer<typeof UpdateBalancesParamsSchema>;
export type UpdateBalancesResult = { success: boolean };

export const DeleteCustomerParamsSchema = z.object({
  delete_in_stripe: z.boolean().optional(),
});

export type DeleteCustomerParams = z.infer<typeof DeleteCustomerParamsSchema>;