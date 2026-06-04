/**
 * Service to manage project lifecycle (CRUD) simulating a database layer.
 * Persists data to localStorage and is fully async to prepare for MongoDB.
 */

// Helper to generate a unique project ID
const generateId = () => {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

// Simulate network delay to mimic real API calls
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectService = {
  /**
   * Internal helper to load all raw projects from localStorage
   */
  async _getRawProjects() {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem("havendecor_projects");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("[ProjectService] Failed to load raw projects:", e);
      return [];
    }
  },

  /**
   * Get all projects from storage filtered by user ID
   */
  async getAllProjects(userId = "guest") {
    await delay();
    const projects = await this._getRawProjects();

    // Filter projects matching userId (or legacy projects without userId if guest)
    const filtered = projects.filter((p) => {
      if (userId === "guest") {
        return !p.userId || p.userId === "guest";
      }
      return p.userId === userId;
    });

    // Sort by updatedAt descending so newest shows first
    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  /**
   * Get a single project by ID
   */
  async getProjectById(id) {
    await delay();
    const projects = await this._getRawProjects();
    return projects.find((p) => p.id === id) || null;
  },

  /**
   * Create a new project
   */
  async createProject(name, designData, userId = "guest") {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");
    
    const now = new Date().toISOString();
    const newProject = {
      id: generateId(),
      userId,
      name: name?.trim() || "Untitled Design",
      createdAt: now,
      updatedAt: now,
      designData: JSON.parse(JSON.stringify(designData)), // Deep copy state
    };

    try {
      const projects = await this._getRawProjects();
      projects.push(newProject);
      localStorage.setItem("havendecor_projects", JSON.stringify(projects));
      return newProject;
    } catch (e) {
      console.error("[ProjectService] Failed to create project:", e);
      throw new Error("Failed to save project. Storage might be full.");
    }
  },

  /**
   * Save (Update) an existing project
   */
  async updateProject(id, designData, updates = {}) {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    try {
      const projects = await this._getRawProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Project ${id} not found`);
      }

      const now = new Date().toISOString();
      projects[index] = {
        ...projects[index],
        ...updates,
        designData: designData ? JSON.parse(JSON.stringify(designData)) : projects[index].designData,
        updatedAt: now,
      };

      localStorage.setItem("havendecor_projects", JSON.stringify(projects));
      return projects[index];
    } catch (e) {
      console.error(`[ProjectService] Failed to update project ${id}:`, e);
      throw e;
    }
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
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    try {
      const projects = await this._getRawProjects();
      const filtered = projects.filter((p) => p.id !== id);
      localStorage.setItem("havendecor_projects", JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error(`[ProjectService] Failed to delete project ${id}:`, e);
      throw e;
    }
  },

  /**
   * Duplicate a project
   */
  async duplicateProject(id, userId = "guest") {
    await delay();
    if (typeof window === "undefined") throw new Error("Window is undefined");

    try {
      const project = await this.getProjectById(id);
      if (!project) throw new Error("Project not found");

      const now = new Date().toISOString();
      const duplicated = {
        id: generateId(),
        userId: userId || project.userId || "guest",
        name: `${project.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
        designData: JSON.parse(JSON.stringify(project.designData)),
      };

      const projects = await this._getRawProjects();
      projects.push(duplicated);
      localStorage.setItem("havendecor_projects", JSON.stringify(projects));
      return duplicated;
    } catch (e) {
      console.error(`[ProjectService] Failed to duplicate project ${id}:`, e);
      throw e;
    }
  },

  /**
   * Encode design state for sharing via URL
   */
  encodeShareLink(designData) {
    try {
      const payloadStr = JSON.stringify(designData);
      // Safe UTF-8 base64 encoding
      return btoa(encodeURIComponent(payloadStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
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
      const decodedBytes = atob(encodedStr).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join("");
      const payloadStr = decodeURIComponent(decodedBytes);
      return JSON.parse(payloadStr);
    } catch (e) {
      console.error("[ProjectService] Failed to decode design:", e);
      return null;
    }
  }
};
