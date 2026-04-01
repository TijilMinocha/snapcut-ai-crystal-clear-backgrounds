import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["5 images/day", "Standard quality", "PNG download"],
    current: true,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    features: ["Unlimited images", "HD quality", "Priority processing", "API access", "Batch upload"],
    current: false,
    popular: true,
  },
];

const BillingPage = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <CreditCard size={24} className="text-primary" /> Billing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`glass-card rounded-xl p-6 ${plan.popular ? "border-primary/50 glow-primary" : ""}`}>
            <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-primary" /> {f}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <Button variant="outline" className="w-full" disabled>Current Plan</Button>
            ) : (
              <Button variant="cta" className="w-full">Upgrade</Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Payment History</h3>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
