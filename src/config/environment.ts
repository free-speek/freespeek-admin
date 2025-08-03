interface EnvironmentConfig {
  apiUrl: string;
  adminSecret: string;
  environment: string;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isProduction) {
    return {
      apiUrl: "https://api.freespeek.net",
      adminSecret: "freepeek08072024",
      environment: "production",
    };
  }

  if (isDevelopment) {
    return {
      apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
      adminSecret: process.env.REACT_APP_ADMIN_SECRET || "freepeek08072024",
      environment: "development",
    };
  }

  // Default fallback
  return {
    apiUrl: "http://localhost:5001/api",
    adminSecret: "freepeek08072024",
    environment: "local",
  };
};

export const config = getEnvironmentConfig();

console.log(`🚀 Environment: ${config.environment}`);
console.log(`🌐 API URL: ${config.apiUrl}`);
console.log(
  `🔐 Admin Secret: ${config.adminSecret ? "Configured" : "Not configured"}`
);
