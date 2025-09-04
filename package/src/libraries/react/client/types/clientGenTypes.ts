import { QueryRangeEnum } from "@sdk";
import { z } from "zod/v4";

export const CancelParamsSchema = z.object({
  productId: z.string(),
  entityId: z.string().optional(),
  cancelImmediately: z.boolean().optional(),
});

export type CancelParams = z.infer<typeof CancelParamsSchema>;

// Add interfaces for function params
export const CheckParamsSchema = z.object({
  featureId: z.string().optional(),
  productId: z.string().optional(),
  entityId: z.string().optional(),
  requiredBalance: z.number().optional(),
  sendEvent: z.boolean().optional(),
  withPreview: z.boolean().optional(),
  dialog: z.any().optional(),
  entityData: z.any().optional(),
});

export type CheckParams = z.infer<typeof CheckParamsSchema>;

export const TrackParamsSchema = z.object({
  featureId: z.string().optional(),
  eventName: z.string().optional(),
  entityId: z.string().optional(),
  value: z.number().optional(),
  idempotencyKey: z.string().optional(),
  entityData: z.any().optional(),
});

export type TrackParams = z.infer<typeof TrackParamsSchema>;

export const OpenBillingPortalParamsSchema = z.object({
  returnUrl: z.string().optional(),
  openInNewTab: z.boolean().optional(),
});

export type OpenBillingPortalParams = z.infer<typeof OpenBillingPortalParamsSchema>;

export const SetupPaymentParamsSchema = z.object({
  successUrl: z.string().optional(),
  checkoutSessionParams: z.record(z.string(), z.any()).optional(),
  openInNewTab: z.boolean().optional(),
});

export type SetupPaymentParams = z.infer<typeof SetupPaymentParamsSchema>;

export const QueryParamsSchema = z.object({
  featureId: z.string().or(z.array(z.string())),
  range: QueryRangeEnum.optional(),
});

export type QueryParams = z.infer<typeof QueryParamsSchema>;
