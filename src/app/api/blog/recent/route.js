import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(request) {
  try {
    await dbConnect();

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(3);

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching recent blogs",
      },
      { status: 500 }
    );
  }
}