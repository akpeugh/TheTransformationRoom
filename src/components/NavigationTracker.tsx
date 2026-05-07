import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A simple utility to track page views.
 * Can be extended to send data to Google Analytics, Mixpanel, etc.
 */
export const trackPageView = (path: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[Navigation Track] Page View: ${path} at ${timestamp}`);
  
  // In a real application, you'd send this to your analytics provider
  // example: window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
};

export const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};
