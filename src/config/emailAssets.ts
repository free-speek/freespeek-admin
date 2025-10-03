/**
 * Configuration for email template assets
 * These URLs point to the hosted images on the backend server
 */

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL_DEVELOPMENT ||
  process.env.REACT_APP_BACKEND_URL_PRODUCTION ||
  "http://192.168.100.56:5001";
// "https://api.freespeek.net/api";
export const EMAIL_ASSETS = {
  LOGO: `${BACKEND_URL}/assets/email-templates/freespeek-logo.png`,
  APP_STORE_BUTTON: `${BACKEND_URL}/assets/email-templates/app-store-button.jpg`,
  GOOGLE_PLAY_BUTTON: `${BACKEND_URL}/assets/email-templates/google-play-button.png`,
} as const;

export default EMAIL_ASSETS;
