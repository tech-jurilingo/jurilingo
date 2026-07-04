import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "A valid email address is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email address" },
        { status: 404 }
      );
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Construct reset URL
    const origin = request.headers.get("origin") || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const resetUrl = `${origin}/auth/reset-password?token=${resetToken}`;

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || `"JuriLingo Support" <no-reply@jurilingo.com>`,
      to: email,
      subject: "Reset Your JuriLingo Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #005F63; text-align: center;">JuriLingo</h2>
          <p>Hello,</p>
          <p>You requested to reset your password for your JuriLingo account. Please click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #005F63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>The JuriLingo Team</p>
        </div>
      `,
    };

    let emailSent = false;
    if (process.env.SMTP_HOST) {
      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailError) {
        console.error("Failed to send reset email via SMTP:", mailError);
      }
    }

    // Always log in the terminal console as backup/development convenience
    console.log("----------------------------------------");
    console.log("PASSWORD RESET REQUEST FOR:", email);
    console.log("Reset Link:", resetUrl);
    console.log("----------------------------------------");

    if (emailSent) {
      return NextResponse.json({
        message: "A password reset link has been sent to your email address."
      });
    } else {
      const isDev = process.env.NODE_ENV !== "production";
      return NextResponse.json({
        message: isDev
          ? "SMTP is not configured. The password reset link was printed to the server console for local testing."
          : "A password reset link has been generated (logged to server console)."
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
