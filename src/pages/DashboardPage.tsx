import { useEffect } from "react";
import { LayoutDashboard, Upload, Image, Zap, TrendingUp, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { isUnlimitedPlan } from "@/lib/user-stats";

const DashboardPage = () => {
  const userStats = useAuthStore((s) => s.userStats);
  const userStatsLoading = useAuthStore((s) => s.userStatsLoading);
  const fetchUserStats = useAuthStore((s) => s.fetchUserStats);
  const history = useAuthStore((s) => s.history);

  useEffect(() => {
    void fetchUserStats();
  }, [fetchUserStats]);

  const plan = userStats?.plan ?? "free";
  const totalLifetime = userStats?.total_images_processed ?? 0;
  const monthly = userStats?.monthly_images_processed ?? 0;
  const creditsDisplay = userStatsLoading
    ? "…"
    : isUnlimitedPlan(plan)
      ? "Unlimited"
      : String(userStats?.credits_remaining ?? "—");

  const stats = [
    {
      label: "Images processed (lifetime)",
      value: userStatsLoading ? "…" : String(totalLifetime),
      icon: Image,
    },
    {
      label: "Credits remaining (this month)",
      value: creditsDisplay,
      icon: Zap,
    },
    {
      label: "Images processed (this month)",
      value: userStatsLoading ? "…" : String(monthly),
      icon: TrendingUp,
    },
  ];

  const recent = history.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard size={24} className="text-primary" />
              Dashboard
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                plan === "pro"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {plan === "pro" ? <Crown size={12} /> : null}
              {plan === "pro" ? "Pro" : "Free"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Button variant="cta" asChild>
          <Link to="/dashboard/upload">
            <Upload size={16} /> Upload Image
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-6 neon-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-tight">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-8 text-center">
        <h2 className="font-display text-xl font-semibold mb-2">Get Started</h2>
        <p className="text-sm text-muted-foreground mb-6">Upload an image to remove its background — free plan includes 5 credits per month.</p>
        <Button variant="cta" size="lg" asChild>
          <Link to="/dashboard/upload">
            <Upload size={18} /> {totalLifetime === 0 ? "Upload Your First Image" : "Upload Another Image"}
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Recent uploads</h2>
        <div className="glass-card rounded-xl divide-y divide-border">
          {recent.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No uploads yet. Start by uploading an image!</p>
            </div>
          ) : (
            recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
