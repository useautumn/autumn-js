import React from "react";
import { EntityDataParams } from "../../../libraries/react/client/types/clientEntTypes";

export interface AttachParams {
  productId: string;
  entityId?: string;
  options?: {
    featureId: string;
    quantity: number;
  }[];
  successUrl?: string;
  forceCheckout?: boolean;
  metadata?: Record<string, string>;
  dialog?: () => JSX.Element | React.ReactNode;

  callback?: () => Promise<void>;
  withPreview?: "formatted" | "raw";
  entityData?: EntityDataParams;
  openInNewTab?: boolean;
}

export interface CreateEntityParams {
  id: string;
  name: string;
  featureId: string;
}
