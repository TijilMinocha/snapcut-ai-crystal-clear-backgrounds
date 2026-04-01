import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="SnapCut AI" className="h-8 w-8" />
              <span className="font-display text-lg font-bold">
                Snap<span className="gradient-text">Cut</span> AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered background removal in seconds. Professional results, zero effort.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Product</h4>
            <div className="flex flex-col gap-2">
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/api-docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">API</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SnapCut AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by AI • Built for professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
