import { NextResponse } from "next/server";

export function verifyCompetitor(authResult) {
  if (authResult.role !== "competitor") {
    return NextResponse.json(
      { message: "Forbidden: Competitor access required" },
      { status: 403 }
    );
  }
  
  return null; // No error, proceed
}