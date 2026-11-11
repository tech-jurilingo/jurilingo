
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyToken } from "@/middlewares/auth";

// POST /api/blog/[id]/like
// Registered users can like or unlike a blog.
export async function POST(request, { params }) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const userId = authResult.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 401 }
      );
    }

    await dbConnect();

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = blog.likes.some(
      (like) => like.toString() === userId.toString()
    );

    if (alreadyLiked) {
      await Blog.updateOne(
        { _id: id },
        { $pull: { likes: userId } }
      );
    } else {
      await Blog.updateOne(
        { _id: id },
        { $addToSet: { likes: userId } }
      );
    }

    const updatedBlog = await Blog.findById(id).select("likes");

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: updatedBlog.likes.length,
      message: alreadyLiked
        ? "Blog unliked successfully"
        : "Blog liked successfully",
    });
  } catch (error) {
    console.error("Blog like error:", error);

    return NextResponse.json(
      { success: false, message: "Server error while updating like" },
      { status: 500 }
    );
  }
}
