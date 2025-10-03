import { AutumnClient } from "@/client/ReactAutumnClient";
import useSWR from "swr";

export const useProductsBase = ({ client }: { client: AutumnClient }) => {
  const fetcher = async () => {
    const data = await client.products.list();
    return data?.list || [];
  };

  const queryKey = [`products`];

  const { data, error, isLoading } = useSWR(queryKey, fetcher, {
    refreshInterval: 0,
    shouldRetryOnError: false,
  });

  return { products: data, error, isLoading };
};
