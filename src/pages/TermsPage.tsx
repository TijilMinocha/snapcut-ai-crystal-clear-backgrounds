const TermsPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="font-display text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
      <div className="glass-card rounded-xl p-8 space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Acceptable Use</h2>
          <p className="text-muted-foreground">You may use SnapCut AI for lawful purposes only. Uploading illegal, harmful, or copyrighted content without permission is strictly prohibited.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Service Limits</h2>
          <p className="text-muted-foreground">Free users are limited to 5 images per day. Images must not exceed 10 MB or 5000×5000 pixels. Files are limited to JPG, PNG, and WEBP formats.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Payments & Refunds</h2>
          <p className="text-muted-foreground">All payments are processed through Razorpay. Subscriptions can be cancelled at any time. Credit packs are non-refundable.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Data Retention</h2>
          <p className="text-muted-foreground">Uploaded images and results are automatically deleted within 24 hours. Account data is retained until account deletion.</p>
        </section>
      </div>
    </div>
  </div>
);

export default TermsPage;
