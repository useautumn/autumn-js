import { logAuthError } from "@/errorUtils/logAuthError";
import {
  AutumnError,
  AutumnPromise,
  CreateCustomerParams,
  CustomerData,
  Product,
  toContainerResult,
} from "../../../sdk";
import { logFetchError } from "../errorUtils/logFetchError";
import { getPricingTableMethod } from "./clientCompMethods";
import { createCustomerMethod } from "./clientCusMethods";
import {
  createEntityMethod,
  deleteEntityMethod,
  getEntityMethod,
} from "./clientEntityMethods";

import {
  attachMethod,
  cancelMethod,
  checkMethod,
  checkoutMethod,
  openBillingPortalMethod,
  queryMethod,
  setupPaymentMethod,
  trackMethod,
} from "./clientGenMethods";
import { listProductsMethod } from "./clientProdMethods";
import { redeemCode, createCode } from "./clientReferralMethods";

export interface ErrorResponse {
  message: string;
  code: string;
}

export type OmitCustomerType =
  | "id"
  | "name"
  | "email"
  | "fingerprint"
  | "customer_id";

export interface AutumnClientConfig {
  backendUrl?: string;
  getBearerToken?: () => Promise<string | null | undefined>;
  customerData?: CustomerData;
  includeCredentials?: boolean;
  betterAuthUrl?: string;
  headers?: Record<string, string>;
}

export interface IAutumnClient {
  readonly backendUrl?: string;
  readonly prefix: string;
  readonly headers?: Record<string, string>;
  readonly customerData?: CustomerData;
  
  // Core methods
  createCustomer(params: Omit<CreateCustomerParams, "id" | "data"> & { errorOnNotFound?: boolean }): Promise<any>;
  getPricingTable(): Promise<any>;
  
  // HTTP methods (stubbed for Convex)
  detectCors(): Promise<{ valid: boolean; includeCredentials: boolean | undefined }>;
  shouldIncludeCredentials(): Promise<boolean>;
  getHeaders(): Promise<Record<string, string>>;
  handleFetch(options: { path: string; method: string; body?: any }): Promise<any>;
  post(path: string, body: any): Promise<any>;
  get(path: string): Promise<any>;
  delete(path: string): Promise<any>;
  
  // Autumn methods
  attach(args: any): Promise<any>;
  checkout(args: any): Promise<any>;
  cancel(args: any): Promise<any>;
  check(args: any): Promise<any>;
  track(args: any): Promise<any>;
  openBillingPortal(args: any): Promise<any>;
  setupPayment(args: any): Promise<any>;
  query(args: any): Promise<any>;
  
  entities: {
    create(args: any): Promise<any>;
    get(args: any): Promise<any>;
    delete(args: any): Promise<any>;
  };
  
  referrals: {
    createCode(args: any): Promise<any>;
    redeemCode(args: any): Promise<any>;
  };
  
  products: {
    list(): AutumnPromise<{ list: Product[]}>;
  };
}

export class AutumnClient implements IAutumnClient {
  public readonly backendUrl?: string;
  protected readonly getBearerToken?: () => Promise<string | null | undefined>;
  public readonly customerData?: CustomerData;
  protected includeCredentials?: boolean;
  public readonly prefix: string;
  public readonly headers?: Record<string, string>;

  constructor({
    backendUrl,
    getBearerToken,
    customerData,
    includeCredentials,
    betterAuthUrl,
    headers,
  }: AutumnClientConfig) {
    this.backendUrl = backendUrl;
    this.getBearerToken = getBearerToken;
    this.customerData = customerData;
    this.includeCredentials = includeCredentials;
    this.prefix = "/api/autumn";

    if (betterAuthUrl) {
      this.prefix = "/api/auth/autumn";
      this.backendUrl = betterAuthUrl;
    }

    this.headers = headers;
  }

