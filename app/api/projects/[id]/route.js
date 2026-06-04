import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession, decomposeDesign, recomposeDesign } from "@/lib/db";

const generateId = () => {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateDesignId = () => {
  return `design_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if current session user owns the project or if it's a guest project
async function checkOwnership(project, request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("havendecor_session_id");
  let activeUserId = "guest";

  if (sessionCookie && sessionCookie.value) {
    const sessionUser = decryptSession(sessionCookie.value);
    if (sessionUser) {
      activeUserId = sessionUser.id;
    }
  }

  // Guest projects can be edited by guest session
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

    // Verify ownership
    const isOwner = await checkOwnership(project, request);
    if (!isOwner) {
      return NextResponse.json(
        { message: "You do not have permission to modify this project" },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();
    const projectUpdates = { updatedAt: now };

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

    // Verify ownership
    const isOwner = await checkOwnership(project, request);
    if (!isOwner) {
      return NextResponse.json(
        { message: "You do not have permission to delete this project" },
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
