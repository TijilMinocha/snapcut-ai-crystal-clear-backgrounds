import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4 max-w-xl">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">
          <span className="gradient-text">Contact</span> Us
        </h1>
        <p className="text-muted-foreground">Have a question? We'd love to hear from you.</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <form className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Your name" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea placeholder="How can we help?" className="bg-muted/50 min-h-[120px]" />
          </div>
          <Button variant="cta" className="w-full">
            <MessageSquare size={16} /> Send Message
          </Button>
        </form>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Or email us directly at{" "}
          <a href="mailto:support@snapcutai.com" className="text-primary hover:underline">support@snapcutai.com</a>
        </p>
      </div>
    </div>
  </div>
);

export default ContactPage;
