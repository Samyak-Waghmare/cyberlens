import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Toast from "./components/common/Toast.jsx";
import { useToast } from "./hooks/useToast.js";
import InteractiveGrid from "./components/common/InteractiveGrid.jsx";
import ScrollProgress from "./components/common/ScrollProgress.jsx";
import ThreatMarquee from "./components/common/ThreatMarquee.jsx";
import HexDump from "./components/common/HexDump.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import AnalyzerPage from "./pages/AnalyzerPage.jsx";
import PasswordPage from "./pages/PasswordPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import WebsitePage from "./pages/WebsitePage.jsx";
import DojoPage from "./pages/DojoPage.jsx";
import ExtensionPage from "./pages/ExtensionPage.jsx";
import LogAnalyzerPage from "./pages/LogAnalyzerPage.jsx";
import LegalPrivacyPage from "./pages/LegalPrivacyPage.jsx";
import LegalDisclaimerPage from "./pages/LegalDisclaimerPage.jsx";
import LegalTermsPage from "./pages/LegalTermsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { toast, showToast, dismiss } = useToast();
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/": document.title = "CyberLens — AI-Powered Cyber Safety Suite"; break;
      case "/analyzer": document.title = "CyberLens | Scam Analyzer"; break;
      case "/password": document.title = "CyberLens | Password Lab"; break;
      case "/privacy": document.title = "CyberLens | Privacy Checkup"; break;
      case "/website": document.title = "CyberLens | Website Inspector"; break;
      case "/dojo": document.title = "CyberLens | Phishing Dojo"; break;
      case "/extension": document.title = "CyberLens | Chrome Extension"; break;
      case "/logs": document.title = "CyberLens | Threat Analysis Dashboard"; break;
      case "/privacy-policy": document.title = "CyberLens | Privacy Policy"; break;
      case "/disclaimer": document.title = "CyberLens | Disclaimer"; break;
      case "/terms": document.title = "CyberLens | Terms of Use"; break;
      default: document.title = "CyberLens | System Error"; break;
    }
  }, [location.pathname]);

  return (
    <div className="app">
      <ScrollProgress />
      <ScrollToTop />
      <InteractiveGrid />
      <HexDump side="left" type={location.pathname === "/analyzer" ? "hex" : "binary"} />
      <HexDump side="right" type={location.pathname === "/analyzer" ? "hex" : "binary"} />
      <Navbar />

      <main className="container">
        <div className="route-transition" key={location.pathname}>
          <Routes location={location}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/analyzer"  element={<AnalyzerPage onToast={showToast} />} />
            <Route path="/password"  element={<PasswordPage onToast={showToast} />} />
            <Route path="/privacy"   element={<PrivacyPage />} />
            <Route path="/website"   element={<WebsitePage onToast={showToast} />} />
            <Route path="/dojo"      element={<DojoPage />} />
            <Route path="/extension" element={<ExtensionPage />} />
            <Route path="/logs"      element={<LogAnalyzerPage onToast={showToast} />} />
            <Route path="/privacy-policy" element={<LegalPrivacyPage />} />
            <Route path="/disclaimer" element={<LegalDisclaimerPage />} />
            <Route path="/terms"     element={<LegalTermsPage />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      <ThreatMarquee />
      <Footer />
      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
