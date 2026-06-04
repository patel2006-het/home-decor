import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession } from "@/lib/db";

async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("havendecor_session_id");
  if (sessionCookie && sessionCookie.value) {
    return decryptSession(sessionCookie.value);
  }
  return null;
}

async function verifyAccess(project, sessionUser) {
  if (!sessionUser) return false;
  if (project.userId === "guest" || !project.userId) return true;
  if (project.userId === sessionUser.id) return true;

  const collaborators = project.collaborators || [];
  return collaborators.some(
    (c) => c.userId === sessionUser.id || c.email.toLowerCase() === sessionUser.email.toLowerCase()
  );
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (status !== "approved" && status !== "rejected" && status !== "pending") {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const projectsCollection = db.collection("Projects");

    const project = await projectsCollection.findOne({ id });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Check collaborator access
    const hasAccess = await verifyAccess(project, sessionUser);
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const now = new Date().toISOString();
    const systemComment = {
      id: `system_${Date.now().toString(36)}`,
      authorName: "System",
      text: `Design review status updated to "${status.toUpperCase()}" by ${sessionUser.name}`,
      roomId: null,
      createdAt: now,
    };

    await projectsCollection.updateOne(
      { id },
      {
        $set: { reviewStatus: status, updatedAt: now },
        $push: { comments: systemComment },
        $inc: { version: 1 }
      }
    );

    return NextResponse.json({ success: true, reviewStatus: status, systemComment }, { status: 200 });
  } catch (error) {
    console.error("[Review POST API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error submitting review" },
      { status: 500 }
    );
  }
}
