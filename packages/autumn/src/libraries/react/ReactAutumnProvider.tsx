import { BaseAutumnProvider } from "./BaseAutumnProvider";
import { AutumnClient } from "./client/ReactAutumnClient";
import { CustomerData } from "../../sdk";

export const ReactAutumnProvider = ({
  children,
  getBearerToken,
  backendUrl,
  customerData,
  includeCredentials = true,
}: {
  children: React.ReactNode;
  getBearerToken?: () => Promise<string | null | undefined>;
  backendUrl: string;
  customerData?: CustomerData;
  includeCredentials?: boolean;
}) => {
  let client = new AutumnClient({
    backendUrl,
    getBearerToken,
    customerData,
    includeCredentials,
  });

  return <BaseAutumnProvider client={client}>{children}</BaseAutumnProvider>;
};
