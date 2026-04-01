import { LayoutDashboard, Upload, Image, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Images Processed", value: "0", icon: Image },
  { label: "Credits Remaining", value: "5", icon: Zap },
  { label: "This Month", value: "0", icon: TrendingUp },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard size={24} className="text-primary" />
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <Button variant="cta" asChild>
          <Link to="/dashboard/upload"><Upload size={16} /> Upload Image</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-6 neon-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="glass-card rounded-xl p-8 text-center">
        <h2 className="font-display text-xl font-semibold mb-2">Get Started</h2>
        <p className="text-sm text-muted-foreground mb-6">Upload your first image to remove its background</p>
        <Button variant="cta" size="lg" asChild>
          <Link to="/dashboard/upload"><Upload size={18} /> Upload Your First Image</Link>
        </Button>
      </div>

      {/* Recent uploads placeholder */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Recent Uploads</h2>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">No uploads yet. Start by uploading an image!</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
