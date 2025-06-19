import { Autumn } from "../client";
import { AutumnPromise } from "../response";
import { GetPricingTableParams, PricingTableProduct } from "./componentTypes";

export const fetchPricingTable = async ({
  instance,
  params,
}: {
  instance: Autumn;
  params?: GetPricingTableParams;
}): AutumnPromise<PricingTableProduct[]> => {
  let path = "/components/pricing_table";

  if (params) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "products") {
        continue;
      }
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    const queryString = queryParams.toString();
    if (queryString) {
      path += `?${queryString}`;
    }
  }
  return await instance.get(path);
};
