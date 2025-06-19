import { EntityDataParams } from "./clientEntTypes";

// Attach
export interface AttachFeatureOptions {
  featureId: string;
  quantity: number;
}

export interface AttachParams {
  productId: string;
  entityId?: string;
  options?: AttachFeatureOptions[];
  productIds?: string[]; // If set, will attach multiple products to the customer (cannot be used with productId)
  freeTrial?: boolean; // Default is true -- if set to false, will bypass product free trial
  successUrl?: string; // Passed to Stripe
  metadata?: Record<string, string>; // Passed to Stripe
  forceCheckout?: boolean; // Default is false -- if set to true, will force the customer to checkout (not allowed for upgrades / downgrades)
  dialog?: (data: any) => JSX.Element | React.ReactNode;
  callback?: () => Promise<void> | void;
  entityData?: EntityDataParams;
  openInNewTab?: boolean;
}

export interface CancelParams {
  productId: string;
  entityId?: string;
}

// Add interfaces for function params
export interface CheckParams {
  featureId?: string;
  productId?: string;
  entityId?: string;
  requiredBalance?: number;
  sendEvent?: boolean;
  withPreview?: "formatted" | "raw";
  dialog?: (data: any) => JSX.Element | React.ReactNode;
  entityData?: EntityDataParams;
}

export interface TrackParams {
  featureId?: string;
  eventName?: string;
  entityId?: string;
  value?: number;
  idempotencyKey?: string;
  entityData?: EntityDataParams;
}

export interface OpenBillingPortalParams {
  returnUrl?: string;
}
