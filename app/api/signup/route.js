import connectDb from "@/middleware/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await connectDb(); // Connect to MongoDB

    const body = await req.json(); // Parse JSON body
    const userExists = await User.findOne({ email: body.email });

    if (userExists) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // ðŸ‘‡ JWT token generate karein just like login
    const token = jwt.sign(
      {
        user: body.hashedPassword,
        email: body.email,
        name: body.name,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    const user = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      roll: "user",
      token: token,
    });

    await user.save();

    // âœ… Return same data as login
    return new Response(
      JSON.stringify({
        message: "Signup successful",
        name: user.name,
        email: user.email,
        roll: user.roll,
        token,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Signup POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to signup" }), {
      status: 500,
    });
  }
};
