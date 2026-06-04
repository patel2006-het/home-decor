import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession } from "@/lib/db";

const generateCommentId = () => {
  return `comment_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
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

    const hasAccess = await verifyAccess(project, sessionUser);
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(project.comments || [], { status: 200 });
  } catch (error) {
    console.error("[Comments GET API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { text, roomId } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Comment text cannot be empty" }, { status: 400 });
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

    // Require collaborator/owner write access
    const hasAccess = await verifyAccess(project, sessionUser);
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const newComment = {
      id: generateCommentId(),
      authorName: sessionUser.name,
      text: text.trim(),
      roomId: roomId || null,
      createdAt: new Date().toISOString(),
    };

    await projectsCollection.updateOne(
      { id },
      {
        $push: { comments: newComment },
        $set: { updatedAt: new Date().toISOString() },
        $inc: { version: 1 }
      }
    );

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("[Comments POST API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error posting comment" },
      { status: 500 }
    );
  }
}
