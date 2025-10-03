import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FreespeekUsersPage from "./pages/FreespeekUsersPage";
import LiveUsersPage from "./pages/LiveUsersPage";
import MessagesPage from "./pages/MessagesPage";
import SupportChatsPage from "./pages/SupportChatsPage";
import SupportChatDetailsPage from "./pages/SupportChatDetailsPage";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import ChatDetailsPage from "./pages/ChatDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";
import BulkEmailDashboardPage from "./pages/BulkEmailDashboardPage";
import ComposeEmailPage from "./pages/ComposeEmailPage";
import RecipientsPage from "./pages/RecipientsPage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import EmailHistoryPage from "./pages/EmailHistoryPage";
import EmailStatsPage from "./pages/EmailStatsPage";
import UserTrackingPage from "./pages/UserTrackingPage";
import Loader from "./components/Loader";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="freespeek-users" element={<FreespeekUsersPage />} />
          <Route path="live-users" element={<LiveUsersPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="support-chats" element={<SupportChatsPage />} />
          <Route path="bulk-email" element={<BulkEmailDashboardPage />} />
          <Route path="bulk-email/compose" element={<ComposeEmailPage />} />
          <Route path="bulk-email/recipients" element={<RecipientsPage />} />
          <Route path="bulk-email/templates" element={<TemplatesPage />} />
          <Route
            path="bulk-email/templates/:id"
            element={<TemplateDetailPage />}
          />
          <Route path="bulk-email/history" element={<EmailHistoryPage />} />
          <Route path="bulk-email/statistics" element={<EmailStatsPage />} />
          <Route path="user-tracking" element={<UserTrackingPage />} />
          <Route
            path="support-chat-details/:chatId"
            element={<SupportChatDetailsPage />}
          />
          <Route path="chat-history/:chatId" element={<ChatHistoryPage />} />
          <Route path="chat-details/:chatId" element={<ChatDetailsPage />} />
          <Route path="user-profile/:userId" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </Provider>
    </AuthProvider>
  );
};

export default App;
