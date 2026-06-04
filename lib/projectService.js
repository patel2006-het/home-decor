/**
 * Client service to manage project lifecycle (CRUD) by communicating with API Route Handlers.
 * Rewritten from localStorage mock to query the MongoDB backend asynchronously.
 */

export const projectService = {
  /**
   * Get all projects filtered by user ID (or guest)
   */
  async getAllProjects(userId = "guest") {
    const res = await fetch(`/api/projects?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) {
      throw new Error("Failed to load projects");
    }
    return res.json();
  },

  /**
   * Get a single project by ID
   */
  async getProjectById(id) {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.error(`[ProjectService] Failed to load project ${id}:`, e);
      return null;
    }
  },

  /**
   * Create a new project
   */
  async createProject(name, designData, userId = "guest") {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, designData, userId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create project");
    }

    return res.json();
  },

  /**
   * Save (Update) an existing project
   */
  async updateProject(id, designData, updates = {}) {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ designData, updates }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save project changes");
    }

    return res.json();
  },

  /**
   * Rename a project
   */
  async renameProject(id, newName) {
    if (!newName || !newName.trim()) throw new Error("Name cannot be empty");
    return this.updateProject(id, null, { name: newName.trim() });
  },

  /**
   * Delete a project
   */
  async deleteProject(id) {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete project");
    }

    return true;
  },

  /**
   * Duplicate a project
   */
  async duplicateProject(id, userId = "guest") {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to duplicate project");
    }

    return res.json();
  },

  /**
   * Encode design state for sharing via URL
   */
  encodeShareLink(designData) {
    try {
      const payloadStr = JSON.stringify(designData);
      // Safe UTF-8 base64 encoding
      return btoa(
        encodeURIComponent(payloadStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        })
      );
    } catch (e) {
      console.error("[ProjectService] Failed to encode design:", e);
      return null;
    }
  },

  /**
   * Decode shared state from URL
   */
  decodeShareLink(encodedStr) {
    try {
      const decodedBytes = atob(encodedStr)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("");
      const payloadStr = decodeURIComponent(decodedBytes);
      return JSON.parse(payloadStr);
    } catch (e) {
      console.error("[ProjectService] Failed to decode design:", e);
      return null;
    }
  }
};
