
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyToken } from "@/middlewares/auth";

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

    await dbConnect();

    const blog = await Blog.findById(id).select("likes");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const alreadyLiked = (blog.likes || []).some(
      (like) => like.toString() === userId.toString()
    );

    if (alreadyLiked) {
      await Blog.updateOne(
        { _id: id },
        { $pull: { likes: new mongoose.Types.ObjectId(userId) } }
      );
    } else {
      await Blog.updateOne(
        { _id: id },
        { $addToSet: { likes: new mongoose.Types.ObjectId(userId) } }
      );
    }

    const updatedBlog = await Blog.findById(id).select("likes");

    return NextResponse.json({
      success: true,
      liked: !alreadyLiked,
      likes: updatedBlog.likes,
      likeCount: updatedBlog.likes.length,
    });

  } catch (error) {
    console.error("Toggle blog like error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Unable to update like" },
      { status: 500 }
    );
  }
}
