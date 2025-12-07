import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies();
  
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "lax",
  });

  return NextResponse.json({ message: "Logged out successfully" });
}