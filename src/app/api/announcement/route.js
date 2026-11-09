
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// POST /api/announcement - Admin only
export async function POST(request) {
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

    const body = await request.json();

    const {
      title,
      description,
      type,
      linkUrl,
      buttonText,
      imageUrl,
      attachments,
      isFeatured,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Announcement title is required",
        },
        { status: 400 }
      );
    }

    // Validate URLs
    const validWebUrl = (value) => {
      if (!value) return true;

      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return value.startsWith("/");
      }
    };

    if (!validWebUrl(linkUrl) || !validWebUrl(imageUrl)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid announcement URLs",
        },
        { status: 400 }
      );
    }

    if (attachments && !Array.isArray(attachments)) {
      return NextResponse.json(
        {
          success: false,
          message: "Attachments must be an array",
        },
        { status: 400 }
      );
    }

    if (attachments) {
      for (const file of attachments) {
        if (
          !file ||
          typeof file.name !== "string" ||
          typeof file.url !== "string" ||
          !validWebUrl(file.url)
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid attachment details",
            },
            { status: 400 }
          );
        }
      }
    }

    await dbConnect();

    const announcement = await Announcement.create({
      title: title.trim(),
      description: description || "",
      type: type || "General",
      linkUrl: linkUrl || "",
      buttonText: buttonText || "Read More",
      imageUrl: imageUrl || "",
      attachments: attachments || [],
      isFeatured: Boolean(isFeatured),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Announcement created successfully",
        announcement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while creating announcement",
      },
      { status: 500 }
    );
  }
}

// GET /api/announcement - Public
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    let query = Announcement.find().sort({ createdAt: -1 });

    if (limitParam !== "all") {
      const limit = parseInt(limitParam, 10) || 10;
      query = query.limit(Math.min(Math.max(limit, 1), 100));
    }

    const announcements = await query;

    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching announcements",
      },
      { status: 500 }
    );
  }
}