  /**
   * Detects if the backend supports CORS credentials by making an OPTIONS request
   */
  public async detectCors() {
    if (this.prefix?.includes("/api/auth")) {
      return { valid: true, includeCredentials: true };
    }

    const testEndpoint = `${this.backendUrl}/api/autumn/cors`;

    // Test 1: With credentials
    try {
      await fetch(testEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      return { valid: true, includeCredentials: true };
    } catch (error: any) {
      // Test 2: Without credentials
      try {
        await fetch(testEndpoint, {
          method: "POST",
          credentials: "omit",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        return { valid: true, includeCredentials: false };
      } catch (error2: any) {
        return { valid: false, includeCredentials: undefined };
      }
    }
  }
  /**
   * Automatically determines whether to include credentials based on CORS detection
   */
  public async shouldIncludeCredentials(): Promise<boolean> {
    // If explicitly set, always use that value
    if (this.includeCredentials !== undefined) {
      return this.includeCredentials;
    }

    try {
      const corsResult = await this.detectCors();
      if (corsResult.valid) {
        console.warn(
          `[Autumn] Detected CORS credentials: ${corsResult.includeCredentials}`
        );
        console.warn(
          `[Autumn] To disable this warning, you can set includeCredentials={${
            corsResult.includeCredentials ? "true" : "false"
          }} in <AutumnProvider />`
        );
        this.includeCredentials = corsResult.includeCredentials;
        return corsResult.includeCredentials || false;
      }

      console.warn(`[Autumn] CORS detection failed, defaulting to false`);
      return false;
    } catch (error: any) {
      console.error(`[Autumn] Error detecting CORS: ${error.message}`);
      return false;
    }
  }

  async getHeaders() {
    let headers: any = {
      "Content-Type": "application/json",
    };

    if (this.getBearerToken) {
      try {
        let token = await this.getBearerToken();
        headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error(`Failed to call getToken() in AutumnProvider`);
      }
    }

    if (this.headers) {
      headers = { ...headers, ...this.headers };
    }

    return headers;
  }

  async handleFetch({
    path,
    method,
    body,
  }: {
    path: string;
    method: string;
    body?: any;
  }) {
    body =
      method === "POST"
        ? JSON.stringify({
            ...body,
            customer_data: this.customerData || undefined,
          })
        : undefined;

    const includeCredentials = await this.shouldIncludeCredentials();

    try {
      const response = await fetch(`${this.backendUrl}${path}`, {
        method,
        body,
        headers: await this.getHeaders(),
        credentials: includeCredentials ? "include" : "omit",
      });

      const loggedError = await logAuthError(response);

      return await toContainerResult({
        response,
        logger: console,
        logError: !loggedError,
      });
    } catch (error: any) {
      logFetchError({
        method,
        backendUrl: this.backendUrl || "",
        path,
        error,
      });
      return {
        data: null,
        error: new AutumnError({
          message: error.message,
          code: "fetch_failed",
        }),
      };
    }
  }

  async post(path: string, body: any) {
    return await this.handleFetch({
      path,
      method: "POST",
      body,
    });
  }

  async get(path: string) {
    return await this.handleFetch({
      path,
      method: "GET",
    });
  }

  async delete(path: string) {
    return await this.handleFetch({
      path,
      method: "DELETE",
    });
  }

  async createCustomer(
    params: Omit<CreateCustomerParams, "id" | "data"> & {
      errorOnNotFound?: boolean;
    }
  ) {
    return await createCustomerMethod({
      client: this,
      params,
    });
  }

  async getPricingTable() {
    return await getPricingTableMethod.bind(this)();
  }

  attach = attachMethod.bind(this);
  checkout = checkoutMethod.bind(this);
  cancel = cancelMethod.bind(this);
  check = checkMethod.bind(this);
  track = trackMethod.bind(this);
  openBillingPortal = openBillingPortalMethod.bind(this);
  setupPayment = setupPaymentMethod.bind(this);
  query = queryMethod.bind(this);

  entities = {
    create: createEntityMethod.bind(this),
    get: getEntityMethod.bind(this),
    delete: deleteEntityMethod.bind(this),
  };

  referrals = {
    createCode: createCode.bind(this),
    redeemCode: redeemCode.bind(this),
  };

  products = {
    list: listProductsMethod.bind(this),
  };
}
