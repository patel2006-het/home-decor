import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, hashPassword, encryptSession } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const emailNormalized = email?.trim().toLowerCase();

    if (!emailNormalized || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("Users");

    // Find the user
    const user = await usersCollection.findOne({ email: emailNormalized });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email address or password" },
        { status: 401 }
      );
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return NextResponse.json(
        { message: "Invalid email address or password" },
        { status: 401 }
      );
    }

    // Create session object
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    // Encrypt and set cookie
    const token = encryptSession(sessionUser);
    const cookieStore = await cookies();
    cookieStore.set("havendecor_session_id", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(sessionUser, { status: 200 });
  } catch (error) {
    console.error("[Login API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error during login" },
      { status: 500 }
    );
  }
}
