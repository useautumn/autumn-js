import { useAutumnContext } from "../AutumnContext";
import {
  PricingTableProduct,
  ProductDetails,
} from "../client/types/clientPricingTableTypes";
import { useEffect } from "react";

const mergeProductDetails = (
  products: PricingTableProduct[] | undefined,
  productDetails?: ProductDetails[]
) => {
  if (!products) {
    return null;
  }

  if (!productDetails) {
    return products;
  }

  let mergedProducts = structuredClone(products);

  for (const product of productDetails) {
    let index = mergedProducts.findIndex((p) => p.id === product.id);
    if (index == -1) {
      console.warn(`Product with id ${product.id} not found`);
      continue;
    }

    mergedProducts[index] = {
      ...mergedProducts[index],
      ...product,
    };
  }

  return mergedProducts;
};

export const usePricingTable = (options?: {
  productDetails: {
    id: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
    recommendText?: string;
  }[];
}) => {
  const { pricingTableProvider } = useAutumnContext();
  const { pricingTableProducts, isLoading, error, refetch } =
    pricingTableProvider;

  useEffect(() => {
    if (!pricingTableProducts) {
      refetch();
    }
  }, [pricingTableProducts]);

  return {
    products: mergeProductDetails(
      pricingTableProducts || undefined,
      options?.productDetails
    ),
    isLoading: isLoading && !pricingTableProducts,
    error,
    refetch,
  };
};
