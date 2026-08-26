import { useState, useEffect, lazy, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Robust dynamic import with automatic retry on chunk loading failure
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      console.warn("Retrying dynamic module load...", error);
      // Wait briefly and retry once
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        return await factory();
      } catch (retryError) {
        console.error("Dynamic module load failed after retry:", retryError);
        throw retryError;
      }
    }
  });
}

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ChatBot } from "./components/ChatBot";
import { VideoCompanionMode as AIVideoCall } from "./components/VideoCompanionMode";
import { NavigationTracker } from "./components/NavigationTracker";

import { GlobalPodcastPlayer } from "./components/GlobalPodcastPlayer";
import { LanguageProvider } from "./contexts/LanguageContext";

// Pages (Lazy loaded with retry)
const Home = lazyWithRetry(() => import("./pages/Home"));
const Organizations = lazyWithRetry(() => import("./pages/Organizations"));
const Individuals = lazyWithRetry(() => import("./pages/Individuals"));
const CareerTool = lazyWithRetry(() => import("./pages/CareerTool"));
const About = lazyWithRetry(() => import("./pages/About"));
const Testimonials = lazyWithRetry(() => import("./pages/Testimonials"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const PodcastLibrary = lazyWithRetry(() => import("./pages/PodcastLibrary"));
const ImpactSimulator = lazyWithRetry(() => import("./pages/ImpactSimulator"));
const ResumeBuilder = lazyWithRetry(() => import("./pages/ResumeBuilder"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));

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
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/resume" element={<Navigate to="/resume-builder" replace />} />
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
