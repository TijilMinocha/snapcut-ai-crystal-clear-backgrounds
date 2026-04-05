import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Download, Zap, Shield, Globe, Clock, Image, Check } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const HeroSection = () => {
  const authReady = useAuthStore((state) => state.authReady);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showDashboardCta = authReady && isAuthenticated;

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-primary animate-pulse-glow">
            <Sparkles size={16} />
            AI-Powered Background Removal
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Remove Backgrounds{" "}
            <span className="gradient-text">Instantly</span> with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional background removal in seconds. Upload your image, let AI do the magic, and download your clean result. No design skills needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="xl" asChild>
              <Link to={showDashboardCta ? "/dashboard/upload" : "/register"}>
                <Upload size={20} />
                Start Removing Backgrounds
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ 5 free images per month • ✓ No credit card required • ✓ Results in seconds
          </p>
        </div>
      </div>
    </section>
  );
};

const steps = [
  { icon: Upload, title: "Upload", description: "Drag & drop or browse your image (JPG, PNG, WEBP up to 10MB)" },
  { icon: Sparkles, title: "AI Processing", description: "Our AI analyzes and removes the background in under 5 seconds" },
  { icon: Download, title: "Download", description: "Get your transparent PNG — ready for any use" },
];

const HowItWorks = () => (
  <section className="py-20 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          How It <span className="gradient-text">Works</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to professional results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-8 text-center neon-hover">
              <div className="w-16 h-16 rounded-xl gradient-cta flex items-center justify-center mx-auto mb-6">
                <Icon size={28} className="text-primary-foreground" />
              </div>
              <div className="text-sm font-medium text-primary mb-2">Step {i + 1}</div>
              <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Results in under 5 seconds with state-of-the-art AI models" },
  { icon: Image, title: "High Resolution", description: "Support for images up to 5000x5000 pixels" },
  { icon: Shield, title: "Secure Processing", description: "Images auto-deleted after 24 hours. Your data stays private" },
  { icon: Globe, title: "B2B API Access", description: "Integrate background removal into your own apps" },
  { icon: Clock, title: "Batch Processing", description: "Process multiple images efficiently with our Pro plan" },
  { icon: Sparkles, title: "Edge Detection", description: "Pixel-perfect cutouts with AI-powered edge refinement" },
];

const FeaturesSection = () => (
  <section className="py-20 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Powerful <span className="gradient-text">Features</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Everything you need for professional background removal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-6 neon-hover">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

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
    features: ["Unlimited images", "HD quality output", "Priority processing", "API access", "Batch upload", "Email support"],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Credit Pack",
    price: "₹199",
    period: "/50 credits",
    description: "Pay as you go",
    features: ["50 image credits", "HD quality output", "No expiry", "API access", "Priority support"],
    cta: "Buy Credits",
    popular: false,
  },
];

const PricingSection = () => (
  <section className="py-20 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Simple <span className="gradient-text">Pricing</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card rounded-xl p-8 relative neon-hover ${
              plan.popular ? "border-primary/50 glow-primary" : ""
            }`}
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
                  <Check size={16} className="text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? "cta" : "cta-outline"}
              className="w-full"
              asChild
            >
              <Link to="/register">{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 border-t border-border">
    <div className="container mx-auto px-4">
      <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Ready to Remove <span className="gradient-text">Backgrounds</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of professionals using SnapCut AI. Start free today.
          </p>
          <Button variant="cta" size="xl" asChild>
            <Link to="/register">
              <Sparkles size={20} />
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const LandingPage = () => (
  <>
    <HeroSection />
    <HowItWorks />
    <FeaturesSection />
    <PricingSection />
    <CTASection />
  </>
);

export default LandingPage;
