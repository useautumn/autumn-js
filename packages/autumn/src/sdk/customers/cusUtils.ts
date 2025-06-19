import { AutumnError } from "../error";
import { CreateCustomerParams } from "./cusTypes";

export const validateCreateCustomer = (params: CreateCustomerParams) => {
  if (!params.email && !params.id) {
    throw new AutumnError({
      message: "Email or id is required",
      code: "invalid_params",
    });
  }
};
