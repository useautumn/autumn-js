import { createContext, useContext } from "react";

import { AutumnError, PricingTableProduct } from "../../sdk";
import { AutumnClient } from "./client/ReactAutumnClient";
import { EntityProvider } from "./hooks/useEntityProvider";

export interface AutumnDialogContext {
  props: any;
  setProps: (props: any) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setComponent: (component: any) => void;
}

export interface AutumnContextParams {
  customerProvider: any;

  pricingTableProvider: {
    pricingTableProducts: PricingTableProduct[] | null;
    isLoading: boolean;
    error: AutumnError | null;
    refetch: () => Promise<void>;
  };

  entityProvider: EntityProvider;

  client: AutumnClient;

  paywallDialog: AutumnDialogContext;
  prodChangeDialog: AutumnDialogContext;
}

export const AutumnContext = createContext<AutumnContextParams>({
  customerProvider: null,

  pricingTableProvider: {
    pricingTableProducts: null,
    isLoading: true,
    error: null,
    refetch: () => Promise.resolve(),
  },

  entityProvider: {
    entity: null,
    isLoading: true,
    error: null,
    refetch: () => Promise.resolve(),
    lastParams: null,
  },

  client: new AutumnClient({
    backendUrl: "http://localhost:8000",
  }),

  paywallDialog: {
    props: null,
    setProps: () => {},
    open: false,
    setOpen: () => {},
    setComponent: () => {},
  },

  prodChangeDialog: {
    props: null,
    setProps: () => {},
    open: false,
    setOpen: () => {},
    setComponent: () => {},
  },
});

export const useAutumnContext = () => {
  const context = useContext(AutumnContext);

  if (context === undefined) {
    throw new Error(
      "useAutumnContext must be used within a AutumnContextProvider"
    );
  }

  return context;
};
