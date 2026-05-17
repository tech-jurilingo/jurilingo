import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// DELETE /api/announcement/by-id/[id] - Admin only
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck;
    }

    const { id } = await params;

    await dbConnect();

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting announcement" },
      { status: 500 }
    );
  }
}
