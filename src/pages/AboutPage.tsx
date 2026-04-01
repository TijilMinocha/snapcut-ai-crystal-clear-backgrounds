import logo from "@/assets/logo.png";

const AboutPage = () => (
  <div className="py-20">
    <div className="container mx-auto px-4 max-w-3xl text-center">
      <img src={logo} alt="SnapCut AI" className="h-20 w-20 mx-auto mb-8" />
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
        About <span className="gradient-text">SnapCut AI</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        SnapCut AI is an AI-powered background removal platform designed for professionals, creators, and businesses. We make it easy to get studio-quality cutouts in seconds — no design skills required.
      </p>
      <div className="glass-card rounded-xl p-8 text-left space-y-4">
        <h2 className="font-display text-xl font-semibold">Our Mission</h2>
        <p className="text-muted-foreground">
          To democratize professional image editing by making AI-powered tools accessible, affordable, and lightning fast for everyone.
        </p>
        <h2 className="font-display text-xl font-semibold pt-4">What We Offer</h2>
        <ul className="text-muted-foreground space-y-2">
          <li>• AI background removal in under 5 seconds</li>
          <li>• Support for high-resolution images up to 5000×5000</li>
          <li>• RESTful API for B2B integration</li>
          <li>• Privacy-first: all images deleted within 24 hours</li>
        </ul>
      </div>
    </div>
  </div>
);

export default AboutPage;
