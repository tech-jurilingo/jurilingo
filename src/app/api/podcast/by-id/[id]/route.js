import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Podcast from "@/models/Podcast";

// GET /api/podcast/:id
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const podcast = await Podcast.findById(id);

    if (!podcast) {
      return NextResponse.json(
        {
          success: false,
          message: "Podcast not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      podcast,
    });
  } catch (error) {
    console.error("Error fetching podcast by id:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching podcast",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Verify admin role
    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck;
    }

    await dbConnect();

    const { id } = await params;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid podcast ID",
        },
        { status: 400 }
      );
    }

    const podcast = await Podcast.findByIdAndDelete(id);

    if (!podcast) {
      return NextResponse.json(
        {
          success: false,
          message: "Podcast not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Podcast deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while deleting podcast",
      },
      { status: 500 }
    );
  }
}