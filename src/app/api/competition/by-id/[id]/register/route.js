import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";
import { verifyToken } from "@/middlewares/auth";
import { verifyCompetitor } from "@/middlewares/verifyCompetitor";

// POST /api/competition/by-id/:competitionId/register - Competitor only
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

    const { competitionId } = await params;
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

    // Check if registration is open
    if (!competition.registrationOpen) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration is closed for this competition",
        },
        { status: 400 }
      );
    }

    // Check if user already in participants
    const isAlreadyParticipant = competition.participants.some(
      (id) => id.toString() === userId
    );

    if (isAlreadyParticipant) {
      return NextResponse.json(
        {
          success: false,
          message: "User already registered for this competition",
        },
        { status: 400 }
      );
    }

    // Check if user already in waitlist
    const isInWaitlist = competition.waitlist.some(
      (item) => item.user.toString() === userId
    );

    if (isInWaitlist) {
      return NextResponse.json(
        {
          success: false,
          message: "User already in waitlist for this competition",
        },
        { status: 400 }
      );
    }

    // Add user to waitlist
    competition.waitlist.push({
      user: userId,
      appliedAt: new Date(),
      status: 'pending',
    });

    await competition.save();

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully. Waiting for admin approval.",
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