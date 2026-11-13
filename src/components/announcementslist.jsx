
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
  try {
    // Verify admin access
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);

    if (adminCheck) {
      return adminCheck;
    }

    // Validate announcement ID
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid announcement ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the announcement
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }

    // Identify associated GridFS banner image
    const imageMatch = announcement.imageUrl?.match(
      /^\/api\/announcement\/image\/([a-f\d]{24})$/i
    );

    // Delete associated GridFS image if present
    if (imageMatch) {
      try {
        const bucket = new mongoose.mongo.GridFSBucket(
          mongoose.connection.db,
          { bucketName: "announcementImages" }
        );

        await bucket.delete(
          new mongoose.Types.ObjectId(imageMatch[1])
        );
      } catch (imageError) {
        console.error("Banner image deletion error:", imageError);
      }
    }

    // Delete announcement from MongoDB
    await Announcement.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });

  } catch (error) {
    console.error("Announcement deletion error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete announcement",
      },
      { status: 500 }
    );
  }
}
