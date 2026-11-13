
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

// GET /api/team - Public
export async function GET() {
  try {
    await dbConnect();

    const members = await TeamMember.find().sort({
      displayOrder: 1,
      createdAt: 1,
    });

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("Error fetching team members:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team members.",
      },
      { status: 500 }
    );
  }
}

// POST /api/team - Admin only
export async function POST(request) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);

    if (adminCheck) {
      return adminCheck;
    }

    const body = await request.json();
    const { name, role, bio, imagePath, displayOrder } = body;

    if (!name?.trim() || !role?.trim() || !bio?.trim() || !imagePath?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, role, bio and profile image are required.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const member = await TeamMember.create({
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      imagePath: imagePath.trim(),
      displayOrder: Number.isFinite(Number(displayOrder))
        ? Number(displayOrder)
        : 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Team member added successfully.",
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding team member:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add team member.",
      },
      { status: 500 }
    );
  }
}
