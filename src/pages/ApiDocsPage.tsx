import { Code, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiDocsPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          API <span className="gradient-text">Documentation</span>
        </h1>
        <p className="text-lg text-muted-foreground">Integrate SnapCut AI into your applications</p>
      </div>

      {/* Quick start */}
      <div className="space-y-8">
        <div className="glass-card rounded-xl p-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Terminal size={20} className="text-primary" /> Quick Start
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Remove backgrounds with a single API call:</p>
          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`curl -X POST https://api.snapcutai.com/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://example.com/photo.jpg"}'`}</pre>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="font-display text-xl font-semibold mb-4">Response</h2>
          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`{
  "success": true,
  "result_url": "https://cdn.snapcutai.com/results/abc123.png",
  "credits_remaining": 45,
  "processing_time_ms": 3200
}`}</pre>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h2 className="font-display text-xl font-semibold mb-4">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground">Plan</th>
                  <th className="text-left p-3 text-muted-foreground">Requests/Day</th>
                  <th className="text-left p-3 text-muted-foreground">Max File Size</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border"><td className="p-3">Free</td><td className="p-3">5</td><td className="p-3">10 MB</td></tr>
                <tr className="border-b border-border"><td className="p-3">Pro</td><td className="p-3">1,000</td><td className="p-3">10 MB</td></tr>
                <tr><td className="p-3">Enterprise</td><td className="p-3">Custom</td><td className="p-3">Custom</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Button variant="cta" size="lg" asChild>
            <a href="/register">Get Your API Key</a>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default ApiDocsPage;
