import { AppEnv } from "../general/genEnums";
import {
  FreeTrialDuration,
  Infinite,
  ProductItemIntervalType,
  UsageModel,
} from "./prodEnums";

export interface PriceTier {
  to: number;
  amount: number | "inf";
}

export interface ProductItem {
  feature_id?: string;
  included_usage?: number | typeof Infinite;
  interval?: ProductItemIntervalType;

  // Price config
  usage_model?: UsageModel;
  price?: number;
  billing_units?: number;
  entity_feature_id?: string;
  reset_usage_on_billing?: boolean;
  reset_usage_when_enabled?: boolean;
}

export interface FreeTrial {
  duration: FreeTrialDuration;
  length: number;
  unique_fingerprint: boolean;
}

export interface Product {
  // internal_id: string;
  autumn_id: string;
  created_at: number;

  id: string;
  name: string;
  env: AppEnv;

  is_add_on: boolean;
  is_default: boolean;
  group: string;
  version: number;

  items: ProductItem[];
  free_trial: FreeTrial | null;
}

export interface CreateProductParams {
  id: string;
  name?: string;
  is_add_on?: boolean;
  is_default?: boolean;
  items?: ProductItem[];
  free_trial?: FreeTrial;
}

export interface ListProductsParams {}
