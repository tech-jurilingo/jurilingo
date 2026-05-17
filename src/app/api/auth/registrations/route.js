import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// GET /api/auth/registrations - Admin only: returns all registered users & count
export async function GET(request) {
  try {
    const authResult = await verifyToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) {
      return adminCheck;
    }

    await dbConnect();

    const users = await User.find({ role: "competitor" })
      .select("name email phonenumber role")
      .sort({ _id: -1 });

    return NextResponse.json({
      success: true,
      totalRegistrations: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching registrations" },
      { status: 500 }
    );
  }
}
