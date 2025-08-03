import React, { useState } from "react";
import { config } from "../config/environment";

const EnvironmentSwitcher: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {config.environment.toUpperCase()}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Environment Info
          </h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-medium">Environment:</span>{" "}
              {config.environment}
            </div>
            <div>
              <span className="font-medium">API URL:</span> {config.apiUrl}
            </div>
            <div>
              <span className="font-medium">Admin Secret:</span>{" "}
              {config.adminSecret ? "Configured" : "Not configured"}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Production: https://api.freespeek.net
              <br />
              Development: http://localhost:5001/api
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSwitcher;
