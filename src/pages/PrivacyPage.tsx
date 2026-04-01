const PrivacyPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="font-display text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
      <div className="glass-card rounded-xl p-8 prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Data Collection</h2>
          <p className="text-muted-foreground">We collect only the minimum data necessary to provide our service: email address, usage statistics, and uploaded images for processing.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Image Storage</h2>
          <p className="text-muted-foreground">All uploaded images and processed results are automatically deleted within 24 hours. We do not permanently store any user images.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Security</h2>
          <p className="text-muted-foreground">All data transmission uses HTTPS encryption. API keys are hashed and stored securely. We follow OWASP security best practices.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold mb-3">Contact</h2>
          <p className="text-muted-foreground">For privacy-related inquiries, contact us at privacy@snapcutai.com.</p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPage;
