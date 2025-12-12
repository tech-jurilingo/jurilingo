// app/api/competition/user/[userId]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Competition from "@/models/Competition";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = await params;
  
    if (!userId) {
      console.error("Missing params.userId");
      return NextResponse.json({ 
        success: false, 
        message: "userId missing in params" 
      }, { status: 400 });
    }

    // Validate if userId is a valid ObjectId
    let objId = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      objId = new mongoose.Types.ObjectId(userId);
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid userId format" 
      }, { status: 400 });
    }

    // Query for competitions where user is in participants OR waitlist
    const competitions = await Competition.find({ 
      $or: [
        { participants: objId }, 
        { "waitlist.user": objId }
      ]
    })
      .sort({ endDate: 1 })
      .populate("participants", "name email")
      .populate("waitlist.user", "name email");

    const results = competitions.map((comp) => {
      const obj = comp.toObject();
      const participantsArr = obj.participants || [];
      const waitlistArr = obj.waitlist || [];

      // Check if user is in participants array
      const inParticipants = participantsArr.some((p) => {
        if (!p || !p._id) return false;
        return p._id.toString() === userId;
      });

      // If in participants, they're accepted (approved and added to competition)
      if (inParticipants) {
        return { ...obj, userStatus: "accepted" };
      }

      // Check waitlist
      const wlEntry = waitlistArr.find((w) => {
        if (!w || !w.user) return false;
        const wUserId = w.user._id ? w.user._id.toString() : w.user.toString();
        return wUserId === userId;
      });

      if (wlEntry) {
        // Map the schema's status values to response status
        const status = wlEntry.status || "pending";
        let userStatus = "pending";
        
        if (status === "approved") {
          userStatus = "approved"; // or "accepted" if you prefer
        } else if (status === "rejected") {
          userStatus = "rejected";
        } else {
          userStatus = "pending";
        }
        
        return { 
          ...obj, 
          userStatus,
          waitlistEntry: wlEntry 
        };
      }

      // This shouldn't happen if query is correct, but just in case
      return { ...obj, userStatus: "unknown" };
    });

    return NextResponse.json({ 
      success: true, 
      competitions: results,
      count: results.length
    });

  } catch (err) {
    console.error("Error fetching competitions by user:", err);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error while fetching competitions for user",
        error: err.message 
      },
      { status: 500 }
    );
  }
}