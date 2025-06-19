import { withAuth } from "./auth/withAuth";
import { createAutumnClient } from "./cusActions";
import { fetchPricingTable } from "../../sdk";
import { toServerResponse } from "./utils";

export const getPricingTableAction = withAuth({
  fn: async ({ customerId }) => {
    let autumn = createAutumnClient();

    const res = await fetchPricingTable({
      instance: autumn,
      params: {
        customer_id: customerId,
      },
    });

    return toServerResponse(res);
  },
  requireCustomer: false,
});
