import { AutumnClient } from "./ReactAutumnClient";
import { AutumnPromise, PricingTableProduct } from "../../../sdk";

export async function getPricingTableMethod(this: AutumnClient): AutumnPromise<{
  list: PricingTableProduct[];
}> {
  const res = await this.get("/api/autumn/components/pricing_table");
  return res;
}
