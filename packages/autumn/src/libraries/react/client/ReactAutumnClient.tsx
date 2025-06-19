import {
  CreateCustomerParams,
  CustomerData,
  toContainerResult,
} from "../../../sdk";
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
  openBillingPortalMethod,
  trackMethod,
} from "./clientGenMethods";
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

export class AutumnClient {
  private readonly backendUrl: string;
  private readonly getBearerToken?: () => Promise<string | null | undefined>;
  private readonly customerData?: CustomerData;
  private readonly includeCredentials?: boolean;

  constructor({
    backendUrl,
    getBearerToken,
    customerData,
    includeCredentials,
  }: {
    backendUrl: string;
    getBearerToken?: () => Promise<string | null | undefined>;
    customerData?: CustomerData;
    includeCredentials?: boolean;
  }) {
    this.backendUrl = backendUrl;
    this.getBearerToken = getBearerToken;
    this.customerData = customerData;
    this.includeCredentials = includeCredentials;
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

    return headers;
  }

  async handleFetchResult(result: Response) {
    let res = await toContainerResult(result);
    return res;
  }

  async post(path: string, body: any) {
    const response = await fetch(`${this.backendUrl}${path}`, {
      method: "POST",
      body: JSON.stringify({
        ...body,
        customer_data: this.customerData || undefined,
      }),
      headers: await this.getHeaders(),
      credentials: this.includeCredentials ? "include" : undefined,
    });

    return await this.handleFetchResult(response);
  }

  async get(path: string) {
    const response = await fetch(`${this.backendUrl}${path}`, {
      method: "GET",
      headers: await this.getHeaders(),
      credentials: this.includeCredentials ? "include" : undefined,
    });

    return await this.handleFetchResult(response);
  }

  async delete(path: string) {
    const response = await fetch(`${this.backendUrl}${path}`, {
      method: "DELETE",
      headers: await this.getHeaders(),
    });

    return await this.handleFetchResult(response);
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
  cancel = cancelMethod.bind(this);
  check = checkMethod.bind(this);
  track = trackMethod.bind(this);
  openBillingPortal = openBillingPortalMethod.bind(this);

  entities = {
    create: createEntityMethod.bind(this),
    get: getEntityMethod.bind(this),
    delete: deleteEntityMethod.bind(this),
  };

  referrals = {
    createCode: createCode.bind(this),
    redeemCode: redeemCode.bind(this),
  };
}
