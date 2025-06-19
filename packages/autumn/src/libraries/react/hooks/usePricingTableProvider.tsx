import { useState } from "react";
import { AutumnClient } from "../client/ReactAutumnClient";
import { AutumnError, PricingTableProduct } from "../../../sdk";

export const usePricingTableProvider = ({
  client,
}: {
  client: AutumnClient;
}) => {
  const [pricingTableProducts, setPricingTableProducts] = useState<
    PricingTableProduct[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AutumnError | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await client.getPricingTable();

      if (error) {
        setError(error);
        setPricingTableProducts(null);
      } else {
        setPricingTableProducts(data?.list || []);
        setError(null);
      }
    } catch (error) {
      setError(
        new AutumnError({
          message: "Failed to fetch pricing table products",
          code: "failed_to_fetch_pricing_table_products",
        })
      );
      setPricingTableProducts(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pricingTableProducts,
    isLoading: isLoading && !pricingTableProducts,
    error,
    refetch: fetchProducts,
  };
};
