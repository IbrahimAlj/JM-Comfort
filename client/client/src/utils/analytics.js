import ReactGA from 'react-ga4';

// Initialize Google Analytics
// IMPORTANT: Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize GA4
export const initGA = () => {
  try {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100, // Track 100% of page load times
      },
      gtagOptions: {
        anonymize_ip: true, // Anonymize IP addresses for privacy
      },
    });
    console.log('✅ Google Analytics initialized');
  } catch (error) {
    console.error('❌ Error initializing Google Analytics:', error);
  }
};

// Track page view
export const trackPageView = (path) => {
  try {
    ReactGA.send({ hitType: 'pageview', page: path });
    console.log(`📊 Page view tracked: ${path}`);
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
  }
};

// Track custom events
export const trackEvent = (category, action, label = '', value = 0) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    console.log(`📊 Event tracked: ${category} - ${action}`);
  } catch (error) {
    console.error('❌ Error tracking event:', error);
  }
};

// Track form submissions
export const trackFormSubmit = (formName) => {
  trackEvent('Form', 'Submit', formName);
};

// Track CTA clicks
export const trackCTAClick = (ctaText, ctaLocation) => {
  trackEvent('CTA', 'Click', `${ctaText} - ${ctaLocation}`);
};

// Track service interactions
export const trackServiceView = (serviceName) => {
  trackEvent('Service', 'View', serviceName);
};

export default ReactGA;