import { useEffect, useState } from "react";
import { useAutumnContext } from "../AutumnContext";
import { PricingTableProduct, ProductDetails } from "../types";
import { fetchPricingTableData } from "../clientUtils";

const mergeProductDetails = (
  products: any[] | null,
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
  const { encryptedCustomerId, pricingTableProducts, setPricingTableProducts } =
    useAutumnContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProducts = async () => {
    let returnData: PricingTableProduct[] | null = null;
    returnData = await fetchPricingTableData({
      setIsLoading,
      setError,
      setProducts: setPricingTableProducts,
      encryptedCustomerId,
    });

    return returnData;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: mergeProductDetails(
      pricingTableProducts,
      options?.productDetails
    ),
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
