import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const resetPasswordForEmail = useAuthStore((s) => s.resetPasswordForEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("If an account exists for this email, you will receive a reset link shortly.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="SnapCut AI" className="h-10 w-10" />
            <span className="font-display text-2xl font-bold">
              Snap<span className="gradient-text">Cut</span> AI
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <Button variant="cta" className="w-full" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
