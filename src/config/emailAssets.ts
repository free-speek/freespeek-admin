/**
 * Configuration for email template assets
 * These URLs point to the hosted images on the backend server
 */

// Get the base backend URL (without /api suffix) for assets
const getBackendBaseUrl = () => {
  const devUrl = process.env.REACT_APP_BACKEND_URL_DEVELOPMENT;
  const prodUrl = process.env.REACT_APP_BACKEND_URL_PRODUCTION;

  // Remove /api suffix if present
  const baseUrl = (prodUrl || devUrl || "https://api.freespeek.net").replace(
    /\/api$/,
    ""
  );
  return baseUrl;
};

const BACKEND_URL = getBackendBaseUrl();
export const EMAIL_ASSETS = {
  LOGO: `${BACKEND_URL}/assets/email-templates/freespeek-logo.png`,
  APP_STORE_BUTTON: `${BACKEND_URL}/assets/email-templates/app-store-button.jpg`,
  GOOGLE_PLAY_BUTTON: `${BACKEND_URL}/assets/email-templates/google-play-button.png`,
} as const;

export default EMAIL_ASSETS;
