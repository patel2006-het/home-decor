import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession, decomposeDesign, recomposeDesign } from "@/lib/db";

const generateId = () => {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateDesignId = () => {
  return `design_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

export async function GET(request) {
  try {
    // Determine active userId from session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");
    let activeUserId = "guest";

    if (sessionCookie && sessionCookie.value) {
      const sessionUser = decryptSession(sessionCookie.value);
      if (sessionUser) {
        activeUserId = sessionUser.id;
      }
    }

    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const designsCollection = db.collection("Designs");

    // Filter projects matching current userId
    const query = activeUserId === "guest"
      ? { $or: [{ userId: { $exists: false } }, { userId: "guest" }] }
      : { userId: activeUserId };

    const projects = await projectsCollection.find(query).sort({ updatedAt: -1 }).toArray();

    // Fetch design details in one batch for scalability
    const designIds = projects.map((p) => p.designId).filter(Boolean);
    const designs = await designsCollection.find({ designId: { $in: designIds } }).toArray();
    const designsMap = new Map(designs.map((d) => [d.designId, d]));

    // Recompose designs
    const projectsWithData = projects.map((project) => {
      const designDoc = designsMap.get(project.designId);
      const designData = recomposeDesign(designDoc);
      
      // Map MongoDB _id object to string, cleanup designId reference if needed
      const { _id, ...rest } = project;
      return {
        ...rest,
        _id: _id.toString(),
        designData,
      };
    });

    return NextResponse.json(projectsWithData, { status: 200 });
  } catch (error) {
    console.error("[Projects GET API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error fetching projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, designData, userId: requestUserId } = await request.json();

    // Enforce userId from session if authenticated
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

    const projectId = generateId();
    const designId = generateDesignId();
    const now = new Date().toISOString();

    // Decompose and insert design data
    const decomposed = decomposeDesign(designId, designData);
    if (decomposed) {
      await designsCollection.insertOne(decomposed);
    }

    // Insert project metadata
    const newProject = {
      id: projectId,
      userId: activeUserId,
      name: name?.trim() || "Untitled Design",
      designId,
      createdAt: now,
      updatedAt: now,
    };

    await projectsCollection.insertOne(newProject);

    // Recompose response object
    const createdProject = {
      id: newProject.id,
      userId: newProject.userId,
      name: newProject.name,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
      designData,
    };

    return NextResponse.json(createdProject, { status: 201 });
  } catch (error) {
    console.error("[Projects POST API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error creating project" },
      { status: 500 }
    );
  }
}
