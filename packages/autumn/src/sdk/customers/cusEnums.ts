export enum ProductStatus {
  Active = "active",
  Expired = "expired",
  Trialing = "trialing",
  Scheduled = "scheduled",
}

export type CustomerExpandOption =
  | "invoices"
  | "rewards"
  | "trials_used"
  | "entities";
