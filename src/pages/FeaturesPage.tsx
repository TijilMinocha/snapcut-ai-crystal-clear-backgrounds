import { Zap, Shield, Globe, Image, Clock, Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const featuresList = [
  {
    icon: Sparkles,
    title: "AI-Powered Precision",
    description: "State-of-the-art AI models detect subjects with pixel-perfect accuracy, handling complex edges like hair and fur.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in under 5 seconds. Our optimized pipeline ensures minimal wait time.",
  },
  {
    icon: Image,
    title: "High Resolution Support",
    description: "Process images up to 5000×5000 pixels. Perfect for print-quality output.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All images are automatically deleted after 24 hours. We never store your data permanently.",
  },
  {
    icon: Globe,
    title: "RESTful API",
    description: "Integrate background removal directly into your apps with our simple, well-documented API.",
  },
  {
    icon: Clock,
    title: "Batch Processing",
    description: "Process multiple images in one go with Pro plan. Perfect for e-commerce catalogs.",
  },
];

const FeaturesPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Powerful <span className="gradient-text">Features</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need for professional background removal at scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {featuresList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-8 neon-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="cta" size="xl" asChild>
          <Link to="/register">Get Started Free</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default FeaturesPage;
