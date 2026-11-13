
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

export const runtime = "nodejs";

async function deleteTeamImage(imagePath) {
  const match = imagePath?.match(
    /^\/api\/team\/image\/([a-f\d]{24})$/i
  );

  if (!match) return;

  const bucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "teamImages" }
  );

  try {
    await bucket.delete(new mongoose.Types.ObjectId(match[1]));
  } catch (error) {
    console.error("Team image cleanup error:", error);
  }
}

// PUT /api/team/[id] - Admin only
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) return authResult;

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid team member ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const allowedFields = ["name", "role", "bio", "imagePath", "displayOrder"];
    const updates = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    for (const field of ["name", "role", "bio", "imagePath"]) {
      if (
        updates[field] !== undefined &&
        (typeof updates[field] !== "string" || !updates[field].trim())
      ) {
        return NextResponse.json(
          { success: false, message: `${field} cannot be empty.` },
          { status: 400 }
        );
      }

      if (typeof updates[field] === "string") {
        updates[field] = updates[field].trim();
      }
    }

    if (updates.displayOrder !== undefined) {
      const order = Number(updates.displayOrder);

      if (!Number.isFinite(order)) {
        return NextResponse.json(
          { success: false, message: "Invalid display order." },
          { status: 400 }
        );
      }

      updates.displayOrder = order;
    }

    await dbConnect();

    const existingMember = await TeamMember.findById(id);

    if (!existingMember) {
      return NextResponse.json(
        { success: false, message: "Team member not found." },
        { status: 404 }
      );
    }

    const oldImagePath = existingMember.imagePath;

    const member = await TeamMember.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Remove the old GridFS image only after a successful update.
    if (
      updates.imagePath &&
      updates.imagePath !== oldImagePath
    ) {
      await deleteTeamImage(oldImagePath);
    }

    return NextResponse.json({
      success: true,
      message: "Team member updated successfully.",
      member,
    });

  } catch (error) {
    console.error("Team member update error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update team member." },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Admin only
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) return authResult;

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid team member ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    const member = await TeamMember.findById(id);

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Team member not found." },
        { status: 404 }
      );
    }

    await TeamMember.findByIdAndDelete(id);

    // Remove associated GridFS photograph, if applicable.
    await deleteTeamImage(member.imagePath);

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully.",
    });

  } catch (error) {
    console.error("Team member deletion error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete team member." },
      { status: 500 }
    );
  }
}
