import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../lib/analytics';

export const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.trackView(location.pathname + location.search);
  }, [location]);

  return null;
};
