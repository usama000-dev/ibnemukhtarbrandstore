import { Forgot } from "@/models/Forgot";
import { User } from "@/models/User";
import { EmailService } from "@/services/emailService";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import connectDb from "../../../middleware/mongoose";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    const { sendmail, password, token, email } = body;
    // Check if user exists

    if (sendmail) {
      // Handle email sending request
      const user = await User.findOne({ email: email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (!user.token) {
        return NextResponse.json({ error: "Token missing" }, { status: 401 });
      }

      // ... inside POST function ...
      const newToken = require("crypto").randomBytes(32).toString("hex");

      // Create or update forgot password record
      let forgot = new Forgot({
        userId: user._id,
        email,
        token: newToken,
      });
      await forgot.save();
      try {
        const subject = "New Contact Form Submission";
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748370423/logo-championchoice-white_ieqabd.png" alt="Champion Choice Logo" style="max-width: 150px; display: block; margin: auto;"/>

          <h2 style="color: #4F46E5; text-align: center;">ðŸ”  Password Reset Request</h2>
            
            <p>Hi <strong>${user.name}</strong>,</p>
            
            <p>We received a request to reset your password for your <strong>Champion-Choice</strong> account.</p>
            
            <p style="margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_HOST}/forgot/${newToken}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Click here to reset your password
              </a>
            </p>
        
            <p>If you didnâ€™t request this, just ignore this email. Your password will remain unchanged.</p>
            
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #777;">
              Champion-Choice Support Team<br/>
              ðŸ“§ championhub00@gmail.com
            </p>
          </div>
        `;

        await EmailService.sendEmail(email, subject, htmlContent, "Please view this email in a client that supports HTML.");
      } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json(
          { error: "Some error sending email" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Reset email initiated successfully",
          // In production, don't return the token to client
          token: newToken, // Only for development/testing
        },
        { status: 200 }
      );
    } else {
      const user = await User.find({ email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Handle password reset request
      if (!token || !password) {
        return NextResponse.json(
          { error: "Token and password are required" },
          { status: 400 }
        );
      }
      // Verify the reset token

      const forgotRecord = await Forgot.findOne({ token: body.token });

      if (!forgotRecord) {
        return NextResponse.json(
          { error: "Invalid or expired reset token" },
          { status: 401 }
        );
      }

      // Validate password is a non-empty string
      if (typeof password !== "string" || password.trim().length === 0) {
        return NextResponse.json(
          { error: "Password must be a non-empty string" },
          { status: 400 }
        );
      }

      // Hash new password with proper error handling
      let hashedPassword;
      try {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      } catch (hashError) {
        console.error("Password hashing error:", hashError);
        return NextResponse.json(
          { error: "Failed to process password" },
          { status: 500 }
        );
      }

      // Update user password
      await User.findOneAndUpdate(
        { email: forgotRecord.email },
        { password: hashedPassword }
      );

      // Delete the used token
      await Forgot.deleteOne({ token });

      return NextResponse.json(
        { success: true, message: "Password changed successfully" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
