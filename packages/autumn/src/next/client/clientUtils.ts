import { getPricingTableAction } from "../server/componentActions";
import { AutumnClientError, PricingTableProduct } from "./types";

export const toClientErrorResponse = (error: any) => {
  let msg = "Unknown error";
  let code = "unknown";

  if (error?.message) {
    msg = error.message;
  }
  if (error?.code) {
    code = error.code;
  }

  console.error("Autumn Error: ", msg);
  return {
    data: null,
    error: new AutumnClientError({ message: msg, code: code }),
  };
};

export const toClientError = (error: any, log = true) => {
  let msg = "Unknown error";
  let code = "unknown";
  if (error?.message) {
    msg = error.message;
  }
  if (error?.code) {
    code = error.code;
  }
  if (log) {
    console.error("Autumn Error: ", msg);
  }
  return new AutumnClientError({ message: msg, code });
};

export const fetchPricingTableData = async ({
  setIsLoading,
  setError,
  setProducts,
  encryptedCustomerId,
}: {
  setIsLoading?: (isLoading: boolean) => void;
  setError?: (error: any) => void;
  setProducts: (products: PricingTableProduct[]) => void;
  encryptedCustomerId?: string;
}) => {
  let returnData: PricingTableProduct[] | null = null;
  try {
    if (setIsLoading) {
      setIsLoading(true);
    }
    const res = await getPricingTableAction({
      encryptedCustomerId,
    });

    if (res.error) {
      if (setError) {
        setError(res.error);
      }
      return res;
    }

    let products = res.data.list;

    setProducts(products);
    returnData = products;
  } catch (error) {
    if (setError) {
      setError(error);
    }
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
  return returnData;
};
