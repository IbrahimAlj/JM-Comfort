import ReactGA from 'react-ga4';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const trackEvent = (eventName, params = {}) => {
  if (!GA_ID) return;
  ReactGA.event(eventName, params);
};