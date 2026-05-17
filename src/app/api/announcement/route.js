import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// POST /api/announcement - Admin only
export async function POST(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck;
    }

    const body = await request.json();
    const { title, type, linkUrl } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const announcement = await Announcement.create({ title, type: type || 'General', linkUrl: linkUrl || '' });

    return NextResponse.json(
      { success: true, message: "Announcement created successfully", announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating announcement" },
      { status: 500 }
    );
  }
}

// GET /api/announcement - Public
export async function GET(request) {
  try {
    await dbConnect();

    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching announcements" },
      { status: 500 }
    );
  }
}
