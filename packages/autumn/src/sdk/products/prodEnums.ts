export const Infinite = "inf";

export enum FreeTrialDuration {
  Day = "day",
}

export enum UsageModel {
  Prepaid = "prepaid",
  PayPerUse = "pay_per_use",
}

export type UsageModelType = "prepaid" | "pay_per_use";

export enum ProductItemInterval {
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Quarter = "quarter",
  SemiAnnual = "semi_annual",
  Year = "year",
  Multiple = "multiple",
}

export type ProductItemIntervalType =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "semi_annual"
  | "year"
  | "multiple";
