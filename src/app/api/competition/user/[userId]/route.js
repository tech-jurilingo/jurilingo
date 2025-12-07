import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";

// GET /api/competition/user/:userId
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    const competitions = await Competition.find({
      participants: userId,
    })
      .sort({ endDate: 1 })
      .populate("participants");

    return NextResponse.json({
      success: true,
      competitions,
    });
  } catch (error) {
    console.error("Error fetching competitions by user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching competitions for user",
      },
      { status: 500 }
    );
  }
}