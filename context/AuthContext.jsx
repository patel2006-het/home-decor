"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/authService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const sessionUser = await authService.getCurrentSession();
        setUser(sessionUser);
      } catch (e) {
        console.error("[AuthContext] Failed to restore session:", e);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const sessionUser = await authService.login(email, password);
      setUser(sessionUser);
      return sessionUser;
    } catch (e) {
      setLoading(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const sessionUser = await authService.signup(name, email, password);
      setUser(sessionUser);
      return sessionUser;
    } catch (e) {
      setLoading(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (e) {
      console.error("[AuthContext] Logout failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error("Not authenticated");
    setLoading(true);
    try {
      const sessionUser = await authService.updateProfile(user.id, updates);
      setUser(sessionUser);
      return sessionUser;
    } catch (e) {
      setLoading(false);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
