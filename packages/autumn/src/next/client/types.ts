import { Customer, CustomerData } from "src/sdk";
import { Entity } from "src/sdk/customers/entities/entTypes";

export interface ProductDetails {
  id: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  recommendText?: string;
}

export interface PricingTableProduct {
  id: string;
  name: string;
  buttonText: string;

  price: {
    primaryText: string;
    secondaryText?: string;
  };

  items: {
    primaryText: string;
    secondaryText?: string;
  }[];
}

export class AutumnClientError extends Error {
  code: string;
  constructor({ message, code }: { message: string; code: string }) {
    super(message);
    this.code = code;
  }

  toString() {
    return `${this.message} (${this.code})`;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export interface AutumnContextParams {
  encryptedCustomerId?: string;
  customerData?: CustomerData;
  authProvider?: "clerk" | "better-auth";
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  entity: Entity | null;
  setEntity: (entity: Entity | null) => void;
  entityId?: string;
  prodChangeDialog: {
    found: boolean;
    setProps: (props: any) => void;
    setOpen: (open: boolean) => void;
    setComponent: (component: any) => void;
  };
  paywallDialog: {
    found: boolean;
    setProps: (props: any) => void;
    setOpen: (open: boolean) => void;
    setComponent: (component: any) => void;
  };
  pricingTableProducts: PricingTableProduct[] | null;
  setPricingTableProducts: (products: PricingTableProduct[]) => void;
}

export interface AutumnProviderProps extends AutumnContextParams {
  children?: React.ReactNode;
}
