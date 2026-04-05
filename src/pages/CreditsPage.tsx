import { useEffect } from "react";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/auth-store";
import { isUnlimitedPlan } from "@/lib/user-stats";

const FREE_MONTHLY = 5;

const CreditsPage = () => {
  const userStats = useAuthStore((s) => s.userStats);
  const userStatsLoading = useAuthStore((s) => s.userStatsLoading);
  const fetchUserStats = useAuthStore((s) => s.fetchUserStats);

  useEffect(() => {
    void fetchUserStats();
  }, [fetchUserStats]);

  const plan = userStats?.plan ?? "free";
  const remaining = userStats?.credits_remaining ?? 0;
  const monthlyUsed = userStats?.monthly_images_processed ?? 0;
  const progressPct =
    isUnlimitedPlan(plan) || userStatsLoading ? 100 : Math.min(100, (remaining / FREE_MONTHLY) * 100);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Zap size={24} className="text-primary" /> Credits
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your processing credits</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Monthly credits (Free plan)</span>
          <span className="text-sm font-medium text-primary">
            {userStatsLoading ? "…" : plan === "pro" ? "Pro plan" : "Free plan"}
          </span>
        </div>
        {isUnlimitedPlan(plan) ? (
          <div className="text-4xl font-bold mb-2">Unlimited</div>
        ) : (
          <>
            <div className="text-4xl font-bold mb-2">
              {userStatsLoading ? "…" : remaining}{" "}
              <span className="text-lg text-muted-foreground font-normal">/ {FREE_MONTHLY} left this month</span>
            </div>
            <Progress value={progressPct} className="h-2 mb-4" />
            <p className="text-xs text-muted-foreground">
              {monthlyUsed} image{monthlyUsed === 1 ? "" : "s"} processed this billing month. Allowance resets on the 1st of each month (UTC).
            </p>
          </>
        )}
      </div>

      <div className="glass-card rounded-xl p-8 border-primary/30 glow-primary">
        <h3 className="font-display text-lg font-semibold mb-2">Need more?</h3>
        <p className="text-sm text-muted-foreground mb-6">Upgrade to Pro for unlimited processing or buy credit packs.</p>
        <div className="flex gap-3 flex-wrap">
          <Button variant="cta">Upgrade to Pro — ₹499/mo</Button>
          <Button variant="cta-outline">
            <Plus size={16} /> Buy Credits
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Usage</h3>
        <div className="glass-card rounded-xl p-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total processed (all time)</span>
            <span className="font-medium">{userStatsLoading ? "…" : userStats?.total_images_processed ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">This month</span>
            <span className="font-medium">{userStatsLoading ? "…" : monthlyUsed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
