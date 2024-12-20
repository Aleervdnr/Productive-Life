import ReactGA from "react-ga4";

export const initializeAnalytics = () => {
  ReactGA.initialize("G-6Q3D5QCEP6"); // Reemplaza con tu ID de medición
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
