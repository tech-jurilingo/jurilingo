
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyToken } from "@/middlewares/auth";

// POST: Like or unlike a blog. Registered users only.
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Atomically toggle this user's like.
    const blog = await Blog.findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            likes: {
              $let: {
                vars: {
                  currentLikes: { $ifNull: ["$likes", []] },
                },
                in: {
                  $cond: [
                    { $in: [userObjectId, "$$currentLikes"] },
                    {
                      $filter: {
                        input: "$$currentLikes",
                        as: "like",
                        cond: { $ne: ["$$like", userObjectId] },
                      },
                    },
                    {
                      $concatArrays: [
                        "$$currentLikes",
                        [userObjectId],
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ],
      { new: true }
    ).select("likes");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const liked = blog.likes.some(
      (like) => like.toString() === userId.toString()
    );

    return NextResponse.json({
      success: true,
      liked,
      likeCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    console.error("Toggle blog like error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update like" },
      { status: 500 }
    );
  }
}
