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
