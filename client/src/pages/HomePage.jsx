import Hero from "../components/layout/Hero.jsx";
import LiveRadar from "../components/common/LiveRadar.jsx";
import HowItWorks from "../components/sections/HowItWorks.jsx";
import FeatureGrid from "../components/sections/FeatureGrid.jsx";
import ThreatStats from "../components/sections/ThreatStats.jsx";
import FAQ from "../components/sections/FAQ.jsx";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="container">
        <LiveRadar />
      </div>
      <ThreatStats />
      <FeatureGrid />
      <HowItWorks />
      <FAQ />
    </>
  );
}
