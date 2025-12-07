import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";

// GET /api/competition/:id
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const competition = await Competition.findById(id).populate("participants");

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: "Competition not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      competition,
    });
  } catch (error) {
    console.error("Error fetching competition by id:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching competition",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/competition/:id - Admin only
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
          message: "Invalid competition ID",
        },
        { status: 400 }
      );
    }

    const competition = await Competition.findByIdAndDelete(id);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: "Competition not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Competition deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting competition:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while deleting competition",
      },
      { status: 500 }
    );
  }
}