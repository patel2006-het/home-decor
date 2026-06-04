import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("havendecor_session_id");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Logout API] Error:", error);
    return NextResponse.json(
      { message: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
