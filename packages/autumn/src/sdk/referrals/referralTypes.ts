export interface CreateReferralCodeParams {
  customer_id: string;
  program_id: string;
}

export interface CreateReferralCodeResult {
  code: string;
  customer_id: string;
  created_at: number;
}

export interface RedeemReferralCodeParams {
  code: string;
  customer_id: string;
}

export interface RedeemReferralCodeResult {
  id: string;
  customer_id: string;
  reward_id: string;
  applied: boolean;
}
