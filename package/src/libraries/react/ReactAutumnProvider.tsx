import { BaseAutumnProvider } from "./BaseAutumnProvider";
import { AutumnClient } from "./client/ReactAutumnClient";
import { CustomerData } from "../../sdk";
import { AutumnContext } from "./AutumnContext";
import { useEffect } from "react";
import { IAutumnClient } from "./client/ReactAutumnClient";
import { ConvexAutumnClient } from "./client/ConvexAutumnClient";

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
  headers,
  convexApi,
  convexUrl,
}: {
  children: React.ReactNode;
  getBearerToken?: () => Promise<string | null>;
  backendUrl?: string;
  customerData?: CustomerData;
  includeCredentials?: boolean;
  betterAuthUrl?: string;
  headers?: Record<string, string>;
  convexApi?: any; // The exported autumn.api() object from Convex
  convexUrl?: string; // The Convex deployment URL
}) => {
  let client: IAutumnClient = convexApi 
    ? new ConvexAutumnClient({ 
        convexApi, 
        convexUrl: getBackendUrl(convexUrl!), 
        customerData, 
        headers,
        getBearerToken,
      })
    : new AutumnClient({
        backendUrl: getBackendUrl(backendUrl),
        getBearerToken,
        customerData,
        includeCredentials,
        betterAuthUrl,
        headers,
      });

  return (
    <BaseAutumnProvider client={client} AutumnContext={AutumnContext}>
      {children}
    </BaseAutumnProvider>
  );
};
