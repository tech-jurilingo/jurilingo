import { NextResponse } from "next/server";

export function verifyAdmin(authResult) {
  if (authResult.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }
  
  return null; // No error, proceed
}