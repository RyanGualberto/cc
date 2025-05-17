import Header from "~/components/landing-page/header";
import Footer from "~/components/landing-page/footer";
import CallToAction from "~/components/landing-page/call-to-action";
import FAQ from "~/components/landing-page/faq";
import Plans from "~/components/landing-page/plans";
import HowItWorks from "~/components/landing-page/how-it-works";
import Features from "~/components/landing-page/features";
import Hero from "~/components/landing-page/hero";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Plans />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
