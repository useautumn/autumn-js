import {
  AttachResult,
  BillingPortalResult,
  CancelResult,
  CheckResult,
  SetupPaymentResult,
  TrackResult,
} from "../../../sdk";
import { AutumnContextParams, useAutumnContext } from "../AutumnContext";
import {
  AttachParams,
  CancelParams,
  CheckParams,
  OpenBillingPortalParams,
  SetupPaymentParams,
  TrackParams,
} from "../client/types/clientGenTypes";
import { AutumnPromise } from "../../../sdk";
import { usePricingTableBase } from "./usePricingTableBase";
import AttachDialog from "@/components/attach-dialog/attach-dialog-synced";
// import AttachDialog from "@/components/attach-dialog/attach-dialog-synced";
// import CheckDialog from "@/components/check-dialog/check-dialog-synced";

export const useAutumnBase = ({
  AutumnContext,
  authClient,
}: {
  AutumnContext: React.Context<AutumnContextParams>;
  authClient?: any;
}) => {
  const context = useAutumnContext({
    AutumnContext,
    name: "useAutumn",
    errorIfNotInitialized: !authClient,
  });
  const { attachDialog, paywallDialog } = context;

  const client = authClient ? authClient.autumn : context.client;
  const authClientExists = !!authClient;
  const { refetch: refetchPricingTable } = usePricingTableBase({
    AutumnContext,
    authClient,
  });

  let {
    open: attachOpen,
    setProps: setAttachProps,
    setOpen: setAttachOpen,
    setComponent: setAttachComponent,
  } = attachDialog;

  let {
    setProps: setCheckProps,
    setOpen: setCheckOpen,
    setComponent: setPaywallComponent,
  } = paywallDialog;

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

    if (setAttachOpen) {
      setAttachOpen(false);
    }

    return result;
  };

  const attachWithDialog = async (
    params: AttachParams
  ): AutumnPromise<AttachResult | CheckResult> => {
    let { dialog, ...rest } = params;

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
      setAttachProps({ preview, attachParams: rest });
      setAttachOpen(true);
    }

    return checkRes;
  };

  const attach = async (params: AttachParams) => {
    const { dialog, openInNewTab } = params;

    let finalDialog = dialog;
    if (dialog && authClientExists) {
      console.error(
        "[Autumn] Attach dialog cannot be used with better auth plugin. To use this, please switch to <AutumnProvider /> and autumnHandler. Learn more here: https://docs.useautumn.com/quickstart/quickstart"
      );
      return undefined as any;
    }

    if (finalDialog && !attachOpen) {
      setAttachComponent(finalDialog);
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

  const check = async (params: CheckParams): AutumnPromise<CheckResult> => {
    let { dialog, withPreview } = params;

    if (dialog && authClientExists) {
      console.error(
        "[Autumn] Check dialog cannot be used with better auth plugin. To use this, please switch to <AutumnProvider /> and autumnHandler. Learn more here: https://docs.useautumn.com/quickstart/quickstart"
      );
      return undefined as any;
    }

    if (dialog) {
      setPaywallComponent(dialog);
    }

    const res = await client.check({
      ...params,
      withPreview: withPreview || dialog ? true : false,
    });

    if (res.error) {
      return res;
    }

    let data = res.data;

    if (data && data.preview && dialog) {
      let preview = data.preview;
      setCheckProps({ preview });
      setCheckOpen(true);
    }

    return res;
  };

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
    check,
    track,
    cancel,
    openBillingPortal,
    setupPayment,
  };
};
