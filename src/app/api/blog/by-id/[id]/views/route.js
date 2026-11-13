
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

// POST /api/blog/by-id/[id]/views
// Records one view when called by the published blog page.
export async function POST(request, { params }) {
  try {
    const { id } = await params;

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Increment the view count in MongoDB
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { viewCount: 1 },
      },
      {
        new: true,
      }
    ).select("viewCount");

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "View recorded successfully",
      viewCount: blog.viewCount,
    });
  } catch (error) {
    console.error("Record blog view error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to record blog view",
      },
      { status: 500 }
    );
  }
}
