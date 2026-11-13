
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";
import { verifyToken } from "@/middlewares/auth";
import { verifyAdmin } from "@/middlewares/verifyAdmin";

const existingProfiles = [
  {
    name: "Chhavi Agarwal",
    role: "Digital Content Coordinator",
    imagePath: "/chhavi.jpg",
    bio: "Chhavi Agarwal is the Digital Content Coordinator at JuriLingo, where she contributes to the platform’s digital and creative initiatives. Through visual storytelling and content coordination, Chhavi plays a key role in maintaining JuriLingo’s presence across digital platforms, helping ensure that legal discussions are presented in a manner that is accessible, engaging, and easy to follow. Her work reflects a thoughtful approach to creating content that connects with students while supporting the platform’s broader educational vision.",
    displayOrder: 1,
  },
  {
    name: "Aanchal Singh",
    role: "Media Production Coordinator",
    imagePath: "/aanchal.jpg",
    bio: "Aanchal Singh is the Media Production Coordinator at JuriLingo, contributing to the platform through videography and podcast production. Working behind the camera, Aanchal plays a role in bringing meaningful legal discussions to audiences through thoughtfully produced visual content. Her work contributes to creating an interactive and engaging learning environment that encourages students to connect with ideas, experiences, and conversations within the legal field.",
    displayOrder: 2,
  },
  {
    name: "Sarvesh R",
    role: "Growth, Partnerships & Community Associate | Web Development Consultant",
    imagePath: "/sarvesh.jpg",
    bio: "Sarvesh R serves as the Growth, Partnerships & Community Associate and Web Development Consultant at JuriLingo, contributing to the platform’s strategic growth, partnerships, community engagement, and digital development. Through building collaborative relationships, supporting outreach initiatives, and working on the development and enhancement of the website, Sarvesh contributes to strengthening JuriLingo’s digital presence and expanding its reach among students and aspiring legal professionals. His work brings together an interest in legal technology, digital innovation, and community building, supporting JuriLingo’s vision of making legal education more accessible, engaging, and impactful.",
    displayOrder: 3,
  },
];

export async function POST(request) {
  try {
    const authResult = await verifyToken(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminCheck = verifyAdmin(authResult);
    if (adminCheck) return adminCheck;

    await dbConnect();

    const operations = existingProfiles.map((profile) => ({
      updateOne: {
        filter: { name: profile.name },
        update: {
          $setOnInsert: profile,
        },
        upsert: true,
      },
    }));

    const result = await TeamMember.bulkWrite(operations);

    return NextResponse.json({
      success: true,
      message: "Team profile migration completed.",
      inserted: result.upsertedCount,
      alreadyExisting: result.matchedCount,
    });

  } catch (error) {
    console.error("Team migration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Team profile migration failed.",
      },
      { status: 500 }
    );
  }
}
