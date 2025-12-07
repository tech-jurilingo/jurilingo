import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";

// GET /api/competition/active/
export async function GET(request) {
  try {
    await dbConnect();

    const competitions = await Competition.find({
      status: "active",
    }).sort({ endDate: 1 });

    return NextResponse.json({
      success: true,
      competitions,
    });
  } catch (error) {
    console.error("Error fetching active competitions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching active competitions",
      },
      { status: 500 }
    );
  }
}