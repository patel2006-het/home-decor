import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, hashPassword, encryptSession } from "@/lib/db";

const generateUserId = () => {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
};

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const emailNormalized = email?.trim().toLowerCase();

    if (!name?.trim() || !emailNormalized || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("Users");

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email: emailNormalized });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email address already registered" },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);
    const userId = generateUserId();
    const createdAt = new Date().toISOString();

    const newUser = {
      id: userId,
      name: name.trim(),
      email: emailNormalized,
      passwordHash,
      createdAt,
    };

    await usersCollection.insertOne(newUser);

    // Create session object
    const sessionUser = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      createdAt,
    };

    // Encrypt and set HTTP-only cookie
    const token = encryptSession(sessionUser);
    const cookieStore = await cookies();
    cookieStore.set("havendecor_session_id", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(sessionUser, { status: 201 });
  } catch (error) {
    console.error("[Signup API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
