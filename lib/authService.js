/**
 * Service to manage user authentication simulating a database layer.
 * Persists data to localStorage and is fully async to prepare for MongoDB.
 */

// Helper to generate a unique user ID
const generateUserId = () => {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
};

// Simulate network delay to mimic real API responses
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Get all registered users from storage (internal use)
   */
  async _getUsers() {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem("havendecor_users");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("[AuthService] Failed to parse users:", e);
      return [];
    }
  },

  /**
   * Register/Sign Up a new user
   */
  async signup(name, email, password) {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    const emailNormalized = email?.trim().toLowerCase();
    if (!name?.trim() || !emailNormalized || !password) {
      throw new Error("All fields are required");
    }

    const users = await this._getUsers();
    const exists = users.some((u) => u.email === emailNormalized);
    if (exists) {
      throw new Error("Email address already registered");
    }

    const newUser = {
      id: generateUserId(),
      name: name.trim(),
      email: emailNormalized,
      passwordHash: password, // Note: Storing plain text mock. bcrypt would be used with a database
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("havendecor_users", JSON.stringify(users));

    // Save session automatically
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
    localStorage.setItem("havendecor_session", JSON.stringify(sessionUser));
    return sessionUser;
  },

  /**
   * Login user
   */
  async login(email, password) {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    const emailNormalized = email?.trim().toLowerCase();
    if (!emailNormalized || !password) {
      throw new Error("Email and password are required");
    }

    const users = await this._getUsers();
    const user = users.find((u) => u.email === emailNormalized);
    if (!user || user.passwordHash !== password) {
      throw new Error("Invalid email address or password");
    }

    const sessionUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    localStorage.setItem("havendecor_session", JSON.stringify(sessionUser));
    return sessionUser;
  },

  /**
   * Logout user
   */
  async logout() {
    await delay(100);
    if (typeof window === "undefined") return;
    localStorage.removeItem("havendecor_session");
  },

  /**
   * Get currently logged in session user
   */
  async getCurrentSession() {
    await delay(50);
    if (typeof window === "undefined") return null;
    try {
      const session = localStorage.getItem("havendecor_session");
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.error("[AuthService] Failed to read session:", e);
      return null;
    }
  },

  /**
   * Update user profile settings
   */
  async updateProfile(userId, updates = {}) {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    const users = await this._getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error("User not found");
    }

    // Merge changes
    const updatedUser = { ...users[index] };
    if (updates.name?.trim()) {
      updatedUser.name = updates.name.trim();
    }
    if (updates.password) {
      updatedUser.passwordHash = updates.password;
    }

    users[index] = updatedUser;
    localStorage.setItem("havendecor_users", JSON.stringify(users));

    // Update active session metadata
    const sessionUser = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, createdAt: updatedUser.createdAt };
    localStorage.setItem("havendecor_session", JSON.stringify(sessionUser));
    return sessionUser;
  }
};
