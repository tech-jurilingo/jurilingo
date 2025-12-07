import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// POST /api/competition - Admin only
export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    // Verify admin role
    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck; // Return forbidden error
    }

    const body = await request.json();
    const {
      title,
      description,
      registrationFee,
      startDate,
      endDate,
      registrationStartDate,
      registrationEndDate,
    } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, startDate, and endDate are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const competition = await Competition.create({
      title,
      description,
      registrationFee,
      date,
      startDate,
      endDate,
      registrationStartDate,
      registrationEndDate,
      status: status || "active",
      participants: participants || [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Competition created successfully",
        competition,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating competition:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while creating competition",
      },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  try {
    await dbConnect();

    const competitions = await Competition.find({
      status: { $in: ["active", "inactive"] },
    }).sort({ endDate: 1 });

    return NextResponse.json({
      success: true,
      competitions,
    });
  } catch (error) {
    console.error("Error fetching competitions by status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching competitions",
      },
      { status: 500 }
    );
  }
}