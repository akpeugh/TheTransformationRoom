import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ChatBot } from "./components/ChatBot";
import { VideoCompanionMode as AIVideoCall } from "./components/VideoCompanionMode";

import { GlobalPodcastPlayer } from "./components/GlobalPodcastPlayer";

// Pages
import Home from "./pages/Home";
import Organizations from "./pages/Organizations";
import Individuals from "./pages/Individuals";
import CareerTool from "./pages/CareerTool";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import PodcastLibrary from "./pages/PodcastLibrary";

import { IntroLoader } from "./components/IntroLoader";

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
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleOpenVideoCall = () => setIsVideoCallOpen(true);
    window.addEventListener('ais:open-video-call', handleOpenVideoCall);
    return () => window.removeEventListener('ais:open-video-call', handleOpenVideoCall);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/individuals" element={<Individuals />} />
            <Route path="/display" element={<CareerTool />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact aiConsultationData={aiConsultationData} />} />
            <Route path="/podcasts" element={<PodcastLibrary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
  );
}
