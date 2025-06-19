import { BillingPortalParams, CustomerData, EntityData } from "../../sdk";
import { createAutumnClient } from "../server/cusActions";
import { withAuth } from "./auth/withAuth";
import { AttachFeatureOptions } from "src/sdk/general/genTypes";
import { toServerResponse } from "./utils";
import { EntityDataParams } from "../../libraries/react/client/types/clientEntTypes";

export const attachAction = withAuth({
  fn: async ({
    customerId,
    customerData,
    productId,
    entityId,
    options,
    successUrl,
    forceCheckout,
    metadata,
    entityData,
  }: {
    customerId: string;
    customerData?: CustomerData;
    productId: string;
    entityId?: string;
    successUrl?: string;
    options?: AttachFeatureOptions[];
    forceCheckout?: boolean;
    metadata?: Record<string, string>;
    entityData?: EntityDataParams;
  }) => {
    const autumn = createAutumnClient();

    let res = await autumn.attach({
      customer_id: customerId,
      customer_data: customerData,
      product_id: productId,
      success_url: successUrl,
      options,
      force_checkout: forceCheckout,
      metadata,
      entity_id: entityId,
      entity_data: entityData
        ? ({ ...entityData, feature_id: entityData.featureId } as EntityData)
        : undefined,
    });

    return toServerResponse(res);
  },
  withCustomerData: true,
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
    customerData,
    featureId,
    productId,
    entityId,
    requiredBalance,
    sendEvent,
    withPreview,
    entityData,
  }: {
    customerId: string;
    customerData?: CustomerData;
    featureId?: string;
    productId?: string;
    entityId?: string;
    requiredBalance?: number;
    sendEvent?: boolean;
    withPreview?: "raw" | "formatted";
    entityData?: EntityDataParams;
  }) => {
    const autumn = createAutumnClient();

    let res = await autumn.check({
      customer_id: customerId,
      feature_id: featureId,
      product_id: productId,
      entity_id: entityId,
      required_balance: requiredBalance,
      send_event: sendEvent,
      with_preview: withPreview,
      customer_data: customerData,
      entity_data: entityData
        ? ({ ...entityData, feature_id: entityData.featureId } as EntityData)
        : undefined,
    });

    return toServerResponse(res);
  },
  withCustomerData: true,
});

export const trackAction = withAuth({
  fn: async ({
    customerId,
    featureId,
    entityId,
    value,
    eventName,
    idempotencyKey,
    customerData,
    entityData,
  }: {
    customerId: string;
    customerData?: CustomerData;
    featureId?: string;
    entityId?: string;
    value?: number;
    eventName?: string;
    idempotencyKey?: string;
    entityData?: EntityDataParams;
  }) => {
    const autumn = createAutumnClient();
    let res = await autumn.track({
      customer_id: customerId,
      feature_id: featureId,
      entity_id: entityId,
      value,
      event_name: eventName,
      idempotency_key: idempotencyKey,
      customer_data: customerData,
      entity_data: entityData
        ? ({ ...entityData, feature_id: entityData.featureId } as EntityData)
        : undefined,
    });

    return toServerResponse(res);
  },
  withCustomerData: true,
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
    let result = await autumn.referrals.createCode({
      customer_id: customerId,
      program_id: programId,
    });
    return toServerResponse(result);
  },
});

export const redeemReferralCodeAction = withAuth({
  fn: async ({ code, customerId }: { code: string; customerId: string }) => {
    const autumn = createAutumnClient();
    let result = await autumn.referrals.redeemCode({
      code,
      customer_id: customerId,
    });
    return toServerResponse(result);
  },
});
