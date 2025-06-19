import { AttachResult, CheckResult } from "src/sdk";
import { useAutumnContext } from "../AutumnContext";
import {
  AttachParams,
  CheckParams,
  OpenBillingPortalParams,
  TrackParams,
} from "../client/types/clientGenTypes";
import { AutumnPromise } from "../../../sdk";

export const useAutumn = () => {
  const { client } = useAutumnContext();
  const {
    prodChangeDialog,
    paywallDialog,
    pricingTableProvider,
    customerProvider,
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

  const attachWithDialog = async (
    params: AttachParams
  ): AutumnPromise<AttachResult | CheckResult> => {
    const attachWithoutDialog = async (options?: any) => {
      let { dialog, ...rest } = params;
      return await attach(rest);
    };

    const { productId, entityId, entityData } = params;

    const checkRes = await client.check({
      productId,
      entityId,
      entityData,
      withPreview: "formatted",
    });

    if (checkRes.error) {
      return checkRes;
    }

    let preview = checkRes.data.preview;

    if (!preview) {
      return await attachWithoutDialog();
    } else {
      setProdChangeDialogProps({
        preview,
      });
      setProdChangeDialogOpen(true);
    }

    return checkRes;
  };

  const attach = async (params: AttachParams) => {
    const {
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
    } = params;

    if (dialog) {
      setProdChangeComponent(dialog);

      return await attachWithDialog(params);
    }

    const result = await client.attach({
      productId,
      entityId,
      successUrl,
      forceCheckout,
      metadata,
      options,
      dialog,
      callback,
      entityData,
    });

    if (result.error) {
      return result;
    }

    let data = result.data;

    if (data?.checkout_url && typeof window !== "undefined") {
      if (openInNewTab) {
        window.open(data.checkout_url, "_blank");
      } else {
        window.location.href = data.checkout_url;
      }
    }

    try {
      await callback?.();
    } catch (error) {
      return result;
    }

    await Promise.all([
      pricingTableProvider.pricingTableProducts
        ? pricingTableProvider.refetch().catch((error: any) => {
            console.warn("Failed to refetch pricing table data");
            console.warn(error);
          })
        : Promise.resolve(),
      customerProvider.refetchFirstTwo(),
    ]);

    if (setProdChangeDialogOpen) {
      setProdChangeDialogOpen(false);
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
    const res = await client.cancel({
      productId,
      entityId,
    });

    if (res.error) {
      return res;
    }

    return res;
  };

  const check = async (params: CheckParams) => {
    let { dialog, withPreview } = params;

    if (dialog) {
      setPaywallComponent(dialog);
    }

    const res = await client.check({
      ...params,
      withPreview: withPreview || dialog ? "formatted" : undefined,
    });

    if (res.error) {
      return res;
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
    const res = await client.track(params);

    if (res.error) {
      return res;
    }

    return res;
  };

  const openBillingPortal = async (params?: OpenBillingPortalParams) => {
    const res = await client.openBillingPortal(params);

    if (res.error) {
      return res;
    }

    let data = res.data;

    if (data?.url && typeof window !== "undefined") {
      window.open(data.url, "_blank");
      return res;
    } else {
      return res;
    }
  };

  return {
    attach,
    check,
    track,
    cancel,
    openBillingPortal,
  };
};
