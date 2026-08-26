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

// Pages (Home is eagerly loaded for instant landing page speed; subpages are lazy loaded)
import Home from "./pages/Home";
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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 max-w-md mb-6 text-sm">
            We encountered an unexpected issue rendering this section. Please reload or return to the home screen.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-all"
            >
              Return Home
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
            <ErrorBoundary>
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
            </ErrorBoundary>
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
