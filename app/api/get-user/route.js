import connectDb from "@/middleware/mongoose";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // console.log("ðŸŸ¢ [API] /api/verifyToken called");

    // Step 1: Connect to DB
    await connectDb();
    // console.log("âœ… Database connected");

    // Step 2: Parse body
    const body = await req.json();
    const token = body.token;
    // console.log("ðŸ”‘ Received token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 404 });
    }

    let decoded;
    try {
      // Verify token
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log("âœ… Token verified. Decoded:", decoded);
    } catch (err) {
      // console.log("âŒ Token verification failed:", err);

      // Handle token expiration
      if (err.name === "TokenExpiredError") {
        // console.log("âš ï¸ Token expired");

        // Decode token without verifying signature to read role
        decoded = jwt.decode(token);
        // console.log("ðŸ“ Decoded expired token:", decoded);

        if (decoded?.role === "admin") {
          // console.log("â›” Admin token expired, cannot auto-login");
          
          // Admin â†’ return error
          return NextResponse.json({ error: "Token expired" }, { status: 401 });
        } else {
          // Non-admin â†’ auto-login and generate new token
          const userEmail = decoded?.email;
          if (!userEmail) {
            return NextResponse.json(
              { error: "Invalid token" },
              { status: 401 }
            );
          }

          const user = await User.findOne({ email: userEmail });
          if (!user) {
            return NextResponse.json(
              { error: "User not found" },
              { status: 404 }
            );
          }

          // Generate new token
          const newToken = jwt.sign(
            {
              user: user._id,
              email: user.email,
              name: user.name,
              role: user.roll,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" } // or whatever expiry you want
          );

          // Save new token in DB
          user.token = newToken;
          await user.save();

          // console.log("âœ… User auto-logged in, new token saved");

          return NextResponse.json({ user, token: newToken });
        }
      }

      // Other verification errors
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Token valid â†’ fetch user from DB
    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    // console.log("ðŸ’¥ Unexpected error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
