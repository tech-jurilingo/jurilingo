
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

    await dbConnect();

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB connection unavailable");
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, message: "Please select a photograph." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPEG, PNG and WebP are allowed." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image must not exceed 2 MB." },
        { status: 400 }
      );
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "teamImages",
    });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadStream = bucket.openUploadStream(
      `${Date.now()}-${safeName}`,
      {
        contentType: file.type,
        metadata: {
          uploadedBy: authResult.userId,
          purpose: "team-profile",
          contentType: file.type,
        },
      }
    );

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(buffer);
    });

    const imagePath = `/api/team/image/${uploadStream.id.toString()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Team photograph uploaded successfully.",
        imagePath,
        fileId: uploadStream.id.toString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Team image upload error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to upload team photograph." },
      { status: 500 }
    );
  }
}
