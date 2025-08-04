import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiService from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const getToken = (): string | null => {
    return localStorage.getItem("authToken");
  };

  const setToken = (token: string) => {
    localStorage.setItem("authToken", token);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (token && isTokenValid(token)) {
        try {
          // Set the token in API service for subsequent requests
          apiService.setAuthToken(token);

          // Try to get current user data
          const userData = (await apiService.getCurrentUser()) as any;
          setUser(userData);
        } catch (error) {
          console.error("Token validation failed:", error);
          removeToken();
          setUser(null);
        }
      } else {
        removeToken();
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = (await apiService.login(email, password)) as any;

      // Handle different response structures
      let token, userData;

      if (response.token) {
        // Direct token in response
        token = response.token;
        userData = response.user || { email, role: "admin" };
      } else if (response.data && response.data.token) {
        // Token in data object
        token = response.data.token;
        userData = response.data.user || { email, role: "admin" };
      } else if (response.success && response.data) {
        // Success wrapper
        token = response.data.token;
        userData = response.data.user || { email, role: "admin" };
      } else {
        // Assume the response itself is the token or user data
        token = response.token || response.accessToken || response;
        userData = response.user || { email, role: "admin" };
      }

      if (token) {
        setToken(token);
        apiService.setAuthToken(token);
        setUser(userData);
      } else {
        throw new Error("No token received from server");
      }
    } catch (error: any) {
      removeToken();
      setUser(null);
      throw new Error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to call logout endpoint if token exists
      const token = getToken();
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      setUser(null);
      apiService.clearAuthToken();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
