/**
 * Analytics Utility
 * Lightweight abstraction for tracking events and page views.
 * Can be connected to GA4, PostHog, Mixpanel, etc.
 */

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

class Analytics {
  private static instance: Analytics;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Track a page view
   */
  public trackView(path: string) {
    if (this.isDevelopment) {
      console.log(`[Analytics] PageView: ${path}`);
    }
    
    // INTEGRATION POINT: Add third-party tracking here
    // Example: window.gtag('event', 'page_view', { page_path: path });
  }

  /**
   * Track a custom event
   */
  public trackEvent(event: AnalyticsEvent) {
    if (this.isDevelopment) {
      console.log(`[Analytics] Event:`, event);
    }

    // INTEGRATION POINT: Add third-party event tracking here
    // Example: window.gtag('event', event.action, { 
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value,
    //   ...event
    // });
  }
}

export const analytics = Analytics.getInstance();
