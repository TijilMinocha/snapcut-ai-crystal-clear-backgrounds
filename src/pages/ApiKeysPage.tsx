import { Key, Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiKeysPage = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Key size={24} className="text-primary" /> API Keys
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your API keys for B2B integration</p>
        </div>
        <Button variant="cta"><Plus size={16} /> Generate Key</Button>
      </div>

      <div className="glass-card rounded-xl p-8 text-center">
        <Key size={40} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display font-semibold mb-2">No API Keys</h3>
        <p className="text-sm text-muted-foreground mb-4">Generate your first API key to start integrating SnapCut AI into your apps.</p>
        <Button variant="cta"><Plus size={16} /> Generate API Key</Button>
      </div>
    </div>
  );
};

export default ApiKeysPage;
