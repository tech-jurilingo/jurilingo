import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phonenumber, email, password } = body;

    // Validation
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!phonenumber || typeof phonenumber !== "string") {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password with 6 or more characters required" },
        { status: 400 }
      );
    }

    await dbConnect();

    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    user = new User({
      name,
      phonenumber,
      email,
      password,
      role: "competitor",
    });

    await user.save();

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
      sameSite: "lax",
    });

    return NextResponse.json(
      { message: "User registered OK" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}