import { config } from "../config/environment";

const API_BASE_URL = config.apiUrl;
const ADMIN_SECRET = config.adminSecret;

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("🔍 API: Making request to:", url);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header - JWT token takes precedence over admin secret
    if (this.authToken) {
      console.log("🔍 API: Using JWT token for authorization");
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.authToken}`,
      };
    } else {
      console.log("🔍 API: Using admin secret for authorization");
      // Fallback to admin secret for non-authenticated requests
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${ADMIN_SECRET}`,
      };
    }

    console.log("🔍 API: Request config:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
    });

    try {
      const response = await fetch(url, config);
      console.log("🔍 API: Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.status === 401 || response.status === 403) {
        console.log("🔍 API: Auth error, status:", response.status);
        // Clear invalid token and try to fallback to admin secret
        this.clearAuthToken();
        localStorage.removeItem("authToken");

        // If this was a 403 and we were using a JWT token, try again with admin secret
        if (response.status === 403 && this.authToken) {
          console.log(
            "🔍 API: JWT token failed, retrying with admin secret..."
          );
          // Retry the request with admin secret
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${ADMIN_SECRET}`,
            },
          };

          try {
            console.log("🔍 API: Retrying request with admin secret");
            const retryResponse = await fetch(url, retryConfig);
            console.log("🔍 API: Retry response:", {
              status: retryResponse.status,
              statusText: retryResponse.statusText,
              ok: retryResponse.ok,
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              console.log("🔍 API: Retry successful, data:", retryData);
              return retryData;
            }
          } catch (retryError) {
            console.log(
              "🔍 API: Admin secret fallback also failed:",
              retryError
            );
          }
        }

        // If we get here, both JWT and admin secret failed
        const data = await response.json();
        const errorMessage =
          data.message ||
          data.error ||
          (response.status === 403
            ? "permission error"
            : "Authentication failed");
        console.log("🔍 API: Throwing error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("🔍 API: Request successful, data:", data);

      if (!response.ok) {
        // Extract error message from response
        const errorMessage =
          data.message ||
          data.error ||
          `HTTP error! status: ${response.status}`;
        console.log("🔍 API: Request not ok, throwing error:", errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("🔍 API: Request failed:", error);
      console.error("🔍 API: Request URL:", url);
      console.error("🔍 API: Request config:", config);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request("/admin/me");
  }

  // Dashboard stats - Admin APIs
  async getDashboardStats() {
    return this.request("/admin/all-counts");
  }

  // Live users - Admin APIs
  async getOnlineUsersCount() {
    return this.request("/admin/online-users-count");
  }

  async getLiveUsers() {
    return this.request("/admin/live-users");
  }

  // Individual count endpoints
  async getUserCount() {
    return this.request("/admin/user-count");
  }

  async getDeletedUserCount() {
    return this.request("/admin/deleted-user-count");
  }

  async getActiveUserCount() {
    return this.request("/admin/active-user-count");
  }

  async getActivePostCount() {
    return this.request("/admin/active-post-count");
  }

  async getDeletedPostCount() {
    return this.request("/admin/deleted-post-count");
  }

  async getBuyListingsCount() {
    return this.request("/admin/buy-listings-count");
  }

  async getSellListingsCount() {
    return this.request("/admin/sell-listings-count");
  }

  async getRestaurantRatingCount() {
    return this.request("/admin/restaurant-rating-count");
  }

  async getBusinessRatingCount() {
    return this.request("/admin/business-rating-count");
  }

  async getSafetyAlertsCount() {
    return this.request("/admin/safety-alerts-count");
  }

  async getUrgentAlertCount() {
    return this.request("/admin/urgent-alert-count");
  }

  async getLostPostsCount() {
    return this.request("/admin/lost-posts-count");
  }

  async getFoundPostsCount() {
    return this.request("/admin/found-posts-count");
  }

  async getPollPostCount() {
    return this.request("/admin/poll-post-count");
  }

  async getCompletedPollPostCount() {
    return this.request("/admin/completed-poll-post-count");
  }

  async getParticipantsInPollCount() {
    return this.request("/admin/participants-in-poll-count");
  }

  async getEventsCount() {
    return this.request("/admin/events-count");
  }

  // Users endpoints (Admin)
  async getUsers(page = 1, limit = 10, search = "", status = "all") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    });
    return this.request(`/admin/users?${params.toString()}`);
  }

  async getUserById(id: string) {
    console.log("🔍 API: getUserById called with ID:", id);
    console.log(
      "🔍 API: Current authToken:",
      this.authToken ? "exists" : "none"
    );
    console.log("🔍 API: ADMIN_SECRET available:", ADMIN_SECRET ? "yes" : "no");

    try {
      const response = await this.request(`/admin/users/${id}`);
      console.log("🔍 API: getUserById successful response:", response);
      return response;
    } catch (error) {
      console.error("🔍 API: getUserById failed with error:", error);
      throw error;
    }
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Support chats endpoints
  async getSupportChats(page = 1, limit = 10, status = "all", search = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status !== "all" && { status }),
      ...(search && { search }),
    });
    return this.request(`/admin/support-chats?${params.toString()}`);
  }

  async getSupportChatById(chatId: string) {
    return this.request(`/admin/support-chats/${chatId}`);
  }

  async sendSupportChatReply(chatId: string, message: string) {
    return this.request(`/admin/support-chats/${chatId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async sendSupportChatEmailReply(chatId: string, message: string) {
    return this.request(`/admin/support-chats/${chatId}/email-reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async updateSupportChatStatus(chatId: string, status: string) {
    return this.request(`/admin/support-chats/${chatId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async getSupportChatsCount() {
    return this.request("/admin/support-chats-count");
  }

  async getSupportChatsStats() {
    return this.request("/admin/support-chats-stats");
  }

  // Messages endpoints (Admin)
  async getMessagesCount() {
    return this.request("/admin/messages-count");
  }

  async getMessages(page = 1, limit = 20, search = "", chatId = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(chatId && { chatId }),
    });
    return this.request(`/admin/messages?${params.toString()}`);
  }

  async getMessageById(messageId: string) {
    return this.request(`/admin/messages/${messageId}`);
  }

  // Chat History endpoints (Admin)
  async getChatsCount() {
    return this.request("/admin/chats-count");
  }

  async getChats(page = 1, limit = 20, search = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return this.request(`/admin/chats?${params.toString()}`);
  }

  async getChatById(id: string) {
    return this.request(`/admin/chats/${id}`);
  }

  async getChatHistory(chatId: string, page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/admin/chats/${chatId}/messages?${params.toString()}`);
  }

  async getChatMessages(chatId: string) {
    return this.request(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, message: string) {
    return this.request(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }
}

export const apiService = new ApiService();
export default apiService;
