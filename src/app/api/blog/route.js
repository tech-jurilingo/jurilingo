import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// POST /api/blog - Admin only
export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    //Verify admin role
    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck; // Return forbidden error
    }

    const body = await request.json();
    const { title, author, content } = body;

    if (!title || !author || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, author, and content are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const blog = await Blog.create({
      title,
      author,
      content,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while creating blog",
      },
      { status: 500 }
    );
  }
}

// GET /api/blog - Public
export async function GET(request) {
  try {
    await dbConnect();

    const blogs = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching blogs",
      },
      { status: 500 }
    );
  }
}