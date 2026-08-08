import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ChatBot } from "./components/ChatBot";
import { VideoCompanionMode as AIVideoCall } from "./components/VideoCompanionMode";
import { NavigationTracker } from "./components/NavigationTracker";

import { GlobalPodcastPlayer } from "./components/GlobalPodcastPlayer";
import { LanguageProvider } from "./contexts/LanguageContext";

// Pages (Lazy loaded)
const Home = lazy(() => import("./pages/Home"));
const Organizations = lazy(() => import("./pages/Organizations"));
const Individuals = lazy(() => import("./pages/Individuals"));
const CareerTool = lazy(() => import("./pages/CareerTool"));
const About = lazy(() => import("./pages/About"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const PodcastLibrary = lazy(() => import("./pages/PodcastLibrary"));
const ImpactSimulator = lazy(() => import("./pages/ImpactSimulator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [aiConsultationData, setAiConsultationData] = useState<{ summary: string; insights: string } | null>(null);

  useEffect(() => {
    const handleOpenVideoCall = () => setIsVideoCallOpen(true);
    window.addEventListener('ais:open-video-call', handleOpenVideoCall);
    return () => window.removeEventListener('ais:open-video-call', handleOpenVideoCall);
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <NavigationTracker />

        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/individuals" element={<Individuals />} />
                <Route path="/career-hub" element={<CareerTool />} />
                <Route path="/display" element={<Navigate to="/career-hub" replace />} />
                <Route path="/tools" element={<Navigate to="/organizations" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/contact" element={<Contact aiConsultationData={aiConsultationData} />} />
                <Route path="/podcasts" element={<PodcastLibrary />} />
                <Route path="/impact-simulator" element={<ImpactSimulator />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatBot />
          
          <AnimatePresence>
            {isVideoCallOpen && (
              <AIVideoCall onClose={(data) => {
                 // Ensure data is the aiConsultationData object, not a MouseEvent
                 if (data && typeof data === 'object' && 'summary' in data) {
                   setAiConsultationData(data);
                 }
                 setIsVideoCallOpen(false);
              }} />
            )}
          </AnimatePresence>
          <GlobalPodcastPlayer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
