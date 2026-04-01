import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for trying out",
    features: ["5 images per day", "Standard quality", "PNG download", "Community support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For professionals & creators",
    features: ["Unlimited images", "HD quality output", "Priority processing", "API access (1000 req/day)", "Batch upload", "Email support"],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Credit Pack",
    price: "₹199",
    period: "/50 credits",
    description: "Pay as you go",
    features: ["50 image credits", "HD quality output", "Never expires", "API access", "Priority support"],
    cta: "Buy Credits",
    popular: false,
  },
];

const PricingPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Start free, upgrade when you need more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card rounded-xl p-8 relative neon-hover ${plan.popular ? "border-primary/50 glow-primary" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-cta text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            )}
            <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-primary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.popular ? "cta" : "cta-outline"} className="w-full" asChild>
              <Link to="/register">{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PricingPage;
