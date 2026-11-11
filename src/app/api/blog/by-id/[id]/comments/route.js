
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyToken } from "@/middlewares/auth";

// GET /api/blog/by-id/[id]/comments
// Public: fetch comments for a blog
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const blog = await Blog.findById(id)
      .select("comments")
      .populate("comments.user", "name");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      comments: blog.comments,
    });
  } catch (error) {
    console.error("Fetch comments error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/blog/by-id/[id]/comments
// Registered users only: add a comment
export async function POST(request, { params }) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const userId = authResult.userId;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid blog or user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const commentText =
      typeof body.text === "string" ? body.text.trim() : "";

    if (!commentText) {
      return NextResponse.json(
        { success: false, message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (commentText.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Comment cannot exceed 2000 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            user: userId,
            text: commentText,
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    ).populate("comments.user", "name");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const newComment = blog.comments[blog.comments.length - 1];

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add comment error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to add comment" },
      { status: 500 }
    );
  }
}
