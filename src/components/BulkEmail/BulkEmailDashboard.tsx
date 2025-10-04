import React, { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useLocation } from "react-router-dom";
import ComposeEmail from "./ComposeEmail";
import Templates from "./Templates";
import Recipients from "./Recipients";
import Analytics from "./Analytics";
import RecipientGroups from "./RecipientGroups";
import Groups from "./Groups";
import { Mail, Plus, TrendingUp } from "lucide-react";

const BulkEmailDashboard: React.FC = () => {
  usePageTitle("Bulk Email");
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(() => {
    // Get the section from URL hash, default to 'compose' if none
    const hash = window.location.hash.replace("#", "");

    return hash || "compose";
  });

  // Handle URL hash changes for navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Also handle location changes (when navigating from other pages)
  React.useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (hash) {
      setActiveSection(hash);
    }
  }, [location.hash, location.pathname]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "compose":
        return <ComposeEmail />;
      case "templates":
        return <Templates />;
      case "recipients":
        return <Recipients />;
      case "recipient-groups":
        return <RecipientGroups />;
      case "groups":
        return <Groups />;
      case "analytics":
        return <Analytics />;
      default:
        return <ComposeEmail />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "compose":
        return "Compose Email";
      case "templates":
        return "Email Templates";
      case "recipients":
        return "Manage Recipients";
      case "recipient-groups":
        return "Recipient Groups";
      case "groups":
        return "Groups";
      case "analytics":
        return "Email Analytics";
      default:
        return "Bulk Email";
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case "compose":
        return "Create and send emails to multiple recipients";
      case "templates":
        return "Manage your email templates and pre-built designs";
      case "recipients":
        return "Add, edit, and manage your email recipients";
      case "recipient-groups":
        return "Create and manage groups of recipients for targeted campaigns";
      case "groups":
        return "Create and manage recipient groups for targeted email campaigns";
      case "analytics":
        return "Track your email performance and engagement metrics";
      default:
        return "Send emails to multiple users at once";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getSectionTitle()}
            </h1>
            <p className="text-gray-600 mt-1">{getSectionDescription()}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {activeSection === "compose" && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Mail className="h-4 w-4" />
                  Fill Sample Data
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Mail className="h-4 w-4" />
                  Send Email
                </button>
              </>
            )}
            {/* {activeSection === "templates" && (
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Sparkles className="h-4 w-4" />
                  Pre-built Templatessss
                </button>
              )} */}
            {activeSection === "recipients" && (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Recipient
              </button>
            )}
            {activeSection === "analytics" && (
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <TrendingUp className="h-4 w-4" />
                Refresh Data
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto p-6">{renderActiveSection()}</main>
    </div>
  );
};

export default BulkEmailDashboard;
