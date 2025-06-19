import { createContext, useContext } from "react";
import { AutumnContextParams } from "./types";

export const AutumnContext = createContext<AutumnContextParams>({
  encryptedCustomerId: "",
  customerData: {},

  entity: null,
  setEntity: () => {},

  customer: null,
  setCustomer: () => {},
  prodChangeDialog: {
    found: false,
    setProps: () => {},
    setOpen: () => {},
    setComponent: () => {},
  },
  paywallDialog: {
    found: false,
    setProps: () => {},
    setOpen: () => {},
    setComponent: () => {},
  },
  pricingTableProducts: null,
  setPricingTableProducts: () => {},
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
