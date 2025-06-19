import {
  attachAction,
  cancelAction,
  checkAction,
  getBillingPortalAction,
  trackAction,
} from "../../server/genActions";

import { useAutumnContext } from "../AutumnContext";
import { AttachParams } from "./types";
import { fetchPricingTableData, toClientErrorResponse } from "../clientUtils";
import { TrackParams } from "../../../libraries/react/client/types/clientGenTypes";
import { EntityDataParams } from "../../../libraries/react/client/types/clientEntTypes";

export const useAutumn = () => {
  const {
    encryptedCustomerId,
    prodChangeDialog,
    paywallDialog,
    pricingTableProducts,
    setPricingTableProducts,
  } = useAutumnContext();

  let {
    setProps: setProdChangeDialogProps,
    setOpen: setProdChangeDialogOpen,
    setComponent: setProdChangeComponent,
  } = prodChangeDialog;

  let {
    setProps: setPaywallDialogProps,
    setOpen: setPaywallDialogOpen,
    setComponent: setPaywallComponent,
  } = paywallDialog;

  const attachWithDialog = async ({
    productId,
    entityId,
    successUrl,
    forceCheckout,
    metadata,
    callback,
    entityData,
    openInNewTab,
  }: AttachParams) => {
    const attachWithoutDialog = async (options?: any) => {
      try {
        await attach({
          productId,
          entityId,
          options,
          successUrl,
          forceCheckout,
          metadata,
          entityData,
          openInNewTab,
        });
      } catch (error) {
        return toClientErrorResponse(error);
      } finally {
        await callback?.();
      }
    };

    // 1. Check product

    const { data, error } = await checkAction({
      encryptedCustomerId,
      productId,
      entityId,
      withPreview: "formatted",
    });

    if (error) {
      return toClientErrorResponse(error);
    }

    let preview = data.preview;

    if (!preview) {
      return await attachWithoutDialog();
    } else {
      setProdChangeDialogProps({
        preview,
      });
      setProdChangeDialogOpen(true);
    }

    return { data: null, error: null };
  };

  const attach = async ({
    productId,
    entityId,
    options,
    successUrl,
    forceCheckout,
    metadata,
    dialog,
    callback,
    entityData,
    openInNewTab,
  }: AttachParams) => {
    if (dialog) {
      setProdChangeComponent(dialog);

      return await attachWithDialog({
        productId,
        entityId,
        successUrl,
        forceCheckout,
        metadata,
        callback,
        entityData,
        openInNewTab,
      });
    }

    let snakeOptions =
      options?.map((option) => ({
        feature_id: option.featureId,
        quantity: option.quantity,
      })) || undefined;

    const result = await attachAction({
      encryptedCustomerId,
      productId,
      entityId,
      options: snakeOptions,
      successUrl,
      forceCheckout,
      metadata,
      entityData,
    });

    if (result.error) {
      return toClientErrorResponse(result.error);
    }

    let data = result.data;

    if (data?.checkout_url && typeof window !== "undefined") {
      if (openInNewTab) {
        window.open(data.checkout_url, "_blank");
      } else {
        window.open(data.checkout_url, "_self");
      }
    }

    try {
      await callback?.();
    } catch (error) {
      return toClientErrorResponse(error);
    }

    if (pricingTableProducts) {
      try {
        await fetchPricingTableData({
          setProducts: setPricingTableProducts,
          encryptedCustomerId,
        });
      } catch (error) {
        console.warn("Failed to fetch pricing table data");
        console.warn(error);
      }
    }

    return result;
  };

  const cancel = async ({
    productId,
    entityId,
  }: {
    productId: string;
    entityId?: string;
  }) => {
    const res = await cancelAction({
      encryptedCustomerId,
      productId,
      entityId,
    });

    if (res.error) {
      return toClientErrorResponse(res.error);
    }

    return res;
  };

  const check = async ({
    featureId,
    productId,
    entityId,
    requiredBalance,
    sendEvent,
    withPreview,
    dialog,
    entityData,
  }: {
    featureId?: string;
    productId?: string;
    entityId?: string;
    requiredBalance?: number;
    sendEvent?: boolean;
    withPreview?: "formatted" | "raw";
    dialog?: (data: any) => JSX.Element | React.ReactNode;
    entityData?: EntityDataParams;
  }) => {
    if (dialog) {
      setPaywallComponent(dialog);
    }

    const res = await checkAction({
      encryptedCustomerId,
      featureId,
      productId,
      entityId,
      requiredBalance,
      sendEvent,
      withPreview: dialog ? "formatted" : withPreview,
      entityData,
    });

    if (res.error) {
      return toClientErrorResponse(res.error);
    }

    let data = res.data;

    if (data && data.preview && dialog) {
      let preview = data.preview;

      setPaywallDialogProps({
        preview,
      });

      setPaywallDialogOpen(true);
    }

    return res;
  };

  const track = async (params: TrackParams) => {
    const {
      featureId,
      entityId,
      value,
      eventName,
      idempotencyKey,
      entityData,
    } = params;
    const res = await trackAction({
      encryptedCustomerId,
      featureId,
      entityId,
      value,
      eventName,
      idempotencyKey,
      entityData,
    });

    if (res.error) {
      return toClientErrorResponse(res.error);
    }

    return res;
  };

  const openBillingPortal = async (options?: { returnUrl?: string }) => {
    const result = await getBillingPortalAction({
      encryptedCustomerId,
      params: {
        return_url: options?.returnUrl,
      },
    });

    if (result.error) {
      return toClientErrorResponse(result.error);
    }

    let data = result.data;

    if (data?.url && typeof window !== "undefined") {
      window.open(data.url, "_blank");
      return result;
    } else {
      return result;
    }
  };

  // 2. Create a client
  return {
    attach,
    check,
    track,
    cancel,
    openBillingPortal,
  };
};
