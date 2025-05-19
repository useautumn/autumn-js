import { AppEnv } from "../general/genEnums";
import { ProductItemInterval } from "../products/prodEnums";
import { CustomerExpandOption, ProductStatus } from "./cusEnums";

export interface CustomerFeature {
  id: string;
  name: string;

  unlimited?: boolean;
  interval?: ProductItemInterval | null;
  balance?: number;
  usage?: number;
  included_usage?: number;
  next_reset_at?: number | null;

  breakdown?: {
    interval: ProductItemInterval;
    balance?: number;
    usage?: number;
    included_usage?: number;
    next_reset_at?: number;
  }[];
}

export interface CustomerProduct {
  id: string;
  name: string | null;
  group: string | null;
  status: ProductStatus;
  started_at: number;
  canceled_at: number | null;

  subscription_ids?: string[] | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
}

export interface Customer {
  // Internal fields
  id: string | null;
  created_at: number;
  name: string | null;
  email: string | null;
  fingerprint: string | null;
  stripe_id: string | null;
  env: AppEnv;
  metadata: Record<string, any>;

  products: CustomerProduct[];
  features: Record<string, CustomerFeature>;
  invoices?: CustomerInvoice[];
}

export interface CustomerData {
  name?: string;
  email?: string;
  fingerprint?: string;
}

export interface GetCustomerParams {
  expand?: CustomerExpandOption[];
}

export interface CreateCustomerParams {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  fingerprint?: string | null;
  metadata?: Record<string, any>;
  expand?: CustomerExpandOption[];
}

export interface UpdateCustomerParams {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  fingerprint?: string | null;
}

export interface BillingPortalParams {
  return_url?: string;
}

export interface BillingPortalResponse {
  customer_id: string;
  url: string;
}

export interface CustomerInvoice {
  product_ids: string[];
  stripe_id: string;
  status: string;
  total: number;
  currency: string;
  created_at: number;
}

export interface GenerateReferralCodeParams {
  customer_id: string;
  program_id: string;
}

export interface GenerateReferralCodeResponse {
  code: string;
  customer_id: string;
  created_at: number;
}

export interface RedeemReferralCodeParams {
  code: string;
  customer_id: string;
}

export interface RedeemReferralCodeResponse {
  id: string;
  customer_id: string;
  applied: boolean;
  reward_id: string;
}
