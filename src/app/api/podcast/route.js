import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Podcast from "@/models/Podcast";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// POST /api/podcast - Admin only
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
    const { title, youtubeUrl } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and youtubeUrl are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const podcast = await Podcast.create({ title, youtubeUrl });

    return NextResponse.json(
      {
        success: true,
        message: "Podcast created successfully",
        podcast,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating podcast:", error);

    // Handle invalid YouTube URL error from pre('validate')
    if (error.message === "Invalid YouTube URL") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid YouTube URL",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error while creating podcast",
      },
      { status: 500 }
    );
  }
}

// GET /api/podcast
export async function GET(request) {
  try {
    await dbConnect();

    const podcasts = await Podcast.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      podcasts,
    });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching podcasts",
      },
      { status: 500 }
    );
  }
}