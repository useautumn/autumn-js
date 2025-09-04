import { AutumnContext } from "../../../libraries/react/AutumnContext";
import {
  type UseCustomerParams,
  type UseCustomerResult,
  useCustomerBase,
} from "../../../libraries/react/hooks/useCustomerBase";

export const useCustomer = (params?: UseCustomerParams): UseCustomerResult => {
	return useCustomerBase({
		params,
		AutumnContext: AutumnContext,
	});
};
