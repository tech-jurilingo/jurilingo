
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Readable } from "stream";
import dbConnect from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid image ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const db = mongoose.connection.db;

    const fileId = new mongoose.Types.ObjectId(id);

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "announcementImages",
    });

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files.length) {
      return NextResponse.json(
        { message: "Image not found" },
        { status: 404 }
      );
    }

    const file = files[0];

    const contentType = file.metadata?.contentType;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { message: "Unsupported image type" },
        { status: 415 }
      );
    }

    const downloadStream = bucket.openDownloadStream(fileId);

    return new Response(Readable.toWeb(downloadStream), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Announcement image retrieval error:", error);

    return NextResponse.json(
      { message: "Unable to retrieve image" },
      { status: 500 }
    );
  }
}
