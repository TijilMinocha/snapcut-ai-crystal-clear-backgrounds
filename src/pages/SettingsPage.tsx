import { useState, useEffect } from "react";
import { Settings, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SettingsPage = () => {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Settings size={24} className="text-primary" /> Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2"><User size={18} /> Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={user?.name || "John Doe"} 
              className="bg-muted/50" 
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email" 
              placeholder={user?.email || "you@example.com"} 
              className="bg-muted/50" 
              disabled 
            />
          </div>
        </div>
        <Button variant="cta" size="sm" onClick={handleUpdateProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Security */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2"><Shield size={18} /> Security</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" className="bg-muted/50" />
          </div>
        </div>
        <Button variant="cta" size="sm">Update Password</Button>
      </div>

      {/* Danger zone */}
      <div className="glass-card rounded-xl p-6 border-destructive/30 space-y-4">
        <h3 className="font-display font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
        <Button variant="destructive" size="sm">Delete Account</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
