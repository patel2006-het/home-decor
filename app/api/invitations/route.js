import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession } from "@/lib/db";

const generateId = () => {
  return `invite_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
};

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = decryptSession(sessionCookie.value);
    if (!sessionUser || !sessionUser.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const invitesCollection = db.collection("Invitations");

    // Fetch pending invitations for this user's email (case-insensitive)
    const query = {
      inviteeEmail: { $regex: new RegExp(`^${sessionUser.email}$`, "i") },
      status: "pending",
    };

    const invites = await invitesCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(invites, { status: 200 });
  } catch (error) {
    console.error("[Invitations GET API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error fetching invitations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = decryptSession(sessionCookie.value);
    if (!sessionUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, inviteeEmail, role = "editor" } = await request.json();

    if (!projectId || !inviteeEmail) {
      return NextResponse.json({ message: "Project ID and Invitee Email are required" }, { status: 400 });
    }

    const db = await getDb();
    const projectsCollection = db.collection("Projects");
    const invitesCollection = db.collection("Invitations");

    // Verify the project exists
    const project = await projectsCollection.findOne({ id: projectId });
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Verify that the current user is the owner of the project
    if (project.userId !== sessionUser.id) {
      return NextResponse.json(
        { message: "Only the project owner can invite collaborators" },
        { status: 403 }
      );
    }

    // Check if the collaborator is already added
    const collaborators = project.collaborators || [];
    const alreadyCollaborator = collaborators.some(
      (c) => c.email.toLowerCase() === inviteeEmail.toLowerCase()
    );
    if (alreadyCollaborator) {
      return NextResponse.json(
        { message: `${inviteeEmail} is already a collaborator on this project` },
        { status: 400 }
      );
    }

    // Check if there is already a pending invitation for this email on this project
    const existingInvite = await invitesCollection.findOne({
      projectId,
      inviteeEmail: { $regex: new RegExp(`^${inviteeEmail}$`, "i") },
      status: "pending",
    });
    if (existingInvite) {
      return NextResponse.json(
        { message: `A pending invitation has already been sent to ${inviteeEmail}` },
        { status: 400 }
      );
    }

    // Create the invitation document
    const inviteId = generateId();
    const newInvite = {
      id: inviteId,
      projectId,
      projectName: project.name,
      inviteeEmail: inviteeEmail.trim(),
      inviterName: sessionUser.name,
      inviterEmail: sessionUser.email,
      role,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await invitesCollection.insertOne(newInvite);

    return NextResponse.json(newInvite, { status: 251 });
  } catch (error) {
    console.error("[Invitations POST API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error sending invitation" },
      { status: 500 }
    );
  }
}
