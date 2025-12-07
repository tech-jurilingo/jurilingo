import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";
import { verifyToken } from "@/middleware/auth";
import { verifyCompetitor } from "@/middleware/verifyCompetitor";

// POST /api/competition/:competitionId/register - Competitor only
export async function POST(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    // Verify competitor role
    const competitorCheck = verifyCompetitor(authResult);
    if (competitorCheck) {
      return competitorCheck; // Return forbidden error
    }

    const { competitionId } = params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find competition
    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: "Competition not found",
        },
        { status: 404 }
      );
    }

    // Check if user already registered
    const isAlreadyRegistered = competition.participants.some(
      (id) => id.toString() === userId
    );

    if (isAlreadyRegistered) {
      return NextResponse.json(
        {
          success: false,
          message: "User already registered for this competition",
        },
        { status: 400 }
      );
    }

    // Add user
    competition.participants.push(userId);
    await competition.save();

    return NextResponse.json({
      success: true,
      message: "User successfully registered for the competition",
      competition,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration",
      },
      { status: 500 }
    );
  }
}