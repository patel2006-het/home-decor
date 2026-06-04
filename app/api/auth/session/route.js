import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, hashPassword, encryptSession, decryptSession } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(null, { status: 200 });
    }

    const sessionUser = decryptSession(sessionCookie.value);
    if (!sessionUser) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(sessionUser, { status: 200 });
  } catch (error) {
    console.error("[Session GET API] Error:", error);
    return NextResponse.json(null, { status: 200 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("havendecor_session_id");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const sessionUser = decryptSession(sessionCookie.value);
    if (!sessionUser) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const { name, password } = await request.json();

    const db = await getDb();
    const usersCollection = db.collection("Users");

    const user = await usersCollection.findOne({ id: sessionUser.id });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updates = {};
    if (name?.trim()) {
      updates.name = name.trim();
    }
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      updates.passwordHash = hashPassword(password);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(sessionUser, { status: 200 });
    }

    await usersCollection.updateOne({ id: sessionUser.id }, { $set: updates });

    // Re-encrypt the session cookie with updated metadata
    const updatedSessionUser = {
      ...sessionUser,
      name: updates.name || sessionUser.name,
    };

    const token = encryptSession(updatedSessionUser);
    cookieStore.set("havendecor_session_id", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(updatedSessionUser, { status: 200 });
  } catch (error) {
    console.error("[Session PUT API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error updating profile" },
      { status: 500 }
    );
  }
}
