import { CustomerData } from "../customers/cusTypes";
import { EntityData } from "../customers/entities/entTypes";
import { CheckProductFormattedPreview } from "./checkTypes";
import { CheckFeatureFormattedPreview } from "./checkTypes";

// Attach
export interface AttachFeatureOptions {
  feature_id: string;
  quantity: number;
}

export interface AttachParams {
  customer_id: string;
  product_id: string;
  entity_id?: string;
  options?: AttachFeatureOptions[];

  product_ids?: string[]; // If set, will attach multiple products to the customer (cannot be used with product_id)
  free_trial?: boolean; // Default is true -- if set to false, will bypass product free trial
  success_url?: string; // Passed to Stripe
  metadata?: Record<string, string>; // Passed to Stripe
  force_checkout?: boolean; // Default is false -- if set to true, will force the customer to checkout (not allowed for upgrades / downgrades)

  customer_data?: CustomerData;
  entity_data?: EntityData;
}

export interface CancelParams {
  customer_id: string;
  product_id: string;
  entity_id?: string;
}

export interface CancelResult {
  success: boolean;
  customer_id: string;
  product_id: string;
}

export interface AttachResult {
  checkout_url?: string;
  customer_id: string;
  product_ids: string[];
  code: string;
  message: string;
  customer_data?: CustomerData;
}

// Events
export interface TrackParams {
  customer_id: string;
  value?: number; // Defaults to 1

  feature_id?: string;
  event_name?: string;
  entity_id?: string;
  customer_data?: CustomerData;
  idempotency_key?: string;
  entity_data?: EntityData;
}

export interface TrackResult {
  id: string; // Event ID
  code: string; // Success code
  customer_id: string; // Customer ID

  feature_id?: string; // Feature ID
  event_name?: string; // Event name
}

// Entitled
export interface CheckParams {
  customer_id: string;
  feature_id?: string;
  product_id?: string;
  entity_id?: string;
  customer_data?: CustomerData;
  required_balance?: number;
  send_event?: boolean;
  with_preview?: "raw" | "formatted";
  entity_data?: EntityData;
}

export interface CheckResult {
  customer_id: string; // Customer ID
  allowed: boolean; // Whether the customer is allowed to use the feature
  code: string; // Success code

  // Feature return values
  feature_id?: string; // Feature ID
  required_balance?: number; // Required balance for the feature
  unlimited?: boolean; // Whether the feature is unlimited
  balance?: number | null; // Balance for the feature

  // Product return values
  product_id?: string; // Product ID
  status?: string; // Status of the product...

  // Preview
  preview?: CheckProductFormattedPreview | CheckFeatureFormattedPreview;
}

export interface EntitledBalance {
  feature_id: string;
  unlimited: boolean;
  balance: number | null;
  usage_allowed: boolean;
  required?: number | null;
}

export interface UsageParams {
  customer_id: string;
  feature_id: string;
  value: number;
  customer_data?: CustomerData;
}

export interface UsageResult {
  code: string; // Success code
  customer_id: string; // Customer ID
  feature_id: string; // Feature ID
}
