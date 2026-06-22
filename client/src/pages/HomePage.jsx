import Hero from "../components/layout/Hero.jsx";
import HowItWorks from "../components/sections/HowItWorks.jsx";
import FeatureGrid from "../components/sections/FeatureGrid.jsx";
import ThreatStats from "../components/sections/ThreatStats.jsx";
import FAQ from "../components/sections/FAQ.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ThreatStats />
      <FeatureGrid />
      <HowItWorks />
      <FAQ />
    </>
  );
}
