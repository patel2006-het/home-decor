import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, decryptSession } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (status !== "accepted" && status !== "rejected") {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

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
    const projectsCollection = db.collection("Projects");

    // Fetch the invitation
    const invite = await invitesCollection.findOne({ id });
    if (!invite) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // Verify invitee email matches active session user email
    if (invite.inviteeEmail.toLowerCase() !== sessionUser.email.toLowerCase()) {
      return NextResponse.json(
        { message: "You do not have permission to respond to this invitation" },
        { status: 403 }
      );
    }

    if (invite.status !== "pending") {
      return NextResponse.json(
        { message: `This invitation has already been ${invite.status}` },
        { status: 400 }
      );
    }

    // Update invitation status
    await invitesCollection.updateOne({ id }, { $set: { status, updatedAt: new Date().toISOString() } });

    // If accepted, add collaborator to the project
    if (status === "accepted") {
      const project = await projectsCollection.findOne({ id: invite.projectId });
      if (project) {
        const collaborator = {
          userId: sessionUser.id,
          email: sessionUser.email.toLowerCase(),
          name: sessionUser.name,
          role: invite.role || "editor",
        };

        await projectsCollection.updateOne(
          { id: invite.projectId },
          {
            $push: { collaborators: collaborator },
            $set: { updatedAt: new Date().toISOString() },
            $inc: { version: 1 }
          }
        );
      }
    }

    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error) {
    console.error("[Invitation PUT API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error updating invitation" },
      { status: 500 }
    );
  }
}
