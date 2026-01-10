import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You can decode JWT to get user info or fetch user data from backend
      try {
        // Basic JWT decode (base64url)
        const base64UrlDecode = (str) => {
          str = str.replace(/-/g, '+').replace(/_/g, '/');
          while (str.length % 4) str += '=';
          return atob(str);
        };
        const decoded = JSON.parse(base64UrlDecode(token.split(".")[1]));
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login(email, password);
      const base64UrlDecode = (str) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        return atob(str);
      };
      const decoded = JSON.parse(base64UrlDecode(data.access_token.split(".")[1]));
      setUser(decoded);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password, avatar = null) => {
    try {
      setError(null);
      await authAPI.register(username, email, password, avatar);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (avatar) => {
    try {
      setError(null);
      await authAPI.updateProfile(avatar);
      // Update user state
      setUser({ ...user, avatar });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

