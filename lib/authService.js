/**
 * Client service to manage user authentication by communicating with API Route Handlers.
 * Rewritten from localStorage mock to query the MongoDB backend asynchronously.
 */

export const authService = {
  /**
   * Register/Sign Up a new user
   */
  async signup(name, email, password) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to sign up");
    }

    return res.json();
  },

  /**
   * Login user
   */
  async login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to log in");
    }

    return res.json();
  },

  /**
   * Logout user
   */
  async logout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!res.ok) {
      console.error("[AuthService] Remote logout failed");
    }
  },

  /**
   * Get currently logged in session user
   */
  async getCurrentSession() {
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.error("[AuthService] Failed to fetch active session:", e);
      return null;
    }
  },

  /**
   * Update user profile settings
   */
  async updateProfile(userId, updates = {}) {
    const res = await fetch("/api/auth/session", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update profile settings");
    }

    return res.json();
  }
};
