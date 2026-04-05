export type Plan = "free" | "pro";

export interface UserStatsRow {
  id: string;
  plan: Plan;
  credits_remaining: number;
  total_images_processed: number;
  monthly_images_processed: number;
  month_key: string;
  updated_at: string;
}

export function isUnlimitedPlan(plan: Plan): boolean {
  return plan === "pro";
}
