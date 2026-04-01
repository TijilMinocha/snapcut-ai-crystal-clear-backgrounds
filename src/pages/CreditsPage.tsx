import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CreditsPage = () => {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Zap size={24} className="text-primary" /> Credits
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your processing credits</p>
      </div>

      {/* Current balance */}
      <div className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Daily Credits</span>
          <span className="text-sm font-medium text-primary">Free Plan</span>
        </div>
        <div className="text-4xl font-bold mb-2">5 <span className="text-lg text-muted-foreground font-normal">/ 5 remaining</span></div>
        <Progress value={100} className="h-2 mb-4" />
        <p className="text-xs text-muted-foreground">Resets daily at midnight UTC</p>
      </div>

      {/* Upgrade */}
      <div className="glass-card rounded-xl p-8 border-primary/30 glow-primary">
        <h3 className="font-display text-lg font-semibold mb-2">Need more?</h3>
        <p className="text-sm text-muted-foreground mb-6">Upgrade to Pro for unlimited processing or buy credit packs.</p>
        <div className="flex gap-3">
          <Button variant="cta">Upgrade to Pro — ₹499/mo</Button>
          <Button variant="cta-outline"><Plus size={16} /> Buy Credits</Button>
        </div>
      </div>

      {/* Usage history */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Usage History</h3>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">No usage recorded yet.</p>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
