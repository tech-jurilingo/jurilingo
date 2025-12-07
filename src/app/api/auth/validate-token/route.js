import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middlewares/auth";

export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    const { userId } = authResult;

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}