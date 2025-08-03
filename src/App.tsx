import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FreespeekUsersPage from "./pages/FreespeekUsersPage";
import SupportChatsPage from "./pages/SupportChatsPage";
import UserProfilePage from "./pages/UserProfilePage";
import ChatDetailsPage from "./pages/ChatDetailsPage";
import ChatsPage from "./pages/ChatsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { store } from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="freespeek-users" element={<FreespeekUsersPage />} />
              <Route path="support-chats" element={<SupportChatsPage />} />
              <Route path="user-profile/:id" element={<UserProfilePage />} />
              <Route
                path="chat-details/:chatId"
                element={<ChatDetailsPage />}
              />
              <Route
                path="statistics"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Statistics</h1>
                  </div>
                }
              />
              <Route
                path="interactions-dashboard"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">
                      Interactions Dashboard
                    </h1>
                  </div>
                }
              />
              <Route
                path="dau-mau"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">DAU/MAU</h1>
                  </div>
                }
              />
              <Route
                path="create-test-user"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Create Test User</h1>
                  </div>
                }
              />
              <Route
                path="interactions"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Interactions</h1>
                  </div>
                }
              />
              <Route path="chats" element={<ChatsPage />} />
              <Route
                path="campaign"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Campaign</h1>
                  </div>
                }
              />
              <Route
                path="create-campaign"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Create Campaign</h1>
                  </div>
                }
              />
              <Route
                path="language"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Language</h1>
                  </div>
                }
              />
              <Route
                path="hotspots"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Hotspots</h1>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
