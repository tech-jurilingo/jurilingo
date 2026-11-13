
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request) {
  try {
    // 1. Verify authentication
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // 2. Verify admin access
    const adminCheck = verifyAdmin(authResult);

    if (adminCheck) {
      return adminCheck;
    }

    // 3. Connect to MongoDB
    await dbConnect();

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("MongoDB database connection unavailable");
    }

    // 4. Read uploaded image
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, message: "Please select an image." },
        { status: 400 }
      );
    }

    // 5. Validate image format
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPEG, PNG and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    // 6. Validate image size
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be between 1 byte and 2 MB.",
        },
        { status: 400 }
      );
    }

    // 7. Prepare GridFS storage
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "announcementImages",
    });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const buffer = Buffer.from(await file.arrayBuffer());

    // 8. Upload image to MongoDB GridFS
    const uploadStream = bucket.openUploadStream(
      `${Date.now()}-${safeName}`,
      {
        contentType: file.type,
        metadata: {
          uploadedBy: authResult.userId,
          purpose: "announcement-banner",
          contentType: file.type,
        },
      }
    );

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
      uploadStream.end(buffer);
    });

    // 9. Generate image URL
    const imageUrl = `/api/announcement/image/${uploadStream.id.toString()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully.",
        imageUrl,
        fileId: uploadStream.id.toString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Announcement image upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to upload announcement image.",
      },
      { status: 500 }
    );
  }
}
