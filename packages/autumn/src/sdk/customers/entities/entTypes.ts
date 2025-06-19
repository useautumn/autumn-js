import {
  CustomerData,
  CustomerFeature,
  CustomerInvoice,
  CustomerProduct,
} from "../cusTypes";
import { EntityExpandOption } from "./entEnums";

export interface CreateEntityParams {
  id: string;
  name: string;
  feature_id: string;
  customer_data?: CustomerData;
}

export interface CreateEntityResult {
  success: boolean;
}

export interface DeleteEntityResult {
  success: boolean;
}

export interface GetEntityParams {
  expand?: EntityExpandOption[];
}

export interface Entity {
  id: string;
  name: string;
  customer_id: string;
  created_at: number;
  env: string;
  products: CustomerProduct[];
  features: Record<string, CustomerFeature>;
  invoices?: CustomerInvoice[];
}

export interface EntityData {
  name?: string;
  feature_id: string;
}
