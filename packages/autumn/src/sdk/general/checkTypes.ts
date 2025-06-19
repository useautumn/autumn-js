import { UsageModelType } from "../products/prodEnums";
import { Product } from "../products/prodTypes";

export type CheckFeatureScenario = "usage_limit" | "feature_flag";

export interface CheckFeatureFormattedPreview {
  scenario: CheckFeatureScenario;
  title: string;
  message: string;
  feature_id: string;
  feature_name: string;
  products: Product[];
}

export type CheckProductScenario =
  | "scheduled"
  | "active"
  | "new"
  | "renew"
  | "upgrade"
  | "downgrade"
  | "cancel";

export interface CheckProductFormattedPreview {
  scenario: CheckProductScenario;
  product_id: string;
  product_name: string;
  recurring: boolean;
  error_on_attach?: boolean;
  next_cycle_at?: number;
  current_product_name?: string;

  items?: {
    price: string;
    description: string;
    usage_model?: UsageModelType;
  }[];

  options?: {
    feature_id: string;
    feature_name: string;
    billing_units: number;
    price?: number;
    tiers?: {
      to: number | string;
      amount: number;
    }[];
  }[];

  due_today?: {
    price: number;
    currency: string;
  };

  due_next_cycle?: {
    price: number;
    currency: string;
  };
}
