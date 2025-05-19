import { BillingPortalParams } from "src/sdk";
import { createAutumnClient } from "../server/cusActions";
import { withAuth } from "./auth/withAuth";
import { AttachFeatureOptions } from "src/sdk/general/genTypes";
import { toServerResponse } from "./utils";

export const attachAction = withAuth({
  fn: async ({
    customerId,
    productId,
    entityId,
    options,
    successUrl,
    forceCheckout,
    metadata,
  }: {
    customerId: string;
    productId: string;
    entityId?: string;
    successUrl?: string;
    options?: AttachFeatureOptions[];
    forceCheckout?: boolean;
    metadata?: Record<string, string>;
  }) => {
    const autumn = createAutumnClient();

    let res = await autumn.attach({
      customer_id: customerId,
      product_id: productId,
      entity_id: entityId,
      success_url: successUrl,
      options,
      force_checkout: forceCheckout,
      metadata,
    });

    return toServerResponse(res);
  },
});

export const cancelAction = withAuth({
  fn: async ({
    customerId,
    productId,
    entityId,
  }: {
    customerId: string;
    productId: string;
    entityId?: string;
  }) => {
    const autumn = createAutumnClient();
    let res = await autumn.cancel({
      customer_id: customerId,
      product_id: productId,
      entity_id: entityId,
    });

    return toServerResponse(res);
  },
});

export const checkAction = withAuth({
  fn: async ({
    customerId,
    featureId,
    productId,
    entityId,
    requiredQuantity,
    sendEvent,
    withPreview,
  }: {
    customerId: string;
    featureId?: string;
    productId?: string;
    entityId?: string;
    requiredQuantity?: number;
    sendEvent?: boolean;
    withPreview?: "raw" | "formatted";
  }) => {
    const autumn = createAutumnClient();

    let res = await autumn.check({
      customer_id: customerId,
      feature_id: featureId,
      product_id: productId,
      entity_id: entityId,
      required_quantity: requiredQuantity,
      send_event: sendEvent,
      with_preview: withPreview,
    });

    return toServerResponse(res);
  },
});

export const trackAction = withAuth({
  fn: async ({
    customerId,
    featureId,
    entityId,
    value,
    eventName,
    idempotencyKey,
  }: {
    customerId: string;
    featureId?: string;
    entityId?: string;
    value?: number;
    eventName?: string;
    idempotencyKey?: string;
  }) => {
    const autumn = createAutumnClient();
    let res = await autumn.track({
      customer_id: customerId,
      feature_id: featureId,
      entity_id: entityId,
      value,
      event_name: eventName,
      idempotency_key: idempotencyKey,
    });

    return toServerResponse(res);
  },
});

export const getBillingPortalAction = withAuth({
  fn: async ({
    customerId,
    params,
  }: {
    customerId: string;
    params?: BillingPortalParams;
  }) => {
    const autumn = createAutumnClient();
    let result = await autumn.customers.billingPortal(customerId, params);
    return toServerResponse(result);
  },
});

export const generateReferralCodeAction = withAuth({
  fn: async ({
    customerId,
    programId,
  }: {
    customerId: string;
    programId: string;
  }) => {
    const autumn = createAutumnClient();
    let result = await autumn.customers.generateReferralCode({
      customer_id: customerId,
      program_id: programId,
    });
    return toServerResponse(result);
  },
});

export const redeemReferralCodeAction = withAuth({
  fn: async ({ code, customerId }: { code: string; customerId: string }) => {
    const autumn = createAutumnClient();
    let result = await autumn.customers.redeemReferralCode({
      code,
      customer_id: customerId,
    });
    return toServerResponse(result);
  },
});
