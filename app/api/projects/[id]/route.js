import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession, decomposeDesign, recomposeDesign } from "@/lib/db";

const generateId = () => {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateDesignId = () => {
  return `design_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get active user details from session
async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("havendecor_session_id");
  if (sessionCookie && sessionCookie.value) {
    return decryptSession(sessionCookie.value);
  }
  return null;
}

// Check if current user has read or write access
async function checkAccess(project, request, requireEditor = false) {
  const sessionUser = await getSessionUser();
  const activeUserId = sessionUser?.id || "guest";
  const activeUserEmail = sessionUser?.email || null;

  if (project.userId === "guest" || !project.userId) {
    return true;
  }

  if (project.userId === activeUserId) {
    return true;
  }

  const collaborators = project.collaborators || [];
  const col = collaborators.find(
    (c) => c.userId === activeUserId || (activeUserEmail && c.email.toLowerCase() === activeUserEmail.toLowerCase())
  );

  if (col) {
    if (requireEditor && col.role === "viewer") {
      return false;
    }
    return true;
  }

  return false;
}

// Check if current user is the owner (for delete or admin operations)
async function isProjectOwner(project) {
  const sessionUser = await getSessionUser();
  const activeUserId = sessionUser?.id || "guest";

  if (project.userId === "guest" || !project.userId) {
    return true;
  }

  return project.userId === activeUserId;
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const designsCollection = db.collection("Designs");

    const project = await projectsCollection.findOne({ id });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const hasAccess = await checkAccess(project, request, false);
    if (!hasAccess) {
      return NextResponse.json(
        { message: "You do not have permission to view this project" },
        { status: 403 }
      );
    }

    const designDoc = await designsCollection.findOne({ designId: project.designId });
    const designData = recomposeDesign(designDoc);

    const { _id, ...rest } = project;
    return NextResponse.json(
      {
        ...rest,
        _id: _id.toString(),
        designData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Project GET API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error fetching project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { designData, updates } = await request.json();

    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const designsCollection = db.collection("Designs");

    const project = await projectsCollection.findOne({ id });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Verify write access
    const hasWriteAccess = await checkAccess(project, request, true);
    if (!hasWriteAccess) {
      return NextResponse.json(
        { message: "You do not have permission to modify this project" },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();
    const projectUpdates = {
      updatedAt: now,
      version: (project.version || 1) + 1
    };

    if (updates?.name?.trim()) {
      projectUpdates.name = updates.name.trim();
    }

    // Update design data if provided
    if (designData) {
      const decomposed = decomposeDesign(project.designId, designData);
      if (decomposed) {
        await designsCollection.updateOne(
          { designId: project.designId },
          { $set: decomposed },
          { upsert: true }
        );
      }
    }

    // Update project metadata
    await projectsCollection.updateOne({ id }, { $set: projectUpdates });

    const updatedProjectDoc = await projectsCollection.findOne({ id });
    const finalDesignDoc = await designsCollection.findOne({ designId: project.designId });
    const finalDesignData = recomposeDesign(finalDesignDoc);

    const { _id, ...rest } = updatedProjectDoc;
    return NextResponse.json(
      {
        ...rest,
        _id: _id.toString(),
        designData: finalDesignData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Project PUT API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error updating project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const designsCollection = db.collection("Designs");

    const project = await projectsCollection.findOne({ id });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Verify ownership (only the project owner/creator can delete)
    const isOwner = await isProjectOwner(project);
    if (!isOwner) {
      return NextResponse.json(
        { message: "You do not have permission to delete this project. Only the project owner can perform this action." },
        { status: 403 }
      );
    }

    // Delete both project metadata and design payload
    await projectsCollection.deleteOne({ id });
    await designsCollection.deleteOne({ designId: project.designId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Project DELETE API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error deleting project" },
      { status: 500 }
    );
  }
}

// POST to duplicate a project
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { userId: requestUserId } = await request.json();

    // Enforce active session userId if authenticated
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");
    let activeUserId = requestUserId || "guest";

    if (sessionCookie && sessionCookie.value) {
      const sessionUser = decryptSession(sessionCookie.value);
      if (sessionUser) {
        activeUserId = sessionUser.id;
      }
    }

    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const designsCollection = db.collection("Designs");

    // Get original project
    const project = await projectsCollection.findOne({ id });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const designDoc = await designsCollection.findOne({ designId: project.designId });
    if (!designDoc) {
      return NextResponse.json({ message: "Design data not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const duplicatedProjectId = generateId();
    const duplicatedDesignId = generateDesignId();

    // Copy and insert design data
    const newDesignDoc = {
      ...designDoc,
      _id: undefined, // Let Mongo generate a new _id
      designId: duplicatedDesignId,
    };
    await designsCollection.insertOne(newDesignDoc);

    // Copy and insert project metadata
    const duplicatedProject = {
      id: duplicatedProjectId,
      userId: activeUserId,
      name: `${project.name} (Copy)`,
      designId: duplicatedDesignId,
      createdAt: now,
      updatedAt: now,
    };

    await projectsCollection.insertOne(duplicatedProject);

    const finalDesignData = recomposeDesign(newDesignDoc);

    return NextResponse.json(
      {
        id: duplicatedProject.id,
        userId: duplicatedProject.userId,
        name: duplicatedProject.name,
        createdAt: duplicatedProject.createdAt,
        updatedAt: duplicatedProject.updatedAt,
        designData: finalDesignData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Project Duplicate API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error duplicating project" },
      { status: 500 }
    );
  }
}
