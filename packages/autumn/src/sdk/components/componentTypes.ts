export interface GetPricingTableParams {
  customer_id?: string;
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

// export interface PricecnClientProduct {
//   id: string;
//   description?: string;
//   buttonText?: string;
//   recommendText?: string;
//   onClick?: any;
//   href?: string;
// }
