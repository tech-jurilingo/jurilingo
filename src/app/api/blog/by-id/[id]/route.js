import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import mongoose from "mongoose";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// GET /api/blog/:id
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid blog ID",
        },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(id);

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
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog by id:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching blog",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/:id - Admin only
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
          message: "Invalid blog ID",
        },
        { status: 400 }
      );
    }

    const blog = await Blog.findByIdAndDelete(id);

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
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while deleting blog",
      },
      { status: 500 }
    );
  }
}