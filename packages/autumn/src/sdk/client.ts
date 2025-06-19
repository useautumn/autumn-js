import { customerMethods } from "./customers/cusMethods";
import { entityMethods } from "./customers/entities/entMethods";

import {
  handleAttach,
  handleCancel,
  handleCheck,
  handleEntitled,
  handleEvent,
  handleTrack,
  handleUsage,
} from "./general/genMethods";
import {
  AttachParams,
  CancelParams,
  CheckParams,
  TrackParams,
  UsageParams,
} from "./general/genTypes";
import { productMethods } from "./products/prodMethods";
import { referralMethods } from "./referrals/referralMethods";
import { toContainerResult } from "./response";
import { staticWrapper } from "./utils";

const LATEST_API_VERSION = "1.2";
export class Autumn {
  private readonly secretKey: string | undefined;
  private readonly publishableKey: string | undefined;
  private level: "secret" | "publishable";
  private headers: Record<string, string>;
  private url: string;

  constructor(options?: {
    secretKey?: string;
    publishableKey?: string;
    url?: string;
    version?: string;
  }) {
    try {
      this.secretKey = options?.secretKey || process.env.AUTUMN_SECRET_KEY;
      this.publishableKey =
        options?.publishableKey || process.env.AUTUMN_PUBLISHABLE_KEY;
    } catch (error) {}

    if (!this.secretKey && !this.publishableKey) {
      throw new Error("Autumn secret key or publishable key is required");
    }

    this.headers = {
      Authorization: `Bearer ${this.secretKey || this.publishableKey}`,
      "Content-Type": "application/json",
    };

    let version = options?.version || LATEST_API_VERSION;
    this.headers["x-api-version"] = version;

    this.url = options?.url || "https://api.useautumn.com/v1";
    this.level = this.secretKey ? "secret" : "publishable";
  }

  public getLevel() {
    return this.level;
  }

  async get(path: string) {
    const response = await fetch(`${this.url}${path}`, {
      headers: this.headers,
    });

    return toContainerResult(response);
  }

  async post(path: string, body: any) {
    const response = await fetch(`${this.url}${path}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return toContainerResult(response);
  }

  async delete(path: string) {
    const response = await fetch(`${this.url}${path}`, {
      method: "DELETE",
      headers: this.headers,
    });
    return toContainerResult(response);
  }

  static customers = customerMethods();
  static products = productMethods();
  static entities = entityMethods();
  static referrals = referralMethods();

  customers = customerMethods(this);
  products = productMethods(this);
  entities = entityMethods(this);
  referrals = referralMethods(this);

  static attach = (params: AttachParams) =>
    staticWrapper(handleAttach, undefined, { params });
  static usage = (params: UsageParams) =>
    staticWrapper(handleUsage, undefined, { params });

  async attach(params: AttachParams) {
    return handleAttach({
      instance: this,
      params,
    });
  }

  static cancel = (params: CancelParams) =>
    staticWrapper(handleCancel, undefined, { params });

  async cancel(params: CancelParams) {
    return handleCancel({
      instance: this,
      params,
    });
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the new check() method instead.
   */
  static entitled = (params: CheckParams) =>
    staticWrapper(handleEntitled, undefined, { params });

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the new check() method instead.
   */
  async entitled(params: CheckParams) {
    return handleEntitled({
      instance: this,
      params,
    });
  }

  static check = (params: CheckParams) =>
    staticWrapper(handleCheck, undefined, { params });

  async check(params: CheckParams) {
    return handleCheck({
      instance: this,
      params,
    });
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the new track() method instead.
   */
  static event = (params: TrackParams) =>
    staticWrapper(handleEvent, undefined, { params });

  /**
   * @deprecated This method is deprecated and will be removed in a future version.
   * Please use the new track() method instead.
   */
  async event(params: TrackParams) {
    return handleEvent({
      instance: this,
      params,
    });
  }

  static track = (params: TrackParams) =>
    staticWrapper(handleTrack, undefined, { params });

  async track(params: TrackParams) {
    return handleTrack({
      instance: this,
      params,
    });
  }

  async usage(params: UsageParams) {
    return handleUsage({
      instance: this,
      params,
    });
  }
}
