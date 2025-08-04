import { BaseAutumnProvider } from "./BaseAutumnProvider";
import { AutumnClient } from "./client/ReactAutumnClient";
import { CustomerData } from "../../sdk";
import { AutumnContext } from "./AutumnContext";
import { useEffect } from "react";

const getBackendUrl = (backendUrl?: string) => {
  if (backendUrl) {
    return backendUrl;
  }

  if (backendUrl && !backendUrl.startsWith("http")) {
    console.warn(`backendUrl is not a valid URL: ${backendUrl}`);
  }

  return "";
};

export const ReactAutumnProvider = ({
  children,
  getBearerToken,
  backendUrl,
  customerData,
  includeCredentials,
  betterAuthUrl,
  customHeaders,
  corsOrigin,
}: {
  children: React.ReactNode;
  getBearerToken?: () => Promise<string | null | undefined>;
  backendUrl?: string;
  customerData?: CustomerData;
  includeCredentials?: boolean;
  betterAuthUrl?: string;
  customHeaders?: Record<string, string>;
  corsOrigin?: string;
}) => {
  let client = new AutumnClient({
    backendUrl: getBackendUrl(backendUrl),
    getBearerToken,
    customerData,
    includeCredentials,
    betterAuthUrl,
    customHeaders,
    corsOrigin,
  });

  return (
    <BaseAutumnProvider client={client} AutumnContext={AutumnContext}>
      {children}
    </BaseAutumnProvider>
  );
};
