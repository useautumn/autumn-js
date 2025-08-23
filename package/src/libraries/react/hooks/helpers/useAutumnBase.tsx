import {
  BillingPortalResult,
  CancelResult,
  CheckResult,
  SetupPaymentResult,
  TrackResult,
} from "@sdk";
import { AutumnContextParams } from "@/AutumnContext";
import {
  CancelParams,
  CheckParams,
  OpenBillingPortalParams,
  SetupPaymentParams,
  TrackParams,
} from "@/client/types/clientGenTypes";
import { AutumnPromise } from "@sdk";
import { usePricingTableBase } from "../usePricingTableBase";
import { AttachResult } from "@sdk/general/attachTypes";
import { AttachParams, CheckoutParams } from "@/client/types/clientAttachTypes";
import { AutumnClient } from "@/client/ReactAutumnClient";
import { ConvexAutumnClient } from "@/client/ConvexAutumnClient";

export const useAutumnBase = ({
  // AutumnContext,
  context,
  client,
  refetchCustomer,
}: {
  // AutumnContext: React.Context<AutumnContextParams>;
  context?: AutumnContextParams;
  client: AutumnClient | ConvexAutumnClient;
  refetchCustomer?: () => Promise<any>;
}) => {
  const { attachDialog, paywallDialog } = context || {};

  const { refetch: refetchPricingTable } = usePricingTableBase({ client });

  const attachWithoutDialog = async (params: AttachParams) => {
    const result = await client.attach(params);

    if (result.error) {
      return result;
    }

    let data = result.data;

    if (data?.checkout_url && typeof window !== "undefined") {
      if (params.openInNewTab) {
        window.open(data.checkout_url, "_blank");
      } else {
        window.location.href = data.checkout_url;
      }
    }

    await refetchPricingTable();
    if (refetchCustomer) {
      await refetchCustomer();
    }

    attachDialog?.setOpen(false);

    return result;
  };

  const checkout = async (params: CheckoutParams) => {
    const { data, error } = await client.checkout(params);

    const { dialog, ...rest } = params;

    if (error) {
      return { data, error };
    }

    const hasPrepaid = data.product.items.some(
      (item: any) => item.usage_model === "prepaid"
    );

    const showDialog = hasPrepaid && params.dialog;

    if (data.url && !showDialog) {
      if (params.openInNewTab) {
        window.open(data.url, "_blank");
      } else {
        window.location.href = data.url;
      }

      return { data, error };
    }

    if (params.dialog) {
      attachDialog?.setProps({ checkoutResult: data, attachParams: rest });
      attachDialog?.setComponent(params.dialog);
      attachDialog?.setOpen(true);
    }

    return { data, error };
  };

  const attachWithDialog = async (
    params: AttachParams
  ): AutumnPromise<AttachResult | CheckResult> => {
    let { ...rest } = params;

    const { productId, entityId, entityData } = params;

    const checkRes = await client.check({
      productId,
      entityId,
      entityData,
      withPreview: true,
    });

    if (checkRes.error) {
      return checkRes;
    }

    let preview = checkRes.data.preview;

    if (!preview) {
      return await attachWithoutDialog(rest);
    } else {
      attachDialog?.setProps({ preview, attachParams: rest });
      attachDialog?.setOpen(true);
    }

    return checkRes;
  };

  const attach = async (params: AttachParams) => {
    const { dialog } = params;

    if (dialog && !attachDialog?.open) {
      attachDialog?.setComponent(dialog);
      return await attachWithDialog(params);
    }

    return await attachWithoutDialog(params);
  };

  const cancel = async (params: CancelParams): AutumnPromise<CancelResult> => {
    const res = await client.cancel(params);

    if (res.error) {
      return res;
    }

    return res;
  };

  // const check = async (params: CheckParams): AutumnPromise<CheckResult> => {
  //   let { dialog, withPreview } = params;

  //   if (dialog) {
  //     paywallDialog?.setComponent(dialog);
  //   }

  //   const res = await client.check({
  //     ...params,
  //     withPreview: withPreview || dialog ? true : false,
  //   });

  //   if (res.error) {
  //     return res;
  //   }

  //   let data = res.data;

  //   if (data && data.preview && dialog) {
  //     let preview = data.preview;
  //     paywallDialog?.setProps({ preview });
  //     paywallDialog?.setOpen(true);
  //   }

  //   return res;
  // };

  const track = async (params: TrackParams): AutumnPromise<TrackResult> => {
    const res = await client.track(params);

    if (res.error) {
      return res;
    }

    return res;
  };

  const openBillingPortal = async (
    params?: OpenBillingPortalParams
  ): AutumnPromise<BillingPortalResult> => {
    let defaultParams = {
      openInNewTab: false,
    };

    let finalParams = {
      ...defaultParams,
      ...params,
    };

    const res = await client.openBillingPortal(finalParams);

    if (res.error) {
      return res;
    }

    let data = res.data;

    if (data?.url && typeof window !== "undefined") {
      if (finalParams.openInNewTab) {
        window.open(data.url, "_blank");
      } else {
        window.open(data.url, "_self");
      }

      return res;
    } else {
      return res;
    }
  };

  const setupPayment = async (
    params?: SetupPaymentParams
  ): AutumnPromise<SetupPaymentResult> => {
    let defaultParams = {
      openInNewTab: false,
    };

    let finalParams = {
      ...defaultParams,
      ...(params || {}),
    };

    const res = await client.setupPayment(finalParams);

    if (res.data?.url && typeof window !== "undefined") {
      if (finalParams.openInNewTab) {
        window.open(res.data.url, "_blank");
      } else {
        window.open(res.data.url, "_self");
      }

      return res;
    } else {
      return res;
    }
  };

  return {
    attach,
    track,
    cancel,
    openBillingPortal,
    setupPayment,
    checkout,
  };
};
